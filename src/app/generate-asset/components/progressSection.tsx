'use client'
import { useLoading } from '@/components/global/Loading/LoadingContext'
import { useGetTemplates } from '@/hooks/useGetTemplates'
import { ApiService } from '@/lib/axios_generic'
import { FC, ReactNode, useRef, useState } from 'react'
import { Template } from '@/types/templates'
import TemplateSelectionContainer from '../layout/TemplateSelectionContainer'
import TemplateGenerationSection from '../layout/TemplateGenerationSection'
// import { PageType } from '@/componentsMap/pageMap'
import { useGenerateAssetStoreSelector } from '@/store/generatAssetStore'
import { AssetType } from '@/types/assetTypes'

type ProgressComponent = ReactNode;
interface ProjectAssetProp {
  params: {
    type_page: AssetType
  }
  handleEdit?: () => void
}

const ProgressSection: FC<ProjectAssetProp> = ({ params }) => {
  const total_steps: number = 2
  const { listTemplates,getTemplateById } = useGetTemplates({ type_page: params.type_page })
  const selectedTemplateRef = useRef<Template>()
  const { setShowLoading } = useLoading()

  const updatedProgressionStep = useGenerateAssetStoreSelector.use.updateProgressionStep()
  const progressionStep = useGenerateAssetStoreSelector.use.progressionStep()

  const handleNext = async (selectedTemplate: Template) => {
    if (progressionStep < total_steps) {
      try {
        setShowLoading(true)
        if (!selectedTemplate.templateID) {
          console.error('unable to get the template data')
          return
        }
        const res_Template = await getTemplateById(selectedTemplate.templateID)
        selectedTemplateRef.current = res_Template as Template
        updatedProgressionStep('inc')
          // setContextData({ assetGenerateStatus: 1, assetTemplateShow: true })
      } catch (error) {
        alert(ApiService.handleError(error));
      } finally {
        setShowLoading(false)
      }
    }
  }

  const pageProgressComponents: { [key: number]: ProgressComponent } = {
    0: (
      <TemplateSelectionContainer
        templateData={listTemplates}
        onProceed={handleNext}
      />
    ),
    1: (
      <TemplateGenerationSection
        params={{
          type_page: params.type_page,
          template: selectedTemplateRef.current as Template
        }}
      />
    )
  } 

  return pageProgressComponents[progressionStep]
}

export default ProgressSection