-- ============================================================
-- IF E-KIOSK — Database Schema (v2)
-- Run this file once in your PostgreSQL database (ekiosk)
-- ============================================================

-- Drop existing tables (order matters due to foreign keys)
DROP TABLE IF EXISTS jadwal;
DROP TABLE IF EXISTS penghuni_ruangan;
DROP TABLE IF EXISTS ruang_dosen;
DROP TABLE IF EXISTS dosen;
DROP TABLE IF EXISTS ruangan_kelas;
DROP TABLE IF EXISTS ruangan;

-- ============================================================
-- Ruangan — single source of truth for all rooms
-- Flags (can combine freely, e.g. LP_2 is lab + kelas + ruang_dosen):
--   is_kelas      → has scheduled classes (jadwal)
--   is_lab        → displayed as Laboratorium
--   is_ruang_dosen→ has dosen occupants (penghuni_ruangan)
--   is_ruangan    → label-only room (Mushola, Ruang Rapat, etc.)
-- ============================================================
CREATE TABLE ruangan (
  id             SERIAL  PRIMARY KEY,
  nama_ruang     TEXT    NOT NULL UNIQUE,
  lantai         TEXT,
  is_kelas       BOOLEAN NOT NULL DEFAULT FALSE,
  is_lab         BOOLEAN NOT NULL DEFAULT FALSE,
  is_ruang_dosen BOOLEAN NOT NULL DEFAULT FALSE,
  is_ruangan     BOOLEAN NOT NULL DEFAULT FALSE,
  label          TEXT
);

-- ============================================================
-- Dosen
-- ============================================================
CREATE TABLE dosen (
  id    SERIAL PRIMARY KEY,
  nama  TEXT   NOT NULL
);

-- ============================================================
-- Penghuni Ruangan — dosen occupants per room
-- ============================================================
CREATE TABLE penghuni_ruangan (
  id         SERIAL  PRIMARY KEY,
  ruangan_id INTEGER NOT NULL REFERENCES ruangan(id) ON DELETE CASCADE,
  dosen_id   INTEGER NOT NULL REFERENCES dosen(id)   ON DELETE CASCADE,
  urutan     INTEGER NOT NULL DEFAULT 0
);

-- ============================================================
-- Jadwal (Kelas) — references ruangan directly
-- ============================================================
CREATE TABLE jadwal (
  id          SERIAL  PRIMARY KEY,
  ruangan_id  INTEGER NOT NULL REFERENCES ruangan(id) ON DELETE CASCADE,
  hari        TEXT    NOT NULL CHECK (hari IN ('Senin','Selasa','Rabu','Kamis','Jumat')),
  jam_mulai   TIME    NOT NULL,
  jam_selesai TIME    NOT NULL,
  mata_kuliah TEXT    NOT NULL,
  dosen_id    INTEGER NOT NULL REFERENCES dosen(id) ON DELETE RESTRICT,
  dosen_id_2  INTEGER REFERENCES dosen(id) ON DELETE SET NULL,
  dosen_id_3  INTEGER REFERENCES dosen(id) ON DELETE SET NULL
);
-- ============================================================
-- Seed: Ruangan — Lantai 1 (Ruang Kelas)
-- ============================================================
INSERT INTO ruangan (nama_ruang, lantai, is_kelas) VALUES
  ('IF_101', 'Lantai 1', TRUE),
  ('IF_102', 'Lantai 1', TRUE),
  ('IF_103', 'Lantai 1', TRUE),
  ('IF_104', 'Lantai 1', TRUE),
  ('IF_105', 'Lantai 1', TRUE),
  ('IF_106', 'Lantai 1', TRUE),
  ('IF_107', 'Lantai 1', TRUE),
  ('IF_108', 'Lantai 1', TRUE),
  ('IF_109', 'Lantai 1', TRUE),
  ('IF_110', 'Lantai 1', TRUE),
  ('IF_111', 'Lantai 1', TRUE),
  ('IF_112', 'Lantai 1', TRUE),
  ('IF_113', 'Lantai 1', TRUE);

