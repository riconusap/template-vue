<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ChevronLeft, ChevronRight, LayoutDashboard, Users, UserCog, FileText, ClipboardList } from 'lucide-vue-next'
import { themeConfig } from '@/config/theme.config'

interface MenuItem {
  name: string
  path: string
  icon: any
}

export default defineComponent({
  name: 'Sidebar',
  components: {
    Button,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    ChevronLeft, ChevronRight, LayoutDashboard, Users, UserCog, FileText, ClipboardList
  },
  props: {
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
    const isCollapsed = ref(false)

    const menuItems: MenuItem[] = [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'User Management', path: '/users', icon: Users },
      { name: 'Employee Management', path: '/employees', icon: UserCog },
      { name: 'Invoicing', path: '/invoices', icon: FileText },
      { name: 'Tugas', path: '/tasks', icon: ClipboardList },
    ]

    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value
    }

    return {
      route,
      isCollapsed,
      menuItems,
      toggleSidebar,
      themeConfig,
      ChevronLeft,
      ChevronRight,
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
  <TooltipProvider>
    <aside 
      class="border-r hidden md:flex flex-col transition-all"
      :style="{
        backgroundColor: themeConfig.sidebar.background,
        width: isCollapsed ? themeConfig.sidebar.collapsedWidth : themeConfig.sidebar.width,
        transitionDuration: themeConfig.transitions.slow
      }"
    >
      <div class="flex items-center border-b px-4 relative"
        :style="{
          height: themeConfig.header.height,
          borderColor: themeConfig.header.borderColor
        }"
      >
        <template v-if="!isCollapsed">
          <img
            v-if="props.logoType === 'image' && props.logoSrc"
            :src="props.logoSrc"
            alt="Logo"
            class="absolute left-1/2 -translate-x-1/2 h-8 w-auto object-contain transition-opacity duration-300"
            style="max-width: 120px;"
          />
          <h1
            v-else
            class="absolute left-1/2 -translate-x-1/2 text-lg font-bold tracking-tight text-center transition-opacity duration-300"
            style="width: max-content;"
          >
            VIGOR
          </h1>
        </template>
        <Button 
          variant="ghost" 
          size="sm" 
          class="h-8 w-8 p-0 flex-shrink-0 ml-auto"
          @click="toggleSidebar"
        >
          <ChevronLeft v-if="!isCollapsed" class="h-4 w-4" />
          <ChevronRight v-if="isCollapsed" class="h-4 w-4" />
        </Button>
      </div>
      
      <nav class="flex-1 p-4 space-y-1">
        <template v-for="item in menuItems" :key="item.path">
          <Tooltip v-if="isCollapsed" :delayDuration="0">
            <TooltipTrigger as-child>
              <RouterLink 
                :to="item.path"
                class="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-all justify-center"
                :style="{
                  backgroundColor: route.path === item.path ? themeConfig.sidebar.activeBackground : 'transparent',
                  color: route.path === item.path ? themeConfig.sidebar.activeText : themeConfig.sidebar.textColor,
                  border: route.path === item.path ? `1px solid ${themeConfig.sidebar.activeBorder}` : '1px solid transparent',
                  transitionDuration: themeConfig.transitions.normal
                }"
              >
                <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
              </RouterLink>
            </TooltipTrigger>
            <TooltipContent side="right" class="font-medium">
              {{ item.name }}
            </TooltipContent>
          </Tooltip>
          <RouterLink 
            v-else
            :to="item.path"
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
        </template>
      </nav>
    </aside>
  </TooltipProvider>
</template>
