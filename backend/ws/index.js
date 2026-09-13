const { WebSocketServer, WebSocket } = require("ws");
const { randomUUID } = require("crypto");
const { getLocalIP } = require("../utils/network");

// A phone that stops sending for this long is dropped, freeing the session.
const PHONE_IDLE_MS = 1 * 60 * 1000;

/**
 * Pairs a kiosk screen ("tv") with a phone that drives it.
 *
 * The TV connects first and is handed a fresh session id plus the URL to put
 * in its QR code. The phone connects with that sid; from then on every message
 * is relayed verbatim between the two sockets.
 */
function attachWebSocketServer(server, port) {
  const wss      = new WebSocketServer({ server, path: "/ws" });
  const sessions = new Map();

  wss.on("connection", (ws, req) => {
    const params = new URL(req.url, "http://localhost").searchParams;
    const role   = params.get("role");
    const sid    = params.get("sid");

    if (role === "tv") {
      const newSid = randomUUID();
      sessions.set(newSid, { tv: ws, phone: null });

      const localIP      = getLocalIP();
      const frontendPort = process.env.FRONTEND_PORT || 5173;
      const backendUrl   = process.env.PUBLIC_BACKEND_URL  || `http://${localIP}:${port}`;
      const frontendUrl  = process.env.PUBLIC_FRONTEND_URL || `http://${localIP}:${frontendPort}`;
      ws.send(JSON.stringify({
        type:      "session",
        sid:       newSid,
        mobileUrl: `${frontendUrl}/mobile?sid=${newSid}&backendUrl=${encodeURIComponent(backendUrl)}`,
      }));

      ws.on("message", (data) => {
        const session = sessions.get(newSid);
        if (session?.phone?.readyState === WebSocket.OPEN) session.phone.send(data.toString());
      });

      ws.on("close", () => sessions.delete(newSid));

    } else if (role === "phone" && sid && sessions.has(sid)) {
      const session = sessions.get(sid);
      if (session.phone && session.phone.readyState === WebSocket.OPEN) {
        ws.close(1000, "session already in use");
        return;
      }
      session.phone = ws;

      if (session.tv?.readyState === WebSocket.OPEN) {
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
        if (s?.tv?.readyState === WebSocket.OPEN) s.tv.send(data.toString());
      });

      ws.on("close", () => {
        clearTimeout(idleTimer);
        const s = sessions.get(sid);
        if (s) {
          s.phone = null;
          if (s.tv?.readyState === WebSocket.OPEN) s.tv.send(JSON.stringify({ type: "phoneDisconnected" }));
        }
      });

    } else {
      ws.close(1008, "Invalid params");
    }
  });

  return wss;
}

module.exports = { attachWebSocketServer, PHONE_IDLE_MS };