-- ============================================================
-- Seed: Ruangan — Lantai 2 (Ruang Dosen & Ruangan)
-- ============================================================
INSERT INTO ruangan (nama_ruang, lantai, is_ruang_dosen) VALUES
  ('IF_201', 'Lantai 2', TRUE),
  ('IF_203', 'Lantai 2', TRUE),
  ('IF_204', 'Lantai 2', TRUE),
  ('IF_205', 'Lantai 2', TRUE),
  ('IF_206', 'Lantai 2', TRUE),
  ('IF_207', 'Lantai 2', TRUE),
  ('IF_208', 'Lantai 2', TRUE),
  ('IF_209', 'Lantai 2', TRUE),
  ('IF_210', 'Lantai 2', TRUE),
  ('IF_211', 'Lantai 2', TRUE),
  ('IF_212', 'Lantai 2', TRUE),
  ('IF_213', 'Lantai 2', TRUE),
  ('IF_214', 'Lantai 2', TRUE),
  ('IF_215', 'Lantai 2', TRUE),
  ('IF_216', 'Lantai 2', TRUE),
  ('IF_218', 'Lantai 2', TRUE),
  ('IF_223', 'Lantai 2', TRUE),
  ('IF_224', 'Lantai 2', TRUE),
  ('IF_225', 'Lantai 2', TRUE),
  ('IF_226', 'Lantai 2', TRUE),
  ('IF_227', 'Lantai 2', TRUE),
  ('IF_228', 'Lantai 2', TRUE),
  ('IF_229', 'Lantai 2', TRUE),
  ('IF_230', 'Lantai 2', TRUE),
  ('IF_231', 'Lantai 2', TRUE),
  ('IF_232', 'Lantai 2', TRUE),
  ('IF_233', 'Lantai 2', TRUE),
  ('IF_234', 'Lantai 2', TRUE),
  ('IF_235', 'Lantai 2', TRUE);

INSERT INTO ruangan (nama_ruang, lantai, is_ruangan, label) VALUES
  ('IF_202',  'Lantai 2', TRUE, 'Mushola'),
  ('IF_217A', 'Lantai 2', TRUE, 'Ruang Rapat'),
  ('IF_217B', 'Lantai 2', TRUE, 'Ruang Rapat'),
  ('IF_237',  'Lantai 2', TRUE, 'Mushola');

INSERT INTO ruangan (nama_ruang, lantai, is_ruangan, is_ruang_dosen, label) VALUES
   ('IF_222',  'Lantai 2', TRUE, TRUE,'Alumni Corner');

INSERT INTO ruangan (nama_ruang, lantai, is_ruangan, label) VALUES
  ('Lounge',      'Lantai 2', TRUE, 'Lounge'),
  ('Ruang Sidang','Lantai 2', TRUE, 'Ruang Sidang'),
  ('Tata Usaha',  'Lantai 2', TRUE, 'Tata Usaha');

INSERT INTO ruangan (nama_ruang, lantai, is_ruangan, label) VALUES
  ('SPMB Jatim',      'Lantai 4', TRUE, 'SPMB Jatim'),
  ('SPMB Surabaya','Lantai 4', TRUE, 'SPMB Surabaya');

-- ============================================================
-- Seed: Ruangan — Lantai 3 (Laboratorium, Mixed, Ruangan)
-- Note: nama_ruang must match 3D model mesh names exactly.
-- ============================================================

-- Lab only
INSERT INTO ruangan (nama_ruang, lantai, is_lab, label) VALUES
  ('RPL',             'Lantai 3', TRUE, 'Rekayasa Perangkat Lunak'),
  ('KCV',             'Lantai 3', TRUE, 'Komputasi Cerdas Visi'),
  ('ALPRO',           'Lantai 3', TRUE, 'Algoritma Pemrograman'),
  ('MCI',             'Lantai 3', TRUE, 'Manajemen Cerdas Informasi'),
  ('PKT',             'Lantai 3', TRUE, 'Pemodelan dan Komputasi Terapan'),
  ('GIGa',            'Lantai 3', TRUE, 'Grafika, Interaksi dan Game'),
  ('Lab_Pascasarjana','Lantai 3', TRUE, 'Laboratorium Pascasarjana');

-- Lab + Ruang Dosen 
INSERT INTO ruangan (nama_ruang, lantai, is_lab, is_ruang_dosen, label) VALUES
  ('KBJ', 'Lantai 3', TRUE, TRUE, 'Komputasi Berbasis Jaringan');

