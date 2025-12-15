import type { Step } from '@/composables/useStepTypes'

export const EMPLOYEE_FORM_STEPS: Step[] = [
  { 
    number: 1, 
    title: 'Data Pribadi', 
    description: 'Informasi personal karyawan',
    tooltip: 'Lengkapi nama lengkap, email, dan nomor telepon karyawan. Pastikan format email dan nomor telepon valid.'
  },
  { 
    number: 2, 
    title: 'Kontak', 
    description: 'Informasi kontak dan alamat',
    tooltip: 'Masukkan alamat lengkap, kota tempat tinggal, dan kode pos. Kode pos harus 5 digit angka.'
  },
  { 
    number: 3, 
    title: 'Data Kontrak', 
    description: 'Informasi posisi dan departemen',
    tooltip: 'Tentukan posisi jabatan, departemen tempat bekerja, dan tanggal mulai bergabung di perusahaan.'
  },
  { 
    number: 4, 
    title: 'Kontak Darurat', 
    description: 'Informasi kontak emergency',
    tooltip: 'Isi nama dan nomor telepon yang dapat dihubungi dalam keadaan darurat. Pastikan nomor yang dapat dihubungi kapan saja.'
  },
  { 
    number: 5, 
    title: 'Data Bank', 
    description: 'Informasi rekening bank',
    tooltip: 'Masukkan nama bank dan nomor rekening untuk transfer gaji. Pastikan data rekening sesuai dengan identitas karyawan.'
  },
  { 
    number: 6, 
    title: 'Data Pajak', 
    description: 'Informasi perpajakan',
    tooltip: 'Isi nomor NPWP (Nomor Pokok Wajib Pajak) karyawan untuk keperluan perpajakan dan pelaporan.'
  },
  { 
    number: 7, 
    title: 'Pendidikan', 
    description: 'Riwayat pendidikan',
    tooltip: 'Pilih jenjang pendidikan terakhir, nama universitas/institusi, dan tahun kelulusan karyawan.'
  },
  { 
    number: 8, 
    title: 'Data Pengguna', 
    description: 'Informasi akun dan status',
    tooltip: 'Tentukan status akun karyawan: Aktif untuk karyawan yang sudah bekerja, atau Tidak Aktif untuk karyawan yang sudah resign atau cuti panjang.'
  },
  { 
    number: 9, 
    title: 'Review', 
    description: 'Peninjauan data lengkap',
    tooltip: 'Tinjau kembali semua data yang telah diisi. Pastikan semua informasi sudah benar sebelum menyimpan.'
  }
]
