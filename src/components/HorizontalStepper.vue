<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { Check } from 'lucide-vue-next'
import type { Step } from '@/composables/useMultiStepForm'

export default defineComponent({
  name: 'HorizontalStepper',
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
  methods: {
    getVisibleSteps() {
      const current = this.currentStep
      const total = this.totalSteps
      if (current === 1) {
        return this.steps.slice(0, 3)
      } else if (current === total) {
        return this.steps.slice(-3)
      } else {
        return this.steps.slice(current - 2, current + 1)
      }
    }
  }
})
</script>

<template>
  <div class="mb-8">
    <!-- Mobile: Show 3 steps with current in center -->
    <div class="block sm:hidden">
      <div class="flex items-center justify-center">
        <div 
          v-for="step in getVisibleSteps()" 
          :key="step.number"
          class="flex flex-col items-center min-w-[80px]"
        >
          <div class="flex items-center w-full justify-center">
            <div 
              v-if="step.number > getVisibleSteps()[0].number"
              :class="[
                'w-8 h-0.5 transition-colors duration-200',
                currentStep > step.number - 1 ? 'bg-green-600' : 'bg-gray-300'
              ]"
            />
            <div class="relative group flex-shrink-0">
              <button
                type="button"
                :disabled="!canGoToStep(step.number)"
                @click="$emit('go-to-step', step.number)"
                @mouseenter="(e) => $emit('show-tooltip', step.number, e)"
                @mouseleave="$emit('hide-tooltip')"
                :class="[
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 mx-1',
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
              v-if="step.number < getVisibleSteps()[getVisibleSteps().length - 1].number"
              :class="[
                'w-8 h-0.5 transition-colors duration-200',
                currentStep > step.number ? 'bg-green-600' : 'bg-gray-300'
              ]"
            />
          </div>
          <div class="mt-2 text-center w-full px-1">
            <p 
              :class="[
                'text-xs font-medium truncate',
                currentStep === step.number ? 'text-primary' : 'text-gray-500'
              ]"
              :title="step.title"
            >
              {{ step.title }}
            </p>
          </div>
        </div>
      </div>
      <div class="text-center mt-3 text-xs text-muted-foreground">
        Step {{ currentStep }} dari {{ totalSteps }}
      </div>
    </div>

    <!-- Desktop: Show all steps -->
    <div class="hidden sm:flex items-center">
      <div 
        v-for="step in steps" 
        :key="step.number"
        class="flex flex-col items-center flex-1 min-w-[80px]"
      >
        <div class="flex items-center w-full">
          <div class="flex-1 flex justify-end">
            <div 
              v-if="step.number > 1"
              :class="[
                'w-full h-0.5 transition-colors duration-200',
                currentStep > step.number - 1 ? 'bg-green-600' : 'bg-gray-300'
              ]"
            />
          </div>
          <div class="relative group mx-2 flex-shrink-0">
            <button
              type="button"
              @click="$emit('go-to-step', step.number)"
              @mouseenter="(e) => $emit('show-tooltip', step.number, e)"
              @mouseleave="$emit('hide-tooltip')"
              :class="[
                'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200',
                currentStep === step.number 
                  ? 'border-primary bg-primary text-white' 
                  : currentStep > step.number
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-gray-300 bg-white text-gray-400'
              ]"
            >
              <Check v-if="currentStep > step.number" class="h-5 w-5" />
              <span v-else>{{ step.number }}</span>
            </button>
          </div>
          <div class="flex-1">
            <div 
              v-if="step.number < totalSteps"
              :class="[
                'w-full h-0.5 transition-colors duration-200',
                currentStep > step.number ? 'bg-green-600' : 'bg-gray-300'
              ]"
            />
          </div>
        </div>
        <div class="mt-2 text-center w-20 px-1">
          <p 
            :class="[
              'text-xs font-medium truncate',
              currentStep === step.number ? 'text-primary' : 'text-gray-500'
            ]"
            :title="step.title"
          >
            {{ step.title }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
