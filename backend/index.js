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
      `SELECT id, nama_ruang, lantai, is_kelas, is_lab, is_ruang_dosen, is_ruangan, label
       FROM ruangan
       WHERE nama_ruang = $1
          OR REPLACE(nama_ruang, ' ', '_') = REPLACE($1, ' ', '_')`,
      [roomName]
    );
    if (roomResult.rows.length === 0) return res.status(404).json({ error: "Not found" });

    const room = roomResult.rows[0];

    const [occupantsResult, schedResult] = await Promise.all([
      room.is_ruang_dosen
        ? db.query(
            `SELECT d.nama FROM penghuni_ruangan pr
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
    ]);

    res.json({
      ...room,
      occupants: occupantsResult.rows.map((r) => r.nama),
      schedules: schedResult.rows,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/search", async (req, res) => {
  try {
    const q   = (req.query.q   || "").trim();
    const day = (req.query.day || "").trim();
    if (q.length < 2) return res.json([]);

    const schedParams = [`%${q}%`];
    const dayClause   = day ? `AND j.hari = $2` : "";
    if (day) schedParams.push(day);

    const schedResult = await db.query(
      `SELECT r.nama_ruang AS room_name, r.lantai, 'schedule' AS result_type,
              j.hari, j.jam_mulai, j.jam_selesai, j.mata_kuliah,
              d.nama AS nama_dosen, d2.nama AS nama_dosen_2, d3.nama AS nama_dosen_3,
              NULL::text[] AS occupants, NULL::text AS label
       FROM jadwal j
       JOIN ruangan r ON j.ruangan_id = r.id
       LEFT JOIN dosen d  ON j.dosen_id   = d.id
       LEFT JOIN dosen d2 ON j.dosen_id_2 = d2.id
       LEFT JOIN dosen d3 ON j.dosen_id_3 = d3.id
       WHERE (j.mata_kuliah ILIKE $1 OR d.nama ILIKE $1 OR d2.nama ILIKE $1 OR d3.nama ILIKE $1)
       ${dayClause}
       ORDER BY r.nama_ruang, j.jam_mulai
       LIMIT 50`,
      schedParams
    );

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
              r.label
       FROM ruangan r
       LEFT JOIN penghuni_ruangan pr ON pr.ruangan_id = r.id
       LEFT JOIN dosen d ON pr.dosen_id = d.id
       WHERE r.is_ruang_dosen = TRUE
         AND (r.nama_ruang ILIKE $1 OR r.label ILIKE $1 OR d.nama ILIKE $1
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
              NULL::text[] AS occupants, r.label
       FROM ruangan r
       WHERE r.nama_ruang ILIKE $1
         AND r.is_ruang_dosen = FALSE
       ORDER BY r.lantai, r.nama_ruang
       LIMIT 20`,
      [`%${q}%`]
    );

    const seen = new Set([
      ...schedResult.rows.map(r => r.room_name),
      ...dosenResult.rows.map(r => r.room_name),
    ]);
    const extraRooms = roomResult.rows.filter(r => !seen.has(r.room_name));

    res.json([...schedResult.rows, ...dosenResult.rows, ...extraRooms]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get("/api/rooms", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM ruangan ORDER BY lantai, nama_ruang");
    res.json(result.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});


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
const wss    = new WebSocketServer({ server });

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
