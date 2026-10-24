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
      (hasRoom(r.nama_ruang) || has(r.keterangan) || (data.occupants[r.nama_ruang] ?? []).some(dosenMatches)))
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
    .filter((r) => !r.is_ruang_dosen && !seen.has(r.nama_ruang) && (hasRoom(r.nama_ruang) || has(r.keterangan)))
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
