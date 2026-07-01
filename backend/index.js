const express        = require("express");
const cors           = require("cors");
const http           = require("http");
const path           = require("path");
const { WebSocketServer } = require("ws");
const { networkInterfaces } = require("os");
const { randomUUID } = require("crypto");
const db             = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const frontendDist = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendDist));
app.get("/mobile", (_req, res) => res.sendFile(path.join(frontendDist, "index.html")));

// ── REST routes ──────────────────────────────────────────────────────

// Unified room info: flags + occupants + schedules in one call
app.get("/api/rooms/:roomName", async (req, res) => {
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

app.get("/api/search", async (req, res) => {
  try {
    const q   = (req.query.q   || "").trim();
    const day = (req.query.day || "").trim();
    if (q.length < 2) return res.json([]);

    const dayNames = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const todayName = day || dayNames[new Date().getDay()];
    const isWeekday = ['Senin','Selasa','Rabu','Kamis','Jumat'].includes(todayName);

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

app.get("/api/rooms", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM ruangan ORDER BY lantai, nama_ruang");
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Admin CRUD routes ───────────────────────────────────────────────

// -- Ruangan CRUD --
app.post("/api/rooms", async (req, res) => {
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

app.put("/api/rooms/:id", async (req, res) => {
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

app.delete("/api/rooms/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM ruangan WHERE id=$1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ deleted: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -- Dosen CRUD --
app.get("/api/dosen", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM dosen ORDER BY id");
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post("/api/dosen", async (req, res) => {
  try {
    const { nama } = req.body;
    const result = await db.query("INSERT INTO dosen (nama) VALUES ($1) RETURNING *", [nama]);
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put("/api/dosen/:id", async (req, res) => {
  try {
    const { nama } = req.body;
    const result = await db.query("UPDATE dosen SET nama=$1 WHERE id=$2 RETURNING *", [nama, req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete("/api/dosen/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM dosen WHERE id=$1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ deleted: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -- Jadwal CRUD --
app.get("/api/jadwal", async (req, res) => {
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

app.post("/api/jadwal", async (req, res) => {
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

app.put("/api/jadwal/:id", async (req, res) => {
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

app.delete("/api/jadwal/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM jadwal WHERE id=$1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ deleted: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -- Penghuni Ruangan CRUD --
app.get("/api/penghuni", async (req, res) => {
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

app.post("/api/penghuni", async (req, res) => {
  try {
    const { ruangan_id, dosen_id, urutan } = req.body;
    const result = await db.query(
      "INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan) VALUES ($1,$2,$3) RETURNING *",
      [ruangan_id, dosen_id, urutan || 0]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put("/api/penghuni/:id", async (req, res) => {
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

app.delete("/api/penghuni/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM penghuni_ruangan WHERE id=$1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ deleted: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// -- Reservasi CRUD --
// Clean up expired reservations on every list request
const cleanExpiredReservasi = () =>
  db.query(`DELETE FROM reservasi WHERE tanggal < CURRENT_DATE OR (tanggal = CURRENT_DATE AND jam_selesai <= CURRENT_TIME)`);

app.get("/api/reservasi", async (req, res) => {
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

app.post("/api/reservasi", async (req, res) => {
  try {
    const { ruangan_id, dosen_id, tanggal, jam_mulai, jam_selesai, keterangan } = req.body;

    const dayNames = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const hari = dayNames[new Date(tanggal).getDay()];

    const jadwalConflict = await db.query(
      `SELECT id FROM jadwal
       WHERE ruangan_id = $1 AND hari = $2
         AND jam_mulai < $4 AND jam_selesai > $3
       LIMIT 1`,
      [ruangan_id, hari, jam_mulai, jam_selesai]
    );
    if (jadwalConflict.rows.length > 0) {
      return res.status(409).json({ error: "Konflik dengan jadwal kuliah pada hari dan jam tersebut." });
    }

    const resConflict = await db.query(
      `SELECT id FROM reservasi
       WHERE ruangan_id = $1 AND tanggal = $2
         AND jam_mulai < $4 AND jam_selesai > $3
       LIMIT 1`,
      [ruangan_id, tanggal, jam_mulai, jam_selesai]
    );
    if (resConflict.rows.length > 0) {
      return res.status(409).json({ error: "Konflik dengan reservasi lain pada tanggal dan jam tersebut." });
    }

    const result = await db.query(
      `INSERT INTO reservasi (ruangan_id, dosen_id, tanggal, jam_mulai, jam_selesai, keterangan)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [ruangan_id, dosen_id, tanggal, jam_mulai, jam_selesai, keterangan || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put("/api/reservasi/:id", async (req, res) => {
  try {
    const { ruangan_id, dosen_id, tanggal, jam_mulai, jam_selesai, keterangan } = req.body;

    const dayNames = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const hari = dayNames[new Date(tanggal).getDay()];

    const jadwalConflict = await db.query(
      `SELECT id FROM jadwal
       WHERE ruangan_id = $1 AND hari = $2
         AND jam_mulai < $4 AND jam_selesai > $3
       LIMIT 1`,
      [ruangan_id, hari, jam_mulai, jam_selesai]
    );
    if (jadwalConflict.rows.length > 0) {
      return res.status(409).json({ error: "Konflik dengan jadwal kuliah pada hari dan jam tersebut." });
    }

    const resConflict = await db.query(
      `SELECT id FROM reservasi
       WHERE ruangan_id = $1 AND tanggal = $2
         AND jam_mulai < $4 AND jam_selesai > $3
         AND id != $5
       LIMIT 1`,
      [ruangan_id, tanggal, jam_mulai, jam_selesai, req.params.id]
    );
    if (resConflict.rows.length > 0) {
      return res.status(409).json({ error: "Konflik dengan reservasi lain pada tanggal dan jam tersebut." });
    }

    const result = await db.query(
      `UPDATE reservasi SET ruangan_id=$1, dosen_id=$2, tanggal=$3, jam_mulai=$4, jam_selesai=$5,
       keterangan=$6 WHERE id=$7 RETURNING *`,
      [ruangan_id, dosen_id, tanggal, jam_mulai, jam_selesai, keterangan || null, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete("/api/reservasi/:id", async (req, res) => {
  try {
    const result = await db.query("DELETE FROM reservasi WHERE id=$1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json({ deleted: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Serve admin page
app.get("/admin", (_req, res) => res.sendFile(path.join(frontendDist, "index.html")));

// ── WebSocket server ─────────────────────────────────────────────────

function getLocalIP() {
  const nets = networkInterfaces();
  const isPrivate = (addr) =>
    /^192\.168\./.test(addr) ||
    /^10\./.test(addr) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(addr);

  const isVirtualGateway = (addr) => addr.endsWith(".1") || addr.endsWith(".254");

  for (const name of Object.keys(nets)) {
    for (const net of (nets[name] || [])) {
      if (net.family === "IPv4" && !net.internal && isPrivate(net.address) && !isVirtualGateway(net.address))
        return net.address;
    }
  }
  for (const name of Object.keys(nets)) {
    for (const net of (nets[name] || [])) {
      if (net.family === "IPv4" && !net.internal && isPrivate(net.address))
        return net.address;
    }
  }
  for (const name of Object.keys(nets)) {
    for (const net of (nets[name] || [])) {
      if (net.family === "IPv4" && !net.internal) return net.address;
    }
  }
  return "localhost";
}

const PORT          = process.env.PORT || 8000;
const PHONE_IDLE_MS = 1 * 60 * 1000;
const server = http.createServer(app);
const wss    = new WebSocketServer({ server, path: "/ws" });

const sessions = new Map();

wss.on("connection", (ws, req) => {
  const params = new URL(req.url, "http://localhost").searchParams;
  const role   = params.get("role");
  const sid    = params.get("sid");

  if (role === "tv") {
    const newSid = randomUUID();
    sessions.set(newSid, { tv: ws, phone: null });

    const localIP       = getLocalIP();
    const frontendPort  = process.env.FRONTEND_PORT || 5173;
    const backendUrl    = process.env.PUBLIC_BACKEND_URL  || `http://${localIP}:${PORT}`;
    const frontendUrl   = process.env.PUBLIC_FRONTEND_URL || `http://${localIP}:${frontendPort}`;
    ws.send(JSON.stringify({
      type:      "session",
      sid:       newSid,
      mobileUrl: `${frontendUrl}/mobile?sid=${newSid}&backendUrl=${encodeURIComponent(backendUrl)}`,
    }));

    ws.on("message", (data) => {
      const session = sessions.get(newSid);
      if (session?.phone?.readyState === 1) session.phone.send(data.toString());
    });

    ws.on("close", () => sessions.delete(newSid));

  } else if (role === "phone" && sid && sessions.has(sid)) {
    const session  = sessions.get(sid);
    if (session.phone && session.phone.readyState === WebSocket.OPEN) {
      ws.close(1000, "session already in use");
      return;
    }
    session.phone  = ws;

    if (session.tv?.readyState === 1) {
      session.tv.send(JSON.stringify({ type: "phoneConnected" }));
    }

    let idleTimer = setTimeout(() => ws.close(1000, "idle"), PHONE_IDLE_MS);
    const resetIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => ws.close(1000, "idle"), PHONE_IDLE_MS);
    };

    ws.on("message", (data) => {
      resetIdle();
      const s = sessions.get(sid);
      if (s?.tv?.readyState === 1) s.tv.send(data.toString());
    });

    ws.on("close", () => {
      clearTimeout(idleTimer);
      const s = sessions.get(sid);
      if (s) {
        s.phone = null;
        if (s.tv?.readyState === 1) s.tv.send(JSON.stringify({ type: "phoneDisconnected" }));
      }
    });

  } else {
    ws.close(1008, "Invalid params");
  }
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
}

module.exports = server;
