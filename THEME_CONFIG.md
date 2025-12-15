# Theme Configuration Guide

File `theme.config.ts` memungkinkan Anda untuk dengan mudah menyesuaikan tampilan aplikasi tanpa perlu mengubah kode komponen.

## Struktur Konfigurasi

### 1. Brand Colors
```typescript
brand: {
  primary: '#0f172a',    // Warna utama aplikasi
  secondary: '#64748b',  // Warna sekunder
  accent: '#3b82f6',     // Warna aksen untuk highlight
}
```

### 2. Sidebar Configuration
Konfigurasi untuk tampilan sidebar desktop dan mobile:
- `background`: Warna background sidebar
- `textColor`: Warna text menu default
- `activeBackground`: Background menu yang sedang aktif
- `width`: Lebar sidebar normal
- `collapsedWidth`: Lebar sidebar saat collapsed

### 3. Header Configuration
Pengaturan untuk header atas:
- `background`: Warna background header
- `borderColor`: Warna border bawah header
- `height`: Tinggi header

### 4. Button Configuration
Konfigurasi untuk berbagai variant button:
- `primary`: Button utama
- `secondary`: Button sekunder
- `danger`: Button untuk aksi berbahaya (delete, dll)

### 5. Toast/Notification
Pengaturan warna untuk notifikasi:
- `success`: Notifikasi sukses (hijau)
- `error`: Notifikasi error (merah)
- `info`: Notifikasi informasi (biru)

### 6. Table Configuration
Styling untuk tabel:
- `headerBackground`: Background header tabel
- `rowHoverBackground`: Background saat hover pada row
- `borderColor`: Warna border tabel

### 7. Form Configuration
Pengaturan untuk form input:
- `inputBorder`: Border color input
- `inputFocus`: Border color saat focus
- `errorColor`: Warna text error
- `errorBackground`: Background error message

### 8. Badge Configuration
Styling untuk status badge:
- `active`: Badge untuk status aktif
- `inactive`: Badge untuk status tidak aktif

### 9. Typography
Pengaturan tipografi:
- `fontFamily`: Font yang digunakan
- `heading`: Warna heading
- `body`: Warna text body
- `muted`: Warna text muted

### 10. Spacing & Border Radius
Ukuran spacing dan border radius yang konsisten di seluruh aplikasi.

### 11. Transitions
Durasi animasi untuk berbagai transisi.

## Cara Menggunakan

### Import di Component
```vue
<script setup lang="ts">
import { themeConfig } from '@/config/theme.config'

// Gunakan nilai dari config
const sidebarBg = themeConfig.sidebar.background
</script>
```

### Dengan CSS Variables
```vue
<style>
.custom-element {
  background-color: var(--color-primary);
  color: var(--sidebar-text);
}
</style>
```

## Tips Customization

### Mengubah Skema Warna Keseluruhan
Untuk mengubah tema keseluruhan, ubah nilai di `brand`:
```typescript
brand: {
  primary: '#7c3aed',    // Ubah ke violet
  secondary: '#a78bfa',
  accent: '#c084fc',
}
```

### Mengubah Sidebar Style
Untuk dark sidebar:
```typescript
sidebar: {
  background: '#1e293b',
  textColor: '#cbd5e1',
  activeBackground: '#334155',
  activeBorder: '#475569',
  activeText: '#ffffff',
}
```

### Customisasi Toast
Untuk toast dengan warna kustom:
```typescript
toast: {
  success: {
    background: '#ecfdf5',
    border: '#10b981',
    text: '#064e3b',
  },
}
```

## Notes

- Gunakan hex color untuk konsistensi
- Pastikan contrast ratio yang baik untuk accessibility
- Test di light dan dark mode jika diperlukan
- Nilai spacing menggunakan rem untuk responsiveness
