const express = require("express");
const db      = require("../db");

const router = express.Router();

// Unified room info: flags + occupants + schedules in one call
router.get("/:roomName", async (req, res) => {
  try {
    const { roomName } = req.params;
    const roomResult = await db.query(
      `SELECT id, nama_ruang, lantai, is_kelas, is_lab, is_ruang_dosen, is_ruangan, is_reservable, keterangan
       FROM ruangan
       WHERE nama_ruang = $1
          OR REPLACE(nama_ruang, ' ', '_') = REPLACE($1, ' ', '_')`,
      [roomName]
    );
    if (roomResult.rows.length === 0) return res.status(404).json({ error: "Not found" });

    const room = roomResult.rows[0];

    const [occupantsResult, schedResult, reservasiResult] = await Promise.all([
      room.is_ruang_dosen
        ? db.query(
            `SELECT d.id, d.nama FROM penghuni_ruangan pr
             JOIN dosen d ON pr.dosen_id = d.id
             WHERE pr.ruangan_id = $1 ORDER BY pr.urutan`,
            [room.id]
          )
        : { rows: [] },
      room.is_kelas
        ? db.query(
            `SELECT j.id, j.hari, j.jam_mulai, j.jam_selesai, j.mata_kuliah,
                    d.nama AS nama_dosen, d2.nama AS nama_dosen_2, d3.nama AS nama_dosen_3
             FROM jadwal j
             LEFT JOIN dosen d  ON j.dosen_id   = d.id
             LEFT JOIN dosen d2 ON j.dosen_id_2 = d2.id
             LEFT JOIN dosen d3 ON j.dosen_id_3 = d3.id
             WHERE j.ruangan_id = $1
             ORDER BY
               CASE j.hari
                 WHEN 'Senin' THEN 1 WHEN 'Selasa' THEN 2 WHEN 'Rabu' THEN 3
                 WHEN 'Kamis' THEN 4 WHEN 'Jumat'  THEN 5 ELSE 6
               END, j.jam_mulai`,
            [room.id]
          )
        : { rows: [] },
      room.is_reservable
        ? db.query(
            `SELECT rv.id, rv.tanggal, rv.jam_mulai, rv.jam_selesai, rv.keterangan,
                    d.nama AS nama_dosen
             FROM reservasi rv
             JOIN dosen d ON rv.dosen_id = d.id
             WHERE rv.ruangan_id = $1 AND rv.tanggal = CURRENT_DATE AND rv.jam_selesai > CURRENT_TIME
             ORDER BY rv.jam_mulai`,
            [room.id]
          )
        : { rows: [] },
    ]);

    res.json({
      ...room,
      occupants: occupantsResult.rows,
      schedules: schedResult.rows,
      reservations: reservasiResult.rows,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM ruangan ORDER BY lantai, nama_ruang");
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  try {
    const { nama_ruang, lantai, is_kelas, is_lab, is_ruang_dosen, is_ruangan, is_reservable, keterangan } = req.body;
    const result = await db.query(
      `INSERT INTO ruangan (nama_ruang, lantai, is_kelas, is_lab, is_ruang_dosen, is_ruangan, is_reservable, keterangan)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [nama_ruang, lantai || null, !!is_kelas, !!is_lab, !!is_ruang_dosen, !!is_ruangan, !!is_reservable, keterangan || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:id", async (req, res) => {
  try {
    const { nama_ruang, lantai, is_kelas, is_lab, is_ruang_dosen, is_ruangan, is_reservable, keterangan } = req.body;
    const result = await db.query(
      `UPDATE ruangan SET nama_ruang=$1, lantai=$2, is_kelas=$3, is_lab=$4,
       is_ruang_dosen=$5, is_ruangan=$6, is_reservable=$7, keterangan=$8 WHERE id=$9 RETURNING *`,
      [nama_ruang, lantai || null, !!is_kelas, !!is_lab, !!is_ruang_dosen, !!is_ruangan, !!is_reservable, keterangan || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM ruangan WHERE id=$1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ deleted: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
