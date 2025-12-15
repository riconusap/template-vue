<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { Check } from 'lucide-vue-next'
import type { Step } from '@/composables/useStepTypes'

export default defineComponent({
  name: 'VerticalStepper',
  components: {
    Check
  },
  props: {
    steps: {
      type: Array as PropType<Step[]>,
      required: true
    },
    currentStep: {
      type: Number,
      required: true
    },
    totalSteps: {
      type: Number,
      required: true
    },
    canGoToStep: {
      type: Function as PropType<(step: number) => boolean>,
      default: () => () => true
    }
  },
  emits: ['go-to-step', 'show-tooltip', 'hide-tooltip'],
  setup(props, { emit }) {
    return {
      emit
    }
  }
})
</script>

<template>
  <div class="flex-shrink-0 w-64">
    <div>
      <div 
        v-for="step in steps" 
        :key="step.number"
        class="relative flex gap-4"
      >
        <div class="flex flex-col items-center relative">
          <div class="relative z-10">
            <button
              type="button"
              :disabled="!canGoToStep(step.number)"
              @click="emit('go-to-step', step.number)"
              @mouseenter="(e) => emit('show-tooltip', step.number, e)"
              @mouseleave="emit('hide-tooltip')"
              :class="[
                'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200',
                currentStep === step.number 
                  ? 'border-primary bg-primary text-white' 
                  : currentStep > step.number
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-gray-300 bg-white text-gray-400',
                !canGoToStep(step.number) ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <Check v-if="currentStep > step.number" class="h-5 w-5" />
              <span v-else>{{ step.number }}</span>
            </button>
          </div>
          <div 
            v-if="step.number < totalSteps"
            :class="[
              'absolute w-0.5 transition-colors duration-200',
              currentStep > step.number ? 'bg-green-600' : 'bg-gray-300'
            ]"
            :style="{ top: '2.5rem', bottom: '-1rem' }"
          />
        </div>
        <div class="flex-1 py-1.5 pb-4">
          <p 
            :class="[
              'text-sm font-medium',
              currentStep === step.number ? 'text-foreground' : 'text-gray-500'
            ]"
          >
            {{ step.title }}
          </p>
          <p class="text-xs text-muted-foreground mt-0.5">
            {{ step.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
