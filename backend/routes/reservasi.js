const express = require("express");
const db      = require("../db");
const { dayNameOf } = require("../utils/days");

const router = express.Router();

// Clean up expired reservations on every list request
const cleanExpiredReservasi = () =>
  db.query(`DELETE FROM reservasi WHERE tanggal < CURRENT_DATE OR (tanggal = CURRENT_DATE AND jam_selesai <= CURRENT_TIME)`);

/**
 * A booking clashes if it overlaps a teaching slot on the same weekday, or an
 * existing reservation on the same date. On update, the row being edited is
 * excluded from the reservation check via `excludeId`.
 * Returns an error message, or null when the slot is free.
 */
async function findConflict({ ruangan_id, tanggal, jam_mulai, jam_selesai }, excludeId) {
  const jadwalConflict = await db.query(
    `SELECT id FROM jadwal
     WHERE ruangan_id = $1 AND hari = $2
       AND jam_mulai < $4 AND jam_selesai > $3
     LIMIT 1`,
    [ruangan_id, dayNameOf(tanggal), jam_mulai, jam_selesai]
  );
  if (jadwalConflict.rows.length > 0) {
    return "Konflik dengan jadwal kuliah pada hari dan jam tersebut.";
  }

  const resConflict = await db.query(
    `SELECT id FROM reservasi
     WHERE ruangan_id = $1 AND tanggal = $2
       AND jam_mulai < $4 AND jam_selesai > $3
       ${excludeId === undefined ? "" : "AND id != $5"}
     LIMIT 1`,
    excludeId === undefined
      ? [ruangan_id, tanggal, jam_mulai, jam_selesai]
      : [ruangan_id, tanggal, jam_mulai, jam_selesai, excludeId]
  );
  if (resConflict.rows.length > 0) {
    return "Konflik dengan reservasi lain pada tanggal dan jam tersebut.";
  }

  return null;
}

router.get("/", async (req, res) => {
  await cleanExpiredReservasi();
  try {
    const result = await db.query(
      `SELECT rv.*, r.nama_ruang, d.nama AS nama_dosen
       FROM reservasi rv
       JOIN ruangan r ON rv.ruangan_id = r.id
       JOIN dosen d ON rv.dosen_id = d.id
       ORDER BY rv.tanggal DESC, rv.jam_mulai`
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/", async (req, res) => {
  try {
    const { ruangan_id, dosen_id, tanggal, jam_mulai, jam_selesai, keterangan } = req.body;

    const conflict = await findConflict({ ruangan_id, tanggal, jam_mulai, jam_selesai });
    if (conflict) return res.status(409).json({ error: conflict });

    const result = await db.query(
      `INSERT INTO reservasi (ruangan_id, dosen_id, tanggal, jam_mulai, jam_selesai, keterangan)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [ruangan_id, dosen_id, tanggal, jam_mulai, jam_selesai, keterangan || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/:id", async (req, res) => {
  try {
    const { ruangan_id, dosen_id, tanggal, jam_mulai, jam_selesai, keterangan } = req.body;

    const conflict = await findConflict({ ruangan_id, tanggal, jam_mulai, jam_selesai }, req.params.id);
    if (conflict) return res.status(409).json({ error: conflict });

    const result = await db.query(
      `UPDATE reservasi SET ruangan_id=$1, dosen_id=$2, tanggal=$3, jam_mulai=$4, jam_selesai=$5,
       keterangan=$6 WHERE id=$7 RETURNING *`,
      [ruangan_id, dosen_id, tanggal, jam_mulai, jam_selesai, keterangan || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM reservasi WHERE id=$1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ deleted: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
