<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ref, computed } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import MobileSidebar from '@/components/MobileSidebar.vue'
import DashboardHeader from '@/components/DashboardHeader.vue'

const auth = useAuthStore()
const isMobileMenuOpen = ref(false)
const sidebarRef = ref<InstanceType<typeof Sidebar> | null>(null)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const isSidebarCollapsed = computed(() => {
  return sidebarRef.value?.isCollapsed ?? false
})
</script>

<template>
  <div class="flex h-screen bg-white">
    <!-- Desktop Sidebar -->
    <Sidebar ref="sidebarRef" />

    <!-- Mobile Sidebar -->
    <MobileSidebar 
      :isOpen="isMobileMenuOpen" 
      :user="auth.user" 
      :onClose="toggleMobileMenu"
      :onLogout="auth.logout" 
    />

    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <DashboardHeader 
        :user="auth.user"
        :isSidebarCollapsed="isSidebarCollapsed"
        :onToggleMobileMenu="toggleMobileMenu"
        :onLogout="auth.logout"
      />

      <main class="flex-1 overflow-auto bg-white p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>