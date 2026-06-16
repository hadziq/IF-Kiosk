const request   = require("supertest");
const WebSocket = require("ws");
const server    = require("./index");

// Helper: get the port the server is actually bound to (Supertest binds ephemeral)
function getBaseUrl() {
  const addr = server.address();
  return `http://localhost:${addr.port}`;
}
function getWsUrl(path) {
  const addr = server.address();
  return `ws://localhost:${addr.port}${path}`;
}

// ── Helpers ──────────────────────────────────────────────────────────

/** Open a WebSocket and return { ws, firstMessage } promise */
function connectWs(path) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(getWsUrl(path));
    ws.once("open",    ()    => resolve({ ws, firstMessage: waitForMessage(ws) }));
    ws.once("error",   (err) => reject(err));
    ws.once("close",   (code, reason) => reject(new Error(`Closed ${code}: ${reason}`)));
  });
}

/** Wait for the next message on an already-open WebSocket */
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

// ── Test suite ───────────────────────────────────────────────────────

describe("GET /api/rooms", () => {
  it("returns 200 with an array", async () => {
    const res = await request(server).get("/api/rooms");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("each room has expected fields", async () => {
    const res = await request(server).get("/api/rooms");
    if (res.body.length === 0) return; // skip if DB is empty
    const room = res.body[0];
    expect(room).toHaveProperty("id");
    expect(room).toHaveProperty("nama_ruang");
    expect(room).toHaveProperty("lantai");
  });
});

// ── GET /api/rooms/:roomName ─────────────────────────────────────────

describe("GET /api/rooms/:roomName", () => {
  let existingRoomName;

  beforeAll(async () => {
    const res = await request(server).get("/api/rooms");
    if (res.body.length > 0) existingRoomName = res.body[0].nama_ruang;
  });

  it("returns 404 for a room that does not exist", async () => {
    const res = await request(server).get("/api/rooms/RUANG_TIDAK_ADA_XYZ_999");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 200 with room data for a valid room", async () => {
    if (!existingRoomName) return; // skip if DB is empty
    const res = await request(server).get(`/api/rooms/${encodeURIComponent(existingRoomName)}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("nama_ruang", existingRoomName);
    expect(res.body).toHaveProperty("occupants");
    expect(res.body).toHaveProperty("schedules");
    expect(Array.isArray(res.body.occupants)).toBe(true);
    expect(Array.isArray(res.body.schedules)).toBe(true);
  });

  it("matches room name with underscores instead of spaces", async () => {
    if (!existingRoomName) return;
    // replace spaces with underscores — the API normalises this
    const underscored = existingRoomName.replace(/ /g, "_");
    const res = await request(server).get(`/api/rooms/${encodeURIComponent(underscored)}`);
    expect(res.status).toBe(200);
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

  it("returns an array for a 2+ character query", async () => {
    const res = await request(server).get("/api/search?q=Al");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("each result has room_name, lantai, and result_type", async () => {
    const res = await request(server).get("/api/search?q=Al");
    if (res.body.length === 0) return;
    const item = res.body[0];
    expect(item).toHaveProperty("room_name");
    expect(item).toHaveProperty("lantai");
    expect(item).toHaveProperty("result_type");
    expect(["schedule", "dosen", "room"]).toContain(item.result_type);
  });

  it("accepts an optional day filter without error", async () => {
    const res = await request(server).get("/api/search?q=Al&day=Senin");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("day filter only returns results matching that day", async () => {
    const res = await request(server).get("/api/search?q=Al&day=Senin");
    for (const item of res.body) {
      if (item.result_type === "schedule") {
        expect(item.hari).toBe("Senin");
      }
    }
  });
});

// ── POST /api/rooms/:roomName/schedules ──────────────────────────────

describe("POST /api/rooms/:roomName/schedules", () => {
  const TEST_ROOM    = "TEST_ROOM_JEST_BLACKBOX";
  const createdIds   = [];

  afterAll(async () => {
    // clean up schedules created during tests
    for (const id of createdIds) {
      await request(server).delete(`/api/schedules/${id}`);
    }
  });

  it("creates a new schedule and returns an id", async () => {
    const res = await request(server)
      .post(`/api/rooms/${TEST_ROOM}/schedules`)
      .send({
        hari:        "Senin",
        jam_mulai:   "08:00",
        jam_selesai: "10:00",
        mata_kuliah: "Pemrograman Web",
        kode_kelas:  "A",
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(typeof res.body.id).toBe("number");
    createdIds.push(res.body.id);
  });

  it("accepts optional dosen_id as null without error", async () => {
    const res = await request(server)
      .post(`/api/rooms/${TEST_ROOM}/schedules`)
      .send({
        hari:        "Selasa",
        jam_mulai:   "10:00",
        jam_selesai: "12:00",
        mata_kuliah: "Basis Data",
        dosen_id:    null,
        kode_kelas:  null,
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
    createdIds.push(res.body.id);
  });

  it("created schedule is visible via GET room endpoint", async () => {
    const res = await request(server)
      .post(`/api/rooms/${TEST_ROOM}/schedules`)
      .send({
        hari:        "Rabu",
        jam_mulai:   "13:00",
        jam_selesai: "15:00",
        mata_kuliah: "Jaringan Komputer",
        kode_kelas:  "B",
      });
    createdIds.push(res.body.id);

    const roomRes = await request(server).get(`/api/rooms/${TEST_ROOM}`);
    expect(roomRes.status).toBe(200);
    const found = roomRes.body.schedules.some((s) => s.mata_kuliah === "Jaringan Komputer");
    expect(found).toBe(true);
  });
});

// ── PUT /api/schedules/:id ───────────────────────────────────────────

describe("PUT /api/schedules/:id", () => {
  const TEST_ROOM = "TEST_ROOM_JEST_BLACKBOX";
  let scheduleId;

  beforeAll(async () => {
    const res = await request(server)
      .post(`/api/rooms/${TEST_ROOM}/schedules`)
      .send({
        hari:        "Kamis",
        jam_mulai:   "07:00",
        jam_selesai: "09:00",
        mata_kuliah: "Mata Kuliah Awal",
        kode_kelas:  "C",
      });
    scheduleId = res.body.id;
  });

  afterAll(async () => {
    if (scheduleId) await request(server).delete(`/api/schedules/${scheduleId}`);
  });

  it("updates a schedule and returns success message", async () => {
    const res = await request(server)
      .put(`/api/schedules/${scheduleId}`)
      .send({
        hari:        "Jumat",
        jam_mulai:   "09:00",
        jam_selesai: "11:00",
        mata_kuliah: "Mata Kuliah Diperbarui",
        dosen_id:    null,
        kode_kelas:  "D",
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("update is reflected when fetching the room", async () => {
    const roomRes = await request(server).get(`/api/rooms/${TEST_ROOM}`);
    const updated = roomRes.body.schedules.find((s) => s.id === scheduleId);
    expect(updated).toBeDefined();
    expect(updated.mata_kuliah).toBe("Mata Kuliah Diperbarui");
    expect(updated.hari).toBe("Jumat");
  });

  it("updating a non-existent id returns 200 (no-op, no crash)", async () => {
    // The API doesn't error on missing id — document this behaviour
    const res = await request(server)
      .put("/api/schedules/999999999")
      .send({
        hari: "Senin", jam_mulai: "08:00", jam_selesai: "10:00",
        mata_kuliah: "X", dosen_id: null, kode_kelas: null,
      });
    expect(res.status).toBe(200);
  });
});

// ── DELETE /api/schedules/:id ────────────────────────────────────────

describe("DELETE /api/schedules/:id", () => {
  const TEST_ROOM = "TEST_ROOM_JEST_BLACKBOX";
  let scheduleId;

  beforeAll(async () => {
    const res = await request(server)
      .post(`/api/rooms/${TEST_ROOM}/schedules`)
      .send({
        hari:        "Senin",
        jam_mulai:   "14:00",
        jam_selesai: "16:00",
        mata_kuliah: "Mata Kuliah Hapus",
        kode_kelas:  "E",
      });
    scheduleId = res.body.id;
  });

  it("deletes a schedule and returns success message", async () => {
    const res = await request(server).delete(`/api/schedules/${scheduleId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    scheduleId = null; // already deleted
  });

  it("deleted schedule is no longer in room schedules", async () => {
    const roomRes = await request(server).get(`/api/rooms/${TEST_ROOM}`);
    const stillThere = (roomRes.body.schedules || []).some((s) => s.mata_kuliah === "Mata Kuliah Hapus");
    expect(stillThere).toBe(false);
  });

  it("deleting a non-existent id returns 200 (no-op)", async () => {
    const res = await request(server).delete("/api/schedules/999999999");
    expect(res.status).toBe(200);
  });
});

// ── WebSocket ────────────────────────────────────────────────────────

describe("WebSocket", () => {
  beforeAll((done) => {
    // ensure server is listening before WS tests
    if (!server.listening) server.listen(0, done);
    else done();
  });

  it("tv role receives a session message with sid and mobileUrl", async () => {
    const { ws, firstMessage } = await connectWs("/?role=tv");
    const msg = await firstMessage;
    expect(msg.type).toBe("session");
    expect(typeof msg.sid).toBe("string");
    expect(msg.sid.length).toBeGreaterThan(0);
    expect(typeof msg.mobileUrl).toBe("string");
    expect(msg.mobileUrl).toContain(msg.sid);
    ws.close();
  });

  it("phone with invalid sid is rejected (close code 1008)", async () => {
    const ws = new WebSocket(getWsUrl("/?role=phone&sid=INVALID-SID-THAT-DOES-NOT-EXIST"));
    const { code } = await waitForClose(ws);
    expect(code).toBe(1008);
  });

  it("phone with no sid is rejected (close code 1008)", async () => {
    const ws = new WebSocket(getWsUrl("/?role=phone"));
    const { code } = await waitForClose(ws);
    expect(code).toBe(1008);
  });

  it("connection with unknown role is rejected (close code 1008)", async () => {
    const ws = new WebSocket(getWsUrl("/?role=unknown"));
    const { code } = await waitForClose(ws);
    expect(code).toBe(1008);
  });

  it("phone connecting with valid tv sid triggers phoneConnected on tv", async () => {
    // 1. connect tv
    const { ws: tvWs, firstMessage: firstTvMsg } = await connectWs("/?role=tv");
    const session = await firstTvMsg;
    const sid     = session.sid;

    // 2. connect phone using tv's sid
    const phoneWs     = new WebSocket(getWsUrl(`/?role=phone&sid=${sid}`));
    const phoneOpenP  = new Promise((res) => phoneWs.once("open", res));
    const tvNextMsg   = waitForMessage(tvWs);
    await phoneOpenP;

    // 3. tv should receive phoneConnected
    const connected = await tvNextMsg;
    expect(connected.type).toBe("phoneConnected");

    // 4. phone disconnect notifies tv
    const tvDisconnectMsg = waitForMessage(tvWs);
    phoneWs.close();
    const disconnected = await tvDisconnectMsg;
    expect(disconnected.type).toBe("phoneDisconnected");

    tvWs.close();
  });

  it("messages from phone are forwarded to tv", async () => {
    const { ws: tvWs, firstMessage: firstTvMsg } = await connectWs("/?role=tv");
    const { sid } = await firstTvMsg;

    const phoneWs    = new WebSocket(getWsUrl(`/?role=phone&sid=${sid}`));
    const phoneOpenP = new Promise((res) => phoneWs.once("open", res));
    await phoneOpenP;

    // drain phoneConnected from tv
    await waitForMessage(tvWs);

    const tvNextMsg = waitForMessage(tvWs);
    phoneWs.send(JSON.stringify({ type: "gyroscope", x: 1, y: 2, z: 3 }));

    const forwarded = await tvNextMsg;
    expect(forwarded.type).toBe("gyroscope");
    expect(forwarded.x).toBe(1);

    phoneWs.close();
    tvWs.close();
  });
});
