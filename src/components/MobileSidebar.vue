<script lang="ts">
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { X, LayoutDashboard, Users, UserCog, FileText, ClipboardList } from 'lucide-vue-next'
import { themeConfig } from '@/config/theme.config'

interface MenuItem {
  name: string
  path: string
  icon: any
}

export default defineComponent({
  name: 'MobileSidebar',
  components: {
    Button,
    X, LayoutDashboard, Users, UserCog, FileText, ClipboardList
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object as () => { name: string; role: string },
      required: true
    },
    onClose: {
      type: Function,
      required: true
    },
    onLogout: {
      type: Function,
      required: true
    },
    logoType: {
      type: String,
      default: 'text' // 'text' or 'image'
    },
    logoSrc: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const route = useRoute()

    const menuItems: MenuItem[] = [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'User Management', path: '/users', icon: Users },
      { name: 'Employee Management', path: '/employees', icon: UserCog },
      { name: 'Invoicing', path: '/invoices', icon: FileText },
      { name: 'Tugas', path: '/tasks', icon: ClipboardList },
    ]

    return {
      route,
      menuItems,
      themeConfig,
      X,
      LayoutDashboard,
      Users,
      UserCog,
      FileText,
      ClipboardList,
      props
    }
  }
})
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    leave-active-class="transition-opacity duration-200 ease-in"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <aside 
      v-if="isOpen"
      class="fixed inset-0 z-50 md:hidden"
    >
      <div class="absolute inset-0 bg-black/50" @click="onClose"></div>
    </aside>
  </Transition>

  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    leave-active-class="transition-transform duration-200 ease-in"
    enter-from-class="-translate-x-full"
    enter-to-class="translate-x-0"
    leave-from-class="translate-x-0"
    leave-to-class="-translate-x-full"
  >
    <div 
      v-if="isOpen"
      class="fixed left-0 top-0 bottom-0 z-50 border-r flex flex-col md:hidden"
      :style="{
        width: themeConfig.sidebar.width,
        backgroundColor: themeConfig.sidebar.background,
        borderColor: themeConfig.header.borderColor
      }"
    >
      <div class="p-6 flex items-center justify-between border-b"
        :style="{
          height: themeConfig.header.height,
          borderColor: themeConfig.header.borderColor
        }"
      >
        <template v-if="props.logoType === 'image' && props.logoSrc">
          <img
            :src="props.logoSrc"
            alt="Logo"
            class="h-8 w-auto object-contain mx-auto"
            style="max-width: 120px;"
          />
        </template>
        <h1 v-else class="text-lg font-bold tracking-tight text-center" :style="{ color: themeConfig.typography.heading }">VIGOR</h1>
        <Button variant="ghost" size="sm" class="h-8 w-8 p-0" @click="onClose">
          <X class="h-4 w-4" />
        </Button>
      </div>
      
      <nav class="flex-1 p-4 space-y-1">
        <RouterLink 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          @click="onClose"
          class="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-all"
          :style="{
            backgroundColor: route.path === item.path ? themeConfig.sidebar.activeBackground : 'transparent',
            color: route.path === item.path ? themeConfig.sidebar.activeText : themeConfig.sidebar.textColor,
            border: route.path === item.path ? `1px solid ${themeConfig.sidebar.activeBorder}` : '1px solid transparent',
            transitionDuration: themeConfig.transitions.normal
          }"
        >
          <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
          <span>{{ item.name }}</span>
        </RouterLink>
      </nav>
    </div>
  </Transition>
</template>