-- Lab + Kelas (no dosen)
INSERT INTO ruangan (nama_ruang, lantai, is_lab, is_kelas, label) VALUES
  ('LP_1', 'Lantai 3', TRUE, TRUE, 'Lab Pemrograman 1');

-- Lab + Kelas + Ruang Dosen
INSERT INTO ruangan (nama_ruang, lantai, is_lab, is_kelas, is_ruang_dosen, label) VALUES
  ('LP_2',   'Lantai 3', TRUE, TRUE, TRUE, 'Lab Pemrograman 2'),
  ('NETICS', 'Lantai 3', TRUE, TRUE, TRUE, 'Teknologi Jaringan dan Keamanan Siber Cerdas');

-- Kelas only (auditorium — not a lab)
INSERT INTO ruangan (nama_ruang, lantai, is_kelas) VALUES
  ('Aula Handayani', 'Lantai 3', TRUE);

-- Label-only rooms
INSERT INTO ruangan (nama_ruang, lantai, is_ruangan, label) VALUES
  ('Sekretariat MTC', 'Lantai 3', TRUE, 'Sekretariat HMTC'),
  ('Co Working Space IUP',  'Lantai 3', TRUE, 'Co-Working Space IUP');

-- ============================================================
-- Seed: Dosen
-- ============================================================
INSERT INTO dosen (nama) VALUES
  ('Ir. Misbakhul Munir Irfan Subakti, S.Kom., M.Sc.Eng, M.Phil, IPM.'),
  ('Dr. Wahyu Suadi, S.Kom, M.Kom.'),
  ('Dr. Yudhi Purwananto, S.Kom., M.Kom.'),
  ('Rully Soelaiman, S.Kom, M.Kom.'),
  ('Victor Hariadi, S.Si., M.Kom.'),
  ('Dr. Ir. Ahmad Saikhu, S.Si., MT.'),
  ('Moch. Nafkhan Alzamzami, S.T., M.T.'),
  ('Aldinata Rizky Revanda, S.Kom., M.Kom.'),
  ('Prof. Daniel Oranova Siahaan, S.Kom., M.Sc. PD.Eng.'),
  ('Fajar Baskoro, S.Kom., MT.'),
  ('Imam Mustafa Kamal, S.ST, Ph.D.'),
  ('Dr. Eng. Muhamad Hilmil Muchtar Aditya Pradana, S.Kom, M.Sc.'),
  ('Prof. Ir. Supeno Djanali, M.Sc Ph.D.'),
  ('Prof. Ir. Handayani Tjandrasa, M.Sc., Ph.D.'),
  ('Prof. Dr. Agus Zainal Arifin, S.Kom., M.Kom.'),
  ('Ir. Suhadi Lili, M.T.I.'),
  ('Prof. Dr. Ir. Joko Lianto Buliali, M.Sc.'),
  ('Prof. Drs. Ec. Ir. Riyanarto Sarno, M.Sc., Ph.D.'),
  ('Dr. Ir. Bilqis Amaliah, S.Kom., M.Kom.'),
  ('Siska Arifiani, S.Kom., M.Kom.'),
  ('Dr. Kelly Rossa Sungkono, S.Kom., M.Kom.'),
  ('Prof. Dr. Eng. Chastine Fatichah, S.Kom., M.Kom.'),
  ('Prof. Dr. Diana Purwitasari, S.Kom., M.Sc.'),
  ('Nurul Fajrin Ariyani, S.Kom., M.Sc.'),
  ('Dr. Muhammad Alfian S.Tr.Kom., M.Tr.Kom.'),
  ('Muhammad ''Arif Faizin, S.Kom., M.Kom.'),
  ('Prof. Ir. Ary Mazharuddin Shiddiqi, S.Kom., M.Comp.Sc., Ph.D'),
  ('Prof. Dr. Umi Laili Yuhana, S.Kom., M.Sc.'),
  ('Ir. Siti Rochimah, MT., Ph.D.'),
  ('Dr. Sarwosri, S.Kom., MT.'),
  ('Dr. Anny Yuniarti, S.Kom., M.Comp.Sc.'),
  ('Dini Adni Navastara, S.Kom., M.Sc.'),
  ('Wijayanti Nurul Khotimah, S.Kom., M.Sc., Ph.D.'),
  ('Prof. Dr. Eng. Nanik Suciati, S.Kom., M.Kom.'),
  ('Imam Kuswardayan, S.Kom., MT.'),
  ('Dr. Eng. Darlis Herumurti, S.Kom., M.Kom.'),
  ('Pak Daniel'),
  ('Ir. Ratih Nur Esti Anggraini, S.Kom., M.Sc., Ph.D.'),
  ('Shintami Chusnul Hidayati, S.Kom., M.Sc., Ph.D.'),
  ('Bintang Nuralamsyah, S.Kom, M.Kom.'),
  ('Dr. Ir. Dwi Sunaryono, S.Kom., M.Kom.'),
  ('Rizky Januar Akbar, S.Kom., M.Eng.'),
  ('Hadziq Fabroyir, S.Kom., Ph.D.'),
  ('Arya Yudhi Wijaya, S.Kom, M.Kom.'),
  ('Dr. Radityo Anggoro, S.Kom., M.Sc.'),
  ('Hudan Studiawan, S.Kom., M.Kom., Ph.D.'),
  ('Dr. Baskoro Adi P., S.Kom., M.Kom.'),
  ('Prof. Ir. Tohari Ahmad, S.Kom., M.IT., Ph.D.'),
  ('Royyana Muslim Ijtihadie, S.Kom., M.Kom., Ph.D.'),
  ('Prof. Amitava Datta, Ph.D.'), 
  ('Dr. Adhatus Solichah Ahmadiyah, S.Kom., M.Sc.'), 
  ('Bagus Jati Santoso, S.Kom., Ph.D.'), 
  ('Abdul Munif, S.Kom., M.Sc.Eng.'), 
  ('Agus Budi Raharjo, S.Kom., M.Kom., Ph.D.'), 
  ('Ilham Gurat Adillion, S.Kom., M.Eng.');



