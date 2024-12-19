'use client'
import { urls } from '@/apis/urls'
import { useLoading } from '@/components/global/Loading/LoadingContext'
import TemplateGenerationSection from '@/app/my-projects/[project_name]/[campaign_name]/[type_page]/layout/TemplateGenerationSection'
import TemplateSelectionContainer from '@/app/my-projects/[project_name]/[campaign_name]/[type_page]/layout/TemplateSelectionContainer'
import { useGetTemplates } from '@/hooks/useGetTemplates'
import { ApiService } from '@/lib/axios_generic'
import { FC, ReactNode, useRef, useState } from 'react'
import { Template } from '@/types/templates'
import { useAppData } from '@/context/AppContext'

type ProgressComponent = ReactNode;
interface ProjectAssetProp {
  params: {
    project_name?: string
    campaign_name?: string
    asset_name?: string
    type_page: string
  }
  handleEdit?: () => void
}

const ProgressSection: FC<ProjectAssetProp> = ({ params }) => {
  const total_steps: number = 2
  const [currentStep, setCurrentStep] = useState<number>(0)
  const { listTemplates } = useGetTemplates({ type_page: params.type_page })
  const selectedTemplateRef = useRef<Template>()
  const { setShowLoading } = useLoading()
  const { setContextData } = useAppData();


  const handleNext = async (selectedTemplate: Template) => {
    if (currentStep < total_steps) {
      try {
        setShowLoading(true)
        const res_Template = await ApiService.get<any>(`${urls.template_select}?templateID=${selectedTemplate.templateID}`)

        if (res_Template.isSuccess) {
          selectedTemplateRef.current = res_Template as Template
          setCurrentStep(pre => pre + 1)
          setContextData({ assetGenerateStatus: 1, assetTemplateShow: false })
        }
      } catch (error) {
        console.error('API Error:', ApiService.handleError(error));
        alert(ApiService.handleError(error));
      } finally {
        setShowLoading(false)
      }
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
      <TemplateGenerationSection
        params={{
          type_page: params.type_page,
          template: selectedTemplateRef.current as Template
        }}
      />
    )
  }

  return pageProgressComponents[currentStep]
}

export default ProgressSection