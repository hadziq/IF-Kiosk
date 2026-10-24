// Turns the CSV files in data/ into the single JSON file the kiosk loads at
// runtime (public/data/kiosk.json). Runs before every `dev` and `build`.
//
// The CSVs are meant to be edited by hand, so every cross-reference is checked
// here and a broken one stops the build with the file and line that caused it.
// The old SQL seeds failed silently on a typo; this must not.
//
//   node scripts/build-data.js           build, fail on errors
//   node scripts/build-data.js --check   validate only, write nothing

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { DAYS, EXCLUDE, FLOORS } from "../src/lib/constants.js";

const here        = dirname(fileURLToPath(import.meta.url));
const DATA_DIR    = resolve(here, "../../data");
const PUBLIC_DIR  = resolve(here, "../public");
const OUT_FILE    = join(PUBLIC_DIR, "data/kiosk.json");

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

// ── CSV ──────────────────────────────────────────────────────────────

/**
 * Parses RFC 4180 CSV. Accepts what Excel produces on an Indonesian-locale
 * Windows machine as well as on an English one: a UTF-8 byte-order mark,
 * CRLF line endings, and `;` instead of `,` as the separator (detected from
 * the header row).
 *
 * Returns an array of { line, row } where row maps header → trimmed value and
 * line is the 1-based line number in the file, for error messages.
 */
export function parseCsv(text) {
  text = text.replace(/^\uFEFF/, "");
  const firstLine = text.slice(0, text.search(/\r?\n|$/));
  const sep = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ";" : ",";

  const records = [];
  let field = "", record = [], quoted = false, line = 1, recordLine = 1;
  const endField  = () => { record.push(field); field = ""; };
  const endRecord = () => { endField(); records.push({ line: recordLine, cells: record }); record = []; recordLine = line; };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quoted = false;
      else { if (ch === "\n") line++; field += ch; }
    } else if (ch === '"') quoted = true;
    else if (ch === sep) endField();
    else if (ch === "\n") { line++; endRecord(); }
    else if (ch !== "\r") field += ch;
  }
  if (field !== "" || record.length > 0) endRecord();

  const [header, ...rows] = records.filter((r) => r.cells.some((c) => c.trim() !== ""));
  if (!header) return [];
  const keys = header.cells.map((k) => k.trim());
  return rows.map(({ line, cells }) => ({
    line,
    row: Object.fromEntries(keys.map((k, i) => [k, (cells[i] ?? "").trim()])),
  }));
}

// ── Validation ───────────────────────────────────────────────────────

const meshKey = (name) => name.replace(/ /g, "_");

const TRUE_VALUES  = new Set(["1", "true", "ya", "y", "x", "v"]);
const FALSE_VALUES = new Set(["", "0", "false", "tidak", "n"]);

/** Mesh names of every floor model, keyed by floor name. */
export function readMeshNames(modelsDir) {
  const result = {};
  for (const floor of FLOORS) {
    const file = join(modelsDir, `${floor}.obj`);
    if (!existsSync(file)) continue;
    const names = new Set();
    for (const m of readFileSync(file, "utf8").matchAll(/^o (.+)$/gm)) names.add(m[1].trim());
    result[floor] = names;
  }
  return result;
}

/**
 * Builds the kiosk data from parsed CSV tables. Never throws: problems come
 * back as `errors` (the data is wrong and the build must stop) and `warnings`
 * (worth a look, but the kiosk still works).
 *
 * @param {object} tables  { ruangan, dosen, penghuni, jadwal }, each from parseCsv
 * @param {object} [opts]  { meshNames, photos } — optional cross-checks
 */
export function buildData(tables, { meshNames = null, photos = null } = {}) {
  const errors = [], warnings = [];
  const err  = (file, line, msg) => errors.push(`${file}.csv:${line}: ${msg}`);
  const warn = (file, line, msg) => warnings.push(`${file}.csv${line ? `:${line}` : ""}: ${msg}`);

  const flag = (file, line, column, value) => {
    const v = value.toLowerCase();
    if (TRUE_VALUES.has(v))  return true;
    if (FALSE_VALUES.has(v)) return false;
    err(file, line, `kolom ${column} berisi "${value}"; isi 1 untuk ya atau kosongkan untuk tidak`);
    return false;
  };

  // dosen.csv
  const dosen = {};
  for (const { line, row } of tables.dosen) {
    const kode = row.kode, nama = row.nama;
    if (!kode || !nama) { err("dosen", line, "kode dan nama wajib diisi"); continue; }
    if (dosen[kode])    { err("dosen", line, `kode ${kode} sudah dipakai oleh ${dosen[kode]}`); continue; }
    dosen[kode] = nama;
    if (photos && !photos.has(kode)) warn("dosen", line, `belum ada foto public/picture/${kode}.webp (${nama}); kiosk akan menampilkan inisial`);
  }

  // ruangan.csv
  const rooms = [], roomByKey = new Map();
  for (const { line, row } of tables.ruangan) {
    const nama = row.nama_ruang;
    if (!nama) { err("ruangan", line, "nama_ruang wajib diisi"); continue; }
    if (roomByKey.has(meshKey(nama))) { err("ruangan", line, `ruangan ${nama} sudah ada di baris lain`); continue; }
    if (!FLOORS.includes(row.lantai)) err("ruangan", line, `lantai "${row.lantai}" tidak dikenal; pilih salah satu: ${FLOORS.join(", ")}`);
    else if (meshNames?.[row.lantai] && !meshNames[row.lantai].has(meshKey(nama))) {
      err("ruangan", line, `tidak ada mesh bernama ${meshKey(nama)} di model ${row.lantai}.obj; nama_ruang harus sama persis dengan nama mesh`);
    }
    const room = {
      nama_ruang:     nama,
      lantai:         row.lantai,
      is_kelas:       flag("ruangan", line, "kelas",       row.kelas ?? ""),
      is_lab:         flag("ruangan", line, "lab",         row.lab ?? ""),
      is_ruang_dosen: flag("ruangan", line, "ruang_dosen", row.ruang_dosen ?? ""),
      is_ruangan:     flag("ruangan", line, "ruangan",     row.ruangan ?? ""),
      keterangan:     row.keterangan || null,
    };
    rooms.push(room);
    roomByKey.set(meshKey(nama), room);
  }

  if (meshNames) {
    for (const [floor, names] of Object.entries(meshNames)) {
      for (const mesh of names) {
        if (!EXCLUDE.test(mesh) && !roomByKey.has(mesh)) {
          warnings.push(`model ${floor}.obj: mesh ${mesh} muncul sebagai tombol ruangan tetapi tidak ada di ruangan.csv`);
        }
      }
    }
  }

  const lookupRoom = (file, line, nama) => {
    const room = roomByKey.get(meshKey(nama || ""));
    if (!room) err(file, line, `ruangan "${nama}" tidak ada di ruangan.csv`);
    return room;
  };
  const lookupDosen = (file, line, kode) => {
    if (!dosen[kode]) { err(file, line, `kode dosen "${kode}" tidak ada di dosen.csv`); return false; }
    return true;
  };

  // penghuni.csv — order of rows is the order on screen
  const occupants = {};
  for (const { line, row } of tables.penghuni) {
    const room = lookupRoom("penghuni", line, row.nama_ruang);
    if (!room || !lookupDosen("penghuni", line, row.kode_dosen)) continue;
    if (!room.is_ruang_dosen) err("penghuni", line, `${room.nama_ruang} tidak ditandai ruang_dosen di ruangan.csv, jadi penghuninya tidak akan tampil`);
    const list = (occupants[room.nama_ruang] ??= []);
    if (list.includes(row.kode_dosen)) { err("penghuni", line, `${row.kode_dosen} sudah tercatat di ${room.nama_ruang}`); continue; }
    list.push(row.kode_dosen);
  }
  for (const room of rooms) {
    if (room.is_ruang_dosen && !occupants[room.nama_ruang]) warn("ruangan", null, `${room.nama_ruang} ditandai ruang_dosen tetapi belum punya penghuni di penghuni.csv`);
  }

  // jadwal.csv
  const jadwal = [];
  for (const { line, row } of tables.jadwal) {
    const room = lookupRoom("jadwal", line, row.nama_ruang);
    let ok = !!room;
    if (!DAYS.includes(row.hari)) { err("jadwal", line, `hari "${row.hari}" tidak dikenal; pilih salah satu: ${DAYS.join(", ")}`); ok = false; }
    for (const col of ["jam_mulai", "jam_selesai"]) {
      if (!TIME.test(row[col])) { err("jadwal", line, `${col} "${row[col]}" harus berformat JJ:MM, misalnya 07:00`); ok = false; }
    }
    if (ok && row.jam_mulai >= row.jam_selesai) { err("jadwal", line, `jam_mulai ${row.jam_mulai} tidak sebelum jam_selesai ${row.jam_selesai}`); ok = false; }
    if (!row.mata_kuliah) { err("jadwal", line, "mata_kuliah wajib diisi"); ok = false; }
    if (!row.dosen_1)     { err("jadwal", line, "dosen_1 wajib diisi"); ok = false; }
    const kodes = [row.dosen_1, row.dosen_2, row.dosen_3].filter(Boolean);
    for (const kode of kodes) if (!lookupDosen("jadwal", line, kode)) ok = false;
    if (room && !room.is_kelas) err("jadwal", line, `${room.nama_ruang} tidak ditandai kelas di ruangan.csv, jadi jadwalnya tidak akan tampil`);
    if (!ok) continue;
    jadwal.push({
      line,
      hari: row.hari, jam_mulai: row.jam_mulai, jam_selesai: row.jam_selesai,
      nama_ruang: room.nama_ruang, mata_kuliah: row.mata_kuliah, dosen: kodes,
    });
  }

  jadwal.sort((a, b) =>
    DAYS.indexOf(a.hari) - DAYS.indexOf(b.hari) ||
    a.nama_ruang.localeCompare(b.nama_ruang) ||
    a.jam_mulai.localeCompare(b.jam_mulai));
  for (let i = 1; i < jadwal.length; i++) {
    const prev = jadwal[i - 1], cur = jadwal[i];
    if (prev.hari === cur.hari && prev.nama_ruang === cur.nama_ruang && cur.jam_mulai < prev.jam_selesai) {
      warn("jadwal", cur.line, `${cur.mata_kuliah} bentrok dengan ${prev.mata_kuliah} (baris ${prev.line}) di ${cur.nama_ruang} hari ${cur.hari}`);
    }
  }

  const body = {
    rooms,
    dosen,
    occupants,
    jadwal: jadwal.map(({ hari, jam_mulai, jam_selesai, nama_ruang, mata_kuliah, dosen }) =>
      ({ hari, jam_mulai, jam_selesai, nama_ruang, mata_kuliah, dosen })),
  };
  const version = createHash("sha256").update(JSON.stringify(body)).digest("hex").slice(0, 12);
  return { data: { version, ...body }, errors, warnings };
}

