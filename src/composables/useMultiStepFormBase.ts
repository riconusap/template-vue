import type { Step } from '@/composables/useStepTypes'
import { ref } from 'vue'

export function useMultiStepForm(totalSteps: number = 9, validateStepFn: (step: number) => Promise<boolean>) {
  const currentStep = ref(1)
  const stepperPosition = ref<'top' | 'left'>('top')
  const hoveredStep = ref<number | null>(null)
  const hoveredElement = ref<HTMLElement | null>(null)

  const nextStep = async () => {
    const isValid = await validateStepFn(currentStep.value)
    if (isValid && currentStep.value < totalSteps) {
      currentStep.value++
    }
  }

  const prevStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  const goToStep = async (step: number) => {
    if (step < currentStep.value) {
      currentStep.value = step
    } else {
      // Validate all steps from current+1 up to target step
      let lastValidStep = currentStep.value
      for (let s = currentStep.value; s < step; s++) {
        const isValid = await validateStepFn(s)
        if (!isValid) {
          currentStep.value = s
          return
        }
        lastValidStep = s + 1
      }
      currentStep.value = step
    }
  }

  const toggleStepperPosition = () => {
    stepperPosition.value = stepperPosition.value === 'top' ? 'left' : 'top'
  }

  const showTooltip = (stepNumber: number, event: MouseEvent) => {
    hoveredStep.value = stepNumber
    hoveredElement.value = event.currentTarget as HTMLElement
  }

  const hideTooltip = () => {
    hoveredStep.value = null
    hoveredElement.value = null
  }

  return {
    currentStep,
    stepperPosition,
    hoveredStep,
    hoveredElement,
    nextStep,
    prevStep,
    goToStep,
    toggleStepperPosition,
    showTooltip,
    hideTooltip
  }
}