'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { modulData } from '@/lib/data'
import {
  ArrowLeft, Database, ChevronDown, ChevronUp, Upload,
  Users, Map, Megaphone, ClipboardCheck, BarChart2,
  Wallet, Radio, Heart, UserCircle, LayoutDashboard,
  Loader2, Table2, CheckCircle2, AlertCircle, X,
  Edit3, Globe, Bot, Tv2, Save, Plus, Trash2
} from 'lucide-react'

const iconMap: Record<string, any> = {
  m0:LayoutDashboard, m9:UserCircle, m1:Users, m2:Map, m3:Megaphone,
  m4:ClipboardCheck, m5:BarChart2, m6:Wallet, m7:Radio, m8:Heart,
  m10:Table2, m11:Bot, m12:Tv2,
}
const colorText: Record<string,string> = {
  indigo:'text-indigo-400', purple:'text-purple-400', green:'text-green-400',
  sky:'text-sky-400', pink:'text-pink-400', orange:'text-orange-400',
  teal:'text-teal-400', amber:'text-amber-400', red:'text-red-400',
  blue:'text-blue-400', violet:'text-violet-400', rose:'text-rose-400',
}
const colorBg: Record<string,string> = {
  indigo:'bg-indigo-500/10 border-indigo-500/20', purple:'bg-purple-500/10 border-purple-500/20',
  green:'bg-green-500/10 border-green-500/20', sky:'bg-sky-500/10 border-sky-500/20',
  pink:'bg-pink-500/10 border-pink-500/20', orange:'bg-orange-500/10 border-orange-500/20',
  teal:'bg-teal-500/10 border-teal-500/20', amber:'bg-amber-500/10 border-amber-500/20',
  red:'bg-red-500/10 border-red-500/20', blue:'bg-blue-500/10 border-blue-500/20',
  violet:'bg-violet-500/10 border-violet-500/20', rose:'bg-rose-500/10 border-rose-500/20',
}

// Definisi section per modul: tabel, label, kolom tampil, field form, insertable, publishable
type FieldDef = { key: string; label: string; type: 'text'|'number'|'date'|'select'|'textarea'|'file'; options?: string[]; required?: boolean }
type SectionDef = {
  tabel: string; label: string; cols: string[];
  fields: FieldDef[]; insertable?: boolean; publishable?: boolean; editableFirst?: boolean
}

