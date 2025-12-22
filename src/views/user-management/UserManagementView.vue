<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold tracking-tight">User Management</h1>
        <p class="text-muted-foreground mt-2 text-sm sm:text-base">
          Kelola data karyawan dan pengguna sistem
        </p>
      </div>
      <Button
        @click="handleCreate"
        class="gap-2 w-full sm:w-auto"
      >
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
        <DataTable
          :columns="tableColumns"
          :rows="filteredUsers"
          row-key="id"
          :has-actions="true"
          :page-size="10"
        >
          <template #cell-status="{ row }">
            <span :class="getStatusBadgeClass(row.status)">
              {{ row.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
            </span>
          </template>
          <template #actions="{ row }">
            <div class="flex items-center justify-end gap-2">
              <TooltipProvider :delay-duration="0">
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="sm"
                      @click="handleDetail(row.id)"
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
                      @click="handleEdit(row.id)"
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
                      @click="handleDelete(row.id)"
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
          </template>
          <template #empty>
            Tidak ada data user ditemukan
          </template>
        </DataTable>
      </CardContent>
    </Card>

    <!-- Delete Confirmation Dialog -->
    <AlertDialog
      :open="showDeleteDialog"
      @update:open="showDeleteDialog = $event"
    >
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
    <AlertDialog
      :open="showErrorDialog"
      @update:open="showErrorDialog = $event"
    >
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
    <Dialog
      :open="showFormDialog"
      @update:open="handleCloseForm"
    >
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
            <p
              v-if="errors.name"
              class="text-sm text-red-500"
            >{{ errors.name }}</p>
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
            <p
              v-if="errors.email"
              class="text-sm text-red-500"
            >{{ errors.email }}</p>
          </div>

          <div class="space-y-2">
            <Label for="role">Role</Label>
            <Input
              id="role"
              v-model="form.role"
              placeholder="Masukkan role"
              :class="{ 'border-red-500': errors.role }"
            />
            <p
              v-if="errors.role"
              class="text-sm text-red-500"
            >{{ errors.role }}</p>
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
          <Button
            variant="outline"
            @click="handleCloseForm"
          >
            Batal
          </Button>
          <Button @click="handleSubmit">
            {{ isEdit ? 'Update' : 'Simpan' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Detail Dialog -->
    <Dialog
      :open="showDetailDialog"
      @update:open="showDetailDialog = $event"
    >
      <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle class="text-2xl font-semibold">Detail User</DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang user
          </DialogDescription>
        </DialogHeader>

        <div
          v-if="selectedUser"
          class="space-y-4 py-4"
        >
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

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useUserManagementStore } from "@/stores/userManagement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/toast/use-toast";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-vue-next";

import DataTable from "@/components/ui/DataTable.vue";
import * as yup from "yup";

export default defineComponent({
  name: "UserManagementView",
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
    Plus,
    Search,
    Edit,
    Trash2,
    AlertTriangle,
    XCircle,
    Eye,
    DataTable,
  },
  setup() {
    const router = useRouter();
    const userStore = useUserManagementStore();
    const { toast } = useToast();
    const searchQuery = ref("");
    const showDeleteDialog = ref(false);
    const showFormDialog = ref(false);
    const showDetailDialog = ref(false);
    const userToDelete = ref<string | null>(null);
    const isEdit = ref(false);
    const selectedUser = ref<any>(null);
    // Table columns config for DataTable
    const tableColumns = [
      {
        key: "name",
        label: "Nama",
        thClass: "text-left",
        tdClass: "font-medium",
      },
      {
        key: "email",
        label: "Email",
        thClass: "text-left",
        tdClass: "text-muted-foreground",
      },
      { key: "role", label: "Role", thClass: "text-left" },
      {
        key: "status",
        label: "Status",
        thClass: "text-left",
        tdClass: "min-w-[110px]",
      },
      {
        key: "createdAt",
        label: "Tanggal Dibuat",
        thClass: "text-left text-muted-foreground",
      },
    ];

    const form = ref({
      name: "",
      email: "",
      role: "",
      status: "active" as "active" | "inactive",
    });

    const errors = ref<Record<string, string>>({});

    const filteredUsers = computed(() => {
      if (!searchQuery.value) return userStore.users;

      const query = searchQuery.value.toLowerCase();
      return userStore.users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
      );
    });

    const handleCreate = () => {
      isEdit.value = false;
      form.value = {
        name: "",
        email: "",
        role: "",
        status: "active",
      };
      errors.value = {};
      showFormDialog.value = true;
    };

    const handleEdit = (id: string) => {
      const user = userStore.getUserById(id);
      if (user) {
        isEdit.value = true;
        form.value = {
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        };
        selectedUser.value = user;
        errors.value = {};
        showFormDialog.value = true;
      }
    };

    const handleDetail = (id: string) => {
      const user = userStore.getUserById(id);
      if (user) {
        selectedUser.value = user;
        showDetailDialog.value = true;
      }
    };

    const handleDelete = (id: string) => {
      userToDelete.value = id;
      showDeleteDialog.value = true;
    };

    const confirmDelete = () => {
      if (userToDelete.value) {
        const result = userStore.deleteUser(userToDelete.value);
        showDeleteDialog.value = false;
        userToDelete.value = null;

        if (result.success) {
          toast({
            title: "✓ Berhasil!",
            description: result.message,
            variant: "success",
            duration: 3000,
          });
        } else {
          toast({
            title: "Gagal menghapus user",
            description: result.message,
            variant: "destructive",
            duration: 3000,
          });
        }
      }
    };

    const cancelDelete = () => {
      showDeleteDialog.value = false;
      userToDelete.value = null;
    };

    const getStatusBadgeClass = (status: string) => {
      return status === "active"
        ? "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
        : "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium";
    };



    // Yup validation schema
    const userSchema = yup.object({
      name: yup.string().required("Nama wajib diisi"),
      email: yup
        .string()
        .required("Email wajib diisi")
        .email("Format email tidak valid"),
      role: yup.string().required("Role wajib diisi"),
      status: yup.string().oneOf(["active", "inactive"]),
    });

    const validateField = async (field: string) => {
      try {
        await userSchema.validateAt(field, form.value);
        errors.value[field] = "";
      } catch (err: any) {
        errors.value[field] = err.message;
      }
    };

    // Watch each field for changes and validate in real-time
    watch(() => form.value.name, () => validateField("name"));
    watch(() => form.value.email, () => validateField("email"));
    watch(() => form.value.role, () => validateField("role"));
    watch(() => form.value.status, () => validateField("status"));

    const validateForm = async () => {
      errors.value = {};
      try {
        await userSchema.validate(form.value, { abortEarly: false });
        return true;
      } catch (err: any) {
        if (err.inner) {
          err.inner.forEach((e: any) => {
            if (e.path) errors.value[e.path] = e.message;
          });
        }
        return false;
      }
    };

    const handleSubmit = async () => {
      const valid = await validateForm();
      if (!valid) return;

      let result;
      if (isEdit.value && selectedUser.value) {
        result = userStore.updateUser(selectedUser.value.id, form.value);
      } else {
        result = userStore.addUser(form.value);
      }

      if (result.success) {
        toast({
          title: "✓ Berhasil!",
          description: result.message,
          variant: "success",
          duration: 3000,
        });
        showFormDialog.value = false;
      } else {
        toast({
          title: "Gagal menyimpan user",
          description: result.message,
          variant: "destructive",
          duration: 3000,
        });
      }
    };

    const handleCloseForm = () => {
      showFormDialog.value = false;
      form.value = {
        name: "",
        email: "",
        role: "",
        status: "active",
      };
      errors.value = {};
    };

    return {
      searchQuery,
      filteredUsers,
      showDeleteDialog,
      showFormDialog,
      showDetailDialog,
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
      
      handleSubmit,
      handleCloseForm,
      getStatusBadgeClass,
      tableColumns,
    };
  },
});
</script>
