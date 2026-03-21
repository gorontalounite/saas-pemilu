export const candidate = {
  name: 'Andi Rahmatillah, S.E.',
  shortName: 'Andi Rahmatillah',
  title: 'Calon Anggota DPR RI',
  region: 'Dapil Gorontalo',
  party: '—',
  nomorUrut: '—' as any,
  photo: null,
  initials: 'AR',
  runningMate: '',
  elektabilitas: 0,
  elektabilitasDelta: 0,
  targetSuara: 30,
  targetDate: '14 Februari 2029',
}

export const statsKartu = [
  { label: 'Total Relawan',    value: '0',       delta: 'Belum ada relawan',         trend: 'neutral', color: 'indigo' },
  { label: 'TPS Terpetakan',   value: '0',       delta: 'dari ± 1.800 TPS',          trend: 'neutral', color: 'teal'   },
  { label: 'Dana Tersisa',     value: 'Rp —',    delta: 'Budget belum diset',         trend: 'neutral', color: 'amber'  },
  { label: 'Elektabilitas',    value: '—%',      delta: 'Belum ada survei',           trend: 'neutral', color: 'green'  },
]

export const modulData = [
  { id:'m0',num:'00',name:'Dashboard Master',     desc:'Command center — semua modul dalam satu pandang',      color:'indigo',status:'active', health:100,alerts:0,stats:'10 modul aktif' },
  { id:'m9',num:'09',name:'Profil Calon',          desc:'Identitas, visi misi, program kerja & jadwal kampanye', color:'purple',status:'active', health:0,  alerts:1,stats:'Profil belum lengkap' },
  { id:'m1',num:'01',name:'Relawan & Posko',       desc:'Database, absensi, tugas & broadcast WA',              color:'green', status:'active', health:0,  alerts:3,stats:'0 relawan terdaftar' },
  { id:'m2',num:'02',name:'Pemetaan Pemilih',      desc:'Peta TPS Gorontalo, DPT, segmentasi & canvassing',     color:'sky',   status:'active', health:0,  alerts:2,stats:'0 TPS terpetakan' },
  { id:'m3',num:'03',name:'Kampanye Digital',      desc:'Konten, sosmed, iklan & monitoring sentimen',          color:'pink',  status:'active', health:0,  alerts:1,stats:'0 konten terjadwal' },
  { id:'m4',num:'04',name:'Saksi & Quick Count',   desc:'Penugasan saksi, upload C1, real-time agregasi',       color:'orange',status:'standby',health:100,alerts:0,stats:'Aktif hari-H' },
  { id:'m5',num:'05',name:'Survei & Elektabilitas',desc:'Builder survei, tracking elektabilitas & simulasi',    color:'teal',  status:'active', health:0,  alerts:0,stats:'0 responden' },
  { id:'m6',num:'06',name:'Keuangan & Budget',     desc:'RAB, approval, LPPDK & cost per vote',                color:'amber', status:'active', health:0,  alerts:4,stats:'Budget belum diset' },
  { id:'m7',num:'07',name:'War Room',              desc:'Pusat komando, laporan harian & crisis room',          color:'red',   status:'active', health:100,alerts:2,stats:'0 isu aktif' },
  { id:'m8',num:'08',name:'Konstituen',            desc:'By name by address — DPT, kawan, relasi, potensi',     color:'purple',status:'active', health:0,  alerts:0,stats:'0 konstituen' },
]

export const alerts: any[] = []

export const aktifitasTimeline: any[] = []

export const elektabilitasChart: any[] = []

export const budgetPos: any[] = []

export const kabGorontalo = [
  { id: 'gorut',       name: 'Gorontalo Utara', dpt: 0, tps: 0, est_suara: 0 },
  { id: 'bone',        name: 'Bone Bolango',     dpt: 0, tps: 0, est_suara: 0 },
  { id: 'bonebol',     name: 'Boalemo',          dpt: 0, tps: 0, est_suara: 0 },
  { id: 'pohuwato',    name: 'Pohuwato',          dpt: 0, tps: 0, est_suara: 0 },
  { id: 'gorontalo',   name: 'Kab. Gorontalo',   dpt: 0, tps: 0, est_suara: 0 },
  { id: 'gortalkota',  name: 'Kota Gorontalo',   dpt: 0, tps: 0, est_suara: 0 },
]
