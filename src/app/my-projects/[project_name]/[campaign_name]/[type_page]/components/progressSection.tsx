'use client'
import { urls } from '@/apis/urls'
import { useLoading } from '@/components/global/Loading/LoadingContext'
import TemplateGenerationSection from '@/app/my-projects/[project_name]/[campaign_name]/[type_page]/layout/TemplateGenerationSection'
import TemplateSelectionContainer from '@/app/my-projects/[project_name]/[campaign_name]/[type_page]/layout/TemplateSelectionContainer'
import { useGetTemplates } from '@/hooks/useGetTemplates'
import { ApiService } from '@/lib/axios_generic'
import { FC, ReactNode, useRef, useState } from 'react'
import { AssetHtmlProps, Template } from '@/types/templates'
import { useAppData } from '@/context/AppContext'
import { useYesNoPopup } from '@/components/global/Popup/YesNoPopupContext'
import { useSearchParams } from 'next/navigation';

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
  const assetIDTemplateRef = useRef("")
  const campaignIDTemplateRef = useRef("")
  const assetSelect = useRef<AssetHtmlProps>()
  const selectedTemplateRef = useRef<Template>()
  const { setShowLoading } = useLoading()
  const { setContextData } = useAppData();
  const { openPopup } = useYesNoPopup();
  const queryParams = useSearchParams()


  const handleNext = async (selectedTemplate: Template) => {
    openPopup(
      'Confirmation',
      'Once confirmed, you will not be able to re-select the template.',
      'Next',
      'Cancel',
      async () => {
        if (currentStep < total_steps) {
          try {
            setShowLoading(true)
            const res_Template = await ApiService.get<any>(`${urls.template_select}?templateID=${selectedTemplate.templateID}`)

            if (res_Template.isSuccess) {
              const campaignID = queryParams.get('campaignID') as string
              const asset_name = queryParams.get('asset_name') as string
              const resAddWithTemplate = await ApiService.post<any>(urls.asset_addWithTemplate, {
                "campaignID": campaignID,
                "assetName": asset_name,
                "templateID": selectedTemplate.templateID,
                "language": "",
                "assetAIPrompt": ""
              });
              // const resAddWithTemplate = { isSuccess: true, assetID: "bcaa8216-20bc-ef11-ac7b-0a9328dfcacd" }

              if (resAddWithTemplate.isSuccess) {
                const resAssetSelect = await ApiService.get<any>(`${urls.asset_select}?assetID=${resAddWithTemplate.assetID}`);
                if (resAssetSelect.isSuccess) {
                  campaignIDTemplateRef.current = campaignID
                  assetIDTemplateRef.current = resAddWithTemplate.assetID
                  assetSelect.current = resAssetSelect as AssetHtmlProps
                  selectedTemplateRef.current = res_Template as Template
                  setCurrentStep(pre => pre + 1)
                  setContextData({ assetGenerateStatus: 1, assetTemplateShow: false })
                }
              }
            }
          } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            alert(ApiService.handleError(error));
          } finally {
            setShowLoading(false)
          }
        }
      }
    )
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
          assetID: assetIDTemplateRef.current,
          campaignID: campaignIDTemplateRef.current,
          template: selectedTemplateRef.current as Template,
          assetSelect: assetSelect.current as AssetHtmlProps
        }}
      />
    )
  }

  return pageProgressComponents[currentStep]
}

export default ProgressSection