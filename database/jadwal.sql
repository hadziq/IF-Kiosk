-- ============================================================
-- Seed: Jadwal Kuliah — Genap 25-26
-- Kolom: ruangan_id, dosen_id, dosen_id_2, dosen_id_3
-- Jalankan setelah tabel ruangan dan dosen sudah terisi.
-- ============================================================

-- Senin 10:00:00-12:50:00 | IF_101 | AS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '10:00:00', '12:50:00', 'IF_Teknik Peramalan T',
         (SELECT id FROM dosen WHERE nama = 'Dr. Ir. Ahmad Saikhu, S.Si., MT.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_101';

-- Senin 13:30:00-16:20:00 | IF_101 | SR, MA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2)
  SELECT
         r.id, 'Senin', '13:30:00', '16:20:00', 'IF_Perancangan Perangkat Lunak D',
         (SELECT id FROM dosen WHERE nama = 'Dr. Sarwosri, S.Kom., MT.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Dr. Muhammad Alfian S.Tr.Kom., M.Tr.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_101';

-- Selasa 07:00:00-09:50:00 | IF_101 | SC
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '07:00:00', '09:50:00', 'IF_Manajemen Basis Data C',
         (SELECT id FROM dosen WHERE nama = 'Shintami Chusnul Hidayati, S.Kom., M.Sc., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_101';

-- Selasa 10:00:00-12:50:00 | IF_101 | BS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '10:00:00', '12:50:00', 'IF_Keamanan Jaringan T (EN)',
         (SELECT id FROM dosen WHERE nama = 'Dr. Baskoro Adi P., S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_101';

-- Selasa 13:30:00-16:20:00 | IF_101 | SA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '13:30:00', '16:20:00', 'IF_Interaksi Manusia dan Komputer D',
         (SELECT id FROM dosen WHERE nama = 'Siska Arifiani, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_101';

-- Selasa 15:30:00-18:20:00 | IF_101 | AB
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '15:30:00', '18:20:00', 'IUP_Pemrograman Perangkat Bergerak IUP I',
         (SELECT id FROM dosen WHERE nama = 'Agus Budi Raharjo, S.Kom., M.Kom., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_101';

-- Rabu 07:00:00-10:50:00 | IF_101 | DP
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '07:00:00', '10:50:00', 'IUP_Struktur Data IUP I',
         (SELECT id FROM dosen WHERE nama = 'Prof. Dr. Diana Purwitasari, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_101';

-- Rabu 10:00:00-12:50:00 | IF_101 | HT
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '10:00:00', '12:50:00', 'IF_Pembelajaran Mesin A',
         (SELECT id FROM dosen WHERE nama = 'Prof. Ir. Handayani Tjandrasa, M.Sc., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_101';

-- Rabu 13:30:00-16:20:00 | IF_101 | AS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '13:30:00', '16:20:00', 'IF_Probabilitas dan Statistik D',
         (SELECT id FROM dosen WHERE nama = 'Dr. Ir. Ahmad Saikhu, S.Si., MT.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_101';

-- Kamis 07:00:00-09:50:00 | IF_101 | JL
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '07:00:00', '09:50:00', 'IF_Simulasi Sistem Dinamis T',
         (SELECT id FROM dosen WHERE nama = 'Prof. Dr. Ir. Joko Lianto Buliali, M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_101';

-- Kamis 13:30:00-16:20:00 | IF_101 | AI
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '13:30:00', '16:20:00', 'RPL_Struktur Data M',
         (SELECT id FROM dosen WHERE nama = 'Aldinata Rizky Revanda, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_101';

-- Senin 10:00:00-12:50:00 | IF_102 | AL
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '10:00:00', '12:50:00', 'IF_Pengantar Teknologi Basis Data Z',
         (SELECT id FROM dosen WHERE nama = 'Dr. Adhatus Solichah Ahmadiyah, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_102';

-- Senin 13:30:00-16:20:00 | IF_102 | IG
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '13:30:00', '16:20:00', 'RPL_Matematika Diskrit M',
         (SELECT id FROM dosen WHERE nama = 'Ilham Gurat Adillion, S.Kom., M.Eng.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_102';

-- Selasa 07:00:00-09:50:00 | IF_102 | DP, DA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2)
  SELECT
         r.id, 'Selasa', '07:00:00', '09:50:00', 'RKA_Temu Kembali Sistem Informasi N',
         (SELECT id FROM dosen WHERE nama = 'Prof. Dr. Diana Purwitasari, S.Kom., M.Sc.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Dini Adni Navastara, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_102';

-- Selasa 10:00:00-12:50:00 | IF_102 | WN
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '10:00:00', '12:50:00', 'IF_Interaksi Manusia dan Komputer E',
         (SELECT id FROM dosen WHERE nama = 'Wijayanti Nurul Khotimah, S.Kom., M.Sc., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_102';

-- Selasa 13:30:00-16:20:00 | IF_102 | UY
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '13:30:00', '16:20:00', 'IF_Kualitas Perangkat Lunak T',
         (SELECT id FROM dosen WHERE nama = 'Prof. Dr. Umi Laili Yuhana, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_102';

-- Selasa 15:30:00-19:20:00 | IF_102 | YP
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '15:30:00', '19:20:00', 'IF_Struktur Data C',
         (SELECT id FROM dosen WHERE nama = 'Dr. Yudhi Purwananto, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_102';

-- Rabu 07:00:00-09:50:00 | IF_102 | JL
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '07:00:00', '09:50:00', 'IF_Simulasi Berbasis Agen T',
         (SELECT id FROM dosen WHERE nama = 'Prof. Dr. Ir. Joko Lianto Buliali, M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_102';

-- Rabu 10:00:00-12:50:00 | IF_102 | JL
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '10:00:00', '12:50:00', 'IF_Probabilitas dan Statistik A',
         (SELECT id FROM dosen WHERE nama = 'Prof. Dr. Ir. Joko Lianto Buliali, M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_102';

-- Rabu 13:30:00-16:20:00 | IF_102 | DA, AI
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2)
  SELECT
         r.id, 'Rabu', '13:30:00', '16:20:00', 'RKA_Deep Learning N',
         (SELECT id FROM dosen WHERE nama = 'Dini Adni Navastara, S.Kom., M.Sc.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Aldinata Rizky Revanda, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_102';

-- Rabu 15:30:00-18:20:00 | IF_102 | WS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '15:30:00', '18:20:00', 'IF_Organisasi Komputer C',
         (SELECT id FROM dosen WHERE nama = 'Dr. Wahyu Suadi, S.Kom, M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_102';

-- Kamis 07:00:00-09:50:00 | IF_102 | IS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '07:00:00', '09:50:00', 'IF_Perancangan dan Analisis Algoritma G (EN)',
         (SELECT id FROM dosen WHERE nama = 'Ir. Misbakhul Munir Irfan Subakti, S.Kom., M.Sc.Eng, M.Phil, IPM.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_102';

-- Kamis 10:00:00-12:50:00 | IF_102 | BA, IG
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2)
  SELECT
         r.id, 'Kamis', '10:00:00', '12:50:00', 'RPL_Komputasi Numerik M',
         (SELECT id FROM dosen WHERE nama = 'Dr. Ir. Bilqis Amaliah, S.Kom., M.Kom.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Ilham Gurat Adillion, S.Kom., M.Eng.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_102';

-- Kamis 13:30:00-16:20:00 | IF_102 | SR, MA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2)
  SELECT
         r.id, 'Kamis', '13:30:00', '16:20:00', 'RKA_Konsep Pengembangan dan Perancangan Perangkat Lunak N',
         (SELECT id FROM dosen WHERE nama = 'Dr. Sarwosri, S.Kom., MT.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Dr. Muhammad Alfian S.Tr.Kom., M.Tr.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_102';

-- Kamis 15:30:00-18:20:00 | IF_102 | WS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '15:30:00', '18:20:00', 'IF_Organisasi Komputer D',
         (SELECT id FROM dosen WHERE nama = 'Dr. Wahyu Suadi, S.Kom, M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_102';

-- Jumat 09:00:00-11:50:00 | IF_102 | AS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Jumat', '09:00:00', '11:50:00', 'RKA_Probabilitas dan Statistik N',
         (SELECT id FROM dosen WHERE nama = 'Dr. Ir. Ahmad Saikhu, S.Si., MT.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_102';

-- Senin 07:00:00-09:50:00 | IF_103 | DO
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '07:00:00', '09:50:00', 'IUP_Perancangan Perangkat Lunak IUP I',
         (SELECT id FROM dosen WHERE nama = 'Prof. Daniel Oranova Siahaan, S.Kom., M.Sc. PD.Eng.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_103';

-- Senin 10:00:00-12:50:00 | IF_103 | SC, NF
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2)
  SELECT
         r.id, 'Senin', '10:00:00', '12:50:00', 'IF_Manajemen Basis Data E',
         (SELECT id FROM dosen WHERE nama = 'Shintami Chusnul Hidayati, S.Kom., M.Sc., Ph.D.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Nurul Fajrin Ariyani, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_103';

-- Senin 13:30:00-16:20:00 | IF_103 | BN
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '13:30:00', '16:20:00', 'RPL_Pemrograman Berbasis Kerangka Kerja M',
         (SELECT id FROM dosen WHERE nama = 'Bintang Nuralamsyah, S.Kom, M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_103';

-- Senin 15:30:00-18:20:00 | IF_103 | AI
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '15:30:00', '18:20:00', 'IF_Pembelajaran Mesin F',
         (SELECT id FROM dosen WHERE nama = 'Aldinata Rizky Revanda, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_103';

-- Selasa 07:00:00-09:50:00 | IF_103 | RA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '07:00:00', '09:50:00', 'RKA_Jaringan Komputer N',
         (SELECT id FROM dosen WHERE nama = 'Dr. Radityo Anggoro, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_103';

-- Selasa 10:00:00-12:50:00 | IF_103 | RJ
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '10:00:00', '12:50:00', 'RPL_Pemrograman Berorientasi Objek M',
         (SELECT id FROM dosen WHERE nama = 'Rizky Januar Akbar, S.Kom., M.Eng.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_103';

-- Selasa 13:30:00-16:20:00 | IF_103 | AI, AY
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2)
  SELECT
         r.id, 'Selasa', '13:30:00', '16:20:00', 'RKA_Pengolahan Citra Digital N',
         (SELECT id FROM dosen WHERE nama = 'Aldinata Rizky Revanda, S.Kom., M.Kom.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Dr. Anny Yuniarti, S.Kom., M.Comp.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_103';

-- Selasa 15:30:00-18:20:00 | IF_103 | AI, NF
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2)
  SELECT
         r.id, 'Selasa', '15:30:00', '18:20:00', 'RKA_Konsep Kecerdasan Artifisial N',
         (SELECT id FROM dosen WHERE nama = 'Aldinata Rizky Revanda, S.Kom., M.Kom.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Nurul Fajrin Ariyani, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_103';

-- Rabu 07:00:00-08:50:00 | IF_103 | AW
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '07:00:00', '08:50:00', 'IF_Otomata D',
         (SELECT id FROM dosen WHERE nama = 'Arya Yudhi Wijaya, S.Kom, M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_103';

-- Rabu 10:00:00-12:50:00 | IF_103 | AY
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '10:00:00', '12:50:00', 'RKA_Grafika Komputer N',
         (SELECT id FROM dosen WHERE nama = 'Dr. Anny Yuniarti, S.Kom., M.Comp.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_103';

-- Rabu 13:30:00-16:20:00 | IF_103 | JL
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '13:30:00', '16:20:00', 'IF_Probabilitas dan Statistik B',
         (SELECT id FROM dosen WHERE nama = 'Prof. Dr. Ir. Joko Lianto Buliali, M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_103';

-- Kamis 07:00:00-09:50:00 | IF_103 | BA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '07:00:00', '09:50:00', 'IF_Komputasi Numerik A',
         (SELECT id FROM dosen WHERE nama = 'Dr. Ir. Bilqis Amaliah, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_103';

-- Kamis 10:00:00-12:50:00 | IF_103 | AL
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '10:00:00', '12:50:00', 'IF_Manajemen Basis Data A',
         (SELECT id FROM dosen WHERE nama = 'Dr. Adhatus Solichah Ahmadiyah, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_103';

-- Kamis 13:30:00-16:20:00 | IF_103 | BJ
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '13:30:00', '16:20:00', 'IUP_Pemrograman Jaringan IUP I',
         (SELECT id FROM dosen WHERE nama = 'Bagus Jati Santoso, S.Kom., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_103';

-- Jumat 13:30:00-16:20:00 | IF_103 | RL
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Jumat', '13:30:00', '16:20:00', 'Pengantar Logikda dan Pemrograman Z',
         (SELECT id FROM dosen WHERE nama = 'Rully Soelaiman, S.Kom, M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_103';

-- Senin 07:00:00-09:50:00 | IF_104 | DP
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '07:00:00', '09:50:00', 'RKA_Struktur Data N',
         (SELECT id FROM dosen WHERE nama = 'Prof. Dr. Diana Purwitasari, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_104';

-- Senin 10:00:00-12:50:00 | IF_104 | NS, DA, AI
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2, dosen_id_3)
  SELECT
         r.id, 'Senin', '10:00:00', '12:50:00', 'IF_Deep Learning T',
         (SELECT id FROM dosen WHERE nama = 'Prof. Dr. Eng. Nanik Suciati, S.Kom., M.Kom.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Dini Adni Navastara, S.Kom., M.Sc.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Aldinata Rizky Revanda, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_104';

-- Senin 13:30:00-16:20:00 | IF_104 | SC
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '13:30:00', '16:20:00', 'IF_Manajemen Basis Data D',
         (SELECT id FROM dosen WHERE nama = 'Shintami Chusnul Hidayati, S.Kom., M.Sc., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_104';

-- Senin 15:30:00-18:20:00 | IF_104 | IG
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '15:30:00', '18:20:00', 'IF_Probabilitas dan Statistik F',
         (SELECT id FROM dosen WHERE nama = 'Ilham Gurat Adillion, S.Kom., M.Eng.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_104';

-- Selasa 07:00:00-09:50:00 | IF_104 | BN, MA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2)
  SELECT
         r.id, 'Selasa', '07:00:00', '09:50:00', 'RPL_Arsitektur Microservice dan Aplikasinya M',
         (SELECT id FROM dosen WHERE nama = 'Bintang Nuralamsyah, S.Kom, M.Kom.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Dr. Muhammad Alfian S.Tr.Kom., M.Tr.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_104';

-- Selasa 10:00:00-12:50:00 | IF_104 | RL
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '10:00:00', '12:50:00', 'IF_Perancangan dan Analisis Algoritma B',
         (SELECT id FROM dosen WHERE nama = 'Rully Soelaiman, S.Kom, M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_104';

-- Selasa 13:30:00-16:20:00 | IF_104 | DH
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '13:30:00', '16:20:00', 'IF_Interaksi Manusia dan Komputer A',
         (SELECT id FROM dosen WHERE nama = 'Dr. Eng. Darlis Herumurti, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_104';

-- Selasa 15:30:00-18:20:00 | IF_104 | KR
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '15:30:00', '18:20:00', 'IF_Manajemen Basis Data B',
         (SELECT id FROM dosen WHERE nama = 'Dr. Kelly Rossa Sungkono, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_104';

-- Rabu 07:00:00-08:50:00 | IF_104 | DA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '07:00:00', '08:50:00', 'RKA_Teori Graf N',
         (SELECT id FROM dosen WHERE nama = 'Dini Adni Navastara, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_104';

-- Rabu 10:00:00-12:50:00 | IF_104 | ST
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '10:00:00', '12:50:00', 'RPL_Analisis dan Perancangan Sistem Informasi M',
         (SELECT id FROM dosen WHERE nama = 'Ir. Siti Rochimah, MT., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_104';

-- Rabu 13:30:00-16:20:00 | IF_104 | SR
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '13:30:00', '16:20:00', 'IF_Perancangan Perangkat Lunak B',
         (SELECT id FROM dosen WHERE nama = 'Dr. Sarwosri, S.Kom., MT.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_104';

-- Rabu 15:30:00-18:20:00 | IF_104 | NS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '15:30:00', '18:20:00', 'IF_Pembelajaran Mesin B',
         (SELECT id FROM dosen WHERE nama = 'Prof. Dr. Eng. Nanik Suciati, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_104';

-- Kamis 07:00:00-08:50:00 | IF_104 | SL
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '07:00:00', '08:50:00', 'RPL_Pengantar Teknologi Elektro dan Informatika Cerdas M',
         (SELECT id FROM dosen WHERE nama = 'Ir. Suhadi Lili, M.T.I.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_104';

-- Kamis 10:00:00-12:50:00 | IF_104 | IS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '10:00:00', '12:50:00', 'IF_Perancangan dan Analisis Algoritma F (EN)',
         (SELECT id FROM dosen WHERE nama = 'Ir. Misbakhul Munir Irfan Subakti, S.Kom., M.Sc.Eng, M.Phil, IPM.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_104';

-- Kamis 13:30:00-16:20:00 | IF_104 | RL
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '13:30:00', '16:20:00', 'IF_Perancangan dan Analisis Algoritma C',
         (SELECT id FROM dosen WHERE nama = 'Rully Soelaiman, S.Kom, M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_104';

-- Jumat 13:30:00-16:20:00 | IF_104 | DH
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Jumat', '13:30:00', '16:20:00', 'Game Engine T',
         (SELECT id FROM dosen WHERE nama = 'Dr. Eng. Darlis Herumurti, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_104';

-- Senin 07:00:00-09:50:00 | IF_105 | SL
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '07:00:00', '09:50:00', 'IF_Pengantar Teknologi Elektro dan Informatika Cerdas C',
         (SELECT id FROM dosen WHERE nama = 'Ir. Suhadi Lili, M.T.I.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_105';

-- Senin 10:00:00-12:50:00 | IF_105 | AB
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '10:00:00', '12:50:00', 'IF_Pemrograman Perangkat Bergerak A',
         (SELECT id FROM dosen WHERE nama = 'Agus Budi Raharjo, S.Kom., M.Kom., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_105';

-- Senin 13:30:00-16:20:00 | IF_105 | SL
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '13:30:00', '16:20:00', 'IF_Pengantar Teknologi Elektro dan Informatika Cerdas A',
         (SELECT id FROM dosen WHERE nama = 'Ir. Suhadi Lili, M.T.I.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_105';

-- Senin 15:30:00-18:20:00 | IF_105 | WS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '15:30:00', '18:20:00', 'IF_Organisasi Komputer B',
         (SELECT id FROM dosen WHERE nama = 'Dr. Wahyu Suadi, S.Kom, M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_105';

-- Selasa 07:00:00-10:50:00 | IF_105 | TA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '07:00:00', '10:50:00', 'IF_Sistem Operasi B',
         (SELECT id FROM dosen WHERE nama = 'Prof. Ir. Tohari Ahmad, S.Kom., M.IT., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_105';

-- Selasa 10:00:00-12:50:00 | IF_105 | SR
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '10:00:00', '12:50:00', 'IF_Perancangan Perangkat Lunak A',
         (SELECT id FROM dosen WHERE nama = 'Dr. Sarwosri, S.Kom., MT.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_105';

-- Selasa 13:30:00-16:20:00 | IF_105 | RJ
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '13:30:00', '16:20:00', 'RPL_Arsitektur Perangkat Lunak M',
         (SELECT id FROM dosen WHERE nama = 'Rizky Januar Akbar, S.Kom., M.Eng.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_105';

-- Selasa 15:30:00-18:20:00 | IF_105 | SL
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '15:30:00', '18:20:00', 'IF_Pengantar Teknologi Elektro dan Informatika Cerdas B',
         (SELECT id FROM dosen WHERE nama = 'Ir. Suhadi Lili, M.T.I.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_105';

-- Rabu 07:00:00-09:50:00 | IF_105 | IS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '07:00:00', '09:50:00', 'IF_Perancangan dan Analisis Algoritma D (EN)',
         (SELECT id FROM dosen WHERE nama = 'Ir. Misbakhul Munir Irfan Subakti, S.Kom., M.Sc.Eng, M.Phil, IPM.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_105';

-- Rabu 10:00:00-12:50:00 | IF_105 | SD
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '10:00:00', '12:50:00', 'IF_Organisasi Komputer A',
         (SELECT id FROM dosen WHERE nama = 'Prof. Ir. Supeno Djanali, M.Sc Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_105';

-- Rabu 13:30:00-17:20:00 | IF_105 | RM
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '13:30:00', '17:20:00', 'IF_Sistem Operasi A',
         (SELECT id FROM dosen WHERE nama = 'Royyana Muslim Ijtihadie, S.Kom., M.Kom., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_105';

-- Rabu 15:30:00-19:20:00 | IF_105 | AM
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '15:30:00', '19:20:00', 'IF_Sistem Operasi C',
         (SELECT id FROM dosen WHERE nama = 'Prof. Ir. Ary Mazharuddin Shiddiqi, S.Kom., M.Comp.Sc., Ph.D' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_105';

-- Kamis 07:00:00-09:50:00 | IF_105 | CF
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '07:00:00', '09:50:00', 'IF_Pembelajaran Mesin C',
         (SELECT id FROM dosen WHERE nama = 'Prof. Dr. Eng. Chastine Fatichah, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_105';

-- Kamis 13:30:00-17:20:00 | IF_105 | YP
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '13:30:00', '17:20:00', 'IF_Struktur Data A',
         (SELECT id FROM dosen WHERE nama = 'Dr. Yudhi Purwananto, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_105';

-- Jumat 13:30:00-16:20:00 | IF_105 | IG
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Jumat', '13:30:00', '16:20:00', 'IF_Komputasi Numerik F',
         (SELECT id FROM dosen WHERE nama = 'Ilham Gurat Adillion, S.Kom., M.Eng.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_105';

-- Senin 07:00:00-09:50:00 | IF_106 | UY
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '07:00:00', '09:50:00', 'S3_Filsafat Ilmu A',
         (SELECT id FROM dosen WHERE nama = 'Prof. Dr. Umi Laili Yuhana, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_106';

-- Senin 13:30:00-16:20:00 | IF_106 | TA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '13:30:00', '16:20:00', 'S3_Topik Dalam Jaringan Multimedia',
         (SELECT id FROM dosen WHERE nama = 'Prof. Ir. Tohari Ahmad, S.Kom., M.IT., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_106';

-- Selasa 13:30:00-16:20:00 | IF_106 | CF, HF
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2)
  SELECT
         r.id, 'Selasa', '13:30:00', '16:20:00', 'S3_Topik Dalam Data Mining C',
         (SELECT id FROM dosen WHERE nama = 'Prof. Dr. Eng. Chastine Fatichah, S.Kom., M.Kom.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Hadziq Fabroyir, S.Kom., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_106';

-- Rabu 07:00:00-09:50:00 | IF_106 | BA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '07:00:00', '09:50:00', 'S3_Topik Dalam Data Deret Waktu A',
         (SELECT id FROM dosen WHERE nama = 'Dr. Ir. Bilqis Amaliah, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_106';

-- Rabu 10:00:00-11:50:00 | IF_106 | HS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '10:00:00', '11:50:00', 'S3_Penulisan Ilmiah A',
         (SELECT id FROM dosen WHERE nama = 'Hudan Studiawan, S.Kom., M.Kom., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_106';

-- Rabu 13:30:00-16:20:00 | IF_106 | ST
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '13:30:00', '16:20:00', 'S3_Metode Penelitian A',
         (SELECT id FROM dosen WHERE nama = 'Ir. Siti Rochimah, MT., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_106';

-- Kamis 07:00:00-09:50:00 | IF_106 | BJ, HS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2)
  SELECT
         r.id, 'Kamis', '07:00:00', '09:50:00', 'S3_Topik Dalam Pengaman Jaringan A',
         (SELECT id FROM dosen WHERE nama = 'Bagus Jati Santoso, S.Kom., Ph.D.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Hudan Studiawan, S.Kom., M.Kom., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_106';

-- Kamis 10:00:00-12:50:00 | IF_106 | RS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '10:00:00', '12:50:00', 'S3_Topik Dalam Tata Kelola Teknologi Informasi A',
         (SELECT id FROM dosen WHERE nama = 'Prof. Drs. Ec. Ir. Riyanarto Sarno, M.Sc., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_106';

-- Kamis 13:30:00-16:20:00 | IF_106 | RS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '13:30:00', '16:20:00', 'S3_Topik Dalam Rekayasa Sistem Berbasis Pengetahuan A',
         (SELECT id FROM dosen WHERE nama = 'Prof. Drs. Ec. Ir. Riyanarto Sarno, M.Sc., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_106';

-- Jumat 09:00:00-11:50:00 | IF_106 | BA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Jumat', '09:00:00', '11:50:00', 'S3_Topik Dalam Data Multivariat',
         (SELECT id FROM dosen WHERE nama = 'Dr. Ir. Bilqis Amaliah, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_106';

-- Jumat 13:30:00-16:20:00 | IF_106 | DS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Jumat', '13:30:00', '16:20:00', 'S3_TD IMK',
         (SELECT id FROM dosen WHERE nama = 'Dr. Ir. Dwi Sunaryono, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_106';

-- Jumat 15:30:00-18:20:00 | IF_106 | DS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Jumat', '15:30:00', '18:20:00', 'S3_TD MPPL',
         (SELECT id FROM dosen WHERE nama = 'Dr. Ir. Dwi Sunaryono, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_106';

-- Senin 10:00:00-12:50:00 | IF_107 | NF, DA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2)
  SELECT
         r.id, 'Senin', '10:00:00', '12:50:00', 'IF_Text Mining T',
         (SELECT id FROM dosen WHERE nama = 'Nurul Fajrin Ariyani, S.Kom., M.Sc.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Dini Adni Navastara, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_107';

-- Selasa 07:00:00-09:50:00 | IF_107 | SL
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '07:00:00', '09:50:00', 'IF_Topik Khusus Rekayasa Perangkat Lunak A',
         (SELECT id FROM dosen WHERE nama = 'Ir. Suhadi Lili, M.T.I.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_107';

-- Selasa 10:00:00-12:50:00 | IF_107 | FB
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '10:00:00', '12:50:00', 'RKA_Pemrograman Web N',
         (SELECT id FROM dosen WHERE nama = 'Fajar Baskoro, S.Kom., MT.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_107';

-- Selasa 13:30:00-16:20:00 | IF_107 | SR
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '13:30:00', '16:20:00', 'IF_Perancangan Perangkat Lunak C',
         (SELECT id FROM dosen WHERE nama = 'Dr. Sarwosri, S.Kom., MT.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_107';

-- Rabu 07:00:00-09:50:00 | IF_107 | NZ, AF
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2)
  SELECT
         r.id, 'Rabu', '07:00:00', '09:50:00', 'IF_Pemrograman Jaringan C',
         (SELECT id FROM dosen WHERE nama = 'Moch. Nafkhan Alzamzami, S.T., M.T.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Muhammad ''Arif Faizin, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_107';

-- Rabu 10:00:00-12:50:00 | IF_107 | AB
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '10:00:00', '12:50:00', 'IF_Pemrograman Perangkat Bergerak D',
         (SELECT id FROM dosen WHERE nama = 'Agus Budi Raharjo, S.Kom., M.Kom., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_107';

-- Rabu 13:30:00-16:20:00 | IF_107 | WN
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '13:30:00', '16:20:00', 'IF_Interaksi Manusia dan Komputer F',
         (SELECT id FROM dosen WHERE nama = 'Wijayanti Nurul Khotimah, S.Kom., M.Sc., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_107';

-- Kamis 10:00:00-12:50:00 | IF_107 | RJ
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '10:00:00', '12:50:00', 'RPL_Konstruksi Perangkat Lunak M (EN)',
         (SELECT id FROM dosen WHERE nama = 'Rizky Januar Akbar, S.Kom., M.Eng.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_107';

-- Kamis 13:30:00-16:20:00 | IF_107 | HM
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '13:30:00', '16:20:00', 'IF_Probabilitas dan Statistik E',
         (SELECT id FROM dosen WHERE nama = 'Dr. Eng. Muhamad Hilmil Muchtar Aditya Pradana, S.Kom, M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_107';

-- Jumat 13:30:00-16:20:00 | IF_107 | HF
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Jumat', '13:30:00', '16:20:00', 'IF_Desain Pengalaman Pengguna T (EN)',
         (SELECT id FROM dosen WHERE nama = 'Hadziq Fabroyir, S.Kom., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_107';

-- Senin 07:00:00-09:50:00 | IF_108 | SA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '07:00:00', '09:50:00', 'IF_Animasi Komputer dan Pemodelan 3D T',
         (SELECT id FROM dosen WHERE nama = 'Siska Arifiani, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_108';

-- Senin 13:30:00-16:20:00 | IF_108 | RA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '13:30:00', '16:20:00', 'IF_Komputasi Bergerak T',
         (SELECT id FROM dosen WHERE nama = 'Dr. Radityo Anggoro, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_108';

-- Selasa 07:00:00-09:50:00 | IF_108 | KR
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '07:00:00', '09:50:00', 'IUP_Manajemen Basis Data IUP I',
         (SELECT id FROM dosen WHERE nama = 'Dr. Kelly Rossa Sungkono, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_108';

-- Selasa 10:00:00-12:50:00 | IF_108 | MK
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '10:00:00', '12:50:00', 'IUP_Pembelajaran Mesin I',
         (SELECT id FROM dosen WHERE nama = 'Imam Mustafa Kamal, S.ST, Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_108';

-- Selasa 13:30:00-16:20:00 | IF_108 | BS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '13:30:00', '16:20:00', 'IF_Keamanan Aplikasi T (EN)',
         (SELECT id FROM dosen WHERE nama = 'Dr. Baskoro Adi P., S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_108';

-- Rabu 10:00:00-12:50:00 | IF_108 | IS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '10:00:00', '12:50:00', 'IUP_Perancangan dan Analisis Algoritma IUP I',
         (SELECT id FROM dosen WHERE nama = 'Ir. Misbakhul Munir Irfan Subakti, S.Kom., M.Sc.Eng, M.Phil, IPM.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_108';

-- Rabu 13:30:00-16:20:00 | IF_108 | IM
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '13:30:00', '16:20:00', 'IF_Game Edukasi dan Simulasi T',
         (SELECT id FROM dosen WHERE nama = 'Imam Kuswardayan, S.Kom., MT.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_108';

-- Rabu 15:30:00-17:20:00 | IF_108 | HM
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '15:30:00', '17:20:00', 'IUP_Otomata IUP I',
         (SELECT id FROM dosen WHERE nama = 'Dr. Eng. Muhamad Hilmil Muchtar Aditya Pradana, S.Kom, M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_108';

-- Kamis 10:00:00-12:50:00 | IF_108 | HM
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '10:00:00', '12:50:00', 'IUP_Probabilitas dan Statistik IUP I',
         (SELECT id FROM dosen WHERE nama = 'Dr. Eng. Muhamad Hilmil Muchtar Aditya Pradana, S.Kom, M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_108';

-- Kamis 13:30:00-17:20:00 | IF_108 | NZ
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '13:30:00', '17:20:00', 'IUP_Sistem Operasi IUP I',
         (SELECT id FROM dosen WHERE nama = 'Moch. Nafkhan Alzamzami, S.T., M.T.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_108';

-- Jumat 09:00:00-11:50:00 | IF_108 | IG
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Jumat', '09:00:00', '11:50:00', 'IUP_Komputasi Numerik IUP I',
         (SELECT id FROM dosen WHERE nama = 'Ilham Gurat Adillion, S.Kom., M.Eng.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_108';

-- Senin 07:00:00-09:50:00 | IF_113 | HF
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '07:00:00', '09:50:00', 'RPL_Interaksi Manusia dan Komputer M (EN)',
         (SELECT id FROM dosen WHERE nama = 'Hadziq Fabroyir, S.Kom., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_113';

-- Senin 10:00:00-12:50:00 | IF_113 | VH
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '10:00:00', '12:50:00', 'IF_Komputasi Numerik D',
         (SELECT id FROM dosen WHERE nama = 'Victor Hariadi, S.Si., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_113';

-- Senin 13:30:00-16:20:00 | IF_113 | AS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '13:30:00', '16:20:00', 'IF_Probabilitas dan Statistik C',
         (SELECT id FROM dosen WHERE nama = 'Dr. Ir. Ahmad Saikhu, S.Si., MT.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_113';

-- Senin 18:30:00-19:20:00 | IF_113 | WN, AY
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2)
  SELECT
         r.id, 'Senin', '18:30:00', '19:20:00', 'Topik Dalam Grafika Komputer P',
         (SELECT id FROM dosen WHERE nama = 'Wijayanti Nurul Khotimah, S.Kom., M.Sc., Ph.D.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Dr. Anny Yuniarti, S.Kom., M.Comp.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_113';

-- Selasa 07:00:00-09:50:00 | IF_113 | AW
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '07:00:00', '09:50:00', 'RPL_Probabilitas dan Statistik M',
         (SELECT id FROM dosen WHERE nama = 'Arya Yudhi Wijaya, S.Kom, M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_113';

-- Selasa 10:00:00-12:50:00 | IF_113 | HT
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '10:00:00', '12:50:00', 'Topik Dalam Komputasi Biomedik A',
         (SELECT id FROM dosen WHERE nama = 'Prof. Ir. Handayani Tjandrasa, M.Sc., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_113';

-- Selasa 16:30:00-19:20:00 | IF_113 | ST
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '16:30:00', '19:20:00', 'Topik Dalam Penjaminan Kualitas Perangkat Lunak P',
         (SELECT id FROM dosen WHERE nama = 'Ir. Siti Rochimah, MT., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_113';

-- Rabu 07:00:00-09:50:00 | IF_113 | AY
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '07:00:00', '09:50:00', 'IF_Interaksi Manusia dan Komputer B',
         (SELECT id FROM dosen WHERE nama = 'Dr. Anny Yuniarti, S.Kom., M.Comp.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_113';

-- Rabu 10:00:00-12:50:00 | IF_113 | RJ
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '10:00:00', '12:50:00', 'IF_Konstruksi Perangkat Lunak T (EN)',
         (SELECT id FROM dosen WHERE nama = 'Rizky Januar Akbar, S.Kom., M.Eng.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_113';

-- Rabu 13:30:00-16:20:00 | IF_113 | IS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '13:30:00', '16:20:00', 'IF_Perancangan dan Analisis Algoritma E (EN)',
         (SELECT id FROM dosen WHERE nama = 'Ir. Misbakhul Munir Irfan Subakti, S.Kom., M.Sc.Eng, M.Phil, IPM.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_113';

-- Rabu 15:30:00-19:20:00 | IF_113 | YP
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '15:30:00', '19:20:00', 'IF_Struktur Data B',
         (SELECT id FROM dosen WHERE nama = 'Dr. Yudhi Purwananto, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_113';

-- Rabu 18:30:00-19:20:00 | IF_113 | UY
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '18:30:00', '19:20:00', 'Rekayasa Perangkat Lunak untuk Pendidikan P',
         (SELECT id FROM dosen WHERE nama = 'Prof. Dr. Umi Laili Yuhana, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_113';

-- Kamis 07:00:00-09:50:00 | IF_113 | SA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '07:00:00', '09:50:00', 'RKA_Interaksi Manusia dan Komputer N',
         (SELECT id FROM dosen WHERE nama = 'Siska Arifiani, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_113';

-- Kamis 10:00:00-12:50:00 | IF_113 | DS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '10:00:00', '12:50:00', 'Matrikulasi-Pemrograman Python  A',
         (SELECT id FROM dosen WHERE nama = 'Dr. Ir. Dwi Sunaryono, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_113';

-- Kamis 13:30:00-16:20:00 | IF_113 | DS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '13:30:00', '16:20:00', 'Topik Dalam Algoritma dan Teknik Optimasi A',
         (SELECT id FROM dosen WHERE nama = 'Dr. Ir. Dwi Sunaryono, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_113';

-- Kamis 18:30:00-19:20:00 | IF_113 | DS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '18:30:00', '19:20:00', 'Topik Dalam Algoritma dan Teknik Optimasi P',
         (SELECT id FROM dosen WHERE nama = 'Dr. Ir. Dwi Sunaryono, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_113';

-- Jumat 18:30:00-19:20:00 | IF_113 | DO
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Jumat', '18:30:00', '19:20:00', 'Topik Dalam Rekayasa Kebutuhan P',
         (SELECT id FROM dosen WHERE nama = 'Prof. Daniel Oranova Siahaan, S.Kom., M.Sc. PD.Eng.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'IF_113';

-- Senin 07:00:00-09:50:00 | LP_1 | BN
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '07:00:00', '09:50:00', 'IF_Perancangan Perangkat Lunak E',
         (SELECT id FROM dosen WHERE nama = 'Bintang Nuralamsyah, S.Kom, M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'LP_1';

-- Senin 10:00:00-11:50:00 | LP_1 | AW
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '10:00:00', '11:50:00', 'IF_Otomata F',
         (SELECT id FROM dosen WHERE nama = 'Arya Yudhi Wijaya, S.Kom, M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'LP_1';

-- Senin 13:30:00-16:20:00 | LP_1 | DA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '13:30:00', '16:20:00', 'RKA_Pemrosesan Bahasa Natural N',
         (SELECT id FROM dosen WHERE nama = 'Dini Adni Navastara, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'LP_1';

-- Selasa 07:00:00-09:50:00 | LP_1 | NZ, AF
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2)
  SELECT
         r.id, 'Selasa', '07:00:00', '09:50:00', 'IF_Pemrograman Jaringan D',
         (SELECT id FROM dosen WHERE nama = 'Moch. Nafkhan Alzamzami, S.T., M.T.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Muhammad ''Arif Faizin, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'LP_1';

-- Selasa 10:00:00-12:50:00 | LP_1 | AB
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '10:00:00', '12:50:00', 'IF_Pemrograman Perangkat Bergerak E',
         (SELECT id FROM dosen WHERE nama = 'Agus Budi Raharjo, S.Kom., M.Kom., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'LP_1';

-- Selasa 13:30:00-16:20:00 | LP_1 | HS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '13:30:00', '16:20:00', 'IF_Pemrograman Jaringan B',
         (SELECT id FROM dosen WHERE nama = 'Hudan Studiawan, S.Kom., M.Kom., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'LP_1';

-- Rabu 10:00:00-12:50:00 | LP_1 | RL
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '10:00:00', '12:50:00', 'IF_Perancangan dan Analisis Algoritma A',
         (SELECT id FROM dosen WHERE nama = 'Rully Soelaiman, S.Kom, M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'LP_1';

-- Rabu 13:30:00-17:20:00 | LP_1 | DS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '13:30:00', '17:20:00', 'IF_Struktur Data E',
         (SELECT id FROM dosen WHERE nama = 'Dr. Ir. Dwi Sunaryono, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'LP_1';

-- Senin 07:00:00-08:50:00 | LP_2 | AW
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '07:00:00', '08:50:00', 'IF_Otomata E',
         (SELECT id FROM dosen WHERE nama = 'Arya Yudhi Wijaya, S.Kom, M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'LP_2';

-- Senin 10:00:00-12:50:00 | LP_2 | RN
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Senin', '10:00:00', '12:50:00', 'IF_Big Data T',
         (SELECT id FROM dosen WHERE nama = 'Ir. Ratih Nur Esti Anggraini, S.Kom., M.Sc., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'LP_2';

-- Selasa 10:00:00-12:50:00 | LP_2 | HS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '10:00:00', '12:50:00', 'IF_Pemrograman Jaringan A',
         (SELECT id FROM dosen WHERE nama = 'Hudan Studiawan, S.Kom., M.Kom., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'LP_2';

-- Selasa 13:30:00-16:20:00 | LP_2 | DA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '13:30:00', '16:20:00', 'IF_Pembelajaran Mesin D',
         (SELECT id FROM dosen WHERE nama = 'Dini Adni Navastara, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'LP_2';

-- Selasa 15:30:00-18:20:00 | LP_2 | WS, AF
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2)
  SELECT
         r.id, 'Selasa', '15:30:00', '18:20:00', 'IF_Organisasi Komputer E',
         (SELECT id FROM dosen WHERE nama = 'Dr. Wahyu Suadi, S.Kom, M.Kom.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Muhammad ''Arif Faizin, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'LP_2';

-- Rabu 10:00:00-12:50:00 | LP_2 | FB
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '10:00:00', '12:50:00', 'IF_Pemrograman Perangkat Bergerak C',
         (SELECT id FROM dosen WHERE nama = 'Fajar Baskoro, S.Kom., MT.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'LP_2';

-- Rabu 13:30:00-16:20:00 | LP_2 | FB
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '13:30:00', '16:20:00', 'IF_Pemrograman Perangkat Bergerak B',
         (SELECT id FROM dosen WHERE nama = 'Fajar Baskoro, S.Kom., MT.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'LP_2';

-- Kamis 10:00:00-12:50:00 | LP_2 | AI
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '10:00:00', '12:50:00', 'IF_Pembelajaran Mesin E',
         (SELECT id FROM dosen WHERE nama = 'Aldinata Rizky Revanda, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'LP_2';

-- Senin 10:00:00-12:50:00 | Netics | IG, BA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2)
  SELECT
         r.id, 'Senin', '10:00:00', '12:50:00', 'IF_Topik Khusus PKT T (Di Lab RMK PKT)',
         (SELECT id FROM dosen WHERE nama = 'Ilham Gurat Adillion, S.Kom., M.Eng.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Dr. Ir. Bilqis Amaliah, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'Netics';

-- Selasa 13:30:00-16:20:00 | Netics | IM
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Selasa', '13:30:00', '16:20:00', 'IF_Pengantar Pengembangan Game Z',
         (SELECT id FROM dosen WHERE nama = 'Imam Kuswardayan, S.Kom., MT.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'Netics';

-- Rabu 13:30:00-16:20:00 | Netics | RS
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '13:30:00', '16:20:00', 'IF_Audit Sistem T',
         (SELECT id FROM dosen WHERE nama = 'Prof. Drs. Ec. Ir. Riyanarto Sarno, M.Sc., Ph.D.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'Netics';

-- Rabu 15:30:00-19:20:00 | Netics | DO
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Rabu', '15:30:00', '19:20:00', 'IF_Dasar Pemrograman R (IF dan RPL)',
         (SELECT id FROM dosen WHERE nama = 'Prof. Daniel Oranova Siahaan, S.Kom., M.Sc. PD.Eng.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'Netics';

-- Kamis 07:00:00-10:50:00 | Netics | KR
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Kamis', '07:00:00', '10:50:00', 'IF_Sistem Basis Data R',
         (SELECT id FROM dosen WHERE nama = 'Dr. Kelly Rossa Sungkono, S.Kom., M.Kom.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'Netics';

-- Jumat 09:00:00-11:50:00 | Netics | JL
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Jumat', '09:00:00', '11:50:00', 'IF_Aljabar Linier R',
         (SELECT id FROM dosen WHERE nama = 'Prof. Dr. Ir. Joko Lianto Buliali, M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'Netics';

-- Jumat 13:30:00-16:20:00 | Netics | RA
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id)
  SELECT
         r.id, 'Jumat', '13:30:00', '16:20:00', 'IF_Sistem Digital R',
         (SELECT id FROM dosen WHERE nama = 'Dr. Radityo Anggoro, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'Netics';

-- Jumat 13:30:00-15:20:00 | Aula Handayani | AL, RN, NF
INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah, dosen_id, dosen_id_2, dosen_id_3)
  SELECT
         r.id, 'Jumat', '13:30:00', '15:20:00', 'IF, RKA, & IUP_Etika Profesi A',
         (SELECT id FROM dosen WHERE nama = 'Dr. Adhatus Solichah Ahmadiyah, S.Kom., M.Sc.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Ir. Ratih Nur Esti Anggraini, S.Kom., M.Sc., Ph.D.' LIMIT 1),
         (SELECT id FROM dosen WHERE nama = 'Nurul Fajrin Ariyani, S.Kom., M.Sc.' LIMIT 1)
  FROM ruangan r WHERE r.nama_ruang = 'Aula Handayani';