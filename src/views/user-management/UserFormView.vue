<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserManagementStore, type User } from '@/stores/userManagement'
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
  AlertDialog,
  AlertDialogAction,
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
import { useToast } from '@/components/ui/toast/use-toast'
import { ArrowLeft, XCircle } from 'lucide-vue-next'

export default defineComponent({
  name: 'UserFormView',
  components: {
    Button,
    Input,
    Label,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    AlertDialog,
    AlertDialogAction,
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
    ArrowLeft,
    XCircle
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserManagementStore()
    const { toast } = useToast()
    
    const isEdit = computed(() => !!route.params.id)
    const userId = computed(() => route.params.id as string)

    const form = ref({
      name: '',
      email: '',
      role: '',
      status: 'active' as 'active' | 'inactive'
    })

    const errors = ref<Record<string, string>>({})
    const showErrorDialog = ref(false)
    const errorMessage = ref('')

    onMounted(() => {
      if (isEdit.value) {
        const user = userStore.getUserById(userId.value)
        if (user) {
          form.value = {
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
          }
        } else {
          router.push('/users')
        }
      }
    })

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
      if (isEdit.value) {
        result = userStore.updateUser(userId.value, form.value)
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
        router.push('/users')
      } else {
        errorMessage.value = result.message
        showErrorDialog.value = true
      }
    }

    const closeErrorDialog = () => {
      showErrorDialog.value = false
      errorMessage.value = ''
    }

    const handleCancel = () => {
      router.push('/users')
    }

    return {
      isEdit,
      form,
      errors,
      showErrorDialog,
      errorMessage,
      handleSubmit,
      handleCancel,
      closeErrorDialog,
      ArrowLeft,
      XCircle
    }
  }
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="sm" @click="handleCancel" class="gap-2">
        <ArrowLeft class="h-4 w-4" />
        Kembali
      </Button>
    </div>

    <div>
      <h1 class="text-3xl font-bold tracking-tight">
        {{ isEdit ? 'Edit User' : 'Tambah User Baru' }}
      </h1>
      <p class="text-muted-foreground mt-2">
        {{ isEdit ? 'Update informasi user' : 'Tambahkan user baru ke dalam sistem' }}
      </p>
    </div>

    <Card class="max-w-2xl">
      <CardHeader>
        <CardTitle>Informasi User</CardTitle>
        <CardDescription>
          Lengkapi form di bawah ini dengan data yang valid
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="space-y-2">
            <Label for="name">Nama Lengkap *</Label>
            <Input
              id="name"
              v-model="form.name"
              placeholder="Masukkan nama lengkap"
              :class="errors.name ? 'border-red-500' : ''"
            />
            <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
          </div>

          <div class="space-y-2">
            <Label for="email">Email *</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="contoh@email.com"
              :class="errors.email ? 'border-red-500' : ''"
            />
            <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
          </div>

          <div class="space-y-2">
            <Label for="role">Role *</Label>
            <Input
              id="role"
              v-model="form.role"
              placeholder="Contoh: Admin, Manager, Employee"
              :class="errors.role ? 'border-red-500' : ''"
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

          <div class="flex gap-3 pt-4">
            <Button type="submit">
              {{ isEdit ? 'Update User' : 'Simpan User' }}
            </Button>
            <Button type="button" variant="outline" @click="handleCancel">
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

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