// ── CLI ──────────────────────────────────────────────────────────────

function main() {
  const checkOnly = process.argv.includes("--check");
  const tables = {};
  for (const name of ["ruangan", "dosen", "penghuni", "jadwal"]) {
    tables[name] = parseCsv(readFileSync(join(DATA_DIR, `${name}.csv`), "utf8"));
  }

  const meshNames = readMeshNames(join(PUBLIC_DIR, "models"));
  const photos    = new Set(tables.dosen.map(({ row }) => row.kode)
    .filter((kode) => existsSync(join(PUBLIC_DIR, "picture", `${kode}.webp`))));

  const { data, errors, warnings } = buildData(tables, { meshNames, photos });

  for (const w of warnings) console.warn(`peringatan  ${w}`);
  if (errors.length) {
    for (const e of errors) console.error(`GALAT       ${e}`);
    console.error(`\n${errors.length} galat di data/*.csv. Perbaiki dulu, kiosk tidak dibangun.`);
    process.exit(1);
  }

  const summary = `${data.rooms.length} ruangan, ${Object.keys(data.dosen).length} dosen, ` +
    `${Object.values(data.occupants).flat().length} penghuni, ${data.jadwal.length} jadwal`;
  if (checkOnly) { console.log(`data/*.csv valid: ${summary}.`); return; }

  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(data));
  console.log(`public/data/kiosk.json ditulis: ${summary} (versi ${data.version}).`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