const modulSections: Record<string, SectionDef[]> = {
  m9: [
    {
      tabel:'kandidat', label:'Identitas Kandidat', cols:['nama_lengkap','dapil','kontestasi','partai_id','nomor_urut'],
      insertable:false, editableFirst:true, publishable:true,
      fields:[
        {key:'nama_lengkap',label:'Nama Lengkap',type:'text',required:true},
        {key:'nama_pendek',label:'Nama Panggilan',type:'text'},
        {key:'inisial',label:'Inisial',type:'text'},
        {key:'tempat_lahir',label:'Tempat Lahir',type:'text'},
        {key:'tgl_lahir',label:'Tanggal Lahir',type:'date'},
        {key:'jenis_kelamin',label:'Jenis Kelamin',type:'select',options:['Laki-laki','Perempuan']},
        {key:'agama',label:'Agama',type:'select',options:['Islam','Kristen','Katolik','Hindu','Buddha','Konghucu']},
        {key:'pendidikan',label:'Pendidikan Terakhir',type:'select',options:['SD','SMP','SMA/SMK','D3','S1','S2','S3']},
        {key:'pekerjaan',label:'Pekerjaan Utama',type:'text'},
        {key:'alamat',label:'Alamat Domisili',type:'textarea'},
        {key:'no_hp',label:'Nomor HP',type:'text'},
        {key:'no_wa',label:'Nomor WhatsApp',type:'text'},
        {key:'email',label:'Email',type:'text'},
        {key:'kontestasi',label:'Jenis Kontestasi',type:'select',options:['dpr_ri','dpd_ri','dprd_provinsi','dprd_kabkota']},
        {key:'dapil',label:'Daerah Pemilihan',type:'text'},
        {key:'nomor_urut',label:'Nomor Urut',type:'number'},
        {key:'target_suara',label:'Target Suara',type:'number'},
        {key:'visi',label:'Visi',type:'textarea'},
        {key:'tagline',label:'Tagline Kampanye',type:'text'},
        {key:'narasi_utama',label:'Narasi Utama Kampanye',type:'textarea'},
      ]
    },
    {
      tabel:'program_kerja', label:'Program Kerja', cols:['nama_program','sektor','wilayah_sasaran','prioritas','status'],
      insertable:true, publishable:true,
      fields:[
        {key:'nama_program',label:'Nama Program',type:'text',required:true},
        {key:'sektor',label:'Sektor',type:'select',options:['Ekonomi','Pendidikan','Infrastruktur','Kesehatan','Sosial','Lingkungan','Pertanian','Hukum','Lainnya']},
        {key:'deskripsi',label:'Deskripsi Program',type:'textarea'},
        {key:'target_terukur',label:'Target Terukur',type:'text'},
        {key:'wilayah_sasaran',label:'Wilayah Sasaran',type:'text'},
        {key:'periode',label:'Periode Pelaksanaan',type:'text'},
        {key:'est_anggaran',label:'Estimasi Anggaran (Rp)',type:'number'},
        {key:'prioritas',label:'Prioritas (1–5)',type:'select',options:['1','2','3','4','5']},
        {key:'status',label:'Status',type:'select',options:['draft','aktif','selesai']},
      ]
    },
    {
      tabel:'jadwal_kampanye', label:'Jadwal Kampanye', cols:['nama_kegiatan','tanggal','jenis','lokasi','status'],
      insertable:true, publishable:false,
      fields:[
        {key:'nama_kegiatan',label:'Nama Kegiatan',type:'text',required:true},
        {key:'tanggal',label:'Tanggal',type:'date'},
        {key:'waktu_mulai',label:'Waktu Mulai',type:'text'},
        {key:'waktu_selesai',label:'Waktu Selesai',type:'text'},
        {key:'jenis',label:'Jenis Kegiatan',type:'select',options:['Rapat Umum','Door to Door','Sosmed','Reses','Debat','Pertemuan Tokoh','Lainnya']},
        {key:'lokasi',label:'Nama Lokasi',type:'text'},
        {key:'alamat_lokasi',label:'Alamat Lokasi',type:'textarea'},
        {key:'kabkota',label:'Kabupaten/Kota',type:'text'},
        {key:'target_audience',label:'Target Audience',type:'text'},
        {key:'estimasi_hadir',label:'Estimasi Jumlah Hadir',type:'number'},
        {key:'realisasi_hadir',label:'Realisasi Hadir',type:'number'},
        {key:'pic',label:'PIC (Penanggung Jawab)',type:'text'},
        {key:'status',label:'Status',type:'select',options:['terjadwal','selesai','batal']},
        {key:'catatan',label:'Catatan',type:'textarea'},
      ]
    },
    {
      tabel:'kompetitor', label:'Database Kompetitor', cols:['nama_lengkap','partai','nomor_urut','elektabilitas','status'],
      insertable:true, publishable:false,
      fields:[
        {key:'nama_lengkap',label:'Nama Lengkap',type:'text',required:true},
        {key:'partai',label:'Partai',type:'text'},
        {key:'nomor_urut',label:'Nomor Urut',type:'number'},
        {key:'basis_pemilih',label:'Basis Pemilih Utama',type:'textarea'},
        {key:'elektabilitas',label:'Perkiraan Elektabilitas (%)',type:'number'},
        {key:'isu_diangkat',label:'Isu yang Diangkat',type:'textarea'},
        {key:'kekuatan',label:'Kekuatan',type:'textarea'},
        {key:'kelemahan',label:'Kelemahan',type:'textarea'},
        {key:'ancaman',label:'Ancaman terhadap Kandidat',type:'textarea'},
        {key:'peluang',label:'Peluang Counter Strategi',type:'textarea'},
        {key:'tim_sukses',label:'Tim Sukses Utama',type:'text'},
        {key:'est_anggaran',label:'Perkiraan Anggaran Kampanye',type:'number'},
        {key:'catatan',label:'Catatan Intelijen Lapangan',type:'textarea'},
        {key:'sumber_info',label:'Sumber Informasi',type:'text'},
      ]
    },
    {
      tabel:'dokumen_legal', label:'Dokumen Legal', cols:['jenis_dokumen','nama_dokumen','tanggal_terbit','penerbit','status'],
      insertable:true, publishable:false,
      fields:[
        {key:'jenis_dokumen',label:'Jenis Dokumen',type:'select',options:['KTP','Ijazah','SKCK','LHKPN','Surat Keterangan Partai','Surat Sehat','Surat Keterangan Bebas Narkoba','Lainnya']},
        {key:'nama_dokumen',label:'Nama Dokumen',type:'text',required:true},
        {key:'nomor_dokumen',label:'Nomor Dokumen',type:'text'},
        {key:'tanggal_terbit',label:'Tanggal Terbit',type:'date'},
        {key:'tanggal_exp',label:'Tanggal Kadaluarsa',type:'date'},
        {key:'penerbit',label:'Penerbit / Instansi',type:'text'},
        {key:'status',label:'Status',type:'select',options:['lengkap','kurang','expired']},
        {key:'catatan',label:'Catatan',type:'textarea'},
      ]
    },
    {
      tabel:'rekam_jejak', label:'Rekam Jejak & Prestasi', cols:['tahun','judul','kategori','institusi'],
      insertable:true, publishable:true,
      fields:[
        {key:'tahun',label:'Tahun',type:'number'},
        {key:'judul',label:'Judul / Nama',type:'text',required:true},
        {key:'kategori',label:'Kategori',type:'select',options:['Jabatan','Penghargaan','Karya','Organisasi','Pendidikan','Lainnya']},
        {key:'deskripsi',label:'Deskripsi',type:'textarea'},
        {key:'institusi',label:'Institusi Terkait',type:'text'},
      ]
    },
    {
      tabel:'tracker_janji', label:'Tracker Janji vs Realisasi', cols:['nama_janji','target_realisasi','status','disampaikan_pada'],
      insertable:true, publishable:true,
      fields:[
        {key:'nama_janji',label:'Nama Janji / Program',type:'text',required:true},
        {key:'disampaikan_pada',label:'Disampaikan Pada (tanggal & kegiatan)',type:'text'},
        {key:'target_realisasi',label:'Target Realisasi',type:'text'},
        {key:'status',label:'Status',type:'select',options:['belum','proses','selesai','gagal']},
        {key:'catatan_publik',label:'Catatan Publik',type:'textarea'},
      ]
    },
  ],
  m1: [
    {
      tabel:'relawan', label:'Database Relawan', cols:['nama','nik','no_hp','kabkota','kecamatan','level','status'],
      insertable:true, publishable:false,
      fields:[
        {key:'nik',label:'NIK',type:'text',required:true},
        {key:'nama',label:'Nama Lengkap',type:'text',required:true},
        {key:'tempat_lahir',label:'Tempat Lahir',type:'text'},
        {key:'tgl_lahir',label:'Tanggal Lahir',type:'date'},
        {key:'jenis_kelamin',label:'Jenis Kelamin',type:'select',options:['Laki-laki','Perempuan']},
        {key:'no_hp',label:'Nomor HP',type:'text'},
        {key:'no_wa',label:'Nomor WhatsApp',type:'text'},
        {key:'email',label:'Email',type:'text'},
        {key:'alamat',label:'Alamat Lengkap',type:'textarea'},
        {key:'kabkota',label:'Kabupaten/Kota',type:'text'},
        {key:'kecamatan',label:'Kecamatan',type:'text'},
        {key:'kelurahan',label:'Kelurahan',type:'text'},
        {key:'nomor_tps',label:'Nomor TPS Terdaftar',type:'text'},
        {key:'pekerjaan',label:'Pekerjaan',type:'text'},
        {key:'pendidikan',label:'Pendidikan Terakhir',type:'select',options:['SD','SMP','SMA/SMK','D3','S1','S2','S3']},
        {key:'level',label:'Level Hierarki',type:'select',options:['korkot','korcam','korkel','kortps','relawan'],required:true},
        {key:'posko_id',label:'Posko Induk (ID)',type:'text'},
        {key:'sumber_rekrut',label:'Sumber Rekrut',type:'select',options:['referral','walk-in','sosmed','kenalan','lainnya']},
        {key:'status',label:'Status',type:'select',options:['aktif','nonaktif','blacklist']},
        {key:'catatan',label:'Catatan Khusus',type:'textarea'},
      ]
    },
    {
      tabel:'posko', label:'Database Posko', cols:['nama_posko','alamat','kabkota','kecamatan','kapasitas','status'],
      insertable:true, publishable:false,
      fields:[
        {key:'nama_posko',label:'Nama Posko',type:'text',required:true},
        {key:'alamat',label:'Alamat Lengkap',type:'textarea'},
        {key:'kabkota',label:'Kabupaten/Kota',type:'text'},
        {key:'kecamatan',label:'Kecamatan',type:'text'},
        {key:'kelurahan',label:'Kelurahan',type:'text'},
        {key:'koordinat_gps',label:'Koordinat GPS',type:'text'},
        {key:'pic',label:'PIC Posko',type:'text'},
        {key:'kapasitas',label:'Kapasitas (orang)',type:'number'},
        {key:'fasilitas',label:'Fasilitas Tersedia',type:'textarea'},
        {key:'jadwal_ops',label:'Jadwal Operasional',type:'text'},
        {key:'status',label:'Status',type:'select',options:['aktif','tutup','sementara']},
        {key:'catatan',label:'Catatan',type:'textarea'},
      ]
    },
    {
      tabel:'absensi', label:'Absensi Relawan', cols:['tanggal','hadir','tugas','posko_id'],
      insertable:true, publishable:false,
      fields:[
        {key:'tanggal',label:'Tanggal',type:'date',required:true},
        {key:'waktu_checkin',label:'Waktu Check-in',type:'text'},
        {key:'waktu_checkout',label:'Waktu Check-out',type:'text'},
        {key:'jenis_kegiatan',label:'Jenis Kegiatan Hari Ini',type:'text'},
        {key:'keterangan',label:'Keterangan',type:'text'},
        {key:'status',label:'Status',type:'select',options:['hadir','izin','absen']},
      ]
    },
    {
      tabel:'tugas', label:'Manajemen Tugas', cols:['judul','jenis','deadline','prioritas','status','poin_reward'],
      insertable:true, publishable:false,
      fields:[
        {key:'judul',label:'Judul Tugas',type:'text',required:true},
        {key:'deskripsi',label:'Deskripsi Detail',type:'textarea'},
        {key:'jenis',label:'Jenis',type:'select',options:['canvassing','distribusi materi','jaga posko','sosmed','lainnya']},
        {key:'deadline',label:'Deadline',type:'date'},
        {key:'prioritas',label:'Prioritas',type:'select',options:['rendah','sedang','tinggi']},
        {key:'status',label:'Status',type:'select',options:['belum','sedang','selesai','gagal']},
        {key:'poin_reward',label:'Poin Reward',type:'number'},
        {key:'catatan_hasil',label:'Catatan Hasil',type:'textarea'},
      ]
    },
    {
      tabel:'laporan_canvassing', label:'Laporan Canvassing Harian', cols:['tanggal','kabkota','kecamatan','pintu_dikunjungi','pendukung_pasti','undecided'],
      insertable:true, publishable:false,
      fields:[
        {key:'tanggal',label:'Tanggal',type:'date',required:true},
        {key:'kabkota',label:'Kabupaten/Kota',type:'text'},
        {key:'kecamatan',label:'Kecamatan',type:'text'},
        {key:'kelurahan',label:'Kelurahan',type:'text'},
        {key:'pintu_dikunjungi',label:'Jumlah Pintu Dikunjungi',type:'number'},
        {key:'pendukung_pasti',label:'Pendukung Pasti',type:'number'},
        {key:'undecided',label:'Undecided',type:'number'},
        {key:'penolak',label:'Penolak',type:'number'},
        {key:'tidak_ada',label:'Tidak Ada di Rumah',type:'number'},
        {key:'isu_utama',label:'Isu Paling Banyak Disampaikan',type:'textarea'},
        {key:'kendala',label:'Kendala Lapangan',type:'textarea'},
        {key:'catatan',label:'Catatan Khusus',type:'textarea'},
      ]
    },
    {
      tabel:'broadcast_wa', label:'Broadcast WhatsApp', cols:['judul','total_target','total_terkirim','jadwal_kirim','status'],
      insertable:true, publishable:true,
      fields:[
        {key:'judul',label:'Judul Pesan',type:'text',required:true},
        {key:'isi_pesan',label:'Isi Pesan',type:'textarea',required:true},
        {key:'jadwal_kirim',label:'Jadwal Kirim',type:'date'},
        {key:'status',label:'Status',type:'select',options:['draft','terjadwal','terkirim','gagal']},
      ]
    },
  ],
  m2: [
    {
      tabel:'tps', label:'Data TPS', cols:['kode_tps','nama_tps','kabkota','kecamatan','dpt_count','target_suara'],
      insertable:true, publishable:false,
      fields:[
        {key:'kode_tps',label:'Nomor TPS',type:'text',required:true},
        {key:'nama_tps',label:'Nama TPS',type:'text'},
        {key:'kabkota',label:'Kabupaten/Kota',type:'text'},
        {key:'kecamatan',label:'Kecamatan',type:'text'},
        {key:'kelurahan',label:'Kelurahan',type:'text'},
        {key:'alamat_tps',label:'Alamat TPS',type:'textarea'},
        {key:'koordinat_gps',label:'Koordinat GPS',type:'text'},
        {key:'dpt_l',label:'DPT Laki-laki',type:'number'},
        {key:'dpt_p',label:'DPT Perempuan',type:'number'},
        {key:'dpt_count',label:'DPT Total',type:'number'},
        {key:'target_suara',label:'Target Suara Kandidat',type:'number'},
        {key:'status_coverage',label:'Status Coverage',type:'select',options:['belum','sebagian','penuh']},
        {key:'catatan',label:'Catatan Lapangan',type:'textarea'},
      ]
    },
    {
      tabel:'pemilih', label:'Data Pemilih / DPT', cols:['nama','nik','jenis_kelamin','alamat','kecamatan','status_dukungan'],
      insertable:true, publishable:false,
      fields:[
        {key:'nik',label:'NIK',type:'text',required:true},
        {key:'nama',label:'Nama Lengkap',type:'text',required:true},
        {key:'jenis_kelamin',label:'Jenis Kelamin',type:'select',options:['L','P']},
        {key:'tempat_lahir',label:'Tempat Lahir',type:'text'},
        {key:'tgl_lahir',label:'Tanggal Lahir',type:'date'},
        {key:'alamat',label:'Alamat Lengkap',type:'textarea'},
        {key:'rt_rw',label:'RT/RW',type:'text'},
        {key:'kelurahan',label:'Kelurahan',type:'text'},
        {key:'kecamatan',label:'Kecamatan',type:'text'},
        {key:'kabkota',label:'Kabupaten/Kota',type:'text'},
        {key:'nomor_tps',label:'Nomor TPS',type:'text'},
        {key:'no_hp',label:'Nomor HP',type:'text'},
        {key:'status_dukungan',label:'Status Dukungan',type:'select',options:['pendukung','undecided','penolak','belum dikontak']},
        {key:'catatan',label:'Catatan',type:'textarea'},
      ]
    },
  ],
  m3: [
    {
      tabel:'konten', label:'Kalender Konten', cols:['judul','platform','format','jadwal_post','status'],
      insertable:true, publishable:true,
      fields:[
        {key:'judul',label:'Judul Konten',type:'text',required:true},
        {key:'format',label:'Jenis Konten',type:'select',options:['foto','video','reels','story','carousel','thread','infografis','lainnya']},
        {key:'platform',label:'Platform Target',type:'text'},
        {key:'caption',label:'Caption',type:'textarea'},
        {key:'hashtag',label:'Hashtag',type:'text'},
        {key:'jadwal_post',label:'Tanggal Posting',type:'date'},
        {key:'isu_kampanye',label:'Isu Kampanye yang Diangkat',type:'text'},
        {key:'status',label:'Status',type:'select',options:['draft','review','approved','terjadwal','posted','ditolak']},
        {key:'catatan_revisi',label:'Catatan Revisi',type:'textarea'},
      ]
    },
    {
      tabel:'monitoring_sosmed', label:'Monitoring Sentimen', cols:['tanggal','platform','reach','engagement','followers'],
      insertable:true, publishable:false,
      fields:[
        {key:'tanggal',label:'Tanggal',type:'date',required:true},
        {key:'platform',label:'Platform',type:'select',options:['Instagram','TikTok','Facebook','Twitter','YouTube']},
        {key:'url_konten',label:'URL Konten',type:'text'},
        {key:'penulis',label:'Penulis / Akun',type:'text'},
        {key:'sentimen',label:'Sentimen',type:'select',options:['positif','netral','negatif']},
        {key:'reach',label:'Estimasi Reach',type:'number'},
        {key:'engagement',label:'Total Engagement',type:'number'},
        {key:'followers',label:'Jumlah Followers',type:'number'},
        {key:'kategori_isu',label:'Kategori Isu',type:'text'},
        {key:'perlu_respons',label:'Perlu Respons',type:'select',options:['ya','tidak']},
        {key:'status_respons',label:'Status Respons',type:'select',options:['belum','proses','selesai']},
      ]
    },
  ],
  m5: [
    {
      tabel:'survei', label:'Builder Survei', cols:['judul','target_resp','wilayah','status'],
      insertable:true, publishable:false,
      fields:[
        {key:'judul',label:'Judul Survei',type:'text',required:true},
        {key:'tipe',label:'Tipe',type:'select',options:['internal','eksternal','quick poll']},
        {key:'deskripsi',label:'Deskripsi Tujuan',type:'textarea'},
        {key:'target_resp',label:'Target Jumlah Responden',type:'number'},
        {key:'wilayah',label:'Wilayah Target',type:'text'},
        {key:'tanggal_mulai',label:'Tanggal Mulai',type:'date'},
        {key:'tanggal_selesai',label:'Tanggal Selesai',type:'date'},
        {key:'metode',label:'Metode',type:'select',options:['online','offline','mixed']},
        {key:'status',label:'Status',type:'select',options:['draft','aktif','selesai']},
      ]
    },
    {
      tabel:'tracking_elektabilitas', label:'Tracking Elektabilitas', cols:['tanggal_survei','pct_elektabilitas','jumlah_sampel','lembaga','wilayah'],
      insertable:true, publishable:false,
      fields:[
        {key:'tanggal_survei',label:'Tanggal Survei',type:'date',required:true},
        {key:'pct_elektabilitas',label:'Elektabilitas (%)',type:'number',required:true},
        {key:'margin_error',label:'Margin Error (%)',type:'number'},
        {key:'jumlah_sampel',label:'Jumlah Sampel',type:'number'},
        {key:'metode',label:'Metode Survei',type:'text'},
        {key:'lembaga',label:'Lembaga',type:'select',options:['internal','eksternal']},
        {key:'wilayah',label:'Wilayah',type:'text'},
        {key:'kabkota',label:'Kabupaten Spesifik',type:'text'},
        {key:'catatan',label:'Catatan Metodologi',type:'textarea'},
        {key:'sumber',label:'Sumber',type:'text'},
      ]
    },
    {
      tabel:'simulasi_suara', label:'Simulasi Suara', cols:['nama_skenario','asumsi_partisipasi','proyeksi_total','proyeksi_kursi'],
      insertable:true, publishable:false,
      fields:[
        {key:'nama_skenario',label:'Nama Skenario',type:'text',required:true},
        {key:'asumsi_partisipasi',label:'Asumsi Tingkat Partisipasi (%)',type:'number'},
        {key:'asumsi_konversi',label:'Asumsi Konversi Relawan (%)',type:'number'},
        {key:'proyeksi_total',label:'Proyeksi Suara Total',type:'number'},
        {key:'proyeksi_kursi',label:'Proyeksi Kursi',type:'number'},
        {key:'confidence_level',label:'Confidence Level',type:'select',options:['rendah','sedang','tinggi']},
        {key:'kesimpulan',label:'Kesimpulan & Rekomendasi',type:'textarea'},
      ]
    },
  ],
  m6: [
    {
      tabel:'rab', label:'RAB / Anggaran', cols:['nama_pos','kategori','anggaran','wilayah'],
      insertable:true, publishable:false,
      fields:[
        {key:'nama_pos',label:'Pos Anggaran',type:'text',required:true},
        {key:'kategori',label:'Kategori',type:'select',options:['operasional','alat peraga','SDM','digital','acara','transport','lainnya']},
        {key:'anggaran',label:'Plafon Total (Rp)',type:'number'},
        {key:'wilayah',label:'Wilayah',type:'text'},
        {key:'periode',label:'Periode',type:'text'},
        {key:'keterangan',label:'Keterangan',type:'textarea'},
      ]
    },
    {
      tabel:'transaksi', label:'Pencatatan Transaksi', cols:['jenis','jumlah','keterangan','tanggal'],
      insertable:true, publishable:false,
      fields:[
        {key:'jenis',label:'Tipe',type:'select',options:['pemasukan','pengeluaran'],required:true},
        {key:'tanggal',label:'Tanggal',type:'date',required:true},
        {key:'jumlah',label:'Jumlah (Rp)',type:'number',required:true},
        {key:'keterangan',label:'Deskripsi',type:'textarea'},
        {key:'metode',label:'Metode Pembayaran',type:'select',options:['tunai','transfer','lainnya']},
        {key:'nama_vendor',label:'Nama Vendor / Penerima',type:'text'},
        {key:'status',label:'Status',type:'select',options:['pending','verified','rejected']},
      ]
    },
    {
      tabel:'penyumbang', label:'Database Penyumbang', cols:['nama_lengkap','tipe','jumlah','tanggal','status_validasi'],
      insertable:true, publishable:false,
      fields:[
        {key:'nama_lengkap',label:'Nama Lengkap',type:'text',required:true},
        {key:'tipe',label:'Tipe',type:'select',options:['perseorangan','badan usaha']},
        {key:'nik_npwp',label:'NIK / NPWP',type:'text'},
        {key:'alamat',label:'Alamat',type:'textarea'},
        {key:'jumlah',label:'Jumlah Sumbangan (Rp)',type:'number',required:true},
        {key:'tanggal',label:'Tanggal',type:'date'},
        {key:'metode',label:'Metode Pembayaran',type:'text'},
        {key:'status_validasi',label:'Status Validasi',type:'select',options:['pending','valid','ditolak']},
        {key:'catatan',label:'Catatan',type:'textarea'},
      ]
    },
    {
      tabel:'vendor', label:'Database Vendor', cols:['nama_vendor','kategori','nama_pic','no_hp','rating','status'],
      insertable:true, publishable:false,
      fields:[
        {key:'nama_vendor',label:'Nama Vendor',type:'text',required:true},
        {key:'kategori',label:'Kategori',type:'select',options:['percetakan','catering','sound system','transport','digital','lainnya']},
        {key:'nama_pic',label:'Nama PIC',type:'text'},
        {key:'no_hp',label:'Nomor HP',type:'text'},
        {key:'email',label:'Email',type:'text'},
        {key:'alamat',label:'Alamat',type:'textarea'},
        {key:'no_rekening',label:'Nomor Rekening',type:'text'},
        {key:'nama_bank',label:'Nama Bank',type:'text'},
        {key:'rating',label:'Rating (1–5)',type:'select',options:['1','2','3','4','5']},
        {key:'status',label:'Status',type:'select',options:['aktif','blacklist']},
        {key:'catatan',label:'Catatan',type:'textarea'},
      ]
    },
    {
      tabel:'lppdk', label:'LPPDK', cols:['periode','jenis_laporan','total_penerimaan','total_pengeluaran','status'],
      insertable:true, publishable:true,
      fields:[
        {key:'periode',label:'Periode Laporan',type:'text',required:true},
        {key:'jenis_laporan',label:'Jenis Laporan',type:'select',options:['awal','akhir']},
        {key:'total_penerimaan',label:'Total Penerimaan (Rp)',type:'number'},
        {key:'total_pengeluaran',label:'Total Pengeluaran (Rp)',type:'number'},
        {key:'saldo',label:'Saldo (Rp)',type:'number'},
        {key:'status',label:'Status',type:'select',options:['draft','final','submitted']},
        {key:'deadline_kpu',label:'Deadline KPU',type:'date'},
        {key:'tanggal_submit',label:'Tanggal Submit',type:'date'},
        {key:'catatan_auditor',label:'Catatan Auditor',type:'textarea'},
      ]
    },
  ],
  m7: [
    {
      tabel:'crisis_room', label:'Manajemen Isu & Krisis', cols:['judul','level','status','created_at'],
      insertable:true, publishable:false,
      fields:[
        {key:'judul',label:'Judul Isu',type:'text',required:true},
        {key:'deskripsi',label:'Deskripsi Lengkap',type:'textarea'},
        {key:'sumber',label:'Sumber',type:'select',options:['sosmed','media','lapangan','internal']},
        {key:'url_sumber',label:'URL Sumber',type:'text'},
        {key:'level',label:'Skor Bahaya (1–10)',type:'select',options:['1','2','3','4','5','6','7','8','9','10']},
        {key:'kategori',label:'Kategori',type:'select',options:['hoaks','serangan','kebocoran','teknis','lainnya']},
        {key:'status',label:'Status',type:'select',options:['monitoring','eskalasi','penanganan','selesai']},
        {key:'pic',label:'PIC Penanganan',type:'text'},
        {key:'catatan',label:'Catatan Penanganan',type:'textarea'},
      ]
    },
    {
      tabel:'laporan_harian', label:'Laporan Harian Eksekutif', cols:['tanggal','ringkasan','isu_utama'],
      insertable:true, publishable:true,
      fields:[
        {key:'tanggal',label:'Tanggal',type:'date',required:true},
        {key:'ringkasan',label:'Highlight Hari Ini',type:'textarea'},
        {key:'isu_utama',label:'Catatan Strategis / Isu Utama',type:'textarea'},
      ]
    },
  ],
  m8: [
    {
      tabel:'konstituen', label:'Database Konstituen', cols:['nama','nik','no_hp','kabkota','kecamatan','kategori','status_crm'],
      insertable:true, publishable:false,
      fields:[
        {key:'nik',label:'NIK',type:'text'},
        {key:'nama',label:'Nama Lengkap',type:'text',required:true},
        {key:'jenis_kelamin',label:'Jenis Kelamin',type:'select',options:['L','P']},
        {key:'tempat_lahir',label:'Tempat Lahir',type:'text'},
        {key:'tgl_lahir',label:'Tanggal Lahir',type:'date'},
        {key:'alamat',label:'Alamat Lengkap',type:'textarea'},
        {key:'kabkota',label:'Kabupaten/Kota',type:'text'},
        {key:'kecamatan',label:'Kecamatan',type:'text'},
        {key:'kelurahan',label:'Kelurahan',type:'text'},
        {key:'no_hp',label:'Nomor HP',type:'text'},
        {key:'no_wa',label:'Nomor WhatsApp',type:'text'},
        {key:'email',label:'Email',type:'text'},
        {key:'pekerjaan',label:'Pekerjaan',type:'text'},
        {key:'kategori',label:'Kategori',type:'select',options:['DPT','potensi pemilih','kawan','relasi','tokoh masyarakat','mantan relawan']},
        {key:'status_crm',label:'Status CRM',type:'select',options:['baru','terhubung','aktif','dorman','lost']},
        {key:'tingkat_kedekatan',label:'Tingkat Kedekatan (1–5)',type:'select',options:['1','2','3','4','5']},
        {key:'catatan',label:'Catatan',type:'textarea'},
      ]
    },
    {
      tabel:'aspirasi', label:'Aspirasi & Keluhan', cols:['isi_aspirasi','sektor','status','submitted_at'],
      insertable:true, publishable:false,
      fields:[
        {key:'judul_aspirasi',label:'Judul Aspirasi',type:'text',required:true},
        {key:'isi_aspirasi',label:'Isi Lengkap',type:'textarea',required:true},
        {key:'sektor',label:'Sektor',type:'select',options:['infrastruktur','pendidikan','kesehatan','ekonomi','sosial','lainnya']},
        {key:'wilayah',label:'Wilayah',type:'text'},
        {key:'prioritas',label:'Prioritas',type:'select',options:['rendah','sedang','tinggi']},
        {key:'status',label:'Status',type:'select',options:['masuk','ditinjau','proses','selesai','ditolak']},
        {key:'channel',label:'Channel Masuk',type:'select',options:['langsung','WhatsApp','web','relawan']},
        {key:'catatan',label:'Catatan Tindak Lanjut',type:'textarea'},
      ]
    },
  ],
}

