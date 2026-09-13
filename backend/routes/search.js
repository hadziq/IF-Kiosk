const express = require("express");
const db      = require("../db");
const { DAY_NAMES, WEEKDAYS } = require("../utils/days");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const q   = (req.query.q   || "").trim();
    const day = (req.query.day || "").trim();
    if (q.length < 2) return res.json([]);

    const todayName = day || DAY_NAMES[new Date().getDay()];
    const isWeekday = WEEKDAYS.includes(todayName);

    const schedResult = isWeekday
      ? await db.query(
          `SELECT r.nama_ruang AS room_name, r.lantai, 'schedule' AS result_type,
                  j.hari, j.jam_mulai, j.jam_selesai, j.mata_kuliah,
                  d.nama AS nama_dosen, d2.nama AS nama_dosen_2, d3.nama AS nama_dosen_3,
                  NULL::text[] AS occupants, NULL::text AS keterangan
           FROM jadwal j
           JOIN ruangan r ON j.ruangan_id = r.id
           LEFT JOIN dosen d  ON j.dosen_id   = d.id
           LEFT JOIN dosen d2 ON j.dosen_id_2 = d2.id
           LEFT JOIN dosen d3 ON j.dosen_id_3 = d3.id
           WHERE (j.mata_kuliah ILIKE $1 OR d.nama ILIKE $1 OR d2.nama ILIKE $1 OR d3.nama ILIKE $1)
           AND j.hari = $2
           ORDER BY r.nama_ruang, j.jam_mulai
           LIMIT 50`,
          [`%${q}%`, todayName]
        )
      : { rows: [] };

    const dosenResult = await db.query(
      `SELECT DISTINCT ON (r.nama_ruang)
              r.nama_ruang AS room_name, r.lantai, 'dosen' AS result_type,
              NULL AS hari, NULL AS jam_mulai, NULL AS jam_selesai,
              NULL AS mata_kuliah, NULL AS nama_dosen,
              ARRAY(
                SELECT d2.nama FROM penghuni_ruangan pr2
                JOIN dosen d2 ON pr2.dosen_id = d2.id
                WHERE pr2.ruangan_id = r.id ORDER BY pr2.urutan
              ) AS occupants,
              r.keterangan
       FROM ruangan r
       LEFT JOIN penghuni_ruangan pr ON pr.ruangan_id = r.id
       LEFT JOIN dosen d ON pr.dosen_id = d.id
       WHERE r.is_ruang_dosen = TRUE
         AND (r.nama_ruang ILIKE $1 OR r.keterangan ILIKE $1 OR d.nama ILIKE $1
              OR EXISTS (
                SELECT 1 FROM penghuni_ruangan pr2
                JOIN dosen d2 ON pr2.dosen_id = d2.id
                WHERE pr2.ruangan_id = r.id AND d2.nama ILIKE $1
              ))
       ORDER BY r.nama_ruang
       LIMIT 20`,
      [`%${q}%`]
    );

    const roomResult = await db.query(
      `SELECT r.nama_ruang AS room_name, r.lantai, 'room' AS result_type,
              NULL AS hari, NULL AS jam_mulai, NULL AS jam_selesai,
              NULL AS mata_kuliah, NULL AS nama_dosen,
              NULL::text[] AS occupants, r.keterangan
       FROM ruangan r
       WHERE r.nama_ruang ILIKE $1
         AND r.is_ruang_dosen = FALSE
       ORDER BY r.lantai, r.nama_ruang
       LIMIT 20`,
      [`%${q}%`]
    );

    const reservasiResult = await db.query(
      `SELECT r.nama_ruang AS room_name, r.lantai, 'reservasi' AS result_type,
              NULL AS hari, rv.jam_mulai, rv.jam_selesai,
              rv.keterangan AS mata_kuliah, d.nama AS nama_dosen,
              NULL::text AS nama_dosen_2, NULL::text AS nama_dosen_3,
              NULL::text[] AS occupants, rv.keterangan
       FROM reservasi rv
       JOIN ruangan r ON rv.ruangan_id = r.id
       JOIN dosen d ON rv.dosen_id = d.id
       WHERE rv.tanggal = CURRENT_DATE AND rv.jam_selesai > CURRENT_TIME
         AND (rv.keterangan ILIKE $1 OR d.nama ILIKE $1 OR r.nama_ruang ILIKE $1)
       ORDER BY rv.jam_mulai
       LIMIT 20`,
      [`%${q}%`]
    );

    const seen = new Set([
      ...schedResult.rows.map(r => r.room_name),
      ...dosenResult.rows.map(r => r.room_name),
    ]);
    const extraRooms = roomResult.rows.filter(r => !seen.has(r.room_name));

    res.json([...reservasiResult.rows, ...schedResult.rows, ...dosenResult.rows, ...extraRooms]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
