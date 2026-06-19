import { useEffect, useRef, useState } from "react";

const WS_URL = `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`;

/**
 * Connects the TV browser to the backend WebSocket relay.
 *
 * @param {object} callbacks
 * @param {(action, payload) => void} callbacks.onCmd         - called when phone sends a command
 * @param {() => void}                callbacks.onPhoneConnect - called when phone pairs (use to sync state)
 *
 * @returns {{ mobileUrl, phoneConnected, sendState }}
 *   - mobileUrl:      URL encoded in the QR code (empty until session is established)
 *   - phoneConnected: true while a phone is paired to this session
 *   - sendState:      call this to push current app state to the phone
 */
export function useTVWebSocket({ onCmd, onPhoneConnect, onPhoneDisconnect }) {
  const wsRef          = useRef(null);
  const onCmdRef       = useRef(onCmd);
  const onConnectRef   = useRef(onPhoneConnect);
  const onDisconnectRef = useRef(onPhoneDisconnect);
  const retryRef       = useRef(null);

  const [mobileUrl,      setMobileUrl]      = useState("");
  const [phoneConnected, setPhoneConnected] = useState(false);

  // keep callbacks fresh on every render without re-running the effect
  onCmdRef.current     = onCmd;
  onConnectRef.current = onPhoneConnect;
  onDisconnectRef.current = onPhoneDisconnect;

  const sendState = (state) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "state", ...state }));
    }
  };

  useEffect(() => {
    let active = true;

    function connect() {
      const ws = new WebSocket(`${WS_URL}?role=tv`);

      ws.onopen = () => {
        if (!active) { ws.close(); return; }
        wsRef.current = ws;
      };

      ws.onmessage = (e) => {
        if (!active) return;
        const msg = JSON.parse(e.data);

        if (msg.type === "session") {
          setMobileUrl(msg.mobileUrl);
        }
        if (msg.type === "phoneConnected") {
          setPhoneConnected(true);
          // small delay so React state has settled before we broadcast
          setTimeout(() => onConnectRef.current?.(), 100);
        }
        if (msg.type === "phoneDisconnected") {
          setPhoneConnected(false);
          onDisconnectRef.current?.();
        }
        if (msg.type === "cmd") {
          onCmdRef.current?.(msg.action, msg.payload);
        }
      };

      ws.onclose = () => {
        if (!active) return;
        wsRef.current = null;
        // Keep mobileUrl so QR stays visible; only reset connected status
        setPhoneConnected(false);
        // Reconnect after a short delay to get a fresh session
        retryRef.current = setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      active = false;
      clearTimeout(retryRef.current);
      const ws = wsRef.current;
      wsRef.current = null;
      // only close if already OPEN — avoids StrictMode "closed before
      // established" warning when the cleanup fires mid-handshake
      if (ws?.readyState === WebSocket.OPEN) ws.close();
    };
  }, []);

  return { mobileUrl, phoneConnected, sendState };
}
