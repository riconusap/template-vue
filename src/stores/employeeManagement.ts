import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Employee {
  id: string
  name: string
  email: string
  position: string
  department: string
  phone: string
  joinDate: string
  status: 'active' | 'inactive'
  createdAt: string
}

export const useEmployeeManagementStore = defineStore('employeeManagement', () => {
  const employees = ref<Employee[]>([
    {
      id: '1',
      name: 'Ahmad Wijaya',
      email: 'ahmad.wijaya@company.com',
      position: 'Software Engineer',
      department: 'Engineering',
      phone: '081234567890',
      joinDate: '2023-01-15',
      status: 'active',
      createdAt: '2023-01-15'
    },
    {
      id: '2',
      name: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@company.com',
      position: 'HR Manager',
      department: 'Human Resources',
      phone: '081234567891',
      joinDate: '2022-06-20',
      status: 'active',
      createdAt: '2022-06-20'
    },
    {
      id: '3',
      name: 'Budi Santoso',
      email: 'budi.santoso@company.com',
      position: 'Sales Executive',
      department: 'Sales',
      phone: '081234567892',
      joinDate: '2023-03-10',
      status: 'inactive',
      createdAt: '2023-03-10'
    }
  ])

  const loading = ref(false)

  const addEmployee = (employee: Omit<Employee, 'id' | 'createdAt'>) => {
    try {
      // Validasi email tidak duplikat
      const existingEmployee = employees.value.find(e => e.email === employee.email)
      if (existingEmployee) {
        throw new Error('Email sudah terdaftar dalam sistem')
      }

      // Validasi phone tidak duplikat
      const existingPhone = employees.value.find(e => e.phone === employee.phone)
      if (existingPhone) {
        throw new Error('Nomor telepon sudah terdaftar dalam sistem')
      }

      const newEmployee: Employee = {
        ...employee,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0]
      }
      employees.value.unshift(newEmployee)
      return { success: true, message: 'Karyawan berhasil ditambahkan' }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Gagal menambahkan karyawan' }
    }
  }

  const updateEmployee = (id: string, employeeData: Partial<Employee>) => {
    try {
      const index = employees.value.findIndex(e => e.id === id)
      if (index === -1) {
        throw new Error('Karyawan tidak ditemukan')
      }

      // Validasi email tidak duplikat (kecuali email sendiri)
      if (employeeData.email) {
        const existingEmployee = employees.value.find(e => e.email === employeeData.email && e.id !== id)
        if (existingEmployee) {
          throw new Error('Email sudah digunakan oleh karyawan lain')
        }
      }

      // Validasi phone tidak duplikat (kecuali phone sendiri)
      if (employeeData.phone) {
        const existingPhone = employees.value.find(e => e.phone === employeeData.phone && e.id !== id)
        if (existingPhone) {
          throw new Error('Nomor telepon sudah digunakan oleh karyawan lain')
        }
      }

      employees.value[index] = { ...employees.value[index], ...employeeData }
      return { success: true, message: 'Data karyawan berhasil diupdate' }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Gagal mengupdate data karyawan' }
    }
  }

  const deleteEmployee = (id: string) => {
    try {
      const index = employees.value.findIndex(e => e.id === id)
      if (index === -1) {
        throw new Error('Karyawan tidak ditemukan')
      }
      employees.value = employees.value.filter(e => e.id !== id)
      return { success: true, message: 'Karyawan berhasil dihapus' }
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Gagal menghapus karyawan' }
    }
  }

  const getEmployeeById = (id: string) => {
    return employees.value.find(e => e.id === id)
  }

  return {
    employees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById
  }
})
