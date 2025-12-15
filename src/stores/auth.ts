import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // Cek localStorage saat inisialisasi
  const savedAuth = localStorage.getItem('isAuthenticated')
  const savedUser = localStorage.getItem('user')

  const isAuthenticated = ref(savedAuth === 'true') 
  const user = ref(savedUser ? JSON.parse(savedUser) : { name: 'Riko', role: 'Admin' })

  const login = async (email: string, pass: string) => {

    if (email === 'admin@erp.com' && pass === 'password') {
      isAuthenticated.value = true
      user.value = { name: 'Riko', role: 'Admin' }
      
      // Simpan ke localStorage
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('user', JSON.stringify(user.value))
      
      router.push('/')
      return true
    }
    return false
    
  }

  const logout = () => {
    isAuthenticated.value = false
    
    // Hapus dari localStorage
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('user')
    
    router.push('/login')
  }

  return { isAuthenticated, user, login, logout }
})