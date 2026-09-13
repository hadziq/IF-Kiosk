const express = require("express");
const db      = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT pr.*, r.nama_ruang, d.nama AS nama_dosen
       FROM penghuni_ruangan pr
       JOIN ruangan r ON pr.ruangan_id = r.id
       JOIN dosen d ON pr.dosen_id = d.id
       ORDER BY r.nama_ruang, pr.urutan`
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  try {
    const { ruangan_id, dosen_id, urutan } = req.body;
    const result = await db.query(
      "INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan) VALUES ($1,$2,$3) RETURNING *",
      [ruangan_id, dosen_id, urutan || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:id", async (req, res) => {
  try {
    const { ruangan_id, dosen_id, urutan } = req.body;
    const result = await db.query(
      "UPDATE penghuni_ruangan SET ruangan_id=$1, dosen_id=$2, urutan=$3 WHERE id=$4 RETURNING *",
      [ruangan_id, dosen_id, urutan || 0, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM penghuni_ruangan WHERE id=$1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ deleted: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
