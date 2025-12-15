<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ArrowUpRight, Users, FileText, CheckSquare } from 'lucide-vue-next' // Install ini kalau belum: npm i lucide-vue-next

// Mock data statistik
const stats = [
  { title: 'Total Karyawan', value: '42', desc: '+2 bulan ini', icon: Users },
  { title: 'Invoice Pending', value: 'Rp 12.5jt', desc: '3 invoice perlu approval', icon: FileText },
  { title: 'Tugas Aktif', value: '18', desc: '5 deadline hari ini', icon: CheckSquare },
]
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card v-for="(stat, index) in stats" :key="index">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">
            {{ stat.title }}
          </CardTitle>
          <component :is="stat.icon" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stat.value }}</div>
          <p class="text-xs text-muted-foreground mt-1">
            {{ stat.desc }}
          </p>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card class="col-span-4">
        <CardHeader>
          <CardTitle>Aktivitas Terkini</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div class="flex items-center" v-for="i in 3" :key="i">
              <div class="ml-4 space-y-1">
                <p class="text-sm font-medium leading-none">Riko menambahkan task baru</p>
                <p class="text-sm text-muted-foreground">2 jam yang lalu</p>
              </div>
              <div class="ml-auto font-medium text-sm">+Project Alpha</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>