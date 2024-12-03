'use client'
import TemplateGenerationSection from '@/components/layout/TemplateGenerationSection'
import TemplateSelectionContainer from '@/components/layout/TemplateSelectionContainer'
import { useGetTemplates } from '@/hooks/useGetTemplates'
import { FC, ReactNode, useRef, useState } from 'react'

type ProgressComponent = ReactNode;

const ProgressSection: FC = () => {
  const total_steps: number = 2
  const [currentStep, setCurrentStep] = useState<number>(0)
  const { listTemplates } = useGetTemplates()
  const templateChooseRef = useRef("")

  const handleNext = (selectedTemplate: string) => {
    if (currentStep < total_steps) {
      templateChooseRef.current = selectedTemplate
      setCurrentStep(pre => pre + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(pre => pre - 1)
    }
  }

  const pageProgressComponents: { [key: number]: ProgressComponent } = {
    0: (
      <TemplateSelectionContainer
        aspect_ratio='1 / 2'
        templateData={listTemplates}
        title='Select one of the templates'
        onProceed={handleNext}
      />
    ),
    1: (
      <TemplateGenerationSection templateId={templateChooseRef.current} />
    )
  }

  return pageProgressComponents[currentStep]
}

export default ProgressSection