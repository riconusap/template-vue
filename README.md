# Vue 3 Dashboard Template

> Dashboard modern dengan Vue 3, TypeScript, Tailwind CSS, dan Shadcn-vue. Sudah termasuk autentikasi, manajemen user & karyawan, tema, dan komponen UI siap pakai.

## Fitur
- UI modern & responsif
- Autentikasi (login/logout)
- CRUD User & Karyawan
- Sidebar & breadcrumb otomatis
- Tema terpusat & notifikasi

## Stack
- Vue 3, TypeScript, Vite
- Pinia, Vue Router
- Tailwind CSS, Shadcn-vue, Lucide Icons

## Instalasi
```bash
git clone <repository-url>
cd template-vue
npm install
npm run dev
```

## Struktur
```
src/
  assets/ components/ layouts/ lib/ router/ stores/ views/
  App.vue main.ts style.css
```

## Login Default
Email: admin@example.com  
Password: password123

## Kustomisasi
- Edit tema di `src/config/theme.config.ts`
- Alias path: `@` → `src/`

## Lisensi
MIT License
