# Handoff: IF-Kiosk, akhir Oktober 2026

Catatan peralihan dari sesi Claude Code di cloud ke sesi di Claude Desktop (komputer Hadziq). Isinya: keadaan proyek sekarang, keputusan yang sudah diambil, dan pekerjaan yang belum selesai. Hapus file ini setelah semua butir di [Belum selesai](#belum-selesai) tuntas.

**Pembaca berikutnya (Claude):** baca seluruh file ini dan `README.md` sebelum mulai. Pekerjaan pertama ada di [1. Ganti jadwal dengan Gasal 2026/27](#1-ganti-jadwal-dengan-gasal-202627), dan butuh Claude in Chrome. Itulah alasan sesi pindah ke komputer lokal.

## Keadaan sekarang

Semua yang di bawah ini sudah di `master`, sudah di-deploy, dan sudah diuji.

| | |
|---|---|
| Situs publik | https://hadziq.github.io/IF-Kiosk/ (GitHub Pages, di-deploy oleh `.github/workflows/pages.yml` setiap push ke `master`) |
| Relay ponsel | `wss://if-kiosk-relay.labgigaits.workers.dev`: Cloudflare Worker + Durable Object di akun Cloudflare lab GIGA (`labgigaits@gmail.com`), di-deploy oleh `.github/workflows/relay.yml` |
| Data | `data/*.csv` → `frontend/scripts/build-data.js` (validasi) → `frontend/public/data/kiosk.json` saat build |
| Tes | `npm test` di root: 23 tes frontend (`node:test`), tes protokol relay terhadap relay lokal dan terhadap Worker di `wrangler dev` |

Pairing ponsel sudah dicoba Hadziq di situs publik dan berhasil.

### Riwayat PR

| PR | Isi |
|---|---|
| [#1](https://github.com/hadziq/IF-Kiosk/pull/1) | Fase 0+1: data dari PostgreSQL ke CSV berkunci kode dosen, frontend statis, GitHub Pages. Admin, REST API, reservasi, dan PostgreSQL dihapus. |
| [#2](https://github.com/hadziq/IF-Kiosk/pull/2) | Fase 2: relay di Cloudflare. Protokol bertambah ping/pong dan `session ended`. |
| [#3](https://github.com/hadziq/IF-Kiosk/pull/3) | Gestur sentuh gaya peta (default), skema lama di balik `?gestures=orbit`. |

### Keputusan yang sudah diambil

- **Hosting statis di GitHub Pages**, domain `hadziq.github.io/IF-Kiosk/`, karena ITS tidak mengizinkan pembuatan subdomain sembarangan.
- **Data diedit sebagai CSV** (bisa dengan Excel; pemisah `;` juga diterima). Belum ada antarmuka admin, dan memang belum diperlukan.
- **Reservasi ruangan tidak ditangani kiosk**, karena sudah dikelola sistem lain.
- **Dosen dirujuk dengan kode** (`HF`, `RJ`, …) di semua CSV, dan foto dinamai `<kode>.webp`.
- **Kode dosen yang dikonfirmasi Hadziq:** `AZ` (Agus Zainal Arifin), `AV` (Amitava Datta), `MN` (Abdul Munif). Entri "Pak Daniel" dihapus karena duplikat `DO` (Daniel Oranova).
- **Akun Cloudflare** memakai akun lab GIGA. Secret `CLOUDFLARE_API_TOKEN` dan `CLOUDFLARE_ACCOUNT_ID` sudah diisi di GitHub.

## Belum selesai

### 1. Ganti jadwal dengan Gasal 2026/27

**Masalah:** `data/jadwal.csv` (146 baris) masih berisi jadwal **Genap 2025/26**, semester lalu, hasil ekspor `jadwal.sql` lama. Sumber yang benar untuk semester ini adalah spreadsheet resmi:

> https://its.id/if-jadwal-gasal-2627

Hadziq sudah membuka spreadsheet ini di Chrome. Sesi cloud tidak bisa membacanya: `its.id` diblokir, Claude in Chrome tidak terjangkau, dan pencarian di Google Drive tidak menemukannya. **Gunakan Claude in Chrome untuk membaca spreadsheet itu, dan pakai jam di spreadsheet sebagai acuan.**

**Langkah:**

1. Baca spreadsheet lewat Claude in Chrome. Kalau isinya panjang, lebih praktis mengekspornya sebagai CSV, menyimpannya, lalu memprosesnya dengan skrip.
2. Petakan ke format `data/jadwal.csv`:
   `hari,jam_mulai,jam_selesai,nama_ruang,mata_kuliah,dosen_1,dosen_2,dosen_3`
   - `hari`: `Senin`…`Jumat`. Jam berformat `HH:MM`.
   - `nama_ruang` **harus sama persis** dengan nama mesh di model 3D (`IF_101`, `LP_2`, `NETICS`, `Aula Handayani`, …); daftar lengkapnya ada di `data/ruangan.csv`. Ruangan yang tidak ada di sana (misalnya ruangan di luar gedung IF) dilewati, dan dilaporkan ke Hadziq.
   - `dosen_N` diisi **kode** dosen dari `data/dosen.csv`. Kalau spreadsheet hanya mencantumkan nama, cocokkan dengan nama di `dosen.csv`. Dosen baru ditambahkan dulu ke `dosen.csv`, dan kodenya ditanyakan ke Hadziq; jangan mengarang kode.
   - Ruangan yang dipakai di jadwal harus berflag `kelas` di `ruangan.csv`; kalau belum, build akan gagal.
3. Jalankan `npm run data:check`. Build berhenti pada galat; peringatan tidak menghentikannya.
4. Laporkan ke Hadziq: ruangan yang dilewati, dosen yang tidak dikenali, dan bentrok yang masih tersisa.
5. Buat PR. CI menjalankan `npm test` dan build; deploy terjadi setelah PR digabung ke `master`.

**Temuan di data lama (Genap 2025/26), sebagai bahan cek data baru:**

- Ada 20 pasang kelas bentrok di ruangan yang sama. Sebanyak 17 di antaranya polanya sama: kelas 13:30–16:20 bertabrakan dengan kelas yang mulai 15:30. **Semua** kelas yang mulai 15:30 kena. Kemungkinan besar sumber lama salah menulis 16:30 sebagai 15:30.
- Ada dosen yang tercatat di dua kelas pada jam yang sama: `AI` (Selasa, IF_103), `DS` (Jumat, IF_106), `IG` (Senin), serta `NF` dan `DA` (Senin 10:00, salah satunya Text Mining di IF_107; mungkin *team teaching* yang tercatat ganda).
- Usulan Hadziq "kelas 13:30 berakhir 15:30" **tidak dipakai**. Kelas 3 SKS butuh 170 menit, dan Hadziq kemudian memilih memakai jam di spreadsheet.

**Usulan yang sudah disampaikan dan belum diputuskan:**

- Menambahkan peringatan di `build-data.js` kalau seorang dosen tercatat di dua kelas yang jamnya tumpang tindih. Ini yang menangkap kasus `AI` dan `DS` di atas. Kecil, dan berguna setiap semester.
- Membuat skrip impor dari ekspor spreadsheet jadwal ke `jadwal.csv`, supaya penggantian jadwal setiap semester cukup sekali jalan. Layak dibuat kalau format spreadsheet-nya stabil dari semester ke semester.

### 2. Foto dosen yang belum ada

Ada 50 foto di `frontend/public/picture/`. Empat dosen belum punya foto, dan kiosk menampilkan inisial mereka:

| Kode | Nama |
|---|---|
| `BJ` | Bagus Jati Santoso, S.Kom., Ph.D. |
| `IG` | Ilham Gurat Adillion, S.Kom., M.Eng. |
| `AV` | Prof. Amitava Datta, Ph.D. |
| `MN` | Abdul Munif, S.Kom., M.Sc.Eng. |

Hadziq akan menyediakan fotonya menyusul. Setiap foto disimpan sebagai **WebP 1024×1024**, dengan nama `<kode>.webp`, di `frontend/public/picture/`. Kalau yang diterima JPG atau PNG, konversikan dulu: potong persegi dengan wajah di tengah, sama seperti foto lain. `npm run data:check` berhenti mengeluarkan peringatan "belum ada foto" untuk kode yang fotonya sudah ada.

Dosen baru dari jadwal Gasal 2026/27 kemungkinan juga belum punya foto. Peringatan dari `data:check` menunjukkan siapa saja.

### 3. Uji coba dan pilihan skema gestur

Kedua skema sudah live:

- Peta (default): https://hadziq.github.io/IF-Kiosk/ (1 jari geser, 2 jari putar, cubit zoom)
- Orbit (lama): https://hadziq.github.io/IF-Kiosk/?gestures=orbit (1 jari putar, 2 jari geser dan zoom)

Hadziq akan mengujinya dengan beberapa pengunjung. Contoh tugas: "temukan lab GIGA lalu perbesar". Ini sesuai prinsipnya bahwa antarmuka yang terasa lebih "natural" harus diuji, bukan diasumsikan lebih baik. Setelah ada keputusan:

- Hapus skema yang kalah: `GESTURES` di `frontend/src/lib/config.js` dan cabang-cabangnya di `useThreeScene.js`, `useWebSocket.js` (parameter di QR), `Kiosk.jsx` (`ground`), dan `MobileControl.jsx`.
- Perbarui paragraf "Touch gestures" di `README.md` dan tes di `frontend/tests/cameraMoves.test.js` (tes pan layar hanya relevan untuk skema orbit).

### 4. Kode dosen Dr. Adhatus Solichah Ahmadiyah

Hadziq sempat menyebut `AD` sebagai kode Bu Adhatus. Di data (yang berasal dari komentar `jadwal.sql` lama), beliau tercatat sebagai **`AL`**. Pastikan kode resminya saat mengimpor jadwal Gasal 2026/27. Kalau ternyata `AD`, ganti di `dosen.csv`, `jadwal.csv`, dan `penghuni.csv` (IF_226), lalu ubah nama `frontend/public/picture/AL.webp` menjadi `AD.webp`. `data:check` akan menolak build kalau ada rujukan ke kode lama yang tertinggal.

## Hal teknis yang perlu diketahui

- **Identitas commit:** `Hadziq Fabroyir <3130749+hadziq@users.noreply.github.com>`. **Jangan** tambahkan trailer `Co-Authored-By`/`Claude-Session` atau sebutan Claude di pesan commit, dan **jangan** beri footer "Generated with Claude Code" di PR (aturan di CLAUDE.md pribadi Hadziq).
- **Bahasa:** Hadziq menulis dalam bahasa Indonesia. Kode, komentar, pesan commit, dan PR memakai bahasa Inggris. Pesan galat dan peringatan untuk pengedit CSV memakai bahasa Indonesia.
- **Branch kerja dari sesi cloud:** `master-4eke1u`, sekarang sama dengan `master`. Sesi baru boleh memakai branch lain.
- **npm workspaces:** `backend`, `frontend`, dan `relay` berbagi satu `package-lock.json` di root. Jalankan `npm install` hanya dari root.
- **Lint** sudah memuat temuan lama (`react-hooks/refs`, `set-state-in-effect`) sejak sebelum migrasi. Bandingkan dengan `master` supaya hanya temuan baru yang diperbaiki.
- **`wrangler`** membawa tiga temuan audit di `undici`. Itu alat dev/CI saja dan tidak ikut ter-deploy.
- **Relay di `wrangler dev`:** saat relay menutup koneksi, klien Node `ws` baru melaporkan penutupan sekitar 10 detik kemudian; Chromium langsung. Tes "ends the phone's session" memberi batas waktu 15 detik karena itu. Ini bukan bug.
- **Kiosk memuat ulang sendiri** setiap 10 menit kalau `kiosk.json` berubah, dan hanya ketika tidak ada ponsel terhubung. Perubahan yang hanya menyangkut kode tidak memicunya.
- **Copilot** otomatis mereview setiap PR. Temuannya selama ini layak ditindaklanjuti; balas dan tutup thread-nya setelah diperbaiki.
