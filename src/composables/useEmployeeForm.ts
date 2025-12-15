import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEmployeeManagementStore } from '@/stores/employeeManagement'
import { useToast } from '@/components/ui/toast/use-toast'
import { format } from 'date-fns'
import * as yup from 'yup'

export interface EmployeeFormData {
  name: string
  email: string
  position: string
  department: string
  phone: string
  joinDate: string
  status: 'active' | 'inactive'
  address: string
  city: string
  postalCode: string
  emergencyContact: string
  emergencyPhone: string
  bankName: string
  bankAccount: string
  taxNumber: string
  education: string
  university: string
  graduationYear: string
}

export function useEmployeeForm() {
  const router = useRouter()
  const route = useRoute()
  const employeeStore = useEmployeeManagementStore()
  const { toast } = useToast()

  const isEdit = computed(() => !!route.params.id)
  const employeeId = computed(() => route.params.id as string)

  const form = ref<EmployeeFormData>({
    name: '',
    email: '',
    position: '',
    department: '',
    phone: '',
    joinDate: '',
    status: 'active',
    address: '',
    city: '',
    postalCode: '',
    emergencyContact: '',
    emergencyPhone: '',
    bankName: '',
    bankAccount: '',
    taxNumber: '',
    education: '',
    university: '',
    graduationYear: ''
  })

  const errors = ref<Record<string, string>>({})
  const showErrorDialog = ref(false)
  const errorMessage = ref('')
  const dateValue = ref<Date | undefined>()

  const loadEmployee = () => {
    if (isEdit.value) {
      const employee = employeeStore.getEmployeeById(employeeId.value)
      if (employee) {
        form.value = {
          name: employee.name,
          email: employee.email,
          position: employee.position,
          department: employee.department,
          phone: employee.phone,
          joinDate: employee.joinDate,
          status: employee.status,
          address: '',
          city: '',
          postalCode: '',
          emergencyContact: '',
          emergencyPhone: '',
          bankName: '',
          bankAccount: '',
          taxNumber: '',
          education: '',
          university: '',
          graduationYear: ''
        }
        if (employee.joinDate) {
          dateValue.value = new Date(employee.joinDate)
        }
      } else {
        router.push('/employees')
      }
    }
  }

  const handleSubmit = async (validateCurrentStep: () => Promise<boolean>) => {
    const isValid = await validateCurrentStep()
    if (!isValid) return

    let result
    if (isEdit.value) {
      result = employeeStore.updateEmployee(employeeId.value, form.value)
    } else {
      result = employeeStore.addEmployee(form.value)
    }

    if (result.success) {
      toast({
        title: '✓ Berhasil!',
        description: result.message,
        variant: 'success',
        duration: 3000,
      })
      router.push('/employees')
    } else {
      errorMessage.value = result.message
      showErrorDialog.value = true
    }
  }

  const handleCancel = () => {
    router.push('/employees')
  }

  const handleDateSelect = (date: Date | undefined, clearError: (field: string) => void) => {
    if (date) {
      dateValue.value = date
      form.value.joinDate = format(date, 'yyyy-MM-dd')
      clearError('joinDate')
    }
  }

  const closeErrorDialog = () => {
    showErrorDialog.value = false
    errorMessage.value = ''
  }

  return {
    form,
    errors,
    showErrorDialog,
    errorMessage,
    dateValue,
    isEdit,
    loadEmployee,
    handleSubmit,
    handleCancel,
    handleDateSelect,
    closeErrorDialog
  }
}
