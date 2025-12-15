<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-gray-800">404</h1>
      <p class="mt-4 text-2xl font-semibold text-gray-600">Halaman Tidak Ditemukan</p>
      <p class="mt-2 text-gray-500">
        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <div class="mt-8">
        <Button @click="goBack" variant="outline" class="mr-2">
          Kembali
        </Button>
        <Button @click="goHome">
          Ke Halaman Utama
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>
