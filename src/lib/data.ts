// ─── KANDIDAT ──────────────────────────────────────────────────────────────────
export const candidate = {
  name:        'Andi Rahmatillah, S.E.',
  shortName:   'Andi Rahmatillah',
  title:       'Calon Anggota DPR RI',
  region:      'Dapil Gorontalo',
  party:       '—',
  nomorUrut:   '—' as any,
  initials:    'AR',
  runningMate: '',
  elektabilitas:      0,
  targetSuara:        30,
  targetDate:         '2029-02-14',
  targetDateDisplay:  '14 Februari 2029',
}

// ─── MODUL LIST ────────────────────────────────────────────────────────────────
export const modulData = [
  { id:'m0', num:'00', name:'Dashboard Master',      desc:'Command center — semua modul dalam satu pandang',       color:'indigo', status:'active',  health:100, alerts:0, stats:'10 modul aktif' },
  { id:'m9', num:'09', name:'Profil Calon',           desc:'Identitas, visi misi, program kerja & jadwal kampanye', color:'purple', status:'active',  health:0,   alerts:1, stats:'Profil belum lengkap' },
  { id:'m1', num:'01', name:'Relawan & Posko',        desc:'Database relawan, absensi, tugas & broadcast WA',      color:'green',  status:'active',  health:0,   alerts:3, stats:'0 relawan terdaftar' },
  { id:'m2', num:'02', name:'Pemetaan Pemilih',       desc:'Peta TPS Gorontalo, DPT, segmentasi & canvassing',     color:'sky',    status:'active',  health:0,   alerts:2, stats:'0 TPS terpetakan' },
  { id:'m3', num:'03', name:'Kampanye Digital',       desc:'Konten, sosmed, iklan & monitoring sentimen',          color:'pink',   status:'active',  health:0,   alerts:1, stats:'0 konten terjadwal' },
  { id:'m4', num:'04', name:'Saksi & Quick Count',    desc:'Penugasan saksi, upload C1, agregasi real-time',       color:'orange', status:'standby', health:100, alerts:0, stats:'Aktif hari-H' },
  { id:'m5', num:'05', name:'Survei & Elektabilitas', desc:'Builder survei, tracking elektabilitas & simulasi',    color:'teal',   status:'active',  health:0,   alerts:0, stats:'0 responden' },
  { id:'m6', num:'06', name:'Keuangan & Budget',      desc:'RAB, approval, LPPDK & cost per vote',                color:'amber',  status:'active',  health:0,   alerts:4, stats:'Budget belum diset' },
  { id:'m7', num:'07', name:'War Room',               desc:'Pusat komando, laporan harian & crisis room',          color:'red',    status:'active',  health:100, alerts:2, stats:'0 isu aktif' },
  { id:'m8', num:'08', name:'Konstituen',             desc:'By name by address — DPT, kawan, relasi, potensi',    color:'purple', status:'active',  health:0,   alerts:0, stats:'0 konstituen' },
]

// ─── KABUPATEN / KOTA GORONTALO ────────────────────────────────────────────────
export const kabGorontalo = [
  { id:'gorut',      name:'Gorontalo Utara', dpt:0, tps:0, est_suara:0 },
  { id:'bone',       name:'Bone Bolango',    dpt:0, tps:0, est_suara:0 },
  { id:'bonebol',    name:'Boalemo',         dpt:0, tps:0, est_suara:0 },
  { id:'pohuwato',   name:'Pohuwato',        dpt:0, tps:0, est_suara:0 },
  { id:'gorontalo',  name:'Kab. Gorontalo',  dpt:0, tps:0, est_suara:0 },
  { id:'gortalkota', name:'Kota Gorontalo',  dpt:0, tps:0, est_suara:0 },
]

// ─── EMPTY LIVE DATA (akan diisi dari Supabase) ────────────────────────────────
export const alerts:            any[] = []
export const aktifitasTimeline: any[] = []
export const elektabilitasChart:any[] = []
export const budgetPos:         any[] = []

// ─── FIELD DEFINITIONS PER MODUL ──────────────────────────────────────────────
// Digunakan oleh ModulPage untuk render tabel field + form upload

