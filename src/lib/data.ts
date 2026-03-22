export const candidate = {
  name: 'ADMIN',
  shortName: 'ADMIN',
  title: 'Belum diisi',
  region: '—',
  party: '—',
  nomorUrut: '—' as any,
  photo: null,
  initials: 'AD',
  runningMate: '',
  elektabilitas: 0,
  elektabilitasDelta: 0,
  targetSuara: 30,
  targetDate: '14 Februari 2029',
  kontestasi: '',
}

export const statsKartu = [
  { label: 'Total Relawan',    value: '0',       delta: 'Belum ada relawan',         trend: 'neutral', color: 'indigo' },
  { label: 'TPS Terpetakan',   value: '0',       delta: 'dari ± 1.800 TPS',          trend: 'neutral', color: 'teal'   },
  { label: 'Dana Tersisa',     value: 'Rp —',    delta: 'Budget belum diset',         trend: 'neutral', color: 'amber'  },
  { label: 'Elektabilitas',    value: '—%',      delta: 'Belum ada survei',           trend: 'neutral', color: 'green'  },
]

export const modulData = [
  { id:'m0',num:'00',name:'Dashboard Master',     desc:'Command center — semua modul dalam satu pandang',      color:'indigo',status:'active', health:100,alerts:0,stats:'11 modul aktif' },
  { id:'m9',num:'09',name:'Profil Calon',          desc:'Identitas, visi misi, program kerja & jadwal kampanye', color:'purple',status:'active', health:0,  alerts:0,stats:'Belum ada data profil' },
  { id:'m1',num:'01',name:'Relawan & Posko',       desc:'Database, absensi, tugas & broadcast WA',              color:'green', status:'active', health:0,  alerts:0,stats:'Database relawan & posko' },
  { id:'m2',num:'02',name:'Pemetaan Pemilih',      desc:'Peta TPS Gorontalo, DPT, segmentasi & canvassing',     color:'sky',   status:'active', health:0,  alerts:0,stats:'Peta TPS & pemetaan pemilih' },
  { id:'m3',num:'03',name:'Kampanye Digital',      desc:'Konten, sosmed, iklan & monitoring sentimen',          color:'pink',  status:'active', health:0,  alerts:0,stats:'Konten & monitoring digital' },
  { id:'m4',num:'04',name:'Saksi & Quick Count',   desc:'Penugasan saksi, upload C1, real-time agregasi',       color:'orange',status:'standby',health:100,alerts:0,stats:'Aktif hari-H' },
  { id:'m5',num:'05',name:'Survei & Elektabilitas',desc:'Builder survei, tracking elektabilitas & simulasi',    color:'teal',  status:'active', health:0,  alerts:0,stats:'Survei & tracking elektabilitas' },
  { id:'m6',num:'06',name:'Keuangan & Budget',     desc:'RAB, approval, LPPDK & cost per vote',                color:'amber', status:'active', health:0,  alerts:0,stats:'RAB, transaksi & LPPDK' },
  { id:'m7',num:'07',name:'War Room',              desc:'Pusat komando, laporan harian & crisis room',          color:'red',   status:'active', health:100,alerts:0,stats:'Crisis room & war room' },
  { id:'m10',num:'10',name:'Peta Suara & Referensi', desc:'TPS, DPT, partai, perolehan suara historis & kompetitor', color:'blue',  status:'active', health:0,  alerts:0,stats:'Data historis 2019 tersedia' },
  { id:'m8',num:'08',name:'Konstituen',            desc:'By name by address — DPT, kawan, relasi, potensi',     color:'purple',status:'active', health:0,  alerts:0,stats:'By name by address' },
]

export const alerts: any[] = []

export const aktifitasTimeline: any[] = []

export const elektabilitasChart: any[] = []

export const budgetPos: any[] = []

export const provinsiGorontalo = [
  { id: 'gorut',       name: 'Gorontalo Utara', dpt: 92601,  tps: 245, est_suara: 0 },
  { id: 'bone',        name: 'Bone Bolango',     dpt: 124546, tps: 294, est_suara: 0 },
  { id: 'bonebol',     name: 'Boalemo',          dpt: 108411, tps: 242, est_suara: 0 },
  { id: 'pohuwato',    name: 'Pohuwato',          dpt: 111411, tps: 258, est_suara: 0 },
  { id: 'gorontalo',   name: 'Kab. Gorontalo',   dpt: 301041, tps: 701, est_suara: 0 },
  { id: 'gortalkota',  name: 'Kota Gorontalo',   dpt: 146070, tps: 276, est_suara: 0 },
]
