// Everything that differs between deployments. Kept apart from constants.js
// so that file stays importable from Node (scripts/build-data.js).

// Where the app is served from: "/" locally, "/IF-Kiosk/" on GitHub Pages.
// Set at build time with BASE_PATH (see vite.config.js).
export const BASE = import.meta.env.BASE_URL;

/** Absolute URL path of a file in public/, e.g. asset("models/TC.obj"). */
export const asset = (path) => `${BASE}${path}`;

/**
 * WebSocket relay that pairs the kiosk with a phone, without the /ws suffix.
 *
 * - VITE_RELAY_URL unset: same origin as the page. This is the local backend,
 *   reached directly in production or through the Vite proxy in development.
 * - VITE_RELAY_URL=none: no relay. The kiosk works but shows no QR code.
 * - Anything else: that relay, e.g. wss://if-kiosk-relay.example.workers.dev
 */
const configured = import.meta.env.VITE_RELAY_URL;
export const RELAY_URL =
  configured === "none" ? null
  : configured ? configured.replace(/\/+$/, "")
  : `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}`;

/**
 * Touch gestures for the 3D view, on the kiosk's screen and on the phone.
 *
 * - "map" (default): one finger pans along the floor, two fingers rotate and
 *   pinch to zoom, as in map apps.
 * - "orbit": one finger rotates, two fingers pan and pinch, the OrbitControls
 *   default this kiosk shipped with. Open the kiosk with ?gestures=orbit to
 *   use it; the QR code passes the choice on to the phone.
 */
export const GESTURES =
  new URLSearchParams(window.location.search).get("gestures") === "orbit" ? "orbit" : "map";