export const modulFields: Record<string, { section: string; fields: { name: string; type: string; desc: string }[] }[]> = {

  // ── MODUL 9: PROFIL CALON ────────────────────────────────────────────────────
  m9: [
    {
      section: 'Profil lengkap calon',
      fields: [
        { name:'nama_lengkap',        type:'text',     desc:'Nama lengkap dengan gelar resmi' },
        { name:'nama_panggilan',      type:'text',     desc:'Nama yang dipakai di materi kampanye' },
        { name:'nomor_urut',          type:'integer',  desc:'Nomor urut resmi dari KPU' },
        { name:'jenis_pemilu',        type:'enum',     desc:'DPR RI / DPRD Prov / DPRD Kab / Gubernur / Bupati / Walikota' },
        { name:'dapil',               type:'text',     desc:'Nama daerah pemilihan' },
        { name:'partai_pengusung',    type:'text',     desc:'Nama partai resmi pengusung' },
        { name:'koalisi',             type:'text[]',   desc:'Array nama partai koalisi pendukung' },
        { name:'foto_resmi',          type:'file',     desc:'Foto formal untuk dokumen KPU (JPG/PNG)' },
        { name:'foto_kampanye',       type:'file[]',   desc:'Foto-foto untuk materi kampanye' },
        { name:'ttl',                 type:'text',     desc:'Tempat dan tanggal lahir' },
        { name:'agama',               type:'text',     desc:'Agama yang dianut' },
        { name:'pendidikan_terakhir', type:'text',     desc:'Jenjang + nama institusi terakhir' },
        { name:'riwayat_pendidikan',  type:'jsonb[]',  desc:'Array {jenjang, institusi, tahun_masuk, tahun_lulus}' },
        { name:'riwayat_karir',       type:'jsonb[]',  desc:'Array {jabatan, instansi, periode_mulai, periode_selesai}' },
        { name:'organisasi',          type:'jsonb[]',  desc:'Array {nama_org, jabatan, tahun_mulai, tahun_selesai}' },
        { name:'penghargaan',         type:'jsonb[]',  desc:'Array {nama_penghargaan, pemberi, tahun}' },
        { name:'no_hp_publik',        type:'text',     desc:'Nomor HP yang bisa dihubungi publik' },
        { name:'media_sosial',        type:'jsonb',    desc:'{ig, fb, tiktok, x, youtube, wa, website}' },
        { name:'status_petahana',     type:'boolean',  desc:'true jika incumbent / petahana' },
        { name:'pasangan_nama',       type:'text',     desc:'Nama calon wakil (jika ada)' },
      ]
    },
    {
      section: 'Visi, misi & narasi kampanye',
      fields: [
        { name:'visi',                    type:'text',    desc:'Visi resmi versi KPU (max 500 kata)' },
        { name:'misi',                    type:'text[]',  desc:'Array butir-butir misi' },
        { name:'tagline',                 type:'text',    desc:'Tagline kampanye utama' },
        { name:'narasi_singkat_sosmed',   type:'text',    desc:'Bio singkat max 280 karakter untuk sosmed' },
        { name:'key_messages',            type:'jsonb[]', desc:'Array {segmen_pemilih, pesan_utama}' },
        { name:'isu_unggulan',            type:'text[]',  desc:'Array isu utama yang diangkat kampanye' },
        { name:'tone_of_voice',           type:'text',    desc:'Panduan gaya komunikasi & karakter brand' },
      ]
    },
    {
      section: 'Program kerja terstruktur',
      fields: [
        { name:'program_id',       type:'uuid',     desc:'Primary key program' },
        { name:'sektor',           type:'enum',     desc:'Infrastruktur / Pendidikan / Kesehatan / Ekonomi / Sosial / Hukum / Pertanian / dll' },
        { name:'nama_program',     type:'text',     desc:'Nama program kerja' },
        { name:'deskripsi',        type:'text',     desc:'Deskripsi lengkap program' },
        { name:'target_terukur',   type:'text',     desc:'Target konkret & terukur — contoh: Bangun 5 jembatan' },
        { name:'estimasi_biaya',   type:'bigint',   desc:'Estimasi biaya dalam Rupiah' },
        { name:'wilayah_sasaran',  type:'text[]',   desc:'Array kabupaten/kecamatan yang disasar' },
        { name:'periode',          type:'enum',     desc:'100_hari / 1_tahun / 5_tahun' },
        { name:'prioritas',        type:'integer',  desc:'Urutan prioritas 1–10' },
        { name:'dokumen_pendukung',type:'file[]',   desc:'File pendukung program (PDF, PPT)' },
      ]
    },
    {
      section: 'Knowledge base persiapan debat',
      fields: [
        { name:'debat_id',          type:'uuid',    desc:'Primary key' },
        { name:'isu',               type:'text',    desc:'Isu atau pertanyaan yang mungkin muncul di debat' },
        { name:'jawaban',           type:'text',    desc:'Jawaban yang sudah disiapkan' },
        { name:'data_pendukung',    type:'text',    desc:'Angka, fakta, atau kutipan pendukung jawaban' },
        { name:'sumber',            type:'text',    desc:'Sumber data (BPS, Kemenkes, dll)' },
        { name:'kategori',          type:'enum',    desc:'Ekonomi / Pendidikan / Kesehatan / Infrastruktur / Korupsi / dll' },
        { name:'tingkat_kesulitan', type:'enum',    desc:'rendah / sedang / tinggi' },
      ]
    },
    {
      section: 'Analisis profil kompetitor',
      fields: [
        { name:'kompetitor_id',     type:'uuid',    desc:'Primary key' },
        { name:'nama',              type:'text',    desc:'Nama kandidat lawan' },
        { name:'partai',            type:'text',    desc:'Partai pengusung lawan' },
        { name:'nomor_urut',        type:'integer', desc:'Nomor urut lawan' },
        { name:'kekuatan',          type:'text[]',  desc:'Array kekuatan kompetitor' },
        { name:'kelemahan',         type:'text[]',  desc:'Array kelemahan kompetitor' },
        { name:'basis_pemilih',     type:'text',    desc:'Basis massa utama kompetitor' },
        { name:'isu_diangkat',      type:'text[]',  desc:'Isu-isu yang diangkat kompetitor' },
        { name:'elektabilitas_est', type:'decimal', desc:'Estimasi elektabilitas kompetitor (%)' },
        { name:'catatan',           type:'text',    desc:'Catatan analisis tim strategi' },
        { name:'foto',              type:'file',    desc:'Foto kompetitor' },
      ]
    },
    {
      section: 'Dokumen legal kampanye',
      fields: [
        { name:'dokumen_id',    type:'uuid',  desc:'Primary key' },
        { name:'jenis',         type:'enum',  desc:'SK_paslon / LHKPN / ijazah / surat_dukungan_partai / surat_keterangan_sehat / SKCK / dll' },
        { name:'nama_dokumen',  type:'text',  desc:'Nama/judul dokumen' },
        { name:'file',          type:'file',  desc:'File dokumen (PDF/JPG)' },
        { name:'tanggal',       type:'date',  desc:'Tanggal penerbitan dokumen' },
        { name:'penerbit',      type:'text',  desc:'Instansi penerbit' },
        { name:'masa_berlaku',  type:'date',  desc:'Tanggal kadaluarsa (jika ada)' },
        { name:'catatan',       type:'text',  desc:'Catatan tambahan' },
      ]
    },
    {
      section: 'Rekam jejak petahana (incumbent)',
      fields: [
        { name:'jejak_id',         type:'uuid',    desc:'Primary key' },
        { name:'periode_jabatan',  type:'text',    desc:'Contoh: 2019–2024' },
        { name:'jabatan',          type:'text',    desc:'Nama jabatan yang diemban' },
        { name:'instansi',         type:'text',    desc:'Nama instansi/lembaga' },
        { name:'capaian',          type:'text',    desc:'Deskripsi capaian selama menjabat' },
        { name:'indikator',        type:'text',    desc:'Indikator terukur capaian' },
        { name:'foto_dokumentasi', type:'file[]',  desc:'Foto kegiatan / capaian' },
        { name:'video',            type:'file[]',  desc:'Video dokumentasi' },
        { name:'link_berita',      type:'text[]',  desc:'Array URL pemberitaan terkait' },
      ]
    },
    {
      section: 'Tracker janji kampanye vs realisasi',
      fields: [
        { name:'janji_id',     type:'uuid',  desc:'Primary key' },
        { name:'janji',        type:'text',  desc:'Redaksi janji kampanye saat pemilu lalu' },
        { name:'status',       type:'enum',  desc:'selesai / dalam_progres / belum_dimulai / dibatalkan' },
        { name:'alasan',       type:'text',  desc:'Alasan jika dibatalkan atau terlambat' },
        { name:'progres_pct',  type:'integer',desc:'Persentase realisasi 0–100' },
        { name:'bukti',        type:'file[]',desc:'Foto/dokumen bukti realisasi' },
        { name:'tanggal_target',type:'date', desc:'Target penyelesaian' },
        { name:'catatan',      type:'text',  desc:'Catatan progres terkini' },
      ]
    },
    {
      section: 'Portofolio proyek & kebijakan',
      fields: [
        { name:'proyek_id',       type:'uuid',    desc:'Primary key' },
        { name:'nama_proyek',     type:'text',    desc:'Nama proyek/kebijakan' },
        { name:'sektor',          type:'enum',    desc:'Infrastruktur / Sosial / Ekonomi / dll' },
        { name:'lokasi',          type:'text',    desc:'Lokasi proyek (kabupaten/kecamatan)' },
        { name:'koordinat',       type:'point',   desc:'lat,lng untuk tampil di peta' },
        { name:'nilai_anggaran',  type:'bigint',  desc:'Nilai anggaran Rupiah' },
        { name:'manfaat',         type:'text',    desc:'Manfaat yang dirasakan masyarakat' },
        { name:'foto_sebelum',    type:'file[]',  desc:'Foto kondisi sebelum proyek' },
        { name:'foto_sesudah',    type:'file[]',  desc:'Foto kondisi sesudah proyek' },
        { name:'tahun',           type:'integer', desc:'Tahun realisasi proyek' },
      ]
    },
    {
      section: 'Gap analysis persepsi vs kenyataan',
      fields: [
        { name:'gap_id',           type:'uuid',  desc:'Primary key' },
        { name:'isu_persepsi',     type:'text',  desc:'Isu yang dipersepsi negatif oleh publik' },
        { name:'fakta_sebenarnya', type:'text',  desc:'Data/fakta yang berbeda dari persepsi' },
        { name:'sumber_data',      type:'text',  desc:'Sumber fakta (BPS, Kemenkes, BPKP, dll)' },
        { name:'strategi_respons', type:'text',  desc:'Strategi komunikasi untuk meluruskan persepsi' },
        { name:'status',           type:'enum',  desc:'belum_ditangani / sedang_dikomunikasikan / selesai' },
      ]
    },
    {
      section: 'Jadwal kampanye (dipindah dari War Room)',
      fields: [
        { name:'jadwal_id',      type:'uuid',      desc:'Primary key' },
        { name:'tanggal',        type:'date',      desc:'Tanggal kegiatan' },
        { name:'waktu_mulai',    type:'time',      desc:'Jam mulai' },
        { name:'waktu_selesai',  type:'time',      desc:'Jam selesai' },
        { name:'jenis_kegiatan', type:'enum',      desc:'kunjungan / kampanye_terbuka / debat / rapat / media / pelatihan_relawan / dll' },
        { name:'lokasi',         type:'text',      desc:'Nama lokasi kegiatan' },
        { name:'koordinat',      type:'point',     desc:'GPS lokasi untuk peta & navigasi' },
        { name:'kabupaten',      type:'text',      desc:'Kabupaten/kota tempat kegiatan' },
        { name:'pic',            type:'text',      desc:'Penanggung jawab kegiatan' },
        { name:'rundown',        type:'text',      desc:'Urutan acara' },
        { name:'target_hadirin', type:'integer',   desc:'Estimasi jumlah hadirin' },
        { name:'konten_linked',  type:'uuid[]',    desc:'ID konten Modul 3 yang terhubung ke jadwal ini' },
        { name:'catatan',        type:'text',      desc:'Catatan tambahan' },
        { name:'foto_kegiatan',  type:'file[]',    desc:'Foto dokumentasi pasca kegiatan' },
      ]
    },
  ],

  // ── MODUL 1: RELAWAN & POSKO ─────────────────────────────────────────────────
  m1: [
    {
      section: 'Database relawan terpusat',
      fields: [
        { name:'relawan_id',       type:'uuid',    desc:'Primary key' },
        { name:'nik',              type:'text',    desc:'16 digit NIK KTP (unique)' },
        { name:'nama_lengkap',     type:'text',    desc:'Nama sesuai KTP' },
        { name:'nama_panggilan',   type:'text',    desc:'Nama panggilan sehari-hari' },
        { name:'no_hp',            type:'text',    desc:'Nomor WhatsApp aktif' },
        { name:'foto',             type:'file',    desc:'Foto wajah (JPG/PNG)' },
        { name:'jenis_kelamin',    type:'enum',    desc:'L / P' },
        { name:'tanggal_lahir',    type:'date',    desc:'–' },
        { name:'alamat_lengkap',   type:'text',    desc:'Alamat sesuai KTP' },
        { name:'provinsi',         type:'text',    desc:'–' },
        { name:'kabupaten',        type:'text',    desc:'–' },
        { name:'kecamatan',        type:'text',    desc:'–' },
        { name:'kelurahan',        type:'text',    desc:'–' },
        { name:'rt',               type:'text',    desc:'–' },
        { name:'rw',               type:'text',    desc:'–' },
        { name:'nomor_tps',        type:'text',    desc:'TPS tempat relawan terdaftar sebagai pemilih' },
        { name:'pekerjaan',        type:'text',    desc:'–' },
        { name:'pendidikan',       type:'enum',    desc:'SD / SMP / SMA / D3 / S1 / S2 / S3' },
        { name:'organisasi',       type:'text[]',  desc:'Array organisasi yang diikuti' },
        { name:'sumber_rekrut',    type:'enum',    desc:'mandiri / rekomendasi / partai / komunitas / sosmed' },
        { name:'tanggal_bergabung',type:'date',    desc:'–' },
        { name:'status_aktif',     type:'boolean', desc:'true = aktif, false = nonaktif' },
        { name:'catatan',          type:'text',    desc:'Catatan khusus tentang relawan' },
      ]
    },
    {
      section: 'Hierarki tim & role-based access',
      fields: [
        { name:'level_hierarki',  type:'enum',   desc:'korkot / korcam / korkel / korting / relawan / saksi' },
        { name:'atasan_id',       type:'uuid',   desc:'FK ke relawan_id atasan langsung (self-referencing)' },
        { name:'wilayah_tugas',   type:'text',   desc:'Kota/kecamatan/kelurahan yang menjadi tanggung jawab' },
        { name:'jumlah_anak_buah',type:'integer',desc:'Dihitung otomatis dari relawan yang memiliki atasan_id ini' },
      ]
    },
    {
      section: 'Absensi via QR code & GPS',
      fields: [
        { name:'absensi_id',     type:'uuid',        desc:'Primary key' },
        { name:'relawan_id',     type:'uuid',        desc:'FK ke relawan' },
        { name:'tanggal',        type:'date',        desc:'–' },
        { name:'waktu_checkin',  type:'timestamptz', desc:'Waktu check-in' },
        { name:'waktu_checkout', type:'timestamptz', desc:'Waktu check-out (opsional)' },
        { name:'lat_checkin',    type:'decimal',     desc:'Latitude GPS saat check-in' },
        { name:'lng_checkin',    type:'decimal',     desc:'Longitude GPS saat check-in' },
        { name:'posko_id',       type:'uuid',        desc:'FK ke posko tempat check-in' },
        { name:'foto_checkin',   type:'file',        desc:'Foto selfie opsional' },
        { name:'keterangan',     type:'text',        desc:'Keterangan kehadiran/ketidakhadiran' },
      ]
    },
    {
      section: 'Distribusi tugas & task management',
      fields: [
        { name:'tugas_id',      type:'uuid',        desc:'Primary key' },
        { name:'judul',         type:'text',        desc:'Judul singkat tugas' },
        { name:'deskripsi',     type:'text',        desc:'Detail instruksi tugas' },
        { name:'jenis',         type:'enum',        desc:'door_to_door / bagi_brosur / pasang_apk / mobilisasi / survei / lainnya' },
        { name:'assignee_id',   type:'uuid[]',      desc:'Array relawan_id yang ditugaskan' },
        { name:'assigner_id',   type:'uuid',        desc:'relawan_id yang memberi tugas' },
        { name:'deadline',      type:'timestamptz', desc:'Batas waktu penyelesaian' },
        { name:'status',        type:'enum',        desc:'belum / proses / selesai / batal' },
        { name:'foto_bukti',    type:'file[]',      desc:'Foto dokumentasi tugas selesai' },
        { name:'catatan_hasil', type:'text',        desc:'Laporan singkat hasil pelaksanaan' },
        { name:'poin',          type:'integer',     desc:'Poin gamifikasi untuk tugas ini' },
      ]
    },
    {
      section: 'Laporan harian relawan',
      fields: [
        { name:'laporan_id',          type:'uuid',  desc:'Primary key' },
        { name:'relawan_id',          type:'uuid',  desc:'FK ke relawan pelapor' },
        { name:'tanggal',             type:'date',  desc:'–' },
        { name:'pintu_dikunjungi',    type:'integer',desc:'Jumlah rumah/pintu yang dikunjungi' },
        { name:'warga_ditemui',       type:'integer',desc:'Jumlah warga yang berhasil ditemui' },
        { name:'pendukung_baru',      type:'integer',desc:'Warga baru yang menyatakan dukungan' },
        { name:'undecided_ditemukan', type:'integer',desc:'Warga yang belum memutuskan pilihan' },
        { name:'lawan_ditemukan',     type:'integer',desc:'Warga yang mendukung kompetitor' },
        { name:'isu_lapangan',        type:'text',  desc:'Temuan isu atau keluhan di lapangan' },
        { name:'foto_kegiatan',       type:'file[]',desc:'Foto dokumentasi kegiatan hari itu' },
        { name:'catatan',             type:'text',  desc:'Catatan tambahan' },
        { name:'wilayah',             type:'text',  desc:'Kelurahan/RT/RW yang dikunjungi' },
      ]
    },
    {
      section: 'Manajemen posko & logistik',
      fields: [
        { name:'posko_id',       type:'uuid',    desc:'Primary key' },
        { name:'nama_posko',     type:'text',    desc:'Nama identifikasi posko' },
        { name:'alamat',         type:'text',    desc:'Alamat lengkap posko' },
        { name:'lat',            type:'decimal', desc:'Latitude GPS' },
        { name:'lng',            type:'decimal', desc:'Longitude GPS' },
        { name:'kabupaten',      type:'text',    desc:'–' },
        { name:'kecamatan',      type:'text',    desc:'–' },
        { name:'pic_id',         type:'uuid',    desc:'FK ke relawan penanggung jawab' },
        { name:'kapasitas',      type:'integer', desc:'Kapasitas maksimal orang' },
        { name:'jam_buka',       type:'time',    desc:'Jam operasional mulai' },
        { name:'jam_tutup',      type:'time',    desc:'Jam operasional selesai' },
        { name:'inventaris',     type:'jsonb[]', desc:'Array {item, jumlah, satuan, kondisi}' },
        { name:'foto_posko',     type:'file[]',  desc:'Foto posko' },
        { name:'status_aktif',   type:'boolean', desc:'–' },
      ]
    },
    {
      section: 'Broadcast WA ke relawan',
      fields: [
        { name:'broadcast_id',   type:'uuid',        desc:'Primary key' },
        { name:'judul',          type:'text',        desc:'Judul pesan broadcast' },
        { name:'isi_pesan',      type:'text',        desc:'Isi pesan yang dikirim' },
        { name:'target',         type:'enum',        desc:'semua / per_level / per_wilayah / per_tugas' },
        { name:'filter_level',   type:'text[]',      desc:'Level hierarki yang ditarget (jika per_level)' },
        { name:'filter_wilayah', type:'text[]',      desc:'Wilayah yang ditarget (jika per_wilayah)' },
        { name:'jadwal_kirim',   type:'timestamptz', desc:'Waktu kirim (kosong = kirim sekarang)' },
        { name:'status',         type:'enum',        desc:'draft / terjadwal / terkirim / gagal' },
        { name:'jumlah_penerima',type:'integer',     desc:'Dihitung otomatis' },
        { name:'jumlah_terkirim',type:'integer',     desc:'Jumlah yang berhasil terkirim' },
        { name:'lampiran',       type:'file[]',      desc:'Foto/dokumen yang dilampirkan ke WA' },
      ]
    },
    {
      section: 'Gamifikasi & poin relawan',
      fields: [
        { name:'poin_id',         type:'uuid',        desc:'Primary key transaksi poin' },
        { name:'relawan_id',      type:'uuid',        desc:'FK ke relawan' },
        { name:'jenis',           type:'enum',        desc:'tugas_selesai / absensi / rekrut_relawan / laporan_harian / bonus' },
        { name:'poin',            type:'integer',     desc:'Jumlah poin (positif = tambah, negatif = kurang)' },
        { name:'keterangan',      type:'text',        desc:'Alasan penambahan/pengurangan poin' },
        { name:'referensi_id',    type:'uuid',        desc:'ID tugas/absensi/rekrutmen yang menghasilkan poin' },
        { name:'waktu',           type:'timestamptz', desc:'Waktu transaksi poin' },
      ]
    },
    {
      section: 'Rekrutmen & onboarding digital',
      fields: [
        { name:'rekrut_id',       type:'uuid',        desc:'Primary key' },
        { name:'link_daftar',     type:'text',        desc:'URL form pendaftaran relawan mandiri' },
        { name:'qr_code',         type:'file',        desc:'QR code untuk scan daftar' },
        { name:'rekruiter_id',    type:'uuid',        desc:'FK relawan yang merekrut' },
        { name:'status_onboard',  type:'enum',        desc:'mendaftar / diverifikasi / orientasi / aktif / ditolak' },
        { name:'tanggal_daftar',  type:'timestamptz', desc:'–' },
        { name:'skor_kuis',       type:'integer',     desc:'Skor kuis orientasi (0–100)' },
        { name:'materi_onboard',  type:'file[]',      desc:'Materi orientasi (PDF, video)' },
      ]
    },
    {
      section: 'Tracking mobilisasi hari-H',
      fields: [
        { name:'mobilisasi_id',  type:'uuid',        desc:'Primary key' },
        { name:'relawan_id',     type:'uuid',        desc:'FK ke relawan' },
        { name:'tps_id',         type:'uuid',        desc:'FK ke TPS yang dijaga' },
        { name:'status',         type:'enum',        desc:'belum_konfirmasi / konfirmasi_hadir / sudah_di_tps / selesai / tidak_hadir' },
        { name:'waktu_tiba',     type:'timestamptz', desc:'Waktu relawan tiba di TPS' },
        { name:'lat_tiba',       type:'decimal',     desc:'GPS saat tiba di TPS' },
        { name:'lng_tiba',       type:'decimal',     desc:'GPS saat tiba di TPS' },
        { name:'foto_tiba',      type:'file',        desc:'Foto selfie di TPS hari-H' },
        { name:'catatan',        type:'text',        desc:'Laporan situasi TPS' },
      ]
    },
    {
      section: 'Surat tugas digital + e-signature',
      fields: [
        { name:'surat_id',       type:'uuid',  desc:'Primary key' },
        { name:'nomor_surat',    type:'text',  desc:'Nomor surat auto-generate (contoh: ST/KO/001/2029)' },
        { name:'relawan_id',     type:'uuid',  desc:'FK ke relawan penerima surat' },
        { name:'jenis_tugas',    type:'text',  desc:'Deskripsi tugas dalam surat' },
        { name:'tanggal_berlaku',type:'date',  desc:'Tanggal surat berlaku' },
        { name:'tanggal_berakhir',type:'date', desc:'Tanggal surat berakhir' },
        { name:'penandatangan',  type:'text',  desc:'Nama yang menandatangani' },
        { name:'esignature',     type:'text',  desc:'Base64 tanda tangan digital' },
        { name:'qr_verifikasi',  type:'text',  desc:'QR code untuk verifikasi keaslian' },
        { name:'file_pdf',       type:'file',  desc:'PDF surat tugas yang digenerate' },
      ]
    },
    {
      section: 'Analitik performa tim lapangan',
      fields: [
        { name:'periode',             type:'text',    desc:'Minggu/bulan yang dianalisis' },
        { name:'relawan_id',          type:'uuid',    desc:'FK ke relawan (atau null untuk agregat tim)' },
        { name:'total_tugas',         type:'integer', desc:'Total tugas yang diassign' },
        { name:'tugas_selesai',       type:'integer', desc:'Total tugas yang diselesaikan' },
        { name:'tingkat_penyelesaian',type:'decimal', desc:'Persentase penyelesaian tugas' },
        { name:'total_absensi',       type:'integer', desc:'Jumlah hari hadir' },
        { name:'total_dpt_disentuh',  type:'integer', desc:'Jumlah DPT yang berhasil dikunjungi' },
        { name:'total_pendukung_baru',type:'integer', desc:'Pendukung baru yang didapat' },
        { name:'total_poin',          type:'integer', desc:'Akumulasi poin gamifikasi' },
        { name:'rank_wilayah',        type:'integer', desc:'Peringkat di antara relawan wilayah' },
      ]
    },
  ],

  // ── MODUL 2: PEMETAAN PEMILIH ────────────────────────────────────────────────
  m2: [
    {
      section: 'Data TPS',
      fields: [
        { name:'tps_id',        type:'uuid',    desc:'Primary key' },
        { name:'nomor_tps',     type:'text',    desc:'Nomor TPS resmi KPU (contoh: 001)' },
        { name:'kelurahan',     type:'text',    desc:'–' },
        { name:'kecamatan',     type:'text',    desc:'–' },
        { name:'kabupaten',     type:'text',    desc:'–' },
        { name:'alamat_tps',    type:'text',    desc:'Alamat fisik lokasi TPS' },
        { name:'lat',           type:'decimal', desc:'Latitude GPS TPS' },
        { name:'lng',           type:'decimal', desc:'Longitude GPS TPS' },
        { name:'jumlah_dpt_l',  type:'integer', desc:'DPT laki-laki' },
        { name:'jumlah_dpt_p',  type:'integer', desc:'DPT perempuan' },
        { name:'jumlah_dpt',    type:'integer', desc:'Total DPT (L+P)' },
        { name:'nama_kpps',     type:'text',    desc:'Nama ketua KPPS' },
        { name:'no_hp_kpps',    type:'text',    desc:'Nomor HP KPPS' },
        { name:'target_suara',  type:'integer', desc:'Target perolehan suara yang ditetapkan' },
        { name:'suara_historis',type:'jsonb',   desc:'{tahun_pemilu: jumlah_suara} — histori perolehan' },
      ]
    },
    {
      section: 'Import & manajemen DPT',
      fields: [
        { name:'pemilih_id',       type:'uuid',  desc:'Primary key' },
        { name:'nik',              type:'text',  desc:'NIK 16 digit dari file DPT KPU' },
        { name:'nama',             type:'text',  desc:'Nama pemilih sesuai DPT' },
        { name:'jenis_kelamin',    type:'enum',  desc:'L / P' },
        { name:'tanggal_lahir',    type:'date',  desc:'–' },
        { name:'alamat',           type:'text',  desc:'Alamat dari DPT' },
        { name:'rt',               type:'text',  desc:'–' },
        { name:'rw',               type:'text',  desc:'–' },
        { name:'kelurahan',        type:'text',  desc:'–' },
        { name:'kecamatan',        type:'text',  desc:'–' },
        { name:'nomor_tps',        type:'text',  desc:'Nomor TPS tempat memilih' },
        { name:'tps_id',           type:'uuid',  desc:'FK ke tabel TPS' },
        { name:'sumber_import',    type:'text',  desc:'Nama file XLS/CSV sumber import' },
        { name:'tanggal_import',   type:'date',  desc:'Kapan data diimport' },
      ]
    },
    {
      section: 'Segmentasi & profiling pemilih',
      fields: [
        { name:'pemilih_id',       type:'uuid',  desc:'FK ke tabel pemilih' },
        { name:'status_dukungan',  type:'enum',  desc:'pendukung_kuat / pendukung_lemah / netral / undecided / lawan' },
        { name:'pekerjaan',        type:'text',  desc:'Pekerjaan pemilih' },
        { name:'komunitas',        type:'text[]',desc:'Organisasi/komunitas yang diikuti' },
        { name:'tokoh_panutan',    type:'text',  desc:'Tokoh yang diikuti/dikagumi' },
        { name:'isu_prioritas',    type:'text[]',desc:'Isu yang paling diperhatikan pemilih ini' },
        { name:'catatan_canvassing',type:'text', desc:'Hasil percakapan saat kunjungan' },
        { name:'tanggal_canvassing',type:'date', desc:'Tanggal terakhir dikunjungi' },
        { name:'canvasser_id',     type:'uuid',  desc:'FK ke relawan yang mengunjungi' },
        { name:'tipe_khusus',      type:'enum',  desc:'normal / dptb / disabilitas / tokoh / pemilih_pemula / lansia' },
      ]
    },
    {
      section: 'Heatmap & target suara per TPS',
      fields: [
        { name:'tps_id',          type:'uuid',    desc:'FK ke TPS' },
        { name:'skor_dukungan',   type:'decimal', desc:'0–100, dihitung dari canvassing' },
        { name:'warna_heatmap',   type:'enum',    desc:'merah / kuning / hijau — dikategorikan otomatis' },
        { name:'target_suara',    type:'integer', desc:'Target suara yang ditetapkan tim' },
        { name:'proyeksi_suara',  type:'integer', desc:'Proyeksi berdasar data canvassing' },
        { name:'coverage_pct',    type:'decimal', desc:'Persentase DPT yang sudah dicanvassing' },
        { name:'last_updated',    type:'timestamptz', desc:'Waktu terakhir data diupdate' },
      ]
    },
    {
      section: 'Analisis hasil Pemilu sebelumnya',
      fields: [
        { name:'histori_id',      type:'uuid',    desc:'Primary key' },
        { name:'tps_id',          type:'uuid',    desc:'FK ke TPS' },
        { name:'tahun_pemilu',    type:'integer', desc:'Tahun pemilu (2024, 2019, dst)' },
        { name:'jenis_pemilu',    type:'text',    desc:'Pileg / Pilpres / Pilkada' },
        { name:'suara_kandidat',  type:'integer', desc:'Jumlah suara kandidat kita' },
        { name:'total_suara_sah', type:'integer', desc:'Total suara sah di TPS' },
        { name:'persentase',      type:'decimal', desc:'Persentase perolehan' },
        { name:'foto_c1',         type:'file',    desc:'Foto form C1 pemilu sebelumnya' },
      ]
    },
    {
      section: 'Canvassing digital door-to-door',
      fields: [
        { name:'canvassing_id',   type:'uuid',        desc:'Primary key' },
        { name:'relawan_id',      type:'uuid',        desc:'FK ke relawan yang melakukan canvassing' },
        { name:'pemilih_id',      type:'uuid',        desc:'FK ke pemilih yang dikunjungi' },
        { name:'tps_id',          type:'uuid',        desc:'FK ke TPS' },
        { name:'waktu',           type:'timestamptz', desc:'Waktu kunjungan' },
        { name:'lat',             type:'decimal',     desc:'GPS lokasi kunjungan' },
        { name:'lng',             type:'decimal',     desc:'GPS lokasi kunjungan' },
        { name:'hasil',           type:'enum',        desc:'mendukung / netral / menolak / tidak_ada_di_rumah / akan_dikunjungi_lagi' },
        { name:'isu_disampaikan', type:'text[]',      desc:'Isu yang disampaikan saat canvassing' },
        { name:'respons_pemilih', type:'text',        desc:'Catatan respons pemilih' },
        { name:'foto',            type:'file',        desc:'Foto bukti kunjungan' },
      ]
    },
    {
      section: 'Prediksi perolehan suara',
      fields: [
        { name:'prediksi_id',     type:'uuid',        desc:'Primary key' },
        { name:'tanggal',         type:'date',        desc:'Tanggal prediksi dibuat' },
        { name:'asumsi_partisipasi',type:'decimal',   desc:'Asumsi tingkat partisipasi pemilih (%)' },
        { name:'konversi_undecided',type:'decimal',   desc:'Asumsi % undecided yang akan memilih kita' },
        { name:'kebocoran',       type:'decimal',     desc:'Asumsi % pendukung yang pindah ke lawan' },
        { name:'total_proyeksi',  type:'integer',     desc:'Total suara yang diproyeksikan' },
        { name:'proyeksi_per_kab',type:'jsonb[]',     desc:'Array {kabupaten, proyeksi_suara}' },
        { name:'confidence_level',type:'enum',        desc:'rendah / sedang / tinggi' },
        { name:'catatan',         type:'text',        desc:'Asumsi dan metodologi' },
      ]
    },
    {
      section: 'Overlay data sosiodemografi',
      fields: [
        { name:'kecamatan',        type:'text',    desc:'Primary key per kecamatan' },
        { name:'total_penduduk',   type:'integer', desc:'Data BPS' },
        { name:'pct_usia_17_25',   type:'decimal', desc:'Persentase pemilih pemula' },
        { name:'pct_usia_26_40',   type:'decimal', desc:'Persentase usia produktif' },
        { name:'pct_usia_41_plus', type:'decimal', desc:'Persentase usia menengah-atas' },
        { name:'pct_pendidikan_sd',type:'decimal', desc:'–' },
        { name:'pct_pendidikan_sma',type:'decimal',desc:'–' },
        { name:'pct_pendidikan_pt', type:'decimal',desc:'–' },
        { name:'mata_pencaharian_dominan',type:'text',desc:'Jenis pekerjaan terbanyak' },
        { name:'indeks_kemiskinan',type:'decimal', desc:'Data BPS' },
        { name:'sumber_data',      type:'text',    desc:'BPS / Disdukcapil / dll' },
        { name:'tahun_data',       type:'integer', desc:'Tahun data sosiodemografi' },
      ]
    },
    {
      section: 'Manajemen pemilih khusus',
      fields: [
        { name:'pemilih_id',    type:'uuid',  desc:'FK ke tabel pemilih' },
        { name:'tipe_khusus',   type:'enum',  desc:'dptb / disabilitas / tokoh_masyarakat / pemilih_pemula / lansia / rantau' },
        { name:'kebutuhan',     type:'text',  desc:'Kebutuhan khusus (contoh: kursi roda, pendamping)' },
        { name:'kontak_keluarga',type:'text', desc:'Nomor kontak keluarga untuk koordinasi' },
        { name:'pic_pendamping',type:'uuid',  desc:'FK ke relawan yang mendampingi hari-H' },
        { name:'catatan',       type:'text',  desc:'Catatan penanganan khusus' },
      ]
    },
  ],

  // ── MODUL 3: KAMPANYE DIGITAL ─────────────────────────────────────────────────
  m3: [
    {
      section: 'Kalender konten terpadu (terhubung Modul 9 jadwal)',
      fields: [
        { name:'konten_id',       type:'uuid',        desc:'Primary key' },
        { name:'judul',           type:'text',        desc:'Judul/nama konten' },
        { name:'jenis',           type:'enum',        desc:'gambar / video / carousel / reel / story / thread / artikel / infografis' },
        { name:'platform',        type:'enum[]',      desc:'ig / fb / tiktok / x / youtube / wa / semua' },
        { name:'caption',         type:'text',        desc:'Teks caption konten' },
        { name:'hashtag',         type:'text[]',      desc:'Array hashtag' },
        { name:'file_konten',     type:'file[]',      desc:'File gambar/video yang akan diposting' },
        { name:'tanggal_posting', type:'timestamptz', desc:'Jadwal publish' },
        { name:'status',          type:'enum',        desc:'draft / review / approved / rejected / published / arsip' },
        { name:'jadwal_linked',   type:'uuid',        desc:'FK ke jadwal kampanye Modul 9 (opsional)' },
        { name:'isu_kampanye',    type:'text',        desc:'Isu kampanye yang diangkat konten ini' },
        { name:'target_segmen',   type:'text[]',      desc:'Segmen pemilih yang disasar' },
        { name:'reviewer_id',     type:'uuid',        desc:'FK ke user reviewer' },
        { name:'approver_id',     type:'uuid',        desc:'FK ke user approver (kandidat/jurkam)' },
        { name:'catatan_revisi',  type:'text',        desc:'Catatan dari reviewer/approver' },
      ]
    },
    {
      section: 'Library aset kampanye',
      fields: [
        { name:'aset_id',       type:'uuid',  desc:'Primary key' },
        { name:'nama',          type:'text',  desc:'Nama aset' },
        { name:'kategori',      type:'enum',  desc:'foto_kandidat / logo / template_desain / video / panduan_brand / materi_cetak / lainnya' },
        { name:'file',          type:'file',  desc:'File aset (JPG, PNG, MP4, AI, PSD, PDF)' },
        { name:'deskripsi',     type:'text',  desc:'Deskripsi penggunaan aset' },
        { name:'tags',          type:'text[]',desc:'Tag untuk pencarian cepat' },
        { name:'versi',         type:'text',  desc:'Versi aset (contoh: v1, v2-final)' },
        { name:'diupload_oleh', type:'uuid',  desc:'FK ke user' },
        { name:'tanggal_upload',type:'date',  desc:'–' },
        { name:'publik',        type:'boolean',desc:'Boleh diakses semua level atau hanya tim inti' },
      ]
    },
    {
      section: 'Monitoring sentimen sosmed',
      fields: [
        { name:'sentimen_id',    type:'uuid',        desc:'Primary key' },
        { name:'platform',       type:'enum',        desc:'twitter / instagram / tiktok / facebook / berita_online' },
        { name:'keyword',        type:'text',        desc:'Kata kunci yang dimonitor' },
        { name:'konten',         type:'text',        desc:'Teks postingan/berita yang terdeteksi' },
        { name:'url',            type:'text',        desc:'Link sumber' },
        { name:'penulis',        type:'text',        desc:'Username/nama penulis' },
        { name:'sentimen',       type:'enum',        desc:'positif / negatif / netral' },
        { name:'skor_sentimen',  type:'decimal',     desc:'-1.0 (sangat negatif) s/d 1.0 (sangat positif)' },
        { name:'engagement',     type:'integer',     desc:'Likes + comments + shares' },
        { name:'waktu_deteksi',  type:'timestamptz', desc:'–' },
        { name:'ditandai',       type:'boolean',     desc:'Apakah perlu tindakan dari tim' },
      ]
    },
    {
      section: 'Dashboard analitik iklan Meta & TikTok',
      fields: [
        { name:'iklan_id',       type:'uuid',    desc:'Primary key' },
        { name:'platform',       type:'enum',    desc:'meta / tiktok / google / youtube' },
        { name:'nama_campaign',  type:'text',    desc:'Nama campaign iklan' },
        { name:'periode_mulai',  type:'date',    desc:'–' },
        { name:'periode_selesai',type:'date',    desc:'–' },
        { name:'budget',         type:'bigint',  desc:'Total budget iklan (Rupiah)' },
        { name:'spend',          type:'bigint',  desc:'Budget yang sudah terpakai' },
        { name:'reach',          type:'integer', desc:'Jumlah orang yang dijangkau' },
        { name:'impressions',    type:'integer', desc:'Total tayang' },
        { name:'clicks',         type:'integer', desc:'Total klik' },
        { name:'ctr',            type:'decimal', desc:'Click-through rate (%)' },
        { name:'cpm',            type:'decimal', desc:'Cost per mille (Rp per 1000 tayang)' },
        { name:'target_wilayah', type:'text[]',  desc:'Wilayah targeting iklan' },
        { name:'target_demografi',type:'jsonb',  desc:'{usia_min, usia_max, gender, minat}' },
      ]
    },
    {
      section: 'Tracking berita & media monitoring',
      fields: [
        { name:'berita_id',      type:'uuid',        desc:'Primary key' },
        { name:'judul',          type:'text',        desc:'Judul berita' },
        { name:'media',          type:'text',        desc:'Nama media (contoh: Detik, Kompas, GorontaloPost)' },
        { name:'url',            type:'text',        desc:'Link berita' },
        { name:'tanggal',        type:'date',        desc:'Tanggal terbit' },
        { name:'sentimen',       type:'enum',        desc:'positif / negatif / netral' },
        { name:'topik',          type:'text[]',      desc:'Topik yang dibahas' },
        { name:'subjek',         type:'enum',        desc:'kandidat_kita / kompetitor / keduanya / umum' },
        { name:'screenshot',     type:'file',        desc:'Screenshot berita' },
        { name:'catatan',        type:'text',        desc:'Analisis singkat tim' },
      ]
    },
    {
      section: 'Manajemen influencer & buzzer',
      fields: [
        { name:'influencer_id',   type:'uuid',    desc:'Primary key' },
        { name:'nama',            type:'text',    desc:'Nama lengkap' },
        { name:'tipe',            type:'enum',    desc:'influencer / buzzer / media_partner / tokoh_masyarakat' },
        { name:'platform_utama',  type:'enum',    desc:'ig / tiktok / x / youtube / fb' },
        { name:'username',        type:'text',    desc:'Username di platform utama' },
        { name:'no_hp',           type:'text',    desc:'Nomor WA untuk koordinasi' },
        { name:'jumlah_follower', type:'bigint',  desc:'Jumlah pengikut' },
        { name:'engagement_rate', type:'decimal', desc:'Rata-rata engagement rate (%)' },
        { name:'tarif_per_post',  type:'bigint',  desc:'Honorarium per postingan (Rupiah)' },
        { name:'niche',           type:'text[]',  desc:'Topik spesialisasi (politik, lokal, dll)' },
        { name:'status_kerjasama',type:'enum',    desc:'prospek / negosiasi / aktif / selesai / blacklist' },
        { name:'brief_konten',    type:'text',    desc:'Brief yang diberikan ke influencer' },
        { name:'deadline_posting',type:'date',    desc:'Batas waktu posting' },
        { name:'bukti_posting',   type:'file[]',  desc:'Screenshot bukti postingan' },
        { name:'honor_id',        type:'uuid',    desc:'FK ke transaksi pembayaran Modul 6' },
      ]
    },
    {
      section: 'Analisis kompetitor digital',
      fields: [
        { name:'kompetitor_id',     type:'uuid',    desc:'FK ke kompetitor di Modul 9' },
        { name:'platform',          type:'enum',    desc:'ig / tiktok / x / youtube / fb' },
        { name:'username',          type:'text',    desc:'Akun sosmed kompetitor' },
        { name:'follower_count',    type:'integer', desc:'Jumlah followers saat ini' },
        { name:'follower_growth',   type:'integer', desc:'Pertumbuhan follower minggu ini' },
        { name:'post_frequency',    type:'decimal', desc:'Rata-rata posting per hari' },
        { name:'avg_engagement',    type:'decimal', desc:'Rata-rata engagement per post' },
        { name:'topik_dominan',     type:'text[]',  desc:'Isu/topik yang sering diangkat' },
        { name:'tanggal_analisis',  type:'date',    desc:'Tanggal data diambil' },
        { name:'catatan',           type:'text',    desc:'Analisis tim strategi digital' },
      ]
    },
    {
      section: 'AI generator konten kampanye',
      fields: [
        { name:'generate_id',    type:'uuid',  desc:'Primary key' },
        { name:'prompt',         type:'text',  desc:'Instruksi ke AI' },
        { name:'platform',       type:'enum',  desc:'Platform tujuan konten' },
        { name:'isu',            type:'text',  desc:'Isu kampanye yang diangkat' },
        { name:'tone',           type:'enum',  desc:'formal / santai / inspiratif / informatif / humor' },
        { name:'output',         type:'text',  desc:'Hasil generate dari AI' },
        { name:'status',         type:'enum',  desc:'draft / digunakan / dibuang' },
        { name:'konten_id',      type:'uuid',  desc:'FK ke konten jika output digunakan' },
      ]
    },
    {
      section: 'Deteksi isu viral & crisis management',
      fields: [
        { name:'krisis_id',       type:'uuid',        desc:'Primary key' },
        { name:'judul',           type:'text',        desc:'Ringkasan isu/krisis' },
        { name:'sumber',          type:'enum',        desc:'twitter / instagram / berita / lapangan / internal' },
        { name:'url_sumber',      type:'text',        desc:'Link sumber isu' },
        { name:'deskripsi',       type:'text',        desc:'Deskripsi lengkap isu' },
        { name:'skor_bahaya',     type:'integer',     desc:'Skala 1–10 (10 = sangat berbahaya)' },
        { name:'status',          type:'enum',        desc:'baru / ditangani / eskalasi / selesai' },
        { name:'template_respons',type:'text',        desc:'Draft respons yang bisa langsung diedit' },
        { name:'pic_id',          type:'uuid',        desc:'FK ke user yang menangani' },
        { name:'screenshot',      type:'file[]',      desc:'Bukti screenshot isu' },
        { name:'waktu_deteksi',   type:'timestamptz', desc:'–' },
        { name:'waktu_selesai',   type:'timestamptz', desc:'Kapan isu dinyatakan selesai' },
      ]
    },
  ],

  // ── MODUL 4: SAKSI & QUICK COUNT ─────────────────────────────────────────────
  m4: [
    {
      section: 'Database & penugasan saksi TPS',
      fields: [
        { name:'saksi_id',        type:'uuid',  desc:'Primary key (relawan yang berperan sebagai saksi)' },
        { name:'relawan_id',      type:'uuid',  desc:'FK ke tabel relawan' },
        { name:'tps_id',          type:'uuid',  desc:'FK ke TPS yang dijaga' },
        { name:'status_konfirmasi',type:'enum', desc:'belum / konfirmasi_hadir / hadir_di_tps / selesai / tidak_hadir' },
        { name:'surat_mandat',    type:'file',  desc:'PDF surat mandat resmi dari tim kampanye' },
        { name:'briefing_selesai',type:'boolean',desc:'Apakah sudah ikut briefing saksi' },
      ]
    },
    {
      section: 'Upload & digitasi form C1',
      fields: [
        { name:'c1_id',               type:'uuid',        desc:'Primary key' },
        { name:'tps_id',              type:'uuid',        desc:'FK ke TPS' },
        { name:'saksi_id',            type:'uuid',        desc:'FK ke saksi yang upload' },
        { name:'foto_c1',             type:'file',        desc:'Foto form C1 asli dari TPS' },
        { name:'suara_kandidat_kita', type:'integer',     desc:'Perolehan suara kandidat kita' },
        { name:'suara_kompetitor',    type:'jsonb',       desc:'{nama_kandidat: jumlah_suara} per kompetitor' },
        { name:'suara_tidak_sah',     type:'integer',     desc:'Jumlah suara tidak sah' },
        { name:'total_suara_sah',     type:'integer',     desc:'Total suara sah' },
        { name:'total_dpt_hadir',     type:'integer',     desc:'Jumlah pemilih yang hadir' },
        { name:'waktu_upload',        type:'timestamptz', desc:'Waktu foto diupload' },
        { name:'lat_upload',          type:'decimal',     desc:'GPS saat upload' },
        { name:'lng_upload',          type:'decimal',     desc:'GPS saat upload' },
        { name:'status_verifikasi',   type:'enum',        desc:'pending / verified / flagged / anomali' },
        { name:'catatan_anomali',     type:'text',        desc:'Penjelasan jika data dianggap anomali' },
      ]
    },
    {
      section: 'Dashboard quick count real-time',
      fields: [
        { name:'snapshot_id',       type:'uuid',        desc:'Primary key snapshot data' },
        { name:'waktu_snapshot',    type:'timestamptz', desc:'Waktu data diambil' },
        { name:'tps_masuk',         type:'integer',     desc:'Jumlah TPS yang sudah upload C1' },
        { name:'total_tps',         type:'integer',     desc:'Total TPS keseluruhan' },
        { name:'pct_masuk',         type:'decimal',     desc:'Persentase TPS yang sudah masuk' },
        { name:'total_suara_kita',  type:'integer',     desc:'Akumulasi suara kandidat kita' },
        { name:'total_suara_sah',   type:'integer',     desc:'Akumulasi total suara sah' },
        { name:'pct_suara_kita',    type:'decimal',     desc:'Persentase suara kita dari total' },
        { name:'proyeksi_akhir',    type:'integer',     desc:'Proyeksi perolehan akhir berdasar sample' },
      ]
    },
    {
      section: 'Status & komunikasi saksi hari-H',
      fields: [
        { name:'update_id',      type:'uuid',        desc:'Primary key' },
        { name:'saksi_id',       type:'uuid',        desc:'FK ke saksi' },
        { name:'tps_id',         type:'uuid',        desc:'FK ke TPS' },
        { name:'jenis_update',   type:'enum',        desc:'tiba_di_tps / tps_dibuka / mulai_hitung / c1_diupload / selesai / laporan_situasi' },
        { name:'waktu',          type:'timestamptz', desc:'Waktu update dikirim' },
        { name:'keterangan',     type:'text',        desc:'Detail situasi' },
        { name:'foto',           type:'file',        desc:'Foto situasi TPS' },
      ]
    },
    {
      section: 'Deteksi anomali & kecurangan',
      fields: [
        { name:'anomali_id',     type:'uuid',        desc:'Primary key' },
        { name:'tps_id',         type:'uuid',        desc:'FK ke TPS' },
        { name:'jenis_anomali',  type:'enum',        desc:'suara_tidak_masuk_akal / gps_tidak_sesuai / upload_terlambat / data_berbeda_rekapitulasi' },
        { name:'nilai_terlapor', type:'integer',     desc:'Nilai yang dilaporkan' },
        { name:'nilai_ekspektasi',type:'integer',    desc:'Nilai yang seharusnya berdasar rata-rata' },
        { name:'deviasi_pct',    type:'decimal',     desc:'Selisih persentase dari ekspektasi' },
        { name:'status',         type:'enum',        desc:'flagged / dikonfirmasi_valid / terbukti_anomali' },
        { name:'waktu_deteksi',  type:'timestamptz', desc:'–' },
        { name:'ditangani_oleh', type:'uuid',        desc:'FK ke user koordinator' },
      ]
    },
    {
      section: 'Laporan pelanggaran TPS',
      fields: [
        { name:'pelanggaran_id',  type:'uuid',        desc:'Primary key' },
        { name:'tps_id',          type:'uuid',        desc:'FK ke TPS' },
        { name:'saksi_id',        type:'uuid',        desc:'FK ke saksi pelapor' },
        { name:'jenis',           type:'enum',        desc:'intimidasi / surat_suara_tercoblos / kpps_memihak / pemilih_ganda / apk_di_tps / lainnya' },
        { name:'deskripsi',       type:'text',        desc:'Penjelasan detail pelanggaran' },
        { name:'foto_bukti',      type:'file[]',      desc:'Foto/video bukti' },
        { name:'waktu_kejadian',  type:'timestamptz', desc:'–' },
        { name:'status',          type:'enum',        desc:'dilaporkan / ditangani_internal / diteruskan_bawaslu / selesai' },
        { name:'nomor_laporan_bawaslu',type:'text',   desc:'Nomor registrasi laporan di Bawaslu' },
      ]
    },
    {
      section: 'Rekap & ekspor hasil akhir',
      fields: [
        { name:'rekap_id',        type:'uuid',  desc:'Primary key' },
        { name:'level',           type:'enum',  desc:'tps / kelurahan / kecamatan / kabupaten / provinsi' },
        { name:'wilayah',         type:'text',  desc:'Nama wilayah' },
        { name:'suara_kita',      type:'integer',desc:'Total suara kandidat kita' },
        { name:'total_suara_sah', type:'integer',desc:'Total suara sah wilayah' },
        { name:'pct_suara',       type:'decimal',desc:'Persentase suara kita' },
        { name:'selisih_vs_kpu',  type:'integer',desc:'Selisih dengan hasil resmi KPU' },
        { name:'file_rekap_pdf',  type:'file',  desc:'File PDF rekapitulasi yang digenerate' },
        { name:'file_rekap_xls',  type:'file',  desc:'File Excel rekapitulasi' },
      ]
    },
  ],

  // ── MODUL 5: SURVEI & ELEKTABILITAS ──────────────────────────────────────────
  m5: [
    {
      section: 'Builder survei & distribusi',
      fields: [
        { name:'survei_id',       type:'uuid',  desc:'Primary key' },
        { name:'judul',           type:'text',  desc:'Judul survei' },
        { name:'tipe',            type:'enum',  desc:'elektabilitas / isu / kepuasan_program / canvassing / exit_poll' },
        { name:'deskripsi',       type:'text',  desc:'Deskripsi tujuan survei' },
        { name:'pertanyaan',      type:'jsonb[]',desc:'Array {id, teks, tipe: pilgan/skala/terbuka, opsi[]}' },
        { name:'target_responden',type:'integer',desc:'Jumlah responden yang ditarget' },
        { name:'wilayah_target',  type:'text[]',desc:'Array kabupaten/kecamatan target' },
        { name:'segmen_target',   type:'text[]',desc:'Segmen demografis yang disasar' },
        { name:'tanggal_mulai',   type:'date',  desc:'–' },
        { name:'tanggal_selesai', type:'date',  desc:'–' },
        { name:'link_survei',     type:'text',  desc:'URL publik untuk responden mengisi' },
        { name:'qr_code',         type:'file',  desc:'QR code link survei' },
        { name:'status',          type:'enum',  desc:'draft / aktif / ditutup / diarsipkan' },
        { name:'metode_distribusi',type:'enum[]',desc:'link / wa_blast / qr_code / enumerator' },
      ]
    },
    {
      section: 'Respons & hasil survei',
      fields: [
        { name:'respons_id',      type:'uuid',        desc:'Primary key' },
        { name:'survei_id',       type:'uuid',        desc:'FK ke survei' },
        { name:'jawaban',         type:'jsonb',       desc:'{pertanyaan_id: jawaban_responden}' },
        { name:'kabupaten',       type:'text',        desc:'Wilayah responden' },
        { name:'kecamatan',       type:'text',        desc:'–' },
        { name:'usia',            type:'integer',     desc:'Usia responden' },
        { name:'jenis_kelamin',   type:'enum',        desc:'L / P' },
        { name:'pekerjaan',       type:'text',        desc:'–' },
        { name:'pendidikan',      type:'text',        desc:'–' },
        { name:'waktu_isi',       type:'timestamptz', desc:'Waktu mengisi survei' },
        { name:'sumber',          type:'enum',        desc:'link / wa_blast / qr_code / enumerator' },
        { name:'enumerator_id',   type:'uuid',        desc:'FK ke relawan jika via enumerator' },
      ]
    },
    {
      section: 'Tracking elektabilitas harian',
      fields: [
        { name:'elektabilitas_id', type:'uuid',    desc:'Primary key' },
        { name:'tanggal',          type:'date',    desc:'Tanggal data elektabilitas' },
        { name:'persentase',       type:'decimal', desc:'Persentase elektabilitas' },
        { name:'margin_error',     type:'decimal', desc:'Margin of error (±%)' },
        { name:'jumlah_sampel',    type:'integer', desc:'Jumlah responden' },
        { name:'sumber_data',      type:'enum',    desc:'survei_internal / lembaga_eksternal / simulasi' },
        { name:'nama_lembaga',     type:'text',    desc:'Nama lembaga jika dari eksternal' },
        { name:'wilayah',          type:'text',    desc:'Cakupan survei (nasional/provinsi/dapil)' },
        { name:'catatan_event',    type:'text',    desc:'Event penting yang terjadi hari itu' },
      ]
    },
    {
      section: 'Simulasi penghitungan suara',
      fields: [
        { name:'simulasi_id',         type:'uuid',    desc:'Primary key' },
        { name:'nama_skenario',        type:'text',    desc:'Nama skenario simulasi' },
        { name:'asumsi_partisipasi',   type:'decimal', desc:'Asumsi tingkat kehadiran pemilih (%)' },
        { name:'asumsi_konversi_undecided',type:'decimal',desc:'% undecided yang diprediksi memilih kita' },
        { name:'asumsi_kebocoran',     type:'decimal', desc:'% pendukung yang diprediksi pindah' },
        { name:'proyeksi_suara',       type:'integer', desc:'Total proyeksi perolehan suara' },
        { name:'proyeksi_per_kab',     type:'jsonb[]', desc:'Array {kabupaten, proyeksi}' },
        { name:'confidence_interval',  type:'jsonb',   desc:'{batas_bawah, batas_atas}' },
        { name:'kesimpulan',           type:'enum',    desc:'menang / seri / kalah' },
        { name:'catatan',              type:'text',    desc:'Asumsi dan penjelasan metodologi' },
        { name:'dibuat_pada',          type:'date',    desc:'Tanggal simulasi dibuat' },
      ]
    },
    {
      section: 'Benchmarking vs lembaga eksternal',
      fields: [
        { name:'bench_id',      type:'uuid',    desc:'Primary key' },
        { name:'nama_lembaga',  type:'text',    desc:'Nama lembaga survei eksternal' },
        { name:'tanggal_rilis', type:'date',    desc:'Tanggal survei dirilis' },
        { name:'elektabilitas_kita',type:'decimal',desc:'Hasil elektabilitas kandidat kita versi lembaga tsb' },
        { name:'elektabilitas_kompetitor',type:'jsonb',desc:'{nama: persentase}' },
        { name:'metodologi',    type:'text',    desc:'Metodologi survei (multistage random, dll)' },
        { name:'jumlah_sampel', type:'integer', desc:'–' },
        { name:'margin_error',  type:'decimal', desc:'±%' },
        { name:'link_rilis',    type:'text',    desc:'URL rilis resmi lembaga' },
        { name:'file_rilis',    type:'file',    desc:'PDF rilis survei' },
        { name:'analisis_gap',  type:'text',    desc:'Gap antara survei internal vs eksternal + analisis penyebab' },
      ]
    },
  ],

  // ── MODUL 6: KEUANGAN & BUDGET ───────────────────────────────────────────────
  m6: [
    {
      section: 'Master budget kampanye',
      fields: [
        { name:'budget_id',     type:'uuid',   desc:'Primary key (satu record per kampanye)' },
        { name:'total_dana',    type:'bigint', desc:'Total keseluruhan dana kampanye (Rupiah)' },
        { name:'pos_anggaran',  type:'jsonb[]',desc:'Array {nama_pos, plafon, keterangan}' },
        { name:'tanggal_mulai', type:'date',   desc:'Mulai periode penggunaan anggaran' },
        { name:'tanggal_selesai',type:'date',  desc:'Batas akhir penggunaan anggaran (H+7 pemilu)' },
        { name:'catatan',       type:'text',   desc:'Catatan strategi penggunaan anggaran' },
      ]
    },
    {
      section: 'RAB per kegiatan kampanye',
      fields: [
        { name:'rab_id',         type:'uuid',   desc:'Primary key' },
        { name:'nama_kegiatan',  type:'text',   desc:'Nama kegiatan yang dibiayai' },
        { name:'pos_id',         type:'uuid',   desc:'FK ke pos anggaran di master budget' },
        { name:'wilayah',        type:'text',   desc:'Wilayah pelaksanaan' },
        { name:'tanggal',        type:'date',   desc:'Tanggal kegiatan' },
        { name:'item_rab',       type:'jsonb[]',desc:'Array {nama_item, qty, satuan, harga_satuan, total}' },
        { name:'total_rab',      type:'bigint', desc:'Total RAB (Rupiah)' },
        { name:'status_approval',type:'enum',   desc:'draft / pending / approved / rejected' },
        { name:'pengaju_id',     type:'uuid',   desc:'FK ke user pengaju RAB' },
        { name:'approver_id',    type:'uuid',   desc:'FK ke user yang approve' },
        { name:'tanggal_approval',type:'date',  desc:'–' },
        { name:'catatan_approval',type:'text',  desc:'Catatan dari approver' },
        { name:'template_id',    type:'uuid',   desc:'FK ke template RAB jika menggunakan template' },
      ]
    },
    {
      section: 'Proyeksi cash flow kampanye',
      fields: [
        { name:'cashflow_id',    type:'uuid',   desc:'Primary key' },
        { name:'tanggal',        type:'date',   desc:'Tanggal proyeksi' },
        { name:'pemasukan_plan', type:'bigint', desc:'Rencana penerimaan dana hari itu' },
        { name:'pengeluaran_plan',type:'bigint',desc:'Rencana pengeluaran hari itu' },
        { name:'saldo_awal',     type:'bigint', desc:'Saldo awal hari itu' },
        { name:'saldo_akhir',    type:'bigint', desc:'Proyeksi saldo akhir hari itu' },
        { name:'catatan',        type:'text',   desc:'Kegiatan besar yang mempengaruhi cash flow' },
      ]
    },
    {
      section: 'Transaksi pengeluaran & penerimaan',
      fields: [
        { name:'transaksi_id',   type:'uuid',        desc:'Primary key' },
        { name:'tipe',           type:'enum',        desc:'penerimaan / pengeluaran' },
        { name:'tanggal',        type:'date',        desc:'Tanggal transaksi' },
        { name:'jumlah',         type:'bigint',      desc:'Nominal Rupiah' },
        { name:'deskripsi',      type:'text',        desc:'Keterangan transaksi' },
        { name:'pos_id',         type:'uuid',        desc:'FK ke pos anggaran' },
        { name:'rab_id',         type:'uuid',        desc:'FK ke RAB yang terkait' },
        { name:'vendor_id',      type:'uuid',        desc:'FK ke vendor (jika pengeluaran)' },
        { name:'metode_bayar',   type:'enum',        desc:'transfer / tunai / cek / giro' },
        { name:'rekening_tujuan',type:'text',        desc:'Nomor rekening tujuan transfer' },
        { name:'bukti_file',     type:'file[]',      desc:'Struk/nota/kuitansi/bukti transfer' },
        { name:'wilayah',        type:'text',        desc:'Wilayah kegiatan yang dibiayai' },
        { name:'input_oleh',     type:'uuid',        desc:'FK ke user yang menginput' },
        { name:'approved_oleh',  type:'uuid',        desc:'FK ke user yang approve' },
        { name:'waktu_input',    type:'timestamptz', desc:'–' },
        { name:'status_lppdk',   type:'boolean',     desc:'Sudah masuk laporan LPPDK atau belum' },
      ]
    },
    {
      section: 'Pencatatan sumber dana & penyumbang',
      fields: [
        { name:'penyumbang_id',  type:'uuid',  desc:'Primary key' },
        { name:'transaksi_id',   type:'uuid',  desc:'FK ke transaksi penerimaan' },
        { name:'nama_penyumbang',type:'text',  desc:'Nama lengkap penyumbang' },
        { name:'nik_penyumbang', type:'text',  desc:'NIK (untuk perseorangan)' },
        { name:'npwp',           type:'text',  desc:'NPWP (untuk badan usaha)' },
        { name:'tipe_penyumbang',type:'enum',  desc:'kandidat_sendiri / perseorangan / badan_usaha' },
        { name:'alamat',         type:'text',  desc:'Alamat penyumbang' },
        { name:'no_hp',          type:'text',  desc:'–' },
        { name:'jumlah',         type:'bigint',desc:'Jumlah sumbangan Rupiah' },
        { name:'tanggal',        type:'date',  desc:'–' },
        { name:'validasi_batas', type:'boolean',desc:'Apakah sudah divalidasi tidak melebihi batas legal' },
      ]
    },
    {
      section: 'Manajemen vendor & kontrak',
      fields: [
        { name:'vendor_id',      type:'uuid',  desc:'Primary key' },
        { name:'nama_vendor',    type:'text',  desc:'Nama perusahaan/perorangan' },
        { name:'kategori',       type:'enum',  desc:'percetakan / katering / sound_sistem / konveksi / digital_agency / transportasi / event_organizer / konsultan / lainnya' },
        { name:'no_hp',          type:'text',  desc:'–' },
        { name:'email',          type:'text',  desc:'–' },
        { name:'nama_bank',      type:'text',  desc:'–' },
        { name:'no_rekening',    type:'text',  desc:'–' },
        { name:'atas_nama',      type:'text',  desc:'Nama pemilik rekening' },
        { name:'npwp',           type:'text',  desc:'NPWP vendor' },
        { name:'rating',         type:'decimal',desc:'Rating 1–5 berdasar pengalaman kerjasama' },
        { name:'catatan',        type:'text',  desc:'Catatan kualitas layanan' },
        { name:'dokumen_kontrak',type:'file[]',desc:'File kontrak kerjasama' },
        { name:'status_aktif',   type:'boolean',desc:'Apakah vendor masih aktif digunakan' },
      ]
    },
    {
      section: 'Cost per vote & alokasi per wilayah',
      fields: [
        { name:'cpv_id',         type:'uuid',    desc:'Primary key' },
        { name:'kabupaten',      type:'text',    desc:'Nama kabupaten/kota' },
        { name:'total_spend',    type:'bigint',  desc:'Total pengeluaran di wilayah ini' },
        { name:'proyeksi_suara', type:'integer', desc:'Proyeksi suara dari wilayah ini' },
        { name:'cost_per_vote',  type:'decimal', desc:'Rp per suara = total_spend / proyeksi_suara' },
        { name:'efisiensi',      type:'enum',    desc:'sangat_efisien / efisien / normal / boros' },
        { name:'rekomendasi',    type:'text',    desc:'Rekomendasi realokasi anggaran' },
        { name:'periode',        type:'text',    desc:'Periode analisis' },
      ]
    },
    {
      section: 'Generate LPPDK & kepatuhan KPU',
      fields: [
        { name:'lppdk_id',        type:'uuid',  desc:'Primary key' },
        { name:'jenis_laporan',   type:'enum',  desc:'awal / update / akhir' },
        { name:'periode_mulai',   type:'date',  desc:'–' },
        { name:'periode_selesai', type:'date',  desc:'–' },
        { name:'total_penerimaan',type:'bigint',desc:'Total dana masuk' },
        { name:'total_pengeluaran',type:'bigint',desc:'Total dana keluar' },
        { name:'saldo_akhir',     type:'bigint',desc:'Sisa saldo' },
        { name:'file_lppdk',      type:'file',  desc:'PDF LPPDK format KPU yang digenerate' },
        { name:'tanggal_setor',   type:'date',  desc:'Tanggal diserahkan ke KPU' },
        { name:'status',          type:'enum',  desc:'draft / siap_setor / sudah_disetor / diterima_kpu' },
        { name:'deadline_kpu',    type:'date',  desc:'Batas waktu penyerahan ke KPU' },
        { name:'bukti_terima',    type:'file',  desc:'Bukti tanda terima dari KPU' },
      ]
    },
    {
      section: 'Rekonsiliasi kas & audit trail',
      fields: [
        { name:'rekon_id',       type:'uuid',        desc:'Primary key' },
        { name:'tanggal',        type:'date',        desc:'Tanggal rekonsiliasi' },
        { name:'kas_digital',    type:'bigint',      desc:'Saldo di sistem (dari transaksi digital)' },
        { name:'kas_fisik',      type:'bigint',      desc:'Saldo kas fisik yang dilaporkan koordinator' },
        { name:'selisih',        type:'bigint',      desc:'Perbedaan kas_digital - kas_fisik' },
        { name:'keterangan',     type:'text',        desc:'Penjelasan selisih jika ada' },
        { name:'direkonsiliasi_oleh',type:'uuid',    desc:'FK ke user bendahara' },
        { name:'log_id',         type:'uuid',        desc:'Primary key audit log' },
        { name:'user_id',        type:'uuid',        desc:'Siapa yang melakukan aksi' },
        { name:'aksi',           type:'text',        desc:'Deskripsi aksi (contoh: UPDATE transaksi_id:xxx)' },
        { name:'modul',          type:'text',        desc:'Modul tempat aksi terjadi' },
        { name:'data_sebelum',   type:'jsonb',       desc:'State data sebelum perubahan' },
        { name:'data_sesudah',   type:'jsonb',       desc:'State data sesudah perubahan' },
        { name:'ip_address',     type:'text',        desc:'IP address user' },
        { name:'waktu',          type:'timestamptz', desc:'Tidak bisa dihapus — immutable' },
      ]
    },
  ],

  // ── MODUL 7: WAR ROOM ─────────────────────────────────────────────────────────
  m7: [
    {
      section: 'Dashboard eksekutif 60 detik',
      fields: [
        { name:'widget_config',     type:'jsonb',  desc:'Konfigurasi widget yang di-pin oleh kandidat' },
        { name:'elektabilitas_live',type:'decimal',desc:'Dari Modul 5 — nilai terkini' },
        { name:'relawan_aktif',     type:'integer',desc:'Dari Modul 1 — yang check-in hari ini' },
        { name:'sisa_kas',          type:'bigint', desc:'Dari Modul 6 — saldo real-time' },
        { name:'sentimen_score',    type:'decimal',desc:'Dari Modul 3 — rata-rata sentimen sosmed' },
        { name:'alert_count',       type:'integer',desc:'Dari semua modul — jumlah alert aktif' },
        { name:'agenda_hari_ini',   type:'jsonb[]',desc:'Dari Modul 9 — kegiatan hari ini' },
        { name:'last_refresh',      type:'timestamptz',desc:'Waktu terakhir data direfresh' },
      ]
    },
    {
      section: 'Laporan situasi harian otomatis',
      fields: [
        { name:'laporan_id',         type:'uuid',        desc:'Primary key' },
        { name:'tanggal',            type:'date',        desc:'Tanggal laporan' },
        { name:'ringkasan_kemarin',  type:'text',        desc:'Auto-generate dari aktivitas kemarin' },
        { name:'agenda_hari_ini',    type:'text',        desc:'Kegiatan yang terjadwal hari ini' },
        { name:'alert_penting',      type:'text[]',      desc:'Array alert yang perlu perhatian' },
        { name:'update_elektabilitas',type:'decimal',    desc:'Nilai elektabilitas terkini' },
        { name:'update_relawan',     type:'integer',     desc:'Jumlah relawan aktif' },
        { name:'update_kas',         type:'bigint',      desc:'Sisa kas terkini' },
        { name:'status_kirim',       type:'enum',        desc:'pending / terkirim_wa / terkirim_email / gagal' },
        { name:'penerima_wa',        type:'text[]',      desc:'Array nomor WA penerima laporan' },
        { name:'penerima_email',     type:'text[]',      desc:'Array email penerima laporan' },
        { name:'waktu_kirim',        type:'time',        desc:'Jam otomatis dikirim (default 07:00)' },
      ]
    },
    {
      section: 'Alert & notifikasi kritikal',
      fields: [
        { name:'alert_id',      type:'uuid',        desc:'Primary key' },
        { name:'level',         type:'enum',        desc:'info / warning / critical' },
        { name:'sumber_modul',  type:'text',        desc:'Modul asal alert (m1, m3, m6, dll)' },
        { name:'judul',         type:'text',        desc:'Judul singkat alert' },
        { name:'pesan',         type:'text',        desc:'Detail pesan alert' },
        { name:'aksi_diperlukan',type:'text',       desc:'Tindakan yang perlu diambil' },
        { name:'penerima',      type:'uuid[]',      desc:'Array user_id yang menerima notifikasi' },
        { name:'status',        type:'enum',        desc:'baru / dibaca / ditangani / diabaikan' },
        { name:'waktu_buat',    type:'timestamptz', desc:'–' },
        { name:'waktu_baca',    type:'timestamptz', desc:'–' },
        { name:'waktu_tangani', type:'timestamptz', desc:'–' },
      ]
    },
    {
      section: 'Manajemen isu & respons krisis',
      fields: [
        { name:'isu_id',         type:'uuid',        desc:'Primary key' },
        { name:'judul',          type:'text',        desc:'Judul isu/krisis' },
        { name:'sumber',         type:'enum',        desc:'twitter / instagram / berita / lapangan / internal' },
        { name:'url_sumber',     type:'text',        desc:'Link sumber isu' },
        { name:'deskripsi',      type:'text',        desc:'Deskripsi lengkap' },
        { name:'skor_bahaya',    type:'integer',     desc:'1–10 (10 = sangat berbahaya)' },
        { name:'status',         type:'enum',        desc:'baru / ditangani / eskalasi / selesai' },
        { name:'template_respons',type:'text',       desc:'Draft respons yang bisa langsung diedit & publish' },
        { name:'respons_final',  type:'text',        desc:'Respons yang akhirnya dipublish' },
        { name:'pic_id',         type:'uuid',        desc:'FK ke user penanggung jawab penanganan' },
        { name:'screenshot',     type:'file[]',      desc:'Screenshot bukti isu' },
        { name:'waktu_deteksi',  type:'timestamptz', desc:'–' },
        { name:'waktu_respons',  type:'timestamptz', desc:'Kapan respons dikirim' },
        { name:'waktu_selesai',  type:'timestamptz', desc:'Kapan isu dinyatakan selesai' },
        { name:'durasi_penanganan',type:'integer',   desc:'Menit dari deteksi ke selesai' },
      ]
    },
    {
      section: 'Crisis room hari-H',
      fields: [
        { name:'session_id',     type:'uuid',        desc:'Primary key sesi crisis room' },
        { name:'tanggal',        type:'date',        desc:'Tanggal aktivasi (biasanya hari-H)' },
        { name:'mode',           type:'enum',        desc:'normal / siaga / darurat' },
        { name:'peserta',        type:'uuid[]',      desc:'Array user_id yang aktif di crisis room' },
        { name:'display_config', type:'jsonb',       desc:'Konfigurasi tampilan layar besar (widget yang ditampilkan)' },
        { name:'catatan_realtime',type:'text[]',     desc:'Log catatan situasi yang dibuat selama sesi' },
        { name:'waktu_mulai',    type:'timestamptz', desc:'–' },
        { name:'waktu_selesai',  type:'timestamptz', desc:'–' },
      ]
    },
    {
      section: 'Manajemen akses & audit log',
      fields: [
        { name:'user_id',        type:'uuid',        desc:'Primary key user' },
        { name:'nama',           type:'text',        desc:'–' },
        { name:'email',          type:'text',        desc:'Email login' },
        { name:'role',           type:'enum',        desc:'kandidat / manajer_kampanye / bendahara / koordinator / tim_konten / relawan / saksi / vendor_platform' },
        { name:'kandidat_id',    type:'uuid',        desc:'FK ke kandidat (multi-tenant)' },
        { name:'wilayah_akses',  type:'text',        desc:'Wilayah yang boleh diakses (null = semua)' },
        { name:'modul_akses',    type:'text[]',      desc:'Array modul yang boleh diakses' },
        { name:'last_login',     type:'timestamptz', desc:'–' },
        { name:'status_aktif',   type:'boolean',     desc:'–' },
        { name:'log_aksi',       type:'text',        desc:'Deskripsi aksi yang dilakukan' },
        { name:'log_modul',      type:'text',        desc:'Modul tempat aksi' },
        { name:'log_waktu',      type:'timestamptz', desc:'Immutable — tidak bisa dihapus' },
        { name:'log_ip',         type:'text',        desc:'IP address user' },
      ]
    },
    {
      section: 'Laporan pasca-kampanye (post-mortem)',
      fields: [
        { name:'postmortem_id',      type:'uuid',    desc:'Primary key' },
        { name:'tanggal_buat',       type:'date',    desc:'–' },
        { name:'total_relawan',      type:'integer', desc:'Total relawan yang terlibat' },
        { name:'total_tps_covered',  type:'integer', desc:'TPS yang berhasil dicoverge saksi' },
        { name:'total_canvassing',   type:'integer', desc:'Total DPT yang dicanvassing' },
        { name:'total_pengeluaran',  type:'bigint',  desc:'Total pengeluaran kampanye' },
        { name:'perolehan_suara',    type:'integer', desc:'Hasil akhir perolehan suara' },
        { name:'pct_suara',          type:'decimal', desc:'Persentase perolehan' },
        { name:'menang',             type:'boolean', desc:'true = menang / lolos threshold' },
        { name:'analisis_kemenangan',type:'text',    desc:'Faktor-faktor kemenangan/kekalahan' },
        { name:'rekomendasi',        type:'text',    desc:'Rekomendasi untuk pemilu berikutnya' },
        { name:'file_laporan',       type:'file',    desc:'PDF laporan lengkap pasca-kampanye' },
      ]
    },
  ],

  // ── MODUL 8: KONSTITUEN ───────────────────────────────────────────────────────
  m8: [
    {
      section: 'Database konstituen by name by address',
      fields: [
        { name:'konstituen_id',     type:'uuid',  desc:'Primary key' },
        { name:'nik',               type:'text',  desc:'NIK 16 digit' },
        { name:'nama_lengkap',      type:'text',  desc:'–' },
        { name:'nama_panggilan',    type:'text',  desc:'–' },
        { name:'jenis_kelamin',     type:'enum',  desc:'L / P' },
        { name:'tanggal_lahir',     type:'date',  desc:'–' },
        { name:'alamat_lengkap',    type:'text',  desc:'–' },
        { name:'rt', type:'text', desc:'–' }, { name:'rw', type:'text', desc:'–' },
        { name:'kelurahan',         type:'text',  desc:'–' },
        { name:'kecamatan',         type:'text',  desc:'–' },
        { name:'kabupaten',         type:'text',  desc:'–' },
        { name:'no_hp',             type:'text',  desc:'–' },
        { name:'email',             type:'text',  desc:'–' },
        { name:'pekerjaan',         type:'text',  desc:'–' },
        { name:'pendidikan',        type:'text',  desc:'–' },
        { name:'kategori',          type:'enum',  desc:'dpt / potensi_pemilih / daftar_kawan / relasi / tokoh_masyarakat / mantan_relawan / penerima_program' },
        { name:'tingkat_kedekatan', type:'enum',  desc:'sangat_dekat / dekat / kenalan / baru' },
        { name:'sumber_data',       type:'enum',  desc:'dpt_kpu / input_manual / import_excel / dari_relawan / dari_canvassing' },
        { name:'foto',              type:'file',  desc:'Foto konstituen (opsional)' },
        { name:'catatan',           type:'text',  desc:'Catatan khusus' },
        { name:'tanggal_input',     type:'date',  desc:'–' },
      ]
    },
    {
      section: 'Aspirasi & keluhan konstituen',
      fields: [
        { name:'aspirasi_id',      type:'uuid',  desc:'Primary key' },
        { name:'konstituen_id',    type:'uuid',  desc:'FK ke konstituen' },
        { name:'judul',            type:'text',  desc:'Judul singkat aspirasi/keluhan' },
        { name:'isi',              type:'text',  desc:'Isi aspirasi atau keluhan secara lengkap' },
        { name:'kategori',         type:'enum',  desc:'infrastruktur / pendidikan / kesehatan / ekonomi / sosial / hukum / lingkungan / lainnya' },
        { name:'wilayah',          type:'text',  desc:'Lokasi masalah yang dilaporkan' },
        { name:'foto_kondisi',     type:'file[]',desc:'Foto kondisi yang dikeluhkan' },
        { name:'status',           type:'enum',  desc:'masuk / sedang_ditindaklanjuti / selesai / tidak_relevan' },
        { name:'respons_anggota',  type:'text',  desc:'Respons dari anggota dewan/kandidat' },
        { name:'lampiran',         type:'file[]',desc:'Dokumen pendukung aspirasi' },
        { name:'tanggal_masuk',    type:'date',  desc:'–' },
        { name:'tanggal_respons',  type:'date',  desc:'–' },
        { name:'tanggal_selesai',  type:'date',  desc:'–' },
      ]
    },
    {
      section: 'Manajemen program & bantuan sosial',
      fields: [
        { name:'program_id',       type:'uuid',    desc:'Primary key program bantuan' },
        { name:'nama_program',     type:'text',    desc:'Nama program bantuan' },
        { name:'jenis',            type:'enum',    desc:'beasiswa / bedah_rumah / modal_usaha / alat_pertanian / sembako / pelatihan / lainnya' },
        { name:'deskripsi',        type:'text',    desc:'–' },
        { name:'anggaran',         type:'bigint',  desc:'Total anggaran program' },
        { name:'jumlah_penerima_target',type:'integer',desc:'Target jumlah penerima manfaat' },
        { name:'penerima',         type:'jsonb[]', desc:'Array {konstituen_id, status_terima, tanggal_terima}' },
        { name:'tanggal_mulai',    type:'date',    desc:'–' },
        { name:'tanggal_selesai',  type:'date',    desc:'–' },
        { name:'foto_dokumentasi', type:'file[]',  desc:'Foto seremoni/penyerahan bantuan' },
        { name:'testimoni',        type:'text[]',  desc:'Array kutipan testimoni penerima manfaat' },
        { name:'wilayah',          type:'text',    desc:'Wilayah sasaran program' },
        { name:'status',           type:'enum',    desc:'rencana / berjalan / selesai' },
      ]
    },
    {
      section: 'Laporan kinerja & reses',
      fields: [
        { name:'laporan_id',       type:'uuid',  desc:'Primary key' },
        { name:'jenis',            type:'enum',  desc:'reses / kinerja_bulanan / kinerja_tahunan / akhir_periode' },
        { name:'periode',          type:'text',  desc:'Periode laporan (contoh: Q1 2030)' },
        { name:'rapat_dihadiri',   type:'integer',desc:'Jumlah rapat yang dihadiri' },
        { name:'total_rapat',      type:'integer',desc:'Total rapat yang seharusnya dihadiri' },
        { name:'perda_diperjuangkan',type:'text[]',desc:'Array nama perda/regulasi yang diperjuangkan' },
        { name:'aspirasi_ditangani',type:'integer',desc:'Jumlah aspirasi yang berhasil ditangani' },
        { name:'program_dijalankan',type:'integer',desc:'Jumlah program bantuan yang dijalankan' },
        { name:'anggaran_disalurkan',type:'bigint',desc:'Total anggaran daerah yang berhasil disalurkan ke dapil' },
        { name:'foto_kegiatan',    type:'file[]',desc:'Dokumentasi kegiatan selama periode' },
        { name:'file_laporan',     type:'file',  desc:'PDF laporan kinerja lengkap' },
        { name:'status_publikasi', type:'enum',  desc:'draft / dipublikasi_sosmed / dicetak' },
        { name:'jadwal_reses',     type:'jsonb[]',desc:'Array {tanggal, lokasi, tema, foto[]}' },
      ]
    },
  ],
}
