<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserManagementStore } from '@/stores/userManagement'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/toast/use-toast'
import { Plus, Search, Edit, Trash2, AlertTriangle, CheckCircle2, XCircle, Eye } from 'lucide-vue-next'

export default defineComponent({
  name: 'UserManagementView',
  components: {
    Button,
    Input,
    Label,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    Plus, Search, Edit, Trash2, AlertTriangle, XCircle, Eye
  },
  setup() {
    const router = useRouter()
    const userStore = useUserManagementStore()
    const { toast } = useToast()
    const searchQuery = ref('')
    const showDeleteDialog = ref(false)
    const showErrorDialog = ref(false)
    const showFormDialog = ref(false)
    const showDetailDialog = ref(false)
    const errorMessage = ref('')
    const userToDelete = ref<string | null>(null)
    const isEdit = ref(false)
    const selectedUser = ref<any>(null)
    
    const form = ref({
      name: '',
      email: '',
      role: '',
      status: 'active' as 'active' | 'inactive'
    })
    
    const errors = ref<Record<string, string>>({})

    const filteredUsers = computed(() => {
      if (!searchQuery.value) return userStore.users
      
      const query = searchQuery.value.toLowerCase()
      return userStore.users.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      )
    })

    const handleCreate = () => {
      isEdit.value = false
      form.value = {
        name: '',
        email: '',
        role: '',
        status: 'active'
      }
      errors.value = {}
      showFormDialog.value = true
    }

    const handleEdit = (id: string) => {
      const user = userStore.getUserById(id)
      if (user) {
        isEdit.value = true
        form.value = {
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        }
        selectedUser.value = user
        errors.value = {}
        showFormDialog.value = true
      }
    }

    const handleDetail = (id: string) => {
      const user = userStore.getUserById(id)
      if (user) {
        selectedUser.value = user
        showDetailDialog.value = true
      }
    }

    const handleDelete = (id: string) => {
      userToDelete.value = id
      showDeleteDialog.value = true
    }

    const confirmDelete = () => {
      if (userToDelete.value) {
        const result = userStore.deleteUser(userToDelete.value)
        showDeleteDialog.value = false
        userToDelete.value = null
        
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
      userToDelete.value = null
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

    const validateForm = () => {
      errors.value = {}
      
      if (!form.value.name.trim()) {
        errors.value.name = 'Nama wajib diisi'
      }
      
      if (!form.value.email.trim()) {
        errors.value.email = 'Email wajib diisi'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = 'Format email tidak valid'
      }
      
      if (!form.value.role.trim()) {
        errors.value.role = 'Role wajib diisi'
      }

      return Object.keys(errors.value).length === 0
    }

    const handleSubmit = () => {
      if (!validateForm()) return

      let result
      if (isEdit.value && selectedUser.value) {
        result = userStore.updateUser(selectedUser.value.id, form.value)
      } else {
        result = userStore.addUser(form.value)
      }

      if (result.success) {
        toast({
          title: '✓ Berhasil!',
          description: result.message,
          variant: 'success',
          duration: 3000,
        })
        showFormDialog.value = false
      } else {
        errorMessage.value = result.message
        showErrorDialog.value = true
      }
    }

    const handleCloseForm = () => {
      showFormDialog.value = false
      form.value = {
        name: '',
        email: '',
        role: '',
        status: 'active'
      }
      errors.value = {}
    }

    return {
      searchQuery,
      filteredUsers,
      showDeleteDialog,
      showErrorDialog,
      showFormDialog,
      showDetailDialog,
      errorMessage,
      isEdit,
      selectedUser,
      form,
      errors,
      handleCreate,
      handleEdit,
      handleDetail,
      handleDelete,
      confirmDelete,
      cancelDelete,
      closeErrorDialog,
      handleSubmit,
      handleCloseForm,
      getStatusBadgeClass,
    }
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">User Management</h1>
        <p class="text-muted-foreground mt-2 text-sm sm:text-base">
          Kelola data karyawan dan pengguna sistem
        </p>
      </div>
      <Button @click="handleCreate" class="gap-2 w-full sm:w-auto">
        <Plus class="h-4 w-4" />
        Tambah User
      </Button>
    </div>

    <Card>
      <CardHeader>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div class="relative flex-1 max-w-full sm:max-w-sm">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              placeholder="Cari nama, email, atau role..."
              class="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border overflow-x-auto">
          <table class="w-full min-w-[600px] text-sm">
            <thead>
              <tr class="border-b bg-muted/50">
                <th class="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Nama</th>
                <th class="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Email</th>
                <th class="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Role</th>
                <th class="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Status</th>
                <th class="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">Tanggal Dibuat</th>
                <th class="px-2 sm:px-4 py-3 text-right font-medium whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in filteredUsers"
                :key="user.id"
                class="border-b hover:bg-muted/50 transition-colors"
              >
                <td class="px-2 sm:px-4 py-3 font-medium">{{ user.name }}</td>
                <td class="px-2 sm:px-4 py-3 text-muted-foreground">{{ user.email }}</td>
                <td class="px-2 sm:px-4 py-3">{{ user.role }}</td>
                <td class="px-2 sm:px-4 py-3">
                  <span :class="getStatusBadgeClass(user.status)">
                    {{ user.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
                  </span>
                </td>
                <td class="px-2 sm:px-4 py-3 text-muted-foreground">{{ user.createdAt }}</td>
                <td class="px-2 sm:px-4 py-3">
                  <div class="flex items-center justify-end gap-2">
                    <TooltipProvider :delay-duration="0">
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="sm"
                            @click="handleDetail(user.id)"
                            class="h-8 w-8 p-0"
                          >
                            <Eye class="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Detail User</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="sm"
                            @click="handleEdit(user.id)"
                            class="h-8 w-8 p-0"
                          >
                            <Edit class="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Edit User</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger>
                          <Button
                            variant="ghost"
                            size="sm"
                            @click="handleDelete(user.id)"
                            class="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 class="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Hapus User</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="6" class="px-2 sm:px-4 py-8 text-center text-muted-foreground">
                  Tidak ada data user ditemukan
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
            <AlertDialogTitle class="text-xl">Hapus User</AlertDialogTitle>
          </div>
          <AlertDialogDescription class="pt-3 text-base">
            Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan dan semua data terkait akan dihapus secara permanen.
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

    <!-- Form Dialog (Create/Edit) -->
    <Dialog :open="showFormDialog" @update:open="handleCloseForm">
      <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle class="text-2xl font-semibold">
            {{ isEdit ? 'Edit User' : 'Tambah User Baru' }}
          </DialogTitle>
          <DialogDescription>
            {{ isEdit ? 'Update informasi user yang sudah ada' : 'Masukkan informasi user baru' }}
          </DialogDescription>
        </DialogHeader>
        
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label for="name">Nama</Label>
            <Input
              id="name"
              v-model="form.name"
              placeholder="Masukkan nama"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Masukkan email"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
          </div>

          <div class="space-y-2">
            <Label for="role">Role</Label>
            <Input
              id="role"
              v-model="form.role"
              placeholder="Masukkan role"
              :class="{ 'border-red-500': errors.role }"
            />
            <p v-if="errors.role" class="text-sm text-red-500">{{ errors.role }}</p>
          </div>

          <div class="space-y-2">
            <Label for="status">Status</Label>
            <Select v-model="form.status">
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="handleCloseForm">
            Batal
          </Button>
          <Button @click="handleSubmit">
            {{ isEdit ? 'Update' : 'Simpan' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Detail Dialog -->
    <Dialog :open="showDetailDialog" @update:open="showDetailDialog = $event">
      <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle class="text-2xl font-semibold">Detail User</DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang user
          </DialogDescription>
        </DialogHeader>
        
        <div v-if="selectedUser" class="space-y-4 py-4">
          <div class="grid grid-cols-3 gap-4 py-3 border-b">
            <div class="text-sm font-medium text-muted-foreground">Nama</div>
            <div class="col-span-2 text-sm font-medium">{{ selectedUser.name }}</div>
          </div>
          
          <div class="grid grid-cols-3 gap-4 py-3 border-b">
            <div class="text-sm font-medium text-muted-foreground">Email</div>
            <div class="col-span-2 text-sm">{{ selectedUser.email }}</div>
          </div>
          
          <div class="grid grid-cols-3 gap-4 py-3 border-b">
            <div class="text-sm font-medium text-muted-foreground">Role</div>
            <div class="col-span-2 text-sm">{{ selectedUser.role }}</div>
          </div>
          
          <div class="grid grid-cols-3 gap-4 py-3 border-b">
            <div class="text-sm font-medium text-muted-foreground">Status</div>
            <div class="col-span-2">
              <span :class="getStatusBadgeClass(selectedUser.status)">
                {{ selectedUser.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
              </span>
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-4 py-3 border-b">
            <div class="text-sm font-medium text-muted-foreground">Tanggal Dibuat</div>
            <div class="col-span-2 text-sm">{{ selectedUser.createdAt }}</div>
          </div>
        </div>

        <DialogFooter>
          <Button @click="showDetailDialog = false">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