-- ============================================================
-- Seed: Penghuni Ruangan — Lantai 2
-- ============================================================

-- IF_201
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_201' AND d.nama = 'Ir. Misbakhul Munir Irfan Subakti, S.Kom., M.Sc.Eng, M.Phil, IPM.';

-- IF_203
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_203' AND d.nama = 'Dr. Wahyu Suadi, S.Kom, M.Kom.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 2 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_203' AND d.nama = 'Dr. Yudhi Purwananto, S.Kom., M.Kom.';

-- IF_204
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_204' AND d.nama = 'Rully Soelaiman, S.Kom, M.Kom.';

-- IF_205
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_205' AND d.nama = 'Victor Hariadi, S.Si., M.Kom.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 2 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_205' AND d.nama = 'Dr. Ir. Ahmad Saikhu, S.Si., MT.';

-- IF_206
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_206' AND d.nama = 'Moch. Nafkhan Alzamzami, S.T., M.T.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 2 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_206' AND d.nama = 'Aldinata Rizky Revanda, S.Kom., M.Kom.';

-- IF_207
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_207' AND d.nama = 'Prof. Daniel Oranova Siahaan, S.Kom., M.Sc. PD.Eng.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 2 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_207' AND d.nama = 'Fajar Baskoro, S.Kom., MT.';

-- IF_208
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_208' AND d.nama = 'Imam Mustafa Kamal, S.ST, Ph.D.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 2 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_208' AND d.nama = 'Dr. Eng. Muhamad Hilmil Muchtar Aditya Pradana, S.Kom, M.Sc.';

-- IF_209
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_209' AND d.nama = 'Prof. Ir. Supeno Djanali, M.Sc Ph.D.';

-- IF_210
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_210' AND d.nama = 'Prof. Ir. Handayani Tjandrasa, M.Sc., Ph.D.';

-- IF_211
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_211' AND d.nama = 'Prof. Dr. Agus Zainal Arifin, S.Kom., M.Kom.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 2 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_211' AND d.nama = 'Ir. Suhadi Lili, M.T.I.';

-- IF_212
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_212' AND d.nama = 'Prof. Dr. Ir. Joko Lianto Buliali, M.Sc.';

-- IF_213
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_213' AND d.nama = 'Prof. Drs. Ec. Ir. Riyanarto Sarno, M.Sc., Ph.D.';

-- IF_214
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_214' AND d.nama = 'Dr. Ir. Bilqis Amaliah, S.Kom., M.Kom.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 2 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_214' AND d.nama = 'Siska Arifiani, S.Kom., M.Kom.';

