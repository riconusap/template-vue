<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeeManagementStore } from '@/stores/employeeManagement'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/toast/use-toast'
import { Plus, Search, Edit, Trash2, AlertTriangle, XCircle } from 'lucide-vue-next'

export default defineComponent({
  name: 'EmployeeManagementView',
  components: {
    Button,
    Input,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    Plus, Search, Edit, Trash2, AlertTriangle, XCircle
  },
  setup() {
    const router = useRouter()
    const employeeStore = useEmployeeManagementStore()
    const { toast } = useToast()
    const searchQuery = ref('')
    const showDeleteDialog = ref(false)
    const showErrorDialog = ref(false)
    const errorMessage = ref('')
    const employeeToDelete = ref<string | null>(null)

    const filteredEmployees = computed(() => {
      if (!searchQuery.value) return employeeStore.employees
      
      const query = searchQuery.value.toLowerCase()
      return employeeStore.employees.filter(employee => 
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.position.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query) ||
        employee.phone.toLowerCase().includes(query)
      )
    })

    const handleCreate = () => {
      router.push('/employees/create')
    }

    const handleEdit = (id: string) => {
      router.push(`/employees/edit/${id}`)
    }

    const handleDelete = (id: string) => {
      employeeToDelete.value = id
      showDeleteDialog.value = true
    }

    const confirmDelete = () => {
      if (employeeToDelete.value) {
        const result = employeeStore.deleteEmployee(employeeToDelete.value)
        showDeleteDialog.value = false
        employeeToDelete.value = null
        
        if (result.success) {
          toast({
            title: '✓ Berhasil!',
            description: result.message,
            variant: 'success',
            duration: 3000,
          })
        } else {
          errorMessage.value = result.message
          showErrorDialog.value = true
        }
      }
    }

    const cancelDelete = () => {
      showDeleteDialog.value = false
      employeeToDelete.value = null
    }

    const getStatusBadgeClass = (status: string) => {
      return status === 'active' 
        ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium'
        : 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium'
    }

    const closeErrorDialog = () => {
      showErrorDialog.value = false
      errorMessage.value = ''
    }

    return {
      searchQuery,
      filteredEmployees,
      showDeleteDialog,
      showErrorDialog,
      errorMessage,
      handleCreate,
      handleEdit,
      handleDelete,
      confirmDelete,
      cancelDelete,
      closeErrorDialog,
      getStatusBadgeClass,
    }
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Employee Management</h1>
        <p class="text-muted-foreground mt-2 text-sm sm:text-base">
          Kelola data karyawan perusahaan
        </p>
      </div>
      <Button @click="handleCreate" class="gap-2 w-full sm:w-auto">
        <Plus class="h-4 w-4" />
        Tambah Karyawan
      </Button>
    </div>

    <Card>
      <CardHeader>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div class="relative flex-1 max-w-full sm:max-w-sm">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              placeholder="Cari nama, email, posisi, atau department..."
              class="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border overflow-x-auto">
          <table class="w-full min-w-[700px] text-sm">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Nama</th>
                <th class="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Email</th>
                <th class="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Posisi</th>
                <th class="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Department</th>
                <th class="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">No. Telepon</th>
                <th class="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Status</th>
                <th class="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Tanggal Bergabung</th>
                <th class="px-2 sm:px-4 py-3 text-right font-medium whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="employee in filteredEmployees"
                :key="employee.id"
                class="border-b hover:bg-muted/50 transition-colors"
              >
                <td class="px-2 sm:px-4 py-3 font-medium">{{ employee.name }}</td>
                <td class="px-2 sm:px-4 py-3 text-muted-foreground">{{ employee.email }}</td>
                <td class="px-2 sm:px-4 py-3">{{ employee.position }}</td>
                <td class="px-2 sm:px-4 py-3">{{ employee.department }}</td>
                <td class="px-2 sm:px-4 py-3">{{ employee.phone }}</td>
                <td class="px-2 sm:px-4 py-3">
                  <span :class="getStatusBadgeClass(employee.status)">
                    {{ employee.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
                  </span>
                </td>
                <td class="px-2 sm:px-4 py-3 text-muted-foreground">{{ employee.joinDate }}</td>
                <td class="px-2 sm:px-4 py-3">
                  <div class="flex items-center justify-end gap-2">
                    <TooltipProvider :delay-duration="0">
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="sm"
                            @click="handleEdit(employee.id)"
                            class="h-8 w-8 p-0"
                          >
                            <Edit class="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Edit Karyawan</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="sm"
                            @click="handleDelete(employee.id)"
                            class="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 class="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Hapus Karyawan</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredEmployees.length === 0">
                <td colspan="8" class="px-2 sm:px-4 py-8 text-center text-muted-foreground">
                  Tidak ada data karyawan ditemukan
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle class="h-5 w-5 text-red-600" />
            </div>
            <AlertDialogTitle class="text-xl">Hapus Karyawan</AlertDialogTitle>
          </div>
          <AlertDialogDescription class="pt-3 text-base">
            Apakah Anda yakin ingin menghapus data karyawan ini? Tindakan ini tidak dapat dibatalkan dan semua data terkait akan dihapus secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="cancelDelete">Batal</AlertDialogCancel>
          <AlertDialogAction 
            @click="confirmDelete"
            class="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <!-- Error Dialog -->
    <AlertDialog :open="showErrorDialog" @update:open="showErrorDialog = $event">
      <AlertDialogContent>
        <AlertDialogHeader>
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <XCircle class="h-5 w-5 text-red-600" />
            </div>
            <AlertDialogTitle class="text-xl">Error</AlertDialogTitle>
          </div>
          <AlertDialogDescription class="pt-3 text-base">
            {{ errorMessage }}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction @click="closeErrorDialog">
            Tutup
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
