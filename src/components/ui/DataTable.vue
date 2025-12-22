<template>
  <div>
    <div class="overflow-x-auto rounded-md border">
      <table class="w-full min-w-[700px] text-sm">
        <thead>
          <tr class="border-b bg-muted/50">
            <th v-for="col in columns" :key="col.key" :class="col.thClass" class="px-2 sm:px-4 py-3 text-left font-medium whitespace-nowrap">
              {{ col.label }}
            </th>
            <th v-if="hasActions" class="px-2 sm:px-4 py-3 text-right font-medium whitespace-nowrap">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedRows" :key="row[rowKey]" class="border-b hover:bg-muted/50 transition-colors">
            <td v-for="col in columns" :key="col.key" :class="col.tdClass" class="px-2 sm:px-4 py-3">
              <slot :name="`cell-${col.key}`" :row="row">
                {{ row[col.key] }}
              </slot>
            </td>
            <td v-if="hasActions" class="px-2 sm:px-4 py-3">
              <slot name="actions" :row="row" />
            </td>
          </tr>
          <tr v-if="paginatedRows.length === 0">
            <td :colspan="columns.length + (hasActions ? 1 : 0)" class="px-2 sm:px-4 py-8 text-center text-muted-foreground">
              <slot name="empty">Tidak ada data ditemukan</slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showPagination && totalPages > 1" class="flex items-center justify-between mt-4 gap-2 flex-wrap">
      <div class="text-sm text-muted-foreground">
        Menampilkan {{ startRow + 1 }}-{{ endRow }} dari {{ rows.length }} data
      </div>
      <div class="flex items-center gap-1">
        <button
          class="px-2 py-1 rounded border text-xs"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          Prev
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          class="px-2 py-1 rounded border text-xs"
          :class="page === currentPage ? 'bg-primary text-white' : ''"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <button
          class="px-2 py-1 rounded border text-xs"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, ref, watch } from 'vue'

interface Column {
  key: string
  label: string
  thClass?: string
  tdClass?: string
}

export default defineComponent({
  name: 'DataTable',
  props: {
    columns: {
      type: Array as PropType<Column[]>,
      required: true
    },
    rows: {
      type: Array as PropType<any[]>,
      required: true
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    hasActions: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 10
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    page: {
      type: Number,
      default: 1
    }
  },
  emits: ['update:page'],
  setup(props, { emit }) {
    const currentPage = ref(props.page)

    watch(() => props.page, (val) => {
      currentPage.value = val
    })

    watch(currentPage, (val) => {
      emit('update:page', val)
    })

    const totalPages = computed(() => Math.ceil(props.rows.length / props.pageSize))
    const startRow = computed(() => (currentPage.value - 1) * props.pageSize)
    const endRow = computed(() => Math.min(currentPage.value * props.pageSize, props.rows.length))
    const paginatedRows = computed(() => props.rows.slice(startRow.value, endRow.value))

    // Pagination logic for visible page numbers
    const visiblePages = computed(() => {
      const pages = []
      const max = totalPages.value
      let start = Math.max(1, currentPage.value - 2)
      let end = Math.min(max, currentPage.value + 2)
      if (end - start < 4) {
        if (start === 1) end = Math.min(max, start + 4)
        if (end === max) start = Math.max(1, end - 4)
      }
      for (let i = start; i <= end; i++) pages.push(i)
      return pages
    })

    function goToPage(page: number) {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
      }
    }

    return {
      currentPage,
      totalPages,
      startRow,
      endRow,
      paginatedRows,
      goToPage,
      visiblePages
    }
  }
})
</script>
