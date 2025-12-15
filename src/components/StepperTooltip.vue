<script lang="ts">
import { defineComponent, ref, watch, onMounted, onUnmounted, type PropType } from 'vue'

export default defineComponent({
  name: 'StepperTooltip',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    targetElement: {
      type: Object as PropType<HTMLElement | null>,
      default: null
    },
    position: {
      type: String as PropType<'top' | 'right'>,
      default: 'top'
    }
  },
  setup(props) {

const tooltipStyle = ref({
  top: '0px',
  left: '0px',
  opacity: '0'
})

const updatePosition = () => {
  if (!props.targetElement || !props.show) {
    tooltipStyle.value.opacity = '0'
    return
  }

  const rect = props.targetElement.getBoundingClientRect()
  
  if (props.position === 'top') {
    tooltipStyle.value = {
      top: `${rect.top - 8}px`,
      left: `${rect.left + rect.width / 2}px`,
      opacity: '1'
    }
  } else {
    tooltipStyle.value = {
      top: `${rect.top + rect.height / 2}px`,
      left: `${rect.right + 16}px`,
      opacity: '1'
    }
  }
}

watch(() => [props.show, props.targetElement], () => {
  if (props.show && props.targetElement) {
    // Small delay to ensure DOM is ready
    setTimeout(updatePosition, 10)
  } else {
    tooltipStyle.value.opacity = '0'
  }
}, { immediate: true })

// Update position on scroll/resize
onMounted(() => {
  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('resize', updatePosition)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
})

    return {
      tooltipStyle
    }
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="tooltip-layer w-64 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl"
        :style="{
          top: tooltipStyle.top,
          left: tooltipStyle.left,
          transform: position === 'top' ? 'translate(-50%, -100%)' : 'translateY(-50%)'
        }"
      >
        <div class="font-semibold mb-1">{{ title }}</div>
        <div class="text-gray-300">{{ description }}</div>
        <!-- Arrow -->
        <div
          v-if="position === 'top'"
          class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"
        ></div>
        <div
          v-else
          class="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"
        ></div>
      </div>
    </Transition>
  </Teleport>
</template>
