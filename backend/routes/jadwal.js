const express = require("express");
const db      = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT j.*, r.nama_ruang, d.nama AS nama_dosen, d2.nama AS nama_dosen_2, d3.nama AS nama_dosen_3
       FROM jadwal j
       JOIN ruangan r ON j.ruangan_id = r.id
       LEFT JOIN dosen d  ON j.dosen_id   = d.id
       LEFT JOIN dosen d2 ON j.dosen_id_2 = d2.id
       LEFT JOIN dosen d3 ON j.dosen_id_3 = d3.id
       ORDER BY j.id`
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  try {
    const { ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2, dosen_id_3 } = req.body;
    const result = await db.query(
      `INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2, dosen_id_3)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2 || null, dosen_id_3 || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:id", async (req, res) => {
  try {
    const { ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2, dosen_id_3 } = req.body;
    const result = await db.query(
      `UPDATE jadwal SET ruangan_id=$1, hari=$2, jam_mulai=$3, jam_selesai=$4,
       mata_kuliah=$5, dosen_id=$6, dosen_id_2=$7, dosen_id_3=$8 WHERE id=$9 RETURNING *`,
      [ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2 || null, dosen_id_3 || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM jadwal WHERE id=$1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ deleted: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
