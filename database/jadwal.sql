-- ============================================================
-- Seed: Jadwal Kuliah — Genap 25-26
-- Jalankan setelah ruangan sudah terisi.
-- ============================================================

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '10:00:00', '12:50:00', 'IF_Teknik Peramalan T'
  FROM ruangan WHERE nama_ruang = 'IF_101';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '13:30:00', '16:20:00', 'IF_Perancangan Perangkat Lunak D'
  FROM ruangan WHERE nama_ruang = 'IF_101';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '07:00:00', '09:50:00', 'IF_Manajemen Basis Data C'
  FROM ruangan WHERE nama_ruang = 'IF_101';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '10:00:00', '12:50:00', 'IF_Keamanan Jaringan T (EN)'
  FROM ruangan WHERE nama_ruang = 'IF_101';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '13:30:00', '16:20:00', 'IF_Interaksi Manusia dan Komputer D'
  FROM ruangan WHERE nama_ruang = 'IF_101';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '15:30:00', '18:20:00', 'IUP_Pemrograman Perangkat Bergerak IUP I'
  FROM ruangan WHERE nama_ruang = 'IF_101';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '07:00:00', '10:50:00', 'IUP_Struktur Data IUP I'
  FROM ruangan WHERE nama_ruang = 'IF_101';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '10:00:00', '12:50:00', 'IF_Pembelajaran Mesin A'
  FROM ruangan WHERE nama_ruang = 'IF_101';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '13:30:00', '16:20:00', 'IF_Probabilitas dan Statistik D'
  FROM ruangan WHERE nama_ruang = 'IF_101';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '07:00:00', '09:50:00', 'IF_Simulasi Sistem Dinamis T'
  FROM ruangan WHERE nama_ruang = 'IF_101';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '13:30:00', '16:20:00', 'RPL_Struktur Data M'
  FROM ruangan WHERE nama_ruang = 'IF_101';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '10:00:00', '12:50:00', 'IF_Pengantar Teknologi Basis Data Z'
  FROM ruangan WHERE nama_ruang = 'IF_102';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '13:30:00', '16:20:00', 'RPL_Matematika Diskrit M'
  FROM ruangan WHERE nama_ruang = 'IF_102';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '07:00:00', '09:50:00', 'RKA_Temu Kembali Sistem Informasi N'
  FROM ruangan WHERE nama_ruang = 'IF_102';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '10:00:00', '12:50:00', 'IF_Interaksi Manusia dan Komputer E'
  FROM ruangan WHERE nama_ruang = 'IF_102';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '13:30:00', '16:20:00', 'IF_Kualitas Perangkat Lunak T'
  FROM ruangan WHERE nama_ruang = 'IF_102';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '15:30:00', '19:20:00', 'IF_Struktur Data C'
  FROM ruangan WHERE nama_ruang = 'IF_102';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '07:00:00', '09:50:00', 'IF_Simulasi Berbasis Agen T'
  FROM ruangan WHERE nama_ruang = 'IF_102';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '10:00:00', '12:50:00', 'IF_Probabilitas dan Statistik A'
  FROM ruangan WHERE nama_ruang = 'IF_102';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '13:30:00', '16:20:00', 'RKA_Deep Learning N'
  FROM ruangan WHERE nama_ruang = 'IF_102';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '15:30:00', '18:20:00', 'IF_Organisasi Komputer C'
  FROM ruangan WHERE nama_ruang = 'IF_102';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '07:00:00', '09:50:00', 'IF_Perancangan dan Analisis Algoritma G (EN)'
  FROM ruangan WHERE nama_ruang = 'IF_102';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '10:00:00', '12:50:00', 'RPL_Komputasi Numerik M'
  FROM ruangan WHERE nama_ruang = 'IF_102';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '13:30:00', '16:20:00', 'RKA_Konsep Pengembangan dan Perancangan Perangkat Lunak N'
  FROM ruangan WHERE nama_ruang = 'IF_102';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '15:30:00', '18:20:00', 'IF_Organisasi Komputer D'
  FROM ruangan WHERE nama_ruang = 'IF_102';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '09:00:00', '11:50:00', 'RKA_Probabilitas dan Statistik N'
  FROM ruangan WHERE nama_ruang = 'IF_102';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '07:00:00', '09:50:00', 'IUP_Perancangan Perangkat Lunak IUP I'
  FROM ruangan WHERE nama_ruang = 'IF_103';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '10:00:00', '12:50:00', 'IF_Manajemen Basis Data E'
  FROM ruangan WHERE nama_ruang = 'IF_103';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '13:30:00', '16:20:00', 'RPL_Pemrograman Berbasis Kerangka Kerja M'
  FROM ruangan WHERE nama_ruang = 'IF_103';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '15:30:00', '18:20:00', 'IF_Pembelajaran Mesin F'
  FROM ruangan WHERE nama_ruang = 'IF_103';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '07:00:00', '09:50:00', 'RKA_Jaringan Komputer N'
  FROM ruangan WHERE nama_ruang = 'IF_103';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '10:00:00', '12:50:00', 'RPL_Pemrograman Berorientasi Objek M'
  FROM ruangan WHERE nama_ruang = 'IF_103';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '13:30:00', '16:20:00', 'RKA_Pengolahan Citra Digital N'
  FROM ruangan WHERE nama_ruang = 'IF_103';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '15:30:00', '18:20:00', 'RKA_Konsep Kecerdasan Artifisial N'
  FROM ruangan WHERE nama_ruang = 'IF_103';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '07:00:00', '08:50:00', 'IF_Otomata D'
  FROM ruangan WHERE nama_ruang = 'IF_103';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '10:00:00', '12:50:00', 'RKA_Grafika Komputer N'
  FROM ruangan WHERE nama_ruang = 'IF_103';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '13:30:00', '16:20:00', 'IF_Probabilitas dan Statistik B'
  FROM ruangan WHERE nama_ruang = 'IF_103';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '07:00:00', '09:50:00', 'IF_Komputasi Numerik A'
  FROM ruangan WHERE nama_ruang = 'IF_103';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '10:00:00', '12:50:00', 'IF_Manajemen Basis Data A'
  FROM ruangan WHERE nama_ruang = 'IF_103';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '13:30:00', '16:20:00', 'IUP_Pemrograman Jaringan IUP I'
  FROM ruangan WHERE nama_ruang = 'IF_103';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '13:30:00', '16:20:00', 'Pengantar Logikda dan Pemrograman Z'
  FROM ruangan WHERE nama_ruang = 'IF_103';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '07:00:00', '09:50:00', 'RKA_Struktur Data N'
  FROM ruangan WHERE nama_ruang = 'IF_104';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '10:00:00', '12:50:00', 'IF_Deep Learning T'
  FROM ruangan WHERE nama_ruang = 'IF_104';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '13:30:00', '16:20:00', 'IF_Manajemen Basis Data D'
  FROM ruangan WHERE nama_ruang = 'IF_104';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '15:30:00', '18:20:00', 'IF_Probabilitas dan Statistik F'
  FROM ruangan WHERE nama_ruang = 'IF_104';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '07:00:00', '09:50:00', 'RPL_Arsitektur Microservice dan Aplikasinya M'
  FROM ruangan WHERE nama_ruang = 'IF_104';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '10:00:00', '12:50:00', 'IF_Perancangan dan Analisis Algoritma B'
  FROM ruangan WHERE nama_ruang = 'IF_104';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '13:30:00', '16:20:00', 'IF_Interaksi Manusia dan Komputer A'
  FROM ruangan WHERE nama_ruang = 'IF_104';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '15:30:00', '18:20:00', 'IF_Manajemen Basis Data B'
  FROM ruangan WHERE nama_ruang = 'IF_104';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '07:00:00', '08:50:00', 'RKA_Teori Graf N'
  FROM ruangan WHERE nama_ruang = 'IF_104';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '10:00:00', '12:50:00', 'RPL_Analisis dan Perancangan Sistem Informasi M'
  FROM ruangan WHERE nama_ruang = 'IF_104';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '13:30:00', '16:20:00', 'IF_Perancangan Perangkat Lunak B'
  FROM ruangan WHERE nama_ruang = 'IF_104';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '15:30:00', '18:20:00', 'IF_Pembelajaran Mesin B'
  FROM ruangan WHERE nama_ruang = 'IF_104';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '07:00:00', '08:50:00', 'RPL_Pengantar Teknologi Elektro dan Informatika Cerdas M'
  FROM ruangan WHERE nama_ruang = 'IF_104';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '10:00:00', '12:50:00', 'IF_Perancangan dan Analisis Algoritma F (EN)'
  FROM ruangan WHERE nama_ruang = 'IF_104';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '13:30:00', '16:20:00', 'IF_Perancangan dan Analisis Algoritma C'
  FROM ruangan WHERE nama_ruang = 'IF_104';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '13:30:00', '16:20:00', 'Game Engine T'
  FROM ruangan WHERE nama_ruang = 'IF_104';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '07:00:00', '09:50:00', 'IF_Pengantar Teknologi Elektro dan Informatika Cerdas C'
  FROM ruangan WHERE nama_ruang = 'IF_105';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '10:00:00', '12:50:00', 'IF_Pemrograman Perangkat Bergerak A'
  FROM ruangan WHERE nama_ruang = 'IF_105';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '13:30:00', '16:20:00', 'IF_Pengantar Teknologi Elektro dan Informatika Cerdas A'
  FROM ruangan WHERE nama_ruang = 'IF_105';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '15:30:00', '18:20:00', 'IF_Organisasi Komputer B'
  FROM ruangan WHERE nama_ruang = 'IF_105';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '07:00:00', '10:50:00', 'IF_Sistem Operasi B'
  FROM ruangan WHERE nama_ruang = 'IF_105';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '10:00:00', '12:50:00', 'IF_Perancangan Perangkat Lunak A'
  FROM ruangan WHERE nama_ruang = 'IF_105';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '13:30:00', '16:20:00', 'RPL_Arsitektur Perangkat Lunak M'
  FROM ruangan WHERE nama_ruang = 'IF_105';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '15:30:00', '18:20:00', 'IF_Pengantar Teknologi Elektro dan Informatika Cerdas B'
  FROM ruangan WHERE nama_ruang = 'IF_105';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '07:00:00', '09:50:00', 'IF_Perancangan dan Analisis Algoritma D (EN)'
  FROM ruangan WHERE nama_ruang = 'IF_105';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '10:00:00', '12:50:00', 'IF_Organisasi Komputer A'
  FROM ruangan WHERE nama_ruang = 'IF_105';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '13:30:00', '17:20:00', 'IF_Sistem Operasi A'
  FROM ruangan WHERE nama_ruang = 'IF_105';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '15:30:00', '19:20:00', 'IF_Sistem Operasi C'
  FROM ruangan WHERE nama_ruang = 'IF_105';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '07:00:00', '09:50:00', 'IF_Pembelajaran Mesin C'
  FROM ruangan WHERE nama_ruang = 'IF_105';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '13:30:00', '17:20:00', 'IF_Struktur Data A'
  FROM ruangan WHERE nama_ruang = 'IF_105';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '13:30:00', '16:20:00', 'IF_Komputasi Numerik F'
  FROM ruangan WHERE nama_ruang = 'IF_105';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '07:00:00', '09:50:00', 'S3_Filsafat Ilmu A'
  FROM ruangan WHERE nama_ruang = 'IF_106';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '13:30:00', '16:20:00', 'S3_Topik Dalam Jaringan Multimedia'
  FROM ruangan WHERE nama_ruang = 'IF_106';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '13:30:00', '16:20:00', 'S3_Topik Dalam Data Mining C'
  FROM ruangan WHERE nama_ruang = 'IF_106';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '07:00:00', '09:50:00', 'S3_Topik Dalam Data Deret Waktu A'
  FROM ruangan WHERE nama_ruang = 'IF_106';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '10:00:00', '11:50:00', 'S3_Penulisan Ilmiah A'
  FROM ruangan WHERE nama_ruang = 'IF_106';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '13:30:00', '16:20:00', 'S3_Metode Penelitian A'
  FROM ruangan WHERE nama_ruang = 'IF_106';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '07:00:00', '09:50:00', 'S3_Topik Dalam Pengaman Jaringan A'
  FROM ruangan WHERE nama_ruang = 'IF_106';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '10:00:00', '12:50:00', 'S3_Topik Dalam Tata Kelola Teknologi Informasi A'
  FROM ruangan WHERE nama_ruang = 'IF_106';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '13:30:00', '16:20:00', 'S3_Topik Dalam Rekayasa Sistem Berbasis Pengetahuan A'
  FROM ruangan WHERE nama_ruang = 'IF_106';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '09:00:00', '11:50:00', 'S3_Topik Dalam Data Multivariat'
  FROM ruangan WHERE nama_ruang = 'IF_106';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '13:30:00', '16:20:00', 'S3_TD IMK'
  FROM ruangan WHERE nama_ruang = 'IF_106';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '15:30:00', '18:20:00', 'S3_TD MPPL'
  FROM ruangan WHERE nama_ruang = 'IF_106';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '10:00:00', '12:50:00', 'IF_Text Mining T'
  FROM ruangan WHERE nama_ruang = 'IF_107';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '07:00:00', '09:50:00', 'IF_Topik Khusus Rekayasa Perangkat Lunak A'
  FROM ruangan WHERE nama_ruang = 'IF_107';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '10:00:00', '12:50:00', 'RKA_Pemrograman Web N'
  FROM ruangan WHERE nama_ruang = 'IF_107';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '13:30:00', '16:20:00', 'IF_Perancangan Perangkat Lunak C'
  FROM ruangan WHERE nama_ruang = 'IF_107';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '07:00:00', '09:50:00', 'IF_Pemrograman Jaringan C'
  FROM ruangan WHERE nama_ruang = 'IF_107';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '10:00:00', '12:50:00', 'IF_Pemrograman Perangkat Bergerak D'
  FROM ruangan WHERE nama_ruang = 'IF_107';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '13:30:00', '16:20:00', 'IF_Interaksi Manusia dan Komputer F'
  FROM ruangan WHERE nama_ruang = 'IF_107';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '10:00:00', '12:50:00', 'RPL_Konstruksi Perangkat Lunak M (EN)'
  FROM ruangan WHERE nama_ruang = 'IF_107';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '13:30:00', '16:20:00', 'IF_Probabilitas dan Statistik E'
  FROM ruangan WHERE nama_ruang = 'IF_107';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '13:30:00', '16:20:00', 'IF_Desain Pengalaman Pengguna T (EN)'
  FROM ruangan WHERE nama_ruang = 'IF_107';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '07:00:00', '09:50:00', 'IF_Animasi Komputer dan Pemodelan 3D T'
  FROM ruangan WHERE nama_ruang = 'IF_108';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '13:30:00', '16:20:00', 'IF_Komputasi Bergerak T'
  FROM ruangan WHERE nama_ruang = 'IF_108';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '07:00:00', '09:50:00', 'IUP_Manajemen Basis Data IUP I'
  FROM ruangan WHERE nama_ruang = 'IF_108';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '10:00:00', '12:50:00', 'IUP_Pembelajaran Mesin I'
  FROM ruangan WHERE nama_ruang = 'IF_108';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '13:30:00', '16:20:00', 'IF_Keamanan Aplikasi T (EN)'
  FROM ruangan WHERE nama_ruang = 'IF_108';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '10:00:00', '12:50:00', 'IUP_Perancangan dan Analisis Algoritma IUP I'
  FROM ruangan WHERE nama_ruang = 'IF_108';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '13:30:00', '16:20:00', 'IF_Game Edukasi dan Simulasi T'
  FROM ruangan WHERE nama_ruang = 'IF_108';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '15:30:00', '17:20:00', 'IUP_Otomata IUP I'
  FROM ruangan WHERE nama_ruang = 'IF_108';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '10:00:00', '12:50:00', 'IUP_Probabilitas dan Statistik IUP I'
  FROM ruangan WHERE nama_ruang = 'IF_108';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '13:30:00', '17:20:00', 'IUP_Sistem Operasi IUP I'
  FROM ruangan WHERE nama_ruang = 'IF_108';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '09:00:00', '11:50:00', 'IUP_Komputasi Numerik IUP I'
  FROM ruangan WHERE nama_ruang = 'IF_108';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '07:00:00', '09:50:00', 'RPL_Interaksi Manusia dan Komputer M (EN)'
  FROM ruangan WHERE nama_ruang = 'IF_113';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '10:00:00', '12:50:00', 'IF_Komputasi Numerik D'
  FROM ruangan WHERE nama_ruang = 'IF_113';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '13:30:00', '16:20:00', 'IF_Probabilitas dan Statistik C'
  FROM ruangan WHERE nama_ruang = 'IF_113';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '18:30:00', '19:20:00', 'Topik Dalam Grafika Komputer P'
  FROM ruangan WHERE nama_ruang = 'IF_113';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '07:00:00', '09:50:00', 'RPL_Probabilitas dan Statistik M'
  FROM ruangan WHERE nama_ruang = 'IF_113';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '10:00:00', '12:50:00', 'Topik Dalam Komputasi Biomedik A'
  FROM ruangan WHERE nama_ruang = 'IF_113';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '16:30:00', '19:20:00', 'Topik Dalam Penjaminan Kualitas Perangkat Lunak P'
  FROM ruangan WHERE nama_ruang = 'IF_113';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '07:00:00', '09:50:00', 'IF_Interaksi Manusia dan Komputer B'
  FROM ruangan WHERE nama_ruang = 'IF_113';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '10:00:00', '12:50:00', 'IF_Konstruksi Perangkat Lunak T (EN)'
  FROM ruangan WHERE nama_ruang = 'IF_113';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '13:30:00', '16:20:00', 'IF_Perancangan dan Analisis Algoritma E (EN)'
  FROM ruangan WHERE nama_ruang = 'IF_113';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '15:30:00', '19:20:00', 'IF_Struktur Data B'
  FROM ruangan WHERE nama_ruang = 'IF_113';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '18:30:00', '19:20:00', 'Rekayasa Perangkat Lunak untuk Pendidikan P'
  FROM ruangan WHERE nama_ruang = 'IF_113';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '07:00:00', '09:50:00', 'RKA_Interaksi Manusia dan Komputer N'
  FROM ruangan WHERE nama_ruang = 'IF_113';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '10:00:00', '12:50:00', 'Matrikulasi-Pemrograman Python  A'
  FROM ruangan WHERE nama_ruang = 'IF_113';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '13:30:00', '16:20:00', 'Topik Dalam Algoritma dan Teknik Optimasi A'
  FROM ruangan WHERE nama_ruang = 'IF_113';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '18:30:00', '07:50:00', 'Topik Dalam Algoritma dan Teknik Optimasi P'
  FROM ruangan WHERE nama_ruang = 'IF_113';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '18:30:00', '19:20:00', 'Topik Dalam Rekayasa Kebutuhan P'
  FROM ruangan WHERE nama_ruang = 'IF_113';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '07:00:00', '09:50:00', 'IF_Perancangan Perangkat Lunak E'
  FROM ruangan WHERE nama_ruang = 'LP_1';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '10:00:00', '11:50:00', 'IF_Otomata F'
  FROM ruangan WHERE nama_ruang = 'LP_1';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '13:30:00', '16:20:00', 'RKA_Pemrosesan Bahasa Natural N'
  FROM ruangan WHERE nama_ruang = 'LP_1';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '07:00:00', '09:50:00', 'IF_Pemrograman Jaringan D'
  FROM ruangan WHERE nama_ruang = 'LP_1';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '10:00:00', '12:50:00', 'IF_Pemrograman Perangkat Bergerak E'
  FROM ruangan WHERE nama_ruang = 'LP_1';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '13:30:00', '16:20:00', 'IF_Pemrograman Jaringan B'
  FROM ruangan WHERE nama_ruang = 'LP_1';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '10:00:00', '12:50:00', 'IF_Perancangan dan Analisis Algoritma A'
  FROM ruangan WHERE nama_ruang = 'LP_1';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '13:30:00', '17:20:00', 'IF_Struktur Data E'
  FROM ruangan WHERE nama_ruang = 'LP_1';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '07:00:00', '08:50:00', 'IF_Otomata E'
  FROM ruangan WHERE nama_ruang = 'LP_2';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '10:00:00', '12:50:00', 'IF_Big Data T'
  FROM ruangan WHERE nama_ruang = 'LP_2';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '10:00:00', '12:50:00', 'IF_Pemrograman Jaringan A'
  FROM ruangan WHERE nama_ruang = 'LP_2';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '13:30:00', '16:20:00', 'IF_Pembelajaran Mesin D'
  FROM ruangan WHERE nama_ruang = 'LP_2';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '15:30:00', '18:20:00', 'IF_Organisasi Komputer E'
  FROM ruangan WHERE nama_ruang = 'LP_2';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '10:00:00', '12:50:00', 'IF_Pemrograman Perangkat Bergerak C'
  FROM ruangan WHERE nama_ruang = 'LP_2';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '13:30:00', '16:20:00', 'IF_Pemrograman Perangkat Bergerak B'
  FROM ruangan WHERE nama_ruang = 'LP_2';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '10:00:00', '12:50:00', 'IF_Pembelajaran Mesin E'
  FROM ruangan WHERE nama_ruang = 'LP_2';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Senin', '10:00:00', '12:50:00', 'IF_Topik Khusus PKT T (Di Lab RMK PKT)'
  FROM ruangan WHERE nama_ruang = 'Netics';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Selasa', '13:30:00', '16:20:00', 'IF_Pengantar Pengembangan Game Z'
  FROM ruangan WHERE nama_ruang = 'Netics';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '13:30:00', '16:20:00', 'IF_Audit Sistem T'
  FROM ruangan WHERE nama_ruang = 'Netics';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Rabu', '15:30:00', '19:20:00', 'IF_Dasar Pemrograman R (IF dan RPL)'
  FROM ruangan WHERE nama_ruang = 'Netics';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '07:00:00', '10:50:00', 'IF_Sistem Basis Data R'
  FROM ruangan WHERE nama_ruang = 'Netics';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '09:00:00', '11:50:00', 'IF_Aljabar Linier R'
  FROM ruangan WHERE nama_ruang = 'Netics';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '13:30:00', '16:20:00', 'IF_Sistem Digital R'
  FROM ruangan WHERE nama_ruang = 'Netics';

INSERT INTO jadwal (ruangan_id, hari, jam_mulai, jam_selesai, mata_kuliah)
  SELECT id, 'Kamis', '13:30:00', '15:20:00', 'IF, RKA, & IUP_Etika Profesi A'
  FROM ruangan WHERE nama_ruang = 'Aula Handayani';