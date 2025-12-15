import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
}

export const useUserManagementStore = defineStore('userManagement', () => {
  const users = ref<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Manager',
      status: 'active',
      createdAt: '2024-02-20'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'Employee',
      status: 'inactive',
      createdAt: '2024-03-10'
    }
  ])

  const loading = ref(false)

  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    try {
      // Validasi email tidak duplikat
      const existingUser = users.value.find(u => u.email === user.email)
      if (existingUser) {
        throw new Error('Email sudah terdaftar dalam sistem')
      }

      const newUser: User = {
        ...user,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0]
      }
      users.value.unshift(newUser)
      return { success: true, message: 'User berhasil ditambahkan' }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Gagal menambahkan user' }
    }
  }

  const updateUser = (id: string, userData: Partial<User>) => {
    try {
      const index = users.value.findIndex(u => u.id === id)
      if (index === -1) {
        throw new Error('User tidak ditemukan')
      }

      // Validasi email tidak duplikat (kecuali email sendiri)
      if (userData.email) {
        const existingUser = users.value.find(u => u.email === userData.email && u.id !== id)
        if (existingUser) {
          throw new Error('Email sudah digunakan oleh user lain')
        }
      }

      users.value[index] = { ...users.value[index], ...userData }
      return { success: true, message: 'User berhasil diupdate' }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Gagal mengupdate user' }
    }
  }

  const deleteUser = (id: string) => {
    try {
      const index = users.value.findIndex(u => u.id === id)
      if (index === -1) {
        throw new Error('User tidak ditemukan')
      }
      users.value = users.value.filter(u => u.id !== id)
      return { success: true, message: 'User berhasil dihapus' }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Gagal menghapus user' }
    }
  }

  const getUserById = (id: string) => {
    return users.value.find(u => u.id === id)
  }

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
    getUserById
  }
})
