import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue' // Kita buat ini sebentar lagi
import LoginView from '@/views/auth/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      component: DashboardLayout, // Semua route di bawah ini bakal punya Sidebar
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue') // Lazy load
        },
        {
          path: 'users',
          name: 'users',
          component: () => import('@/views/user-management/UserManagementView.vue')
        },
        {
          path: 'employees',
          name: 'employees',
          component: () => import('@/views/employee-management/EmployeeManagementView.vue')
        },
        {
          path: 'employees/create',
          name: 'employees-create',
          component: () => import('@/views/employee-management/EmployeeFormView.vue')
        },
        {
          path: 'employees/edit/:id',
          name: 'employees-edit',
          component: () => import('@/views/employee-management/EmployeeFormView.vue')
        },
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore() // Harus dipanggil di dalam
  
  // Kalau bukan ke halaman login dan user belum login
  if (to.name !== 'login' && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router