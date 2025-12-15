<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { ArrowLeft, XCircle, CalendarIcon, ChevronRight } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

import StepperTooltip from '@/components/StepperTooltip.vue'
import HorizontalStepper from '@/components/HorizontalStepper.vue'
import VerticalStepper from '@/components/VerticalStepper.vue'

import { useEmployeeForm } from '@/composables/useEmployeeForm'
import { useFormValidation } from '@/composables/useFormValidation'
import { EMPLOYEE_FORM_STEPS } from '@/composables/useMultiStepForm'
import { useMultiStepForm } from '@/composables/useMultiStepFormBase'

// Use steps from composable
const steps = EMPLOYEE_FORM_STEPS

const TOTAL_STEPS = steps.length

// Composables
const { form, errors: formErrors, showErrorDialog, errorMessage, dateValue, isEdit, loadEmployee, handleSubmit: submitForm, handleCancel, handleDateSelect: selectDate, closeErrorDialog } = useEmployeeForm()

const { validateStep, clearError: clearFieldError } = useFormValidation()

const { currentStep, stepperPosition, hoveredStep, hoveredElement, nextStep: next, prevStep, goToStep: navigateToStep, toggleStepperPosition, showTooltip, hideTooltip } = useMultiStepForm(TOTAL_STEPS, async (step: number) => {
  return await validateStep(form, formErrors, step)
})

const errors = formErrors


// Computed
const dateText = computed(() => {
  if (dateValue.value) {
    return format(dateValue.value, 'dd MMMM yyyy', { locale: idLocale })
  }
  return 'Pilih tanggal'
})

// Lifecycle
onMounted(() => {
  loadEmployee()
})

// Helper function to clear specific field error
const clearError = async (field: string) => {
  await clearFieldError(field, form, formErrors, currentStep.value)
}
</script>

<template>
  <div class="space-y-6">
    <!-- <div class="flex items-center gap-4">
      <Button variant="ghost" size="sm" @click="handleCancel" class="gap-2">
        <ArrowLeft class="h-4 w-4" />
        Kembali
      </Button>
    </div> -->

    <div>
      <h1 class="text-xl sm:text-2xl font-bold tracking-tight">
        {{ isEdit ? 'Edit Karyawan' : 'Tambah Karyawan Baru' }}
      </h1>
      <p class="text-sm sm:text-base text-muted-foreground mt-2">
        {{ isEdit ? 'Update informasi karyawan' : 'Tambahkan karyawan baru ke dalam sistem' }}
      </p>
    </div>

    <div :class="stepperPosition === 'left' ? 'flex flex-col lg:flex-row gap-6' : 'space-y-6'">
      <!-- Stepper Card -->
      <Card :class="stepperPosition === 'left' ? 'flex-shrink-0 lg:w-80' : ''">
        <CardHeader>
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle class="text-lg sm:text-xl">Progress Pengisian</CardTitle>
              <CardDescription class="text-sm">
                Step {{ currentStep }} dari {{ TOTAL_STEPS }}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              @click="toggleStepperPosition"
              class="gap-2 w-full sm:w-auto hidden lg:flex"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
              {{ stepperPosition === 'top' ? 'Samping' : 'Atas' }}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <HorizontalStepper
            v-if="stepperPosition === 'top'"
            :steps="steps"
            :current-step="currentStep"
            :total-steps="TOTAL_STEPS"
            :can-go-to-step="() => true" 
            @go-to-step="navigateToStep"
            @show-tooltip="showTooltip"
            @hide-tooltip="hideTooltip"
          />
          <VerticalStepper
            v-if="stepperPosition === 'left'"
            :steps="steps"
            :current-step="currentStep"
            :total-steps="TOTAL_STEPS"
            :can-go-to-step="() => true"
            @go-to-step="navigateToStep"
            @show-tooltip="showTooltip"
            @hide-tooltip="hideTooltip"
          />
        </CardContent>
      </Card>

      <!-- Form Card -->
      <Card :class="stepperPosition === 'left' ? 'flex-1' : ''">
        <CardHeader>
          <CardTitle class="text-lg sm:text-xl">{{ steps[currentStep - 1].title }}</CardTitle>
          <CardDescription class="text-sm">
            {{ steps[currentStep - 1].description }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Step 1: Data Pribadi -->
          <div v-show="currentStep === 1" class="space-y-6">
            <div class="space-y-2">
              <Label for="name">Nama Lengkap *</Label>
              <Input
                id="name"
                v-model="form.name"
                placeholder="Masukkan nama lengkap"
                :class="errors.name ? 'border-red-500' : ''"
                @input="clearError('name')"
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
                @input="clearError('email')"
              />
              <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
            </div>

            <div class="space-y-2">
              <Label for="phone">No. Telepon *</Label>
              <Input
                id="phone"
                v-model="form.phone"
                placeholder="081234567890"
                :class="errors.phone ? 'border-red-500' : ''"
                @input="clearError('phone')"
              />
              <p v-if="errors.phone" class="text-sm text-red-500">{{ errors.phone }}</p>
            </div>
          </div>

          <!-- Step 2: Kontak -->
          <div v-show="currentStep === 2" class="space-y-6">
            <div class="space-y-2">
              <Label for="address">Alamat Lengkap *</Label>
              <Input
                id="address"
                v-model="form.address"
                placeholder="Masukkan alamat lengkap"
                :class="errors.address ? 'border-red-500' : ''"
                @input="clearError('address')"
              />
              <p v-if="errors.address" class="text-sm text-red-500">{{ errors.address }}</p>
            </div>

            <div class="space-y-2">
              <Label for="city">Kota *</Label>
              <Input
                id="city"
                v-model="form.city"
                placeholder="Masukkan kota"
                :class="errors.city ? 'border-red-500' : ''"
                @input="clearError('city')"
              />
              <p v-if="errors.city" class="text-sm text-red-500">{{ errors.city }}</p>
            </div>

            <div class="space-y-2">
              <Label for="postalCode">Kode Pos *</Label>
              <Input
                id="postalCode"
                v-model="form.postalCode"
                placeholder="12345"
                :class="errors.postalCode ? 'border-red-500' : ''"
                @input="clearError('postalCode')"
              />
              <p v-if="errors.postalCode" class="text-sm text-red-500">{{ errors.postalCode }}</p>
            </div>
          </div>

          <!-- Step 3: Data Kontrak -->
          <div v-show="currentStep === 3" class="space-y-6">
            <div class="space-y-2">
              <Label for="position">Posisi *</Label>
              <Input
                id="position"
                v-model="form.position"
                placeholder="Contoh: Software Engineer, HR Manager"
                :class="errors.position ? 'border-red-500' : ''"
                @input="clearError('position')"
              />
              <p v-if="errors.position" class="text-sm text-red-500">{{ errors.position }}</p>
            </div>

            <div class="space-y-2">
              <Label for="department">Department *</Label>
              <Input
                id="department"
                v-model="form.department"
                placeholder="Contoh: Engineering, Human Resources, Sales"
                :class="errors.department ? 'border-red-500' : ''"
                @input="clearError('department')"
              />
              <p v-if="errors.department" class="text-sm text-red-500">{{ errors.department }}</p>
            </div>

            <div class="space-y-2">
              <Label for="joinDate">Tanggal Bergabung *</Label>
              <Popover>
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    :class="[
                      'w-full justify-start text-left font-normal',
                      !dateValue && 'text-muted-foreground',
                      errors.joinDate && 'border-red-500'
                    ]"
                    @click="clearError('joinDate')"
                  >
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ dateText }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0" align="start">
                  <Calendar
                    v-model="dateValue"
                    @update:model-value="selectDate"
                  />
                </PopoverContent>
              </Popover>
              <p v-if="errors.joinDate" class="text-sm text-red-500">{{ errors.joinDate }}</p>
            </div>
          </div>

          <!-- Step 4: Kontak Darurat -->
          <div v-show="currentStep === 4" class="space-y-6">
            <div class="space-y-2">
              <Label for="emergencyContact">Nama Kontak Darurat *</Label>
              <Input
                id="emergencyContact"
                v-model="form.emergencyContact"
                placeholder="Masukkan nama kontak darurat"
                :class="errors.emergencyContact ? 'border-red-500' : ''"
                @input="clearError('emergencyContact')"
              />
              <p v-if="errors.emergencyContact" class="text-sm text-red-500">{{ errors.emergencyContact }}</p>
            </div>

            <div class="space-y-2">
              <Label for="emergencyPhone">No. Telepon Kontak Darurat *</Label>
              <Input
                id="emergencyPhone"
                v-model="form.emergencyPhone"
                placeholder="081234567890"
                :class="errors.emergencyPhone ? 'border-red-500' : ''"
                @input="clearError('emergencyPhone')"
              />
              <p v-if="errors.emergencyPhone" class="text-sm text-red-500">{{ errors.emergencyPhone }}</p>
            </div>
          </div>

          <!-- Step 5: Data Bank -->
          <div v-show="currentStep === 5" class="space-y-6">
            <div class="space-y-2">
              <Label for="bankName">Nama Bank *</Label>
              <Input
                id="bankName"
                v-model="form.bankName"
                placeholder="Contoh: BCA, Mandiri, BNI"
                :class="errors.bankName ? 'border-red-500' : ''"
                @input="clearError('bankName')"
              />
              <p v-if="errors.bankName" class="text-sm text-red-500">{{ errors.bankName }}</p>
            </div>

            <div class="space-y-2">
              <Label for="bankAccount">Nomor Rekening *</Label>
              <Input
                id="bankAccount"
                v-model="form.bankAccount"
                placeholder="Masukkan nomor rekening"
                :class="errors.bankAccount ? 'border-red-500' : ''"
                @input="clearError('bankAccount')"
              />
              <p v-if="errors.bankAccount" class="text-sm text-red-500">{{ errors.bankAccount }}</p>
            </div>
          </div>

          <!-- Step 6: Data Pajak -->
          <div v-show="currentStep === 6" class="space-y-6">
            <div class="space-y-2">
              <Label for="taxNumber">NPWP *</Label>
              <Input
                id="taxNumber"
                v-model="form.taxNumber"
                placeholder="123456789012345"
                :class="errors.taxNumber ? 'border-red-500' : ''"
                @input="clearError('taxNumber')"
              />
              <p v-if="errors.taxNumber" class="text-sm text-red-500">{{ errors.taxNumber }}</p>
            </div>
          </div>

          <!-- Step 7: Pendidikan -->
          <div v-show="currentStep === 7" class="space-y-6">
            <div class="space-y-2">
              <Label for="education">Pendidikan Terakhir *</Label>
              <Input
                id="education"
                v-model="form.education"
                placeholder="Contoh: S1, S2, D3"
                :class="errors.education ? 'border-red-500' : ''"
                @input="clearError('education')"
              />
              <p v-if="errors.education" class="text-sm text-red-500">{{ errors.education }}</p>
            </div>

            <div class="space-y-2">
              <Label for="university">Nama Institusi *</Label>
              <Input
                id="university"
                v-model="form.university"
                placeholder="Masukkan nama universitas/institusi"
                :class="errors.university ? 'border-red-500' : ''"
                @input="clearError('university')"
              />
              <p v-if="errors.university" class="text-sm text-red-500">{{ errors.university }}</p>
            </div>

            <div class="space-y-2">
              <Label for="graduationYear">Tahun Lulus *</Label>
              <Input
                id="graduationYear"
                v-model="form.graduationYear"
                placeholder="2020"
                :class="errors.graduationYear ? 'border-red-500' : ''"
                @input="clearError('graduationYear')"
              />
              <p v-if="errors.graduationYear" class="text-sm text-red-500">{{ errors.graduationYear }}</p>
            </div>
          </div>

          <!-- Step 8: Data Pengguna -->
          <div v-show="currentStep === 8" class="space-y-6">
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

          <!-- Step 9: Review -->
          <div v-show="currentStep === 9" class="space-y-6">
            <!-- Summary Review -->
            <div class="rounded-lg border bg-muted/50 p-4 space-y-4">
              <h3 class="font-semibold">Ringkasan Data Lengkap</h3>
              
              <div class="space-y-3">
                <div class="border-b pb-2">
                  <h4 class="font-medium text-sm mb-2">Data Pribadi</h4>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Nama:</span>
                      <span class="font-medium">{{ form.name || '-' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Email:</span>
                      <span class="font-medium">{{ form.email || '-' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Telepon:</span>
                      <span class="font-medium">{{ form.phone || '-' }}</span>
                    </div>
                  </div>
                </div>

                <div class="border-b pb-2">
                  <h4 class="font-medium text-sm mb-2">Alamat</h4>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Alamat:</span>
                      <span class="font-medium">{{ form.address || '-' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Kota:</span>
                      <span class="font-medium">{{ form.city || '-' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Kode Pos:</span>
                      <span class="font-medium">{{ form.postalCode || '-' }}</span>
                    </div>
                  </div>
                </div>

                <div class="border-b pb-2">
                  <h4 class="font-medium text-sm mb-2">Pekerjaan</h4>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Posisi:</span>
                      <span class="font-medium">{{ form.position || '-' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Department:</span>
                      <span class="font-medium">{{ form.department || '-' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Tanggal Bergabung:</span>
                      <span class="font-medium">{{ dateText === 'Pilih tanggal' ? '-' : dateText }}</span>
                    </div>
                  </div>
                </div>

                <div class="border-b pb-2">
                  <h4 class="font-medium text-sm mb-2">Kontak Darurat</h4>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Nama:</span>
                      <span class="font-medium">{{ form.emergencyContact || '-' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Telepon:</span>
                      <span class="font-medium">{{ form.emergencyPhone || '-' }}</span>
                    </div>
                  </div>
                </div>

                <div class="border-b pb-2">
                  <h4 class="font-medium text-sm mb-2">Informasi Bank</h4>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Bank:</span>
                      <span class="font-medium">{{ form.bankName || '-' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">No. Rekening:</span>
                      <span class="font-medium">{{ form.bankAccount || '-' }}</span>
                    </div>
                  </div>
                </div>

                <div class="border-b pb-2">
                  <h4 class="font-medium text-sm mb-2">Pajak</h4>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">NPWP:</span>
                      <span class="font-medium">{{ form.taxNumber || '-' }}</span>
                    </div>
                  </div>
                </div>

                <div class="border-b pb-2">
                  <h4 class="font-medium text-sm mb-2">Pendidikan</h4>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Jenjang:</span>
                      <span class="font-medium">{{ form.education || '-' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Institusi:</span>
                      <span class="font-medium">{{ form.university || '-' }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Tahun Lulus:</span>
                      <span class="font-medium">{{ form.graduationYear || '-' }}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="font-medium text-sm mb-2">Status Akun</h4>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between">
                      <span class="text-muted-foreground">Status:</span>
                      <span class="font-medium">{{ form.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t">
            <!-- Mobile: Next/Submit button first, then Previous, then Cancel -->
            <div class="flex flex-col sm:hidden gap-3">
              <Button 
                v-if="currentStep < TOTAL_STEPS"
                type="button" 
                @click="next"
                class="gap-2 w-full"
              >
                Selanjutnya
                <ChevronRight class="h-4 w-4" />
              </Button>
              
              <Button 
                v-else
                type="submit"
                class="w-full"
              >
                {{ isEdit ? 'Update Karyawan' : 'Simpan Karyawan' }}
              </Button>

              <Button 
                v-if="currentStep > 1"
                type="button" 
                variant="outline" 
                @click="prevStep"
                class="w-full"
              >
                Sebelumnya
              </Button>

              <Button type="button" variant="outline" @click="handleCancel" class="w-full">
                Batal
              </Button>
            </div>

            <!-- Desktop: Original layout -->
            <div class="hidden sm:flex w-full justify-between">
              <div class="w-auto">
                <Button 
                  v-if="currentStep > 1"
                  type="button" 
                  variant="outline" 
                  @click="prevStep"
                  class="w-auto"
                >
                  Sebelumnya
                </Button>
              </div>
              
              <div class="flex flex-row gap-3 w-auto">
                <Button type="button" variant="outline" @click="handleCancel" class="w-auto">
                  Batal
                </Button>
                
                <Button 
                  v-if="currentStep < TOTAL_STEPS"
                  type="button" 
                  @click="next"
                  class="gap-2 w-auto"
                >
                  Selanjutnya
                  <ChevronRight class="h-4 w-4" />
                </Button>
                
                <Button 
                  v-else
                  type="submit"
                  class="w-auto"
                >
                  {{ isEdit ? 'Update Karyawan' : 'Simpan Karyawan' }}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      </Card>
    </div>

    <!-- Stepper Tooltip Component -->
    <StepperTooltip
      v-for="step in steps"
      :key="step.number"
      :show="hoveredStep === step.number && !!step.tooltip"
      :title="step.title"
      :description="step.tooltip || ''"
      :target-element="hoveredElement"
      :position="stepperPosition === 'top' ? 'top' : 'right'"
    />

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
