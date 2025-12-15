<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ChevronRight, Home } from 'lucide-vue-next'

interface BreadcrumbItem {
  label: string
  path?: string
}

export default defineComponent({
  name: 'DynamicBreadcrumb',
  components: {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    ChevronRight,
    Home
  },
  setup() {
    const route = useRoute()

    const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
      const items: BreadcrumbItem[] = [
        { label: 'Dashboard', path: '/' }
      ]

      // User Management routes
      if (route.path.startsWith('/users')) {
        items.push({ label: 'User Management' })
      }
      // Employee Management routes
      else if (route.path.startsWith('/employees')) {
        items.push({ label: 'Employee Management', path: '/employees' })
        if (route.path === '/employees/create') {
          items.push({ label: 'Tambah Karyawan' })
        } else if (route.path.startsWith('/employees/edit/')) {
          items.push({ label: 'Edit Karyawan' })
        }
      }
      // Other routes
      else if (route.path !== '/') {
        const pathSegments = route.path.split('/').filter(Boolean)
        pathSegments.forEach((segment, index) => {
          const label = segment.charAt(0).toUpperCase() + segment.slice(1)
          const isLast = index === pathSegments.length - 1
          items.push({
            label,
            path: isLast ? undefined : '/' + pathSegments.slice(0, index + 1).join('/')
          })
        })
      }

      return items
    })

    return {
      breadcrumbItems,
      Home,
      ChevronRight
    }
  }
})
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem v-for="(item, index) in breadcrumbItems" :key="index">
        <BreadcrumbLink v-if="item.path" :href="item.path" class="flex items-center gap-2">
          <Home v-if="index === 0" class="h-4 w-4" />
          <span>{{ item.label }}</span>
        </BreadcrumbLink>
        <BreadcrumbPage v-else class="flex items-center gap-2">
          <Home v-if="index === 0" class="h-4 w-4" />
          <span>{{ item.label }}</span>
        </BreadcrumbPage>
        <BreadcrumbSeparator v-if="index < breadcrumbItems.length - 1">
          <ChevronRight class="h-4 w-4" />
        </BreadcrumbSeparator>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>
