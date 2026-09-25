// Integration tests: these run against the real database configured in
// backend/.env (or DATABASE_URL). They create a throwaway room and lecturer,
// both named with TEST_PREFIX, and delete them again in the final afterAll —
// deleting the room cascades to every schedule and booking made on it.

const request   = require("supertest");
const WebSocket = require("ws");
const server    = require("../index");

const TEST_PREFIX = "TEST_JEST_";
const TEST_ROOM   = `${TEST_PREFIX}ROOM`;

function getWsUrl(path) {
  const addr = server.address();
  return `ws://localhost:${addr.port}${path}`;
}

// ── Helpers ──────────────────────────────────────────────────────────

/** Open a WebSocket and return { ws, firstMessage } promise */
function connectWs(path) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(getWsUrl(path));
    const firstMessage = waitForMessage(ws);
    firstMessage.catch(() => {}); // not every caller awaits it
    ws.once("open",    ()    => resolve({ ws, firstMessage }));
    ws.once("error",   (err) => reject(err));
    ws.once("close",   (code, reason) => reject(new Error(`Closed ${code}: ${reason}`)));
  });
}

/** Wait for the next message on a WebSocket */
function waitForMessage(ws, timeoutMs = 3000) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("WS message timeout")), timeoutMs);
    ws.once("message", (data) => { clearTimeout(t); resolve(JSON.parse(data.toString())); });
  });
}

/** Wait for a WebSocket to close */
function waitForClose(ws, timeoutMs = 3000) {
  return new Promise((resolve) => {
    const t = setTimeout(() => resolve({ code: -1 }), timeoutMs);
    ws.once("close", (code, reason) => { clearTimeout(t); resolve({ code, reason: reason.toString() }); });
  });
}

/** Next Monday as YYYY-MM-DD in local time — always in the future, so the
 *  expired-booking cleanup in GET /api/reservasi never removes it. */
function nextMonday() {
  const d = new Date();
  d.setDate(d.getDate() + (((8 - d.getDay()) % 7) || 7));
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// ── Shared fixtures ──────────────────────────────────────────────────

let roomId;
let dosenId;

beforeAll(async () => {
  const room = await request(server).post("/api/rooms").send({
    nama_ruang: TEST_ROOM, lantai: "Lantai 1", is_kelas: true, is_reservable: true,
  });
  roomId = room.body.id;

  const dosen = await request(server).post("/api/dosen").send({ nama: `${TEST_PREFIX}Dosen` });
  dosenId = dosen.body.id;
});

afterAll(async () => {
  // Room first: it cascades to jadwal, whose dosen_id is ON DELETE RESTRICT.
  if (roomId)  await request(server).delete(`/api/rooms/${roomId}`);
  if (dosenId) await request(server).delete(`/api/dosen/${dosenId}`);
});

// ── GET /api/rooms ───────────────────────────────────────────────────

describe("GET /api/rooms", () => {
  it("returns 200 with an array", async () => {
    const res = await request(server).get("/api/rooms");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("each room has expected fields", async () => {
    const res = await request(server).get("/api/rooms");
    const room = res.body[0];
    expect(room).toHaveProperty("id");
    expect(room).toHaveProperty("nama_ruang");
    expect(room).toHaveProperty("lantai");
  });
});

// ── GET /api/rooms/:roomName ─────────────────────────────────────────

describe("GET /api/rooms/:roomName", () => {
  it("returns 404 for a room that does not exist", async () => {
    const res = await request(server).get("/api/rooms/RUANG_TIDAK_ADA_XYZ_999");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("returns the room with occupants, schedules and reservations", async () => {
    const res = await request(server).get(`/api/rooms/${TEST_ROOM}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("nama_ruang", TEST_ROOM);
    expect(Array.isArray(res.body.occupants)).toBe(true);
    expect(Array.isArray(res.body.schedules)).toBe(true);
    expect(Array.isArray(res.body.reservations)).toBe(true);
  });

  it("matches a name with spaces when asked with underscores", async () => {
    const rooms   = (await request(server).get("/api/rooms")).body;
    const spaced  = rooms.find((r) => r.nama_ruang.includes(" "));
    if (!spaced) return; // needs a seeded room such as "Aula Handayani"
    const res = await request(server).get(`/api/rooms/${spaced.nama_ruang.replace(/ /g, "_")}`);
    expect(res.status).toBe(200);
    expect(res.body.nama_ruang).toBe(spaced.nama_ruang);
  });
});

// ── GET /api/search ──────────────────────────────────────────────────

describe("GET /api/search", () => {
  it("returns empty array when q is missing", async () => {
    const res = await request(server).get("/api/search");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns empty array when q has only 1 character", async () => {
    const res = await request(server).get("/api/search?q=A");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("each result has room_name, lantai, and result_type", async () => {
    const res = await request(server).get("/api/search?q=Al");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    for (const item of res.body) {
      expect(item).toHaveProperty("room_name");
      expect(item).toHaveProperty("lantai");
      expect(["schedule", "dosen", "room", "reservasi"]).toContain(item.result_type);
    }
  });

  it("day filter only returns schedules on that day", async () => {
    const res = await request(server).get("/api/search?q=Al&day=Senin");
    expect(res.status).toBe(200);
    for (const item of res.body) {
      if (item.result_type === "schedule") expect(item.hari).toBe("Senin");
    }
  });
});

// ── /api/jadwal ──────────────────────────────────────────────────────

describe("/api/jadwal", () => {
  let jadwalId;

  const schedule = (overrides = {}) => ({
    ruangan_id:  roomId,
    dosen_id:    dosenId,
    hari:        "Senin",
    jam_mulai:   "08:00",
    jam_selesai: "10:00",
    mata_kuliah: "Pemrograman Web",
    ...overrides,
  });

  it("POST creates a schedule and returns the row", async () => {
    const res = await request(server).post("/api/jadwal").send(schedule());
    expect(res.status).toBe(201);
    expect(typeof res.body.id).toBe("number");
    expect(res.body.mata_kuliah).toBe("Pemrograman Web");
    jadwalId = res.body.id;
  });

  it("the new schedule shows up on the room", async () => {
    const res = await request(server).get(`/api/rooms/${TEST_ROOM}`);
    expect(res.body.schedules.some((s) => s.id === jadwalId)).toBe(true);
  });

  it("PUT updates the schedule", async () => {
    const res = await request(server)
      .put(`/api/jadwal/${jadwalId}`)
      .send(schedule({ hari: "Jumat", mata_kuliah: "Mata Kuliah Diperbarui" }));
    expect(res.status).toBe(200);
    expect(res.body.hari).toBe("Jumat");

    const room    = await request(server).get(`/api/rooms/${TEST_ROOM}`);
    const updated = room.body.schedules.find((s) => s.id === jadwalId);
    expect(updated.mata_kuliah).toBe("Mata Kuliah Diperbarui");
  });

  it("PUT on a missing id returns 404", async () => {
    const res = await request(server).put("/api/jadwal/999999999").send(schedule());
    expect(res.status).toBe(404);
  });

  it("DELETE removes the schedule", async () => {
    const res = await request(server).delete(`/api/jadwal/${jadwalId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ deleted: true });

    const room = await request(server).get(`/api/rooms/${TEST_ROOM}`);
    expect(room.body.schedules.some((s) => s.id === jadwalId)).toBe(false);
  });

  it("DELETE on a missing id returns 404", async () => {
    const res = await request(server).delete("/api/jadwal/999999999");
    expect(res.status).toBe(404);
  });
});

// ── /api/reservasi conflict checks ───────────────────────────────────

describe("/api/reservasi conflict checks", () => {
  const tanggal = nextMonday();

  const booking = (jam_mulai, jam_selesai) => ({
    ruangan_id: roomId, dosen_id: dosenId, tanggal, jam_mulai, jam_selesai,
  });

  beforeAll(async () => {
    // A Monday class from 08:00 to 10:00 in the test room.
    await request(server).post("/api/jadwal").send({
      ruangan_id: roomId, dosen_id: dosenId, hari: "Senin",
      jam_mulai: "08:00", jam_selesai: "10:00", mata_kuliah: "Kelas Bentrok",
    });
  });

  it("rejects a booking that overlaps a class with 409", async () => {
    const res = await request(server).post("/api/reservasi").send(booking("09:00", "11:00"));
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/jadwal kuliah/);
  });

  it("accepts a booking that starts when the class ends", async () => {
    const res = await request(server).post("/api/reservasi").send(booking("10:00", "11:00"));
    expect(res.status).toBe(201);
  });

  it("rejects a booking that overlaps another booking with 409", async () => {
    const res = await request(server).post("/api/reservasi").send(booking("10:30", "12:00"));
    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/reservasi lain/);
  });
});

// ── WebSocket ────────────────────────────────────────────────────────

describe("WebSocket /ws", () => {
  beforeAll((done) => {
    // Supertest binds an ephemeral port per request; WS tests need a stable one.
    if (!server.listening) server.listen(0, done);
    else done();
  });

  it("tv role receives a session message with sid and mobileUrl", async () => {
    const { ws, firstMessage } = await connectWs("/ws?role=tv");
    const msg = await firstMessage;
    expect(msg.type).toBe("session");
    expect(typeof msg.sid).toBe("string");
    expect(msg.sid.length).toBeGreaterThan(0);
    expect(msg.mobileUrl).toContain(msg.sid);
    ws.close();
  });

  it.each([
    ["phone with an unknown sid", "/ws?role=phone&sid=INVALID-SID-THAT-DOES-NOT-EXIST"],
    ["phone with no sid",         "/ws?role=phone"],
    ["an unknown role",           "/ws?role=unknown"],
  ])("rejects %s with close code 1008", async (_label, path) => {
    const ws = new WebSocket(getWsUrl(path));
    const { code } = await waitForClose(ws);
    expect(code).toBe(1008);
  });

  it("pairing notifies the tv on phone connect and disconnect", async () => {
    const { ws: tvWs, firstMessage } = await connectWs("/ws?role=tv");
    const { sid } = await firstMessage;

    const tvNext  = waitForMessage(tvWs);
    const phoneWs = new WebSocket(getWsUrl(`/ws?role=phone&sid=${sid}`));
    expect((await tvNext).type).toBe("phoneConnected");

    const tvDisconnect = waitForMessage(tvWs);
    phoneWs.close();
    expect((await tvDisconnect).type).toBe("phoneDisconnected");

    tvWs.close();
  });

  it("relays messages both ways", async () => {
    const { ws: tvWs, firstMessage } = await connectWs("/ws?role=tv");
    const { sid } = await firstMessage;

    const phoneConnected = waitForMessage(tvWs);
    const { ws: phoneWs } = await connectWs(`/ws?role=phone&sid=${sid}`);
    await phoneConnected;

    const atTv = waitForMessage(tvWs);
    phoneWs.send(JSON.stringify({ type: "cmd", action: "selectFloor", payload: "Lantai 2" }));
    expect(await atTv).toEqual({ type: "cmd", action: "selectFloor", payload: "Lantai 2" });

    const atPhone = waitForMessage(phoneWs);
    tvWs.send(JSON.stringify({ type: "state", floor: "Lantai 2" }));
    expect(await atPhone).toEqual({ type: "state", floor: "Lantai 2" });

    phoneWs.close();
    tvWs.close();
  });

  it("closes a second phone on the same session with code 1000", async () => {
    const { ws: tvWs, firstMessage } = await connectWs("/ws?role=tv");
    const { sid } = await firstMessage;

    const phoneConnected = waitForMessage(tvWs);
    const { ws: phoneWs } = await connectWs(`/ws?role=phone&sid=${sid}`);
    await phoneConnected;

    const second = new WebSocket(getWsUrl(`/ws?role=phone&sid=${sid}`));
    const { code, reason } = await waitForClose(second);
    expect(code).toBe(1000);
    expect(reason).toBe("session already in use");

    phoneWs.close();
    tvWs.close();
  });
});
