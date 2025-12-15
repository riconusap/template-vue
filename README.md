# Vue 3 Dashboard Template

Template dashboard modern yang dibangun dengan Vue 3, TypeScript, dan Tailwind CSS. Template ini menyediakan struktur aplikasi yang lengkap dengan sistem autentikasi, manajemen state, dan komponen UI yang siap pakai.

## Fitur Utama

- **UI Modern** - Menggunakan Shadcn-vue components dengan Tailwind CSS
- **Autentikasi** - Sistem login dengan localStorage persistence
- **CRUD Management** - Modul User Management dan Employee Management
- **Modal-based Forms** - Form create/edit/detail menggunakan dialog modal
- **Breadcrumb Navigation** - Navigasi breadcrumb otomatis berdasarkan route
- **Responsive Sidebar** - Sidebar collapsible dengan tooltips dan animasi smooth
- **Theme Configuration** - Sistem tema terpusat untuk kustomisasi mudah
- **Mobile Responsive** - Mobile sidebar dengan drawer component
- **Toast Notifications** - Notifikasi sukses dengan styling modern
- **Error Handling** - Alert dialog untuk menampilkan error dengan styling yang menarik

## Tech Stack

- **Vue 3** - Progressive JavaScript Framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next Generation Frontend Tooling (dengan Rolldown)
- **Vue Router** - Official router untuk Vue.js
- **Pinia** - State management library
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn-vue** - Re-usable components built with Reka UI
- **Lucide Icons** - Beautiful & consistent icon toolkit
- **date-fns** - Modern JavaScript date utility library

## Instalasi

```bash
# Clone repository
git clone <repository-url>
cd template-vue

# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview
```

## Struktur Project

```
template-vue/
├── public/              # Static assets
├── src/
│   ├── assets/         # Images, fonts, dll
│   ├── components/     # Reusable components
│   │   ├── ui/        # Shadcn-vue components
│   │   ├── Sidebar.vue
│   │   ├── MobileSidebar.vue
│   │   ├── DashboardHeader.vue
│   │   └── DynamicBreadcrumb.vue
│   ├── config/         # Configuration files
│   │   └── theme.config.ts
│   ├── layouts/        # Layout components
│   │   └── DashboardLayout.vue
│   ├── lib/           # Utility functions
│   │   └── utils.ts
│   ├── router/        # Vue Router configuration
│   │   └── index.ts
│   ├── stores/        # Pinia stores
│   │   ├── auth.ts
│   │   ├── userManagement.ts
│   │   └── employeeManagement.ts
│   ├── views/         # Page components
│   │   ├── auth/
│   │   ├── user-management/
│   │   └── employee-management/
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── components.json     # Shadcn-vue configuration
├── tailwind.config.js  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Fitur Detail

### Autentikasi
- Login dengan validasi email dan password
- Logout dengan clear localStorage
- Navigation guards untuk proteksi route
- Auth state persistence dengan localStorage

### User Management
- Tabel user dengan search functionality
- Create user via modal dialog
- Edit user via modal dialog
- View user detail via modal dialog
- Delete user dengan confirmation dialog
- Form validation (email, nama, role)
- Toast notification untuk operasi sukses
- Error dialog untuk menampilkan error

### Employee Management
- CRUD lengkap untuk data karyawan
- Form dengan date picker (Calendar component)
- Select dropdown untuk status
- Field tambahan: phone, position, department, join date
- Search dan filter data karyawan

### Theme Configuration
Semua konfigurasi tema tersimpan di `src/config/theme.config.ts`:
- Brand colors
- Sidebar styling (width, colors, transitions)
- Header styling
- Button variants
- Toast notifications
- Table styling
- Form elements
- Badge variants
- Typography

Lihat file `THEME_CONFIG.md` untuk panduan lengkap kustomisasi tema.

## Kredensial Login Default

```
Email: admin@example.com
Password: password123
```

## Komponen UI yang Tersedia

- **Button** - Primary, secondary, outline, ghost variants
- **Input** - Text input dengan validation styling
- **Label** - Form labels
- **Card** - Container dengan header, content, footer
- **Dialog** - Modal dialogs untuk forms
- **AlertDialog** - Confirmation dialogs
- **Select** - Dropdown dengan search
- **Calendar** - Date picker dengan locale Indonesia
- **Toast** - Notification system
- **Tooltip** - Contextual tooltips
- **Breadcrumb** - Navigation breadcrumbs
- **Popover** - Overlay positioned content

## Panduan Penggunaan

### Menambah Route Baru

1. Buat view component di `src/views/`
2. Tambahkan route di `src/router/index.ts`
3. Tambahkan menu item di `src/components/Sidebar.vue`
4. Update breadcrumb logic di `src/components/DynamicBreadcrumb.vue`

### Menambah Store Baru

```typescript
// src/stores/example.ts
import { defineStore } from 'pinia'

export const useExampleStore = defineStore('example', {
  state: () => ({
    items: []
  }),
  actions: {
    addItem(item: any) {
      this.items.push(item)
    }
  }
})
```

### Menggunakan Toast Notification

```typescript
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

toast({
  title: '✓ Berhasil!',
  description: 'Data berhasil disimpan',
  variant: 'success',
  duration: 3000,
})
```

### Menggunakan Dialog Modal

```vue
<Dialog :open="showDialog" @update:open="showDialog = $event">
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Judul Dialog</DialogTitle>
      <DialogDescription>Deskripsi dialog</DialogDescription>
    </DialogHeader>
    
    <!-- Content here -->
    
    <DialogFooter>
      <Button @click="handleSubmit">Simpan</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Konfigurasi

### Path Alias
Project ini menggunakan `@` sebagai alias untuk folder `src`:

```typescript
import Component from '@/components/Component.vue'
import { useStore } from '@/stores/store'
```

### Tailwind Configuration
Kustomisasi warna, spacing, dan utility classes di `tailwind.config.js`.

### Theme Customization
Edit `src/config/theme.config.ts` untuk mengubah tema aplikasi secara terpusat.

## Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Shadcn-vue Documentation](https://www.shadcn-vue.com/)
- [Lucide Icons](https://lucide.dev/)

## Contributing

Kontribusi, issues, dan feature requests sangat diterima!

## License

This project is open source and available under the [MIT License](LICENSE).
