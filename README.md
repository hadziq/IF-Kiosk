# IF E-Kiosk

An interactive 3D digital directory kiosk for the Informatics building (Teknik Informatika / TC), built for touchscreen displays. Visitors explore an interactive 3D model of the building floor by floor, look up rooms, lecturers, and class schedules, and can take over navigation from their own phone by scanning a QR code.

![The kiosk on Lantai 3 with the NETICS lab selected: the room is highlighted in the 3D model, and the right-hand panel lists its lecturers and today's classes](docs/screenshots/kiosk.webp)

## Contents

- [Features](#features)
- [How it fits together](#how-it-fits-together)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [REST API](#rest-api)
- [WebSocket protocol](#websocket-protocol)
- [Rooms and the 3D model](#rooms-and-the-3d-model)
- [Lecturer photos](#lecturer-photos)
- [Testing](#testing)
- [Deploying to a kiosk](#deploying-to-a-kiosk)
- [Known limitations](#known-limitations)

## Features

- **Interactive 3D building model** — Three.js-rendered floors (`Lantai 1`–`4`) with animated transitions, room highlighting, and camera fly-to for selected rooms.
- **Room directory** — search and browse rooms by floor, see whether a room is a classroom, lab, lecturer office, or reservable space.
- **Live class schedules** — per-room weekly schedule (`jadwal`) and same-day room reservations pulled from PostgreSQL.
- **Lecturer directory** — search lecturers (`dosen`) and jump straight to their office/room.
- **QR-code phone control** — scan a QR code on the kiosk to drive camera pan/zoom/rotate and navigation from your own phone over a WebSocket session, without touching the kiosk screen.
- **Admin panel** (`/admin`) — CRUD management of rooms, lecturers, room occupants, and reservations.
- **LAN / tunnel friendly** — auto-detects the kiosk's local IP for same-WiFi QR access, or use `PUBLIC_BACKEND_URL` / `PUBLIC_FRONTEND_URL` (e.g. ngrok) for cross-network access.

## How it fits together

One Express process serves the REST API, the WebSocket relay, and — in production — the built frontend itself. The frontend is a single bundle that picks one of three pages from `window.location.pathname`:

```mermaid
flowchart LR
    subgraph browser["One React bundle, three pages"]
        kiosk["Kiosk at /<br/>3D scene, search, schedules"]
        mobile["MobileControl at /mobile<br/>phone remote"]
        admin["Admin at /admin<br/>CRUD panel"]
    end

    subgraph server["Express, single process<br/>also serves frontend/dist"]
        rest["REST API<br/>/api/*"]
        relay["WebSocket relay<br/>/ws"]
    end

    db[("PostgreSQL")]

    kiosk --> rest
    admin --> rest
    mobile -->|"backendUrl from the QR link"| rest

    kiosk <-->|"role=tv"| relay
    mobile <-->|"role=phone plus sid"| relay

    rest --> db
```

The kiosk never talks to the phone directly. It opens a WebSocket as `role=tv`, receives a session id, and renders a QR code containing a `/mobile` URL carrying that id. When the phone scans it and connects as `role=phone`, the server relays every message between the two sockets verbatim.

<img src="docs/screenshots/phone.webp" alt="The /mobile page on a phone: search, the room list for the current floor, and a touch pad that rotates, pans and zooms the kiosk's camera" width="260" align="right">

The phone gets search, the room list of whichever floor the kiosk shows, and a touch pad for the kiosk's camera. The room panel on the kiosk (the right-hand column in the screenshot above) only appears while a phone is paired.

<br clear="right">


## Tech stack

| Layer     | Stack |
|-----------|-------|
| Frontend  | React 19, Vite, Three.js, Tailwind CSS, `qrcode.react`, `lucide-react` |
| Backend   | Node.js, Express 5, `ws` (WebSocket), `pg` |
| Database  | PostgreSQL |
| Testing   | Jest + Supertest (backend) |
| Tooling   | npm workspaces (single lockfile at the repo root) |

## Project structure

```
IF-Kiosk/
├── backend/           Express API + WebSocket server
│   ├── index.js       Entry point: HTTP server + WebSocket, exported for tests
│   ├── app.js         Express app: middleware, static files, route mounting
│   ├── db.js          PostgreSQL connection pool
│   ├── routes/        One router per resource, all mounted under /api
│   │   ├── rooms.js       Room lookup (flags + occupants + schedules) and CRUD
│   │   ├── search.js      Cross-entity search: schedules, lecturers, rooms, bookings
│   │   ├── dosen.js       Lecturer CRUD
│   │   ├── jadwal.js      Class schedule CRUD
│   │   ├── penghuni.js    Room occupant CRUD
│   │   └── reservasi.js   Room booking CRUD + conflict checks
│   ├── ws/            WebSocket relay pairing a kiosk screen with a phone
│   ├── utils/         Day-name helpers, LAN IP detection
│   └── tests/         API + WebSocket integration tests
├── frontend/          React + Vite kiosk UI
│   ├── src/
│   │   ├── main.jsx       Entry point: picks a page from window.location.pathname
│   │   ├── pages/         One per route — Kiosk (/), MobileControl (/mobile), Admin (/admin)
│   │   ├── components/    Sidebar, SchedulePanel, QROverlay
│   │   ├── hooks/         Three.js scene, animations, model loading, WebSocket
│   │   └── lib/           Shared constants and camera presets
│   └── public/
│       ├── models/    3D building/floor models (.obj/.mtl)
│       └── picture/   Lecturer photos (WebP)
├── docs/screenshots/  Images used in this README
└── database/
    ├── schema.sql     Drops and recreates every table, then seeds rooms, lecturers and occupants
    └── jadwal.sql     Seed data for class schedules (run after schema.sql)
```

## Getting started

### Prerequisites

- Node.js 18+
- PostgreSQL (local instance or accessible server)

### 1. Install dependencies

```bash
npm install
```

One command from the repo root installs everything. `backend` and `frontend` are npm workspaces sharing a single `package-lock.json`; do not run `npm install` inside those folders.

### 2. Set up the database

```bash
createdb ekiosk
psql -d ekiosk -f database/schema.sql
psql -d ekiosk -f database/jadwal.sql
```

`schema.sql` creates five tables: `ruangan` (rooms), `dosen` (lecturers), `penghuni_ruangan` (which lecturers sit in which room), `jadwal` (weekly class schedule), and `reservasi` (ad-hoc room bookings). It then seeds every room in the 3D model, the lecturers, and who sits where. `jadwal.sql` adds the semester's class schedule; it looks rooms and lecturers up by name, so it only works after `schema.sql`.

> **`schema.sql` starts by dropping every table.** Running it again wipes all data, including anything entered through `/admin`. Use it to set up a fresh database, never against one that is in use.

A fresh load should give 79 rooms, 55 lecturers, 52 occupant rows and 146 schedule rows. If a count comes up short, see [Seed data fails silently](#seed-data-fails-silently).

### 3. Configure environment variables

```bash
cp backend/.env.example backend/.env
```

Fill in your database details — see [Environment variables](#environment-variables) below.

> **Never commit `backend/.env`.** It holds real database credentials. Only `backend/.env.example` belongs in git.

### 4. Run in development

```bash
npm run dev
```

This starts the backend on `:8000` (with `node --watch`) and the Vite dev server on `:5173` together.

- Kiosk UI: http://localhost:5173
- Backend API: http://localhost:8000

Or run them separately:

```bash
npm run dev:backend
npm run dev:frontend
```

In development the browser calls the API at `http://localhost:8000` directly rather than through Vite's proxy, which works because CORS is wide open — see [Known limitations](#known-limitations). The phone is the exception: it receives an absolute backend URL inside the QR link, so it never needs to guess.

### 5. Build for production

```bash
npm run build     # builds the frontend into frontend/dist
npm start         # serves the API and the built frontend from the backend
```

The backend serves `frontend/dist` as static files, with `/mobile` and `/admin` falling through to the SPA shell. One process, one port.

## Environment variables

All of these are read by `backend/`, from `backend/.env`. Every variable below is optional — the defaults produce a working local setup against a database named `ekiosk`.

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `8000` | Port the backend listens on. |
| `DATABASE_URL` | — | Full PostgreSQL connection string. When set, it wins and every `DB_*` variable below is ignored. |
| `DB_HOST` | `localhost` | Database host. |
| `DB_PORT` | `5432` | Database port. |
| `DB_USER` | `postgres` | Database user. |
| `DB_PASS` | `postgres` | Database password. `DB_PASSWORD` is accepted as an alias. |
| `DB_NAME` | `ekiosk` | Database name. |
| `FRONTEND_PORT` | `5173` | Only used to build the QR-code URL in development, when the phone loads the Vite dev server rather than the built app. |
| `PUBLIC_BACKEND_URL` | auto-detected LAN IP | Absolute backend URL to embed in the QR code. Set this when the phone cannot reach the kiosk's LAN address — e.g. behind an ngrok tunnel. |
| `PUBLIC_FRONTEND_URL` | auto-detected LAN IP | Absolute frontend URL to embed in the QR code, same reasoning. |

If neither `PUBLIC_*` variable is set, the backend picks the machine's LAN address itself, preferring a real private address over the `.1` / `.254` gateways that Docker and VMware adapters hand out (`backend/utils/network.js`). That covers the common case: kiosk and phone on the same WiFi.

**A note on `backend/db.js`:** the pool runs `SELECT 1` at startup and calls `process.exit(1)` if the database is unreachable. A backend that refuses to start is almost always a database connection problem — check the logged error before anything else.

## REST API

All endpoints live under `/api` and return JSON. Errors are `{ "error": "..." }` with status 404 (not found), 409 (booking conflict), or 500.

### Read

| Method | Path | Notes |
|---|---|---|
| `GET` | `/api/rooms` | All rooms, ordered by floor then name. |
| `GET` | `/api/rooms/:roomName` | One room by **name**, with its occupants, weekly schedule and today's remaining bookings in a single response. Matches names with spaces or underscores interchangeably. |
| `GET` | `/api/search?q=&day=` | Cross-entity search over schedules, lecturers, rooms and today's bookings. Needs `q` of at least 2 characters, otherwise returns `[]`. Schedule results only appear on weekdays; `day` overrides which weekday is assumed. |

### Manage

Each resource exposes the same four operations. These back the `/admin` panel.

| Resource | Path | Table |
|---|---|---|
| Rooms | `GET·POST /api/rooms`, `PUT·DELETE /api/rooms/:id` | `ruangan` |
| Lecturers | `GET·POST /api/dosen`, `PUT·DELETE /api/dosen/:id` | `dosen` |
| Schedules | `GET·POST /api/jadwal`, `PUT·DELETE /api/jadwal/:id` | `jadwal` |
| Occupants | `GET·POST /api/penghuni`, `PUT·DELETE /api/penghuni/:id` | `penghuni_ruangan` |
| Bookings | `GET·POST /api/reservasi`, `PUT·DELETE /api/reservasi/:id` | `reservasi` |

Note that `GET /api/rooms/:roomName` looks up by name while `PUT`/`DELETE /api/rooms/:id` address by numeric id — the read path serves the kiosk, which knows a room by the label on its 3D mesh.

Bookings are validated on write: creating or updating a `reservasi` returns **409** if it overlaps a class in `jadwal` on that weekday, or another booking on that date. `GET /api/reservasi` also deletes bookings that have already ended before returning the list.

## WebSocket protocol

One endpoint, `/ws`, with the role chosen by query string.

| Connect as | Query | Meaning |
|---|---|---|
| Kiosk | `/ws?role=tv` | Opens a new session. |
| Phone | `/ws?role=phone&sid=<id>` | Joins an existing session. |

Anything else is closed with code **1008**. So is a phone presenting an unknown `sid`. A second phone joining a session that already has one is closed with **1000** and the reason `session already in use` — one phone per kiosk at a time.

**Messages from the server:**

| Type | Sent to | Meaning |
|---|---|---|
| `session` | kiosk | `{ type, sid, mobileUrl }` — issued immediately on connect. `mobileUrl` is what goes in the QR code. |
| `phoneConnected` | kiosk | A phone has paired; the kiosk responds by pushing its current state. |
| `phoneDisconnected` | kiosk | The phone went away, or timed out. |

**Messages relayed between the pair:**

| Type | Direction | Shape |
|---|---|---|
| `cmd` | phone → kiosk | `{ type: "cmd", action, payload }` where `action` is one of `selectFloor`, `selectRoom`, `selectFloorAndRoom`, `back`, `cameraRotate`, `cameraZoom`, `cameraPan`, `cameraTransform`, `cameraReset`. |
| `state` | kiosk → phone | Current floor, selected room and camera state, so the phone UI can mirror the screen. |

A phone that sends nothing for **one minute** is disconnected (`PHONE_IDLE_MS` in `backend/ws/index.js`), which frees the session for the next visitor.

## Rooms and the 3D model

The room list on the kiosk does not come from the database. It comes from the **mesh names inside the 3D model**, and the database is then asked about each name. So a room shows up in two places that must agree:

```mermaid
flowchart LR
    obj["Lantai 3.obj<br/>mesh named NETICS"] -->|"every mesh name,<br/>minus EXCLUDE"| list["Room buttons<br/>in the sidebar"]
    list -->|"tap NETICS"| api["GET /api/rooms/NETICS"]
    api --> row[("ruangan row<br/>nama_ruang = 'NETICS'")]
```

### The model files

Each floor is a Wavefront pair in `frontend/public/models/`, loaded by name from the `FLOORS` list in `frontend/src/lib/constants.js`:

| File | Shown when |
|---|---|
| `TC.obj` + `TC.mtl` | The whole-building overview, before a floor is chosen. |
| `Lantai 1.obj` … `Lantai 4.obj` (+ `.mtl`) | A floor is selected. The file name is the floor name, space included. |

When a floor loads, `useModelLoader` collects every named mesh. `Sidebar` then drops any name matching `EXCLUDE` (`pillar`, `box`, `TV`, `lantai`, `tangga`, `pintu`, `sebelah`, case-insensitive), and every remaining name becomes a room button. Tapping one highlights that mesh and fetches `GET /api/rooms/<mesh name>`.

### The rules that tie a mesh to a database row

- **`ruangan.nama_ruang` must equal the mesh name.** The match is case-sensitive: a mesh called `NETICS` will not find a row called `Netics`.
- **Spaces and underscores are interchangeable.** OBJ exporters turn spaces into underscores, so the API matches `Aula_Handayani` to a row named `Aula Handayani`. Buttons display underscores as spaces.
- **`ruangan.lantai` must be the floor's file name**, e.g. `Lantai 3`. Search results use it to decide which model to load before jumping to the room.
- **A mesh with no matching row is not an error.** The panel shows the room name and nothing else, so a typo in either name fails quietly. Every room mesh on floors 1–4 currently has a row. The only exceptions are the two small `Akses_SPMB_*` markers on Lantai 3, which are not rooms.
- **Mesh names must be unique across floors**, because `nama_ruang` is unique. Rooms that repeat on every floor carry a floor suffix. The toilets follow `Toilet_<Laki-laki|Perempuan>_<Utara|Selatan>_L<floor>`, e.g. `Toilet_Perempuan_Selatan_L2`. In the models, north (*Utara*) is the side with the IF_101 / IF_201 / RPL row, and south (*Selatan*) is the side with IF_110 / IF_222 / LP_2.
- **`TC.obj` names are never looked up.** The overview model has its own, older labels (`Toilet_Cewe_A`, `IF_114`, …). Only the four floor models need to agree with the database.

What the panel shows is driven by the flags on the row, and they combine freely. `LP_2`, for example, is a lab and a classroom and a lecturer office at once:

| Flag | Effect on the kiosk panel |
|---|---|
| `is_lab` | Header reads *Laboratorium*. |
| `is_ruang_dosen` | Header reads *Ruang Dosen*; lists lecturers from `penghuni_ruangan`. |
| `is_kelas` | Shows the weekly schedule from `jadwal`. |
| `is_reservable` | Shows today's remaining bookings, and the room can be booked in `/admin`. |
| `is_ruangan` | A labelled space. With none of the three flags above, the panel shows only the name and `keterangan`. |

### Adding a room

1. **Name the mesh** in your 3D tool, then export that floor over the existing `Lantai N.obj` and `.mtl`. Choose the name carefully, because it becomes the room's permanent key.
2. **Add the `ruangan` row**, either through `/admin` (quickest) or in the seed section of `database/schema.sql` (so a fresh install has it too). Copy the mesh name exactly, and set `lantai` and the flags.
3. **Attach what the flags promise:** occupants for `is_ruang_dosen`, classes for `is_kelas`. A lecturer's photo follows the rules in [Lecturer photos](#lecturer-photos).
4. **Check it on the kiosk:** open the floor, tap the room and confirm the panel is filled, not just the bare name.

Adding a whole floor also means adding its name to `FLOORS` in `frontend/src/lib/constants.js`. If its rooms need a particular order in the sidebar, add a sort to `getRoomSort` in the same file, like the one for `Lantai 3`.

### Seed data fails silently

The seed files never use numeric ids. They look rooms and lecturers up by name:

```sql
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'NETICS' AND d.nama = 'Dr. Baskoro Adi P., S.Kom., M.Kom.';
```

If either name is misspelled, the `SELECT` matches nothing and the `INSERT` adds **zero rows without an error**. For a second or third lecturer in `jadwal.sql`, a misspelled name just stores `NULL`. After you edit a seed file, reload it into a scratch database and compare the row counts with the numbers under [Set up the database](#2-set-up-the-database). This query lists lecturer offices that ended up with nobody in them:

```sql
SELECT r.nama_ruang FROM ruangan r
LEFT JOIN penghuni_ruangan pr ON pr.ruangan_id = r.id
WHERE r.is_ruang_dosen AND pr.id IS NULL;
```

## Lecturer photos

Photos live in `frontend/public/picture/` and are looked up **by the lecturer's exact name** from the `dosen` table:

```js
`/picture/${encodeURIComponent(name)}.webp`   // frontend/src/components/SchedulePanel.jsx
```

So a row with `dosen.nama = "Dr. Sarwosri, S.Kom., MT."` needs a file named exactly `Dr. Sarwosri, S.Kom., MT..webp` — trailing dot and all. There is no mapping table; the filename *is* the key.

- **Adding a lecturer photo:** save it as WebP, 1024×1024, named byte-for-byte after `dosen.nama`.
- **A missing or misspelled file is not an error.** `SchedulePanel` catches the failed load and renders the lecturer's initials instead, so a typo shows up as a silent fallback rather than a broken image.

These were originally 1024×1024 PNGs averaging 1.1 MB each — 56 MB for 50 portraits. They are now WebP at the same resolution, 2 MB in total, which is visually indistinguishable at the 150px the UI actually renders.

## Testing

```bash
npm --prefix backend run test
```

`backend/tests/api.test.js` uses Jest and Supertest to cover:
- room lookup and search;
- the full `jadwal` create/update/delete cycle;
- the booking conflict checks that return 409;
- the WebSocket rules: pairing, relaying, the 1008 rejections, and the one-phone-per-session limit.

**These tests need a running PostgreSQL, and they write to it.** They run against whatever database `backend/.env` points at. They create a room and a lecturer named `TEST_JEST_…`, and delete them again at the end. To keep them away from real data, point `DATABASE_URL` at a scratch database loaded from `database/`:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ekiosk_test npm --prefix backend run test
```

`backend/db.js` exits the process if it cannot connect. A failure that looks like a crash on startup usually means the database is down or the connection settings are wrong, not that the code broke.

## Deploying to a kiosk

1. `npm run build`, then `npm start`. The backend serves the API and the built frontend from a single port.
2. Point the kiosk browser at `http://<host>:8000` in fullscreen/kiosk mode.
3. If phones will be on the same WiFi, nothing else is needed — the QR code gets the LAN address automatically.
4. If they will not, set `PUBLIC_BACKEND_URL` and `PUBLIC_FRONTEND_URL` to publicly reachable URLs before starting.

## Known limitations

Worth knowing before putting this on a public network:

- **The admin panel has no authentication.** `/admin` and every write endpoint under `/api` are open to anyone who can reach the port. A `JWT_SECRET` used to appear in `.env.example`, but nothing in the codebase reads it and no auth is implemented — it has been removed so it does not imply otherwise. Put the kiosk on a trusted network, or add auth before exposing it.
- **CORS is unrestricted.** `app.use(cors())` accepts every origin.
- **Sessions are held in memory.** The kiosk↔phone pairing lives in a `Map` in one process, so restarting the backend drops every active session, and running more than one instance behind a load balancer will not work without a shared store.
- **The frontend ships as one bundle** of roughly 850 KB (225 KB gzipped), dominated by Three.js. Fine for a kiosk on a wired connection; worth code-splitting if the phone page is ever loaded over mobile data.
- **`lint` reports pre-existing warnings** about refs being accessed during render in `useWebSocket.js` and elsewhere. They are long-standing and unrelated to the current structure.
