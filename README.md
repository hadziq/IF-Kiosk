# IF E-Kiosk

An interactive 3D digital directory kiosk for the Informatics building (Teknik Informatika / TC), built for touchscreen displays. Visitors explore an interactive 3D model of the building floor by floor, look up rooms, lecturers, and class schedules, and can take over navigation from their own phone by scanning a QR code.

![Kiosk hero](frontend/src/assets/hero.png)

## Features

- **Interactive 3D building model** — Three.js-rendered floors (`Lantai 1`–`4`) with animated transitions, room highlighting, and camera fly-to for selected rooms.
- **Room directory** — search and browse rooms by floor, see whether a room is a classroom, lab, lecturer office, or reservable space.
- **Live class schedules** — per-room weekly schedule (`jadwal`) and same-day room reservations pulled from PostgreSQL.
- **Lecturer directory** — search lecturers (`dosen`) and jump straight to their office/room.
- **QR-code phone control** — scan a QR code on the kiosk to drive camera pan/zoom/rotate and navigation from your own phone over a WebSocket session, without touching the kiosk screen.
- **Admin panel** (`/admin`) — CRUD management of rooms, lecturers, room occupants, and reservations.
- **LAN / tunnel friendly** — auto-detects the kiosk's local IP for same-WiFi QR access, or use `PUBLIC_BACKEND_URL` / `PUBLIC_FRONTEND_URL` (e.g. ngrok) for cross-network access.

## Tech stack

| Layer     | Stack |
|-----------|-------|
| Frontend  | React 19, Vite, Three.js, Tailwind CSS, `qrcode.react`, `lucide-react` |
| Backend   | Node.js, Express 5, `ws` (WebSocket), `pg` |
| Database  | PostgreSQL |
| Testing   | Jest + Supertest (backend) |

## Project structure

```
IF-Kiosk/
├── backend/           Express API + WebSocket server
│   ├── index.js       Routes, WebSocket relay (kiosk ↔ phone), static file serving
│   ├── db.js          PostgreSQL connection pool
│   └── api.test.js    API integration tests
├── frontend/          React + Vite kiosk UI
│   ├── src/
│   │   ├── App.jsx            Main kiosk screen (3D scene + panels)
│   │   ├── MobileControl.jsx  Phone remote-control UI (served at /mobile)
│   │   ├── QROverlay.jsx      QR code overlay for pairing a phone
│   │   ├── Admin.jsx          Admin CRUD panel (served at /admin)
│   │   ├── hooks/              Three.js scene, animations, model loading, WebSocket
│   │   └── components/         Sidebar, SchedulePanel
│   └── public/
│       ├── models/    3D building/floor models (.obj/.mtl)
│       └── picture/   Lecturer photos
└── database/
    ├── schema.sql     Table definitions (ruangan, dosen, jadwal, reservasi, ...)
    └── jadwal.sql     Seed data for class schedules
```

## Getting started

### Prerequisites

- Node.js 18+
- PostgreSQL (local instance or accessible server)

### 1. Install dependencies

```bash
npm install
```

This installs dependencies for the root workspace as well as `backend` and `frontend` (npm workspaces).

### 2. Set up the database

Create a database and load the schema (and optional seed data):

```bash
createdb ekiosk
psql -d ekiosk -f database/schema.sql
psql -d ekiosk -f database/jadwal.sql
```

### 3. Configure environment variables

Copy the example env file and fill in your own values:

```bash
cp backend/.env.example backend/.env
```

| Variable              | Description |
|-----------------------|--------------|
| `PORT`                 | Backend server port (default `8000`) |
| `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT` | PostgreSQL connection details |
| `JWT_SECRET`           | Random secret, 32+ characters |
| `FRONTEND_URL`         | Frontend origin for CORS (default `http://localhost:5173`) |
| `PUBLIC_BACKEND_URL` / `PUBLIC_FRONTEND_URL` | Public URLs (e.g. ngrok tunnels) for cross-network QR access; leave unset to use the local IP for same-WiFi access |
| `NODE_ENV`             | `development` / `production` |
| `DB_LOGGING`           | Set `true` to log SQL queries |

> **Never commit `backend/.env`.** It holds real database credentials and secrets — only `backend/.env.example` should be tracked in git.

### 4. Run in development

From the project root, this starts the backend (with `--watch`) and the Vite dev server together:

```bash
npm run dev
```

- Kiosk UI: http://localhost:5173
- Backend API: http://localhost:8000

Or run them independently:

```bash
npm run dev:backend
npm run dev:frontend
```

### 5. Build for production

```bash
npm run build     # builds the frontend into frontend/dist
npm start          # serves the API and the built frontend from the backend
```

The backend serves `frontend/dist` as static files and exposes `/mobile` and `/admin` as SPA entry points.

## How QR phone control works

1. The kiosk opens a WebSocket connection as `role=tv` and receives a session ID and a `mobileUrl`.
2. That URL is rendered as a QR code (`QROverlay.jsx`). Scanning it opens `/mobile?sid=...` on the visitor's phone, which connects as `role=phone`.
3. The backend relays messages between the two WebSocket connections for that session — the phone sends camera transforms and navigation actions, the kiosk applies them to the 3D scene.
4. A phone session auto-disconnects after a period of inactivity, and only one phone can control a given kiosk session at a time.

## Testing

```bash
npm --prefix backend run test
```

## Admin panel

Visit `/admin` to manage rooms (`ruangan`), lecturers (`dosen`), room occupants, and reservations through a CRUD UI backed by the `/api/*` REST endpoints.
