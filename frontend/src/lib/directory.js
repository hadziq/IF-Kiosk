// Queries over the static kiosk data (public/data/kiosk.json, built from
// data/*.csv by scripts/build-data.js). These replace the old REST endpoints
// GET /api/rooms/:roomName and GET /api/search and return the same shapes, so
// the panels that render them did not have to change.
//
// Pure functions of the data object: no fetching, no browser globals.

import { DAYS, displayName } from "./constants.js";

const meshKey = (name) => name.replace(/ /g, "_");

const scheduleRow = (data) => (j) => ({
  id:           data.jadwal.indexOf(j),
  hari:         j.hari,
  jam_mulai:    j.jam_mulai,
  jam_selesai:  j.jam_selesai,
  mata_kuliah:  j.mata_kuliah,
  nama_dosen:   data.dosen[j.dosen[0]] ?? null,
  nama_dosen_2: data.dosen[j.dosen[1]] ?? null,
  nama_dosen_3: data.dosen[j.dosen[2]] ?? null,
});

/**
 * One room by its mesh name, with its occupants and weekly schedule. Spaces
 * and underscores are interchangeable, because OBJ exporters turn one into
 * the other. Returns null when no row matches.
 */
export function getRoom(data, name) {
  const room = data.rooms.find((r) => meshKey(r.nama_ruang) === meshKey(name));
  if (!room) return null;
  return {
    ...room,
    occupants: room.is_ruang_dosen
      ? (data.occupants[room.nama_ruang] ?? []).map((kode) => ({ kode, nama: data.dosen[kode] }))
      : [],
    schedules: room.is_kelas
      ? data.jadwal.filter((j) => j.nama_ruang === room.nama_ruang).map(scheduleRow(data))
      : [],
  };
}

// Toilets follow Toilet_<Laki-laki|Perempuan>_<Utara|Selatan>_L<floor>
// (README, "Rooms and the 3D model").
const TOILET = /^Toilet_(Laki-laki|Perempuan)_(Utara|Selatan)_L\d+$/;

/**
 * The labels drawn on a floor's 3D model, one per room in the data, as
 * { meshes, text } or, for toilets, { meshes, toilet: [genders] }. A room's
 * label_peta overrides its name, and "-" hides its label. The men's and
 * women's toilets on one side of a floor sit side by side, so they share one
 * pictogram, the way building maps draw them.
 */
export function getMapLabels(data, floor) {
  const labels = [];
  const toilets = new Map();
  for (const room of data.rooms) {
    if (room.lantai !== floor || room.label_peta === "-") continue;
    const mesh = meshKey(room.nama_ruang);
    const toilet = !room.label_peta && mesh.match(TOILET);
    if (!toilet) {
      labels.push({ meshes: [mesh], text: room.label_peta ?? displayName(room.nama_ruang) });
      continue;
    }
    const [, gender, side] = toilet;
    let group = toilets.get(side);
    if (!group) {
      toilets.set(side, (group = { meshes: [], toilet: [] }));
      labels.push(group);
    }
    group.meshes.push(mesh);
    group.toilet.push(gender);
  }
  for (const group of toilets.values()) {
    // Men on the left, as on most signs, whatever the order of the CSV.
    group.toilet.sort((a, b) => (a === "Laki-laki" ? -1 : b === "Laki-laki" ? 1 : 0));
  }
  return labels;
}

/**
 * Joins a short or numbered word to its neighbour with a no-break space, so a
 * label may wrap as "Ruang / Sidang" but never as "IF / 218" or "LP / 1".
 */
export const glueShortWords = (label) =>
  label.replace(/(\S+) (?=(\S+))/g, (match, before, after) =>
    [before, after].some((word) => word.length <= 2 || /\d/.test(word)) ? `${before} ` : match);

const byName = (a, b) => a.nama_ruang.localeCompare(b.nama_ruang);

/**
 * Cross-entity search for the phone: today's classes, lecturer offices and
 * other rooms, in that order. A query shorter than two characters returns
 * nothing. Matching is a case-insensitive substring, and a lecturer can also
 * be found by their exact code (e.g. "HF").
 *
 * @param {string} day  Indonesian weekday name; schedule results only appear
 *                      when it is one of DAYS.
 */
export function search(data, query, day) {
  const q = (query || "").trim().toLowerCase();
  if (q.length < 2) return [];

  const has   = (s) => !!s && s.toLowerCase().includes(q);
  const hasRoom = (name) => has(name) || has(displayName(name));
  const dosenMatches = (kode) => kode.toLowerCase() === q || has(data.dosen[kode]);
  const lantaiOf = new Map(data.rooms.map((r) => [r.nama_ruang, r.lantai]));

  const schedules = DAYS.includes(day)
    ? data.jadwal
        .filter((j) => j.hari === day && (has(j.mata_kuliah) || j.dosen.some(dosenMatches)))
        .sort((a, b) => byName(a, b) || a.jam_mulai.localeCompare(b.jam_mulai))
        .slice(0, 50)
        .map((j) => ({
          ...scheduleRow(data)(j),
          room_name:   j.nama_ruang,
          lantai:      lantaiOf.get(j.nama_ruang),
          result_type: "schedule",
        }))
    : [];

  const offices = data.rooms
    .filter((r) => r.is_ruang_dosen &&
      (hasRoom(r.nama_ruang) || has(r.keterangan) || has(r.label_peta) || (data.occupants[r.nama_ruang] ?? []).some(dosenMatches)))
    .sort(byName)
    .slice(0, 20)
    .map((r) => ({
      room_name:   r.nama_ruang,
      lantai:      r.lantai,
      result_type: "dosen",
      occupants:   (data.occupants[r.nama_ruang] ?? []).map((kode) => data.dosen[kode]),
      keterangan:  r.keterangan,
    }));

  const seen = new Set([...schedules, ...offices].map((r) => r.room_name));
  const rooms = data.rooms
    .filter((r) => !r.is_ruang_dosen && !seen.has(r.nama_ruang) && (hasRoom(r.nama_ruang) || has(r.keterangan) || has(r.label_peta)))
    .sort((a, b) => a.lantai.localeCompare(b.lantai) || byName(a, b))
    .slice(0, 20)
    .map((r) => ({
      room_name:   r.nama_ruang,
      lantai:      r.lantai,
      result_type: "room",
      keterangan:  r.keterangan,
    }));

  return [...schedules, ...offices, ...rooms];
}
