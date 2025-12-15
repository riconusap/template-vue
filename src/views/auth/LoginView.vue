<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

const auth = useAuthStore()
const email = ref('admin@erp.com')
const password = ref('password')
const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  // Simulasi network delay
  await new Promise(r => setTimeout(r, 800))
  
  const success = await auth.login(email.value, password.value)
  if (!success) {
    errorMessage.value = 'Email atau password salah'
  }
  isLoading.value = false
}
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-slate-50">
    <Card class="w-[350px]">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Masuk untuk mengelola sistem ERP.</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin">
          <div class="grid w-full items-center gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" v-model="email" placeholder="admin@erp.com" />
            </div>
            <div class="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" v-model="password" />
            </div>
            <p v-if="errorMessage" class="text-sm text-red-500">{{ errorMessage }}</p>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-between">
        <Button variant="outline">Batal</Button>
        <Button @click="handleLogin" :disabled="isLoading">
          {{ isLoading ? 'Masuk...' : 'Login' }}
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>