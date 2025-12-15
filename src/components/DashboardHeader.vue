<script lang="ts">
import { defineComponent, computed, type PropType } from 'vue'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import DynamicBreadcrumb from '@/components/DynamicBreadcrumb.vue'
import { Menu, Settings, LogOut } from 'lucide-vue-next'
import { themeConfig } from '@/config/theme.config'

export default defineComponent({
  name: 'DashboardHeader',
  components: {
    Button,
    Avatar,
    AvatarFallback,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DynamicBreadcrumb,
    Menu, Settings, LogOut
  },
  props: {
    user: {
      type: Object as PropType<{ name: string; role: string }>,
      required: true
    },
    isSidebarCollapsed: {
      type: Boolean,
      default: false
    },
    onToggleMobileMenu: {
      type: Function,
      required: true
    },
    onLogout: {
      type: Function,
      required: true
    }
  },
  setup(props) {
    const userInitials = computed(() => {
      const names = props.user.name.split(' ')
      if (names.length >= 2) {
        return names[0][0] + names[1][0]
      }
      return props.user.name.substring(0, 1)
    })

    return {
      userInitials,
      themeConfig,
    }
  }
})
</script>

<template>
  <header class="border-b bg-white">
    <div class="h-14 flex items-center justify-between px-6">
      <div class="flex items-center">
        <Button variant="ghost" size="sm" class="h-8 w-8 p-0 md:hidden" @click="onToggleMobileMenu">
          <Menu class="h-5 w-5" />
        </Button>
        <h1 class="ml-4 text-lg font-bold tracking-tight" :class="isSidebarCollapsed ? 'md:block' : 'md:hidden'">VIGOR</h1>
      </div>

      <!-- User Dropdown -->
    <div class="ml-auto">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button 
            variant="plain" 
            class="relative h-10 gap-2 rounded-lg px-3"
          >
            <Avatar class="h-8 w-8 ring-2 ring-slate-200 ring-offset-2 transition-colors hover:bg-black hover:text-white group">
              <AvatarFallback class="text-black text-sm font-semibold group-hover:text-white">
                {{ userInitials }}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-64">
          <DropdownMenuLabel>
            <div class="flex items-center gap-3 py-2">
              <Avatar class="h-12 w-12 ring-2 ring-slate-200">
                <AvatarFallback class="text-black font-semibold">
                  {{ userInitials }}
                </AvatarFallback>
              </Avatar>
              <div class="flex flex-col">
                <p class="text-sm font-semibold">{{ user.name }}</p>
                <p class="text-xs text-muted-foreground">{{ user.role }}</p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="cursor-pointer py-2.5">
            <Settings class="mr-3 h-4 w-4" />
            <span class="font-medium">User Setting</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            class="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 py-2.5 font-medium" 
            @click="onLogout"
          >
            <LogOut class="mr-3 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    </div>
    
    <!-- Breadcrumb -->
    <div class="px-6 py-3 border-t bg-slate-50/50">
      <DynamicBreadcrumb />
    </div>
  </header>
</template>
