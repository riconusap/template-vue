import { ref, type Ref } from 'vue'
import * as yup from 'yup'
import type { EmployeeFormData } from './useEmployeeForm'

const validationSchemas = [
  // Step 1: Data Pribadi
  yup.object({
    name: yup.string().required('Nama wajib diisi').min(3, 'Nama minimal 3 karakter'),
    email: yup.string().required('Email wajib diisi').email('Format email tidak valid'),
    phone: yup.string().required('No. Telepon wajib diisi').matches(/^[0-9]{10,13}$/, 'Format nomor telepon tidak valid (10-13 digit)')
  }),
  // Step 2: Kontak
  yup.object({
    address: yup.string().required('Alamat wajib diisi'),
    city: yup.string().required('Kota wajib diisi'),
    postalCode: yup.string().required('Kode pos wajib diisi').matches(/^[0-9]{5}$/, 'Kode pos harus 5 digit')
  }),
  // Step 3: Data Kontrak
  yup.object({
    position: yup.string().required('Posisi wajib diisi'),
    department: yup.string().required('Department wajib diisi'),
    joinDate: yup.string().required('Tanggal bergabung wajib diisi')
  }),
  // Step 4: Kontak Darurat
  yup.object({
    emergencyContact: yup.string().required('Nama kontak darurat wajib diisi'),
    emergencyPhone: yup.string().required('No. telepon kontak darurat wajib diisi').matches(/^[0-9]{10,13}$/, 'Format nomor telepon tidak valid (10-13 digit)')
  }),
  // Step 5: Data Bank
  yup.object({
    bankName: yup.string().required('Nama bank wajib diisi'),
    bankAccount: yup.string().required('Nomor rekening wajib diisi').matches(/^[0-9]+$/, 'Nomor rekening harus berupa angka')
  }),
  // Step 6: Data Pajak
  yup.object({
    taxNumber: yup.string().required('NPWP wajib diisi').matches(/^[0-9]{15}$/, 'NPWP harus 15 digit')
  }),
  // Step 7: Pendidikan
  yup.object({
    education: yup.string().required('Pendidikan terakhir wajib diisi'),
    university: yup.string().required('Nama institusi wajib diisi'),
    graduationYear: yup.string().required('Tahun lulus wajib diisi').matches(/^[0-9]{4}$/, 'Format tahun tidak valid')
  }),
  // Step 8: Data Pengguna
  yup.object({
    status: yup.string().oneOf(['active', 'inactive']).required()
  }),
  // Step 9: Review
  yup.object({})
]

export function useFormValidation() {
  const validateStep = async (formData: Ref<EmployeeFormData>, errors: Ref<Record<string, string>>, step: number) => {
    errors.value = {}
    
    try {
      await validationSchemas[step - 1].validate(formData.value, { abortEarly: false })
      return true
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        err.inner.forEach((error) => {
          if (error.path) {
            errors.value[error.path] = error.message
          }
        })
      }
      return false
    }
  }

  const clearError = async (field: string, formData: Ref<EmployeeFormData>, errors: Ref<Record<string, string>>, currentStep: number) => {
    if (errors.value[field]) {
      delete errors.value[field]
    }
    
    try {
      await validationSchemas[currentStep - 1].validateAt(field, formData.value)
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        errors.value[field] = err.message
      }
    }
  }

  return {
    validateStep,
    clearError
  }
}