-- IF_215
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_215' AND d.nama = 'Dr. Kelly Rossa Sungkono, S.Kom., M.Kom.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 2 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_215' AND d.nama = 'Prof. Dr. Eng. Chastine Fatichah, S.Kom., M.Kom.';

-- IF_216
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_216' AND d.nama = 'Prof. Dr. Diana Purwitasari, S.Kom., M.Sc.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 2 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_216' AND d.nama = 'Nurul Fajrin Ariyani, S.Kom., M.Sc.';

-- IF_218
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_218' AND d.nama = 'Dr. Muhammad Alfian S.Tr.Kom., M.Tr.Kom.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 2 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_218' AND d.nama = 'Muhammad ''Arif Faizin, S.Kom., M.Kom.';

-- IF_222
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_222' AND d.nama = 'Prof. Amitava Datta, Ph.D.';

-- IF_223
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_223' AND d.nama = 'Prof. Ir. Ary Mazharuddin Shiddiqi, S.Kom., M.Comp.Sc., Ph.D';

-- IF_224
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_224' AND d.nama = 'Prof. Dr. Umi Laili Yuhana, S.Kom., M.Sc.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 2 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_224' AND d.nama = 'Ir. Siti Rochimah, MT., Ph.D.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 3 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_224' AND d.nama = 'Dr. Sarwosri, S.Kom., MT.';

-- IF_225
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_225' AND d.nama = 'Dr. Anny Yuniarti, S.Kom., M.Comp.Sc.';

-- IF_226
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_226' AND d.nama = 'Dini Adni Navastara, S.Kom., M.Sc.';

-- IF_227
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_227' AND d.nama = 'Wijayanti Nurul Khotimah, S.Kom., M.Sc., Ph.D.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 2 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_227' AND d.nama = 'Prof. Dr. Eng. Nanik Suciati, S.Kom., M.Kom.';

-- IF_228
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_228' AND d.nama = 'Imam Kuswardayan, S.Kom., MT.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 2 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_228' AND d.nama = 'Dr. Eng. Darlis Herumurti, S.Kom., M.Kom.';

-- IF_229
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_229' AND d.nama = 'Prof. Daniel Oranova Siahaan, S.Kom., M.Sc. PD.Eng.';

-- IF_230
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_230' AND d.nama = 'Ir. Ratih Nur Esti Anggraini, S.Kom., M.Sc., Ph.D.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 2 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_230' AND d.nama = 'Shintami Chusnul Hidayati, S.Kom., M.Sc., Ph.D.';

-- IF_231
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_231' AND d.nama = 'Bintang Nuralamsyah, S.Kom, M.Kom.';

-- IF_232
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_232' AND d.nama = 'Dr. Ir. Dwi Sunaryono, S.Kom., M.Kom.';

-- IF_233
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_233' AND d.nama = 'Rizky Januar Akbar, S.Kom., M.Eng.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 2 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_233' AND d.nama = 'Hadziq Fabroyir, S.Kom., Ph.D.';

-- IF_234
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_234' AND d.nama = 'Arya Yudhi Wijaya, S.Kom, M.Kom.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 2 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_234' AND d.nama = 'Dr. Radityo Anggoro, S.Kom., M.Sc.';

-- IF_235
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'IF_235' AND d.nama = 'Hudan Studiawan, S.Kom., M.Kom., Ph.D.';

-- ============================================================
-- Seed: Penghuni Ruangan — Lantai 3
-- ============================================================

-- Netics
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'Netics' AND d.nama = 'Dr. Baskoro Adi P., S.Kom., M.Kom.';
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 2 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'Netics' AND d.nama = 'Hudan Studiawan, S.Kom., M.Kom., Ph.D.';

-- KBJ
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'KBJ' AND d.nama = 'Prof. Ir. Tohari Ahmad, S.Kom., M.IT., Ph.D.';

-- LP_2
INSERT INTO penghuni_ruangan (ruangan_id, dosen_id, urutan)
  SELECT r.id, d.id, 1 FROM ruangan r, dosen d
  WHERE r.nama_ruang = 'LP_2' AND d.nama = 'Royyana Muslim Ijtihadie, S.Kom., M.Kom., Ph.D.';
