'use client'
import { urls } from '@/apis/urls'
import { useLoading } from '@/components/global/Loading/LoadingContext'
import { useGetTemplates } from '@/hooks/useGetTemplates'
import { ApiService } from '@/lib/axios_generic'
import { FC, ReactNode, useRef } from 'react'
import { Template } from '@/types/templates'
import { useAppData } from '@/context/AppContext'
import TemplateSelectionContainer from '../layout/TemplateSelectionContainer'
import TemplateGenerationSection from '../layout/TemplateGenerationSection'
import { PageType } from '@/componentsMap/pageMap'

type ProgressComponent = ReactNode;
interface ProjectAssetProp {
  params: {
    type_page: PageType
  }
  handleEdit?: () => void
}

const ProgressSection: FC<ProjectAssetProp> = ({ params }) => {
  const total_steps: number = 2
  const { listTemplates,getTemplateById } = useGetTemplates({ type_page: params.type_page })
  const selectedTemplateRef = useRef<Template>()
  const { setShowLoading } = useLoading()
  const { contextData, setContextData } = useAppData();

  const handleNext = async (selectedTemplate: Template) => {
    if (contextData.stepGenerate < total_steps) {
      try {
        setShowLoading(true)
        if (!selectedTemplate.templateID) {
          console.error('unable to get the template data')
          return
        }
        const res_Template = await getTemplateById(selectedTemplate.templateID)
        selectedTemplateRef.current = res_Template as Template
          setContextData({ assetGenerateStatus: 1, assetTemplateShow: false, stepGenerate: 1 })
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

  return pageProgressComponents[contextData.stepGenerate]
}

export default ProgressSection