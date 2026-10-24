// Tests for the local WebSocket relay. The hosted relay on Cloudflare must
// pass the same cases, so the protocol stays one protocol.

const WebSocket = require("ws");
const server    = require("../index");

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

// ── WebSocket ────────────────────────────────────────────────────────

describe("WebSocket /ws", () => {
  beforeAll((done) => { server.listen(0, done); });
  afterAll((done) => { server.close(done); });

  it("tv role receives a session message with a sid and a LAN address hint", async () => {
    const { ws, firstMessage } = await connectWs("/ws?role=tv");
    const msg = await firstMessage;
    expect(msg.type).toBe("session");
    expect(typeof msg.sid).toBe("string");
    expect(msg.sid.length).toBeGreaterThan(0);
    expect(typeof msg.lanAddress).toBe("string");
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