// Tabel referensi read-only
const refTables: SectionDef[] = [
  { tabel:'ref_dapil', label:'Referensi Dapil', cols:['kontestasi','kabkota','nama_dapil','jumlah_kursi','jumlah_tps'], fields:[], insertable:false },
  { tabel:'ref_partai', label:'Referensi Partai', cols:['nomor_urut','nama_lengkap','nama_pendek'], fields:[], insertable:false },
  { tabel:'ref_kabkota', label:'Referensi Kab/Kota', cols:['nama','jumlah_tps','jumlah_dpt'], fields:[], insertable:false },
  { tabel:'ref_anggota_dprd', label:'Anggota DPRD 2024', cols:['kabkota','nama','partai','nama_dapil','suara_sah'], fields:[], insertable:false },
  { tabel:'histori_pemilu', label:'Histori Pemilu 2019', cols:['kabkota','kecamatan','partai','suara','tahun'], fields:[], insertable:false },
]

type ToastType = { type:'ok'|'err'; msg:string } | null

function SectionBlock({ section, kandidatId }: { section: SectionDef; kandidatId: string | null }) {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState<any[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Record<string,string>>({})
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [uploadingCSV, setUploadingCSV] = useState(false)
  const [toast, setToast] = useState<ToastType>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchCount() }, [])

  function showToast(type: 'ok'|'err', msg: string) {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 4000)
  }

  async function fetchCount() {
    const { count: c } = await supabase.from(section.tabel).select('*', { count:'exact', head:true })
    setCount(c || 0)
  }

  async function fetchRows() {
    setLoading(true)
    const { data } = await supabase.from(section.tabel).select(section.cols.join(',')).limit(50)
    setRows(data || [])
    setLoading(false)
  }

  function toggle() {
    if (!open) fetchRows()
    setOpen(p => !p)
  }

  async function handleSave() {
    if (!kandidatId) return showToast('err', 'Login diperlukan')
    setSaving(true)
    const payload: any = { ...formData }
    if (section.tabel !== 'kandidat') payload.kandidat_id = kandidatId

    const { error } = section.editableFirst
      ? await supabase.from(section.tabel).update(payload).eq('id', kandidatId)
      : await supabase.from(section.tabel).insert(payload)

    if (error) showToast('err', error.message)
    else {
      showToast('ok', 'Data berhasil disimpan')
      setShowForm(false)
      setFormData({})
      fetchCount()
      if (open) fetchRows()
    }
    setSaving(false)
  }

  async function handlePublish() {
    setPublishing(true)
    const payload: any = { status: 'published', published_at: new Date().toISOString() }
    const { error } = await supabase.from(section.tabel).update(payload).eq('kandidat_id', kandidatId)
    if (error) showToast('err', error.message)
    else showToast('ok', 'Data berhasil dipublish')
    setPublishing(false)
  }

  async function handleCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCSV(true)
    try {
      const text = await file.text()
      const lines = text.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g,''))
      const records = lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.trim().replace(/"/g,''))
        const obj: any = {}
        headers.forEach((h, i) => { if (vals[i] !== undefined && vals[i] !== '') obj[h] = vals[i] })
        if (kandidatId) obj.kandidat_id = kandidatId
        return obj
      }).filter(r => Object.keys(r).length > 1)
      if (records.length === 0) throw new Error('Tidak ada data valid di CSV')
      const { error } = await supabase.from(section.tabel).insert(records)
      if (error) throw new Error(error.message)
      showToast('ok', `${records.length} baris berhasil diupload`)
      fetchCount()
      if (open) fetchRows()
    } catch (err: any) {
      showToast('err', err.message)
    }
    setUploadingCSV(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const hasForm = section.fields.length > 0

  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[var(--bg-card)]">
        <button onClick={toggle} className="flex items-center gap-2 flex-1 text-left">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
          <span className="text-[12px] font-medium text-[var(--text-primary)]">{section.label}</span>
          <span className="text-[10px] text-[var(--text-muted)] bg-[var(--bg-hover)] border border-[var(--border)] px-1.5 py-0.5 rounded">{count.toLocaleString('id-ID')} baris</span>
          <span className="text-[10px] text-[var(--text-muted)] font-mono hidden sm:block">{section.tabel}</span>
        </button>
        {/* Action buttons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {hasForm && section.insertable && (
            <button onClick={() => setShowForm(p => !p)}
              className="flex items-center gap-1 text-[10px] bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 px-2.5 py-1.5 rounded-lg transition-colors">
              <Plus size={10} /> Tambah
            </button>
          )}
          {hasForm && section.editableFirst && (
            <button onClick={() => setShowForm(p => !p)}
              className="flex items-center gap-1 text-[10px] bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 px-2.5 py-1.5 rounded-lg transition-colors">
              <Edit3 size={10} /> Edit
            </button>
          )}
          {section.insertable && (
            <>
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSV} />
              <button onClick={() => fileRef.current?.click()} disabled={uploadingCSV}
                className="flex items-center gap-1 text-[10px] bg-[var(--bg-hover)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text-secondary)] px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                {uploadingCSV ? <Loader2 size={10} className="animate-spin" /> : <Upload size={10} />} Upload
            </button>
            </>
          )}
          {section.publishable && (
            <button onClick={handlePublish} disabled={publishing}
              className="flex items-center gap-1 text-[10px] bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50">
              {publishing ? <Loader2 size={10} className="animate-spin" /> : <Globe size={10} />} Publish
            </button>
          )}
          <button onClick={toggle} className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
            {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`mx-4 mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] border ${toast.type === 'ok' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {toast.type === 'ok' ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
          <span className="flex-1">{toast.msg}</span>
          <button onClick={() => setToast(null)}><X size={10} /></button>
        </div>
      )}

      {/* Form input */}
      {showForm && hasForm && (
        <div className="border-t border-[var(--border)] p-4 bg-[var(--bg-hover)]">
          <p className="text-[11px] font-semibold text-[var(--text-primary)] mb-3">
            {section.editableFirst ? `Edit ${section.label}` : `Tambah ${section.label}`}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {section.fields.map(f => (
              <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className="text-[10px] font-medium text-[var(--text-secondary)] block mb-1">
                  {f.label}{f.required && <span className="text-red-400 ml-0.5">*</span>}
                </label>
                {f.type === 'textarea' ? (
                  <textarea value={formData[f.key] || ''} onChange={e => setFormData(p => ({...p,[f.key]:e.target.value}))}
                    rows={3}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-[11px] text-[var(--text-primary)] outline-none focus:border-indigo-500 transition-colors resize-none" />
                ) : f.type === 'select' ? (
                  <select value={formData[f.key] || ''} onChange={e => setFormData(p => ({...p,[f.key]:e.target.value}))}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-[11px] text-[var(--text-primary)] outline-none focus:border-indigo-500 transition-colors">
                    <option value="">— Pilih —</option>
                    {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={f.type === 'file' ? 'file' : f.type} value={f.type !== 'file' ? (formData[f.key] || '') : undefined}
                    onChange={e => setFormData(p => ({...p,[f.key]:e.target.value}))}
                    className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2 text-[11px] text-[var(--text-primary)] outline-none focus:border-indigo-500 transition-colors" />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-[11px] font-medium px-4 py-2 rounded-lg transition-colors">
              {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button onClick={() => { setShowForm(false); setFormData({}) }}
              className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] px-3 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--bg-hover)] transition-colors">
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Data table */}
      {open && (
        <div className="border-t border-[var(--border)]">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 size={16} className="animate-spin text-[var(--text-muted)]" />
              <span className="ml-2 text-xs text-[var(--text-muted)]">Memuat...</span>
            </div>
          ) : rows.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-xs text-[var(--text-muted)]">Belum ada data</p>
              {section.insertable && <p className="text-[10px] text-[var(--text-muted)] mt-1">Gunakan form Tambah atau Upload CSV untuk mengisi</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--bg-hover)]">
                    {section.cols.map(c => (
                      <th key={c} className="text-left px-3 py-2 text-[var(--text-muted)] font-medium uppercase tracking-wider whitespace-nowrap">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)]">
                      {section.cols.map(c => (
                        <td key={c} className="px-3 py-2 text-[var(--text-secondary)] whitespace-nowrap max-w-[200px] truncate">
                          {row[c] !== null && row[c] !== undefined ? String(row[c]) : <span className="text-[var(--text-muted)] italic">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length >= 50 && <p className="text-[10px] text-[var(--text-muted)] text-center py-2">Menampilkan 50 baris</p>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface Props { onBack: () => void }

export default function DatabaseCenter({ onBack }: Props) {
  const supabase = createClient()
  const [kandidatId, setKandidatId] = useState<string | null>(null)
  const [openModul, setOpenModul] = useState<string | null>(null)
  const [openRef, setOpenRef] = useState(false)
  const modules = modulData.filter(m => m.id !== 'm0' && m.id !== 'm10' && m.id !== 'm11' && m.id !== 'm12' && modulSections[m.id])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setKandidatId(data.user.id)
    })
  }, [])

  return (
    <div className="space-y-4 animate-slide-up">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
        <ArrowLeft size={13} /> Kembali ke Dashboard
      </button>

      {/* Header */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/8 p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
            <Database size={22} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-1">Database Center</h2>
            <p className="text-sm text-[var(--text-secondary)]">Satu pintu untuk semua data kampanye</p>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-amber-400" /><span className="text-[10px] text-[var(--text-muted)]">Edit — ubah data yang sudah ada</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-indigo-400" /><span className="text-[10px] text-[var(--text-muted)]">Tambah — input data baru via form</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-slate-400" /><span className="text-[10px] text-[var(--text-muted)]">Upload — import CSV massal</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-green-400" /><span className="text-[10px] text-[var(--text-muted)]">Publish — tayangkan ke publik</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modul sections */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[var(--text-primary)]">Data per Modul</p>
        {modules.map(m => {
          const Icon = iconMap[m.id] || Database
          const isOpen = openModul === m.id
          const sections = modulSections[m.id] || []
          const insertableCount = sections.filter(s => s.insertable).length
          const publishableCount = sections.filter(s => s.publishable).length

          return (
            <div key={m.id} className={`rounded-xl border overflow-hidden transition-all ${isOpen ? `${colorBg[m.color]}` : 'border-[var(--border)] bg-[var(--bg-card)]'}`}>
              <button onClick={() => setOpenModul(isOpen ? null : m.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-[var(--bg-hover)] transition-colors">
                <div className={`w-8 h-8 rounded-lg ${colorBg[m.color]} border flex items-center justify-center flex-shrink-0`}>
                  <Icon size={15} className={colorText[m.color]} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-[var(--text-primary)]">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] mr-1">{m.num}</span>
                    {m.name}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    {sections.length} section · {insertableCount} bisa diinput · {publishableCount} bisa dipublish
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {insertableCount > 0 && <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full">Form tersedia</span>}
                  {publishableCount > 0 && <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">Publishable</span>}
                  {isOpen ? <ChevronUp size={13} className="text-[var(--text-muted)]" /> : <ChevronDown size={13} className="text-[var(--text-muted)]" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-2 border-t border-[var(--border)]">
                  <div className="pt-3" />
                  {sections.map(s => (
                    <SectionBlock key={s.tabel} section={s} kandidatId={kandidatId} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Data Referensi */}
      <div>
        <button onClick={() => setOpenRef(p => !p)}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-colors mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
              <Table2 size={15} className="text-slate-400" />
            </div>
            <div className="text-left">
              <p className="text-[12px] font-semibold text-[var(--text-primary)]">Data Referensi</p>
              <p className="text-[10px] text-[var(--text-muted)]">Dapil, partai, kab/kota, anggota DPRD, histori pemilu — read only</p>
            </div>
          </div>
          {openRef ? <ChevronUp size={13} className="text-[var(--text-muted)]" /> : <ChevronDown size={13} className="text-[var(--text-muted)]" />}
        </button>
        {openRef && (
          <div className="space-y-2 pl-2">
            {refTables.map(s => <SectionBlock key={s.tabel} section={s} kandidatId={null} />)}
          </div>
        )}
      </div>
    </div>
  )
}
