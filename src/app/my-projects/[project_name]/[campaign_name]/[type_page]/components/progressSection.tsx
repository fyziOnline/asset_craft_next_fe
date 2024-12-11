'use client'
import { urls } from '@/apis/urls'
import { useLoading } from '@/components/global/Loading/LoadingContext'
import TemplateGenerationSection from '@/app/my-projects/[project_name]/[campaign_name]/[type_page]/layout/TemplateGenerationSection'
import TemplateSelectionContainer from '@/app/my-projects/[project_name]/[campaign_name]/[type_page]/layout/TemplateSelectionContainer'
import { nkey } from '@/data/keyStore'
import { useGetTemplates } from '@/hooks/useGetTemplates'
import { ApiService } from '@/lib/axios_generic'
import { FC, ReactNode, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import moment from 'moment';
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
  const assetIDTemplateRef = useRef("")
  const campaignIDTemplateRef = useRef("")
  const selectedTemplateRef = useRef<Template>()
  const { setShowLoading } = useLoading()
  const { setContextData } = useAppData();

  const handleNext = async (selectedTemplate: Template) => {
    if (currentStep < total_steps) {
      try {
        setShowLoading(true)
        const client_ID = Cookies.get(nkey.client_ID);
        const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

        const res_campaign_add = await ApiService.post<any>(urls.campaign_add, {
          "clientID": client_ID,
          "campaignName": params.campaign_name,
          "country": "",
          "squad": "",
          "startDate": currentDate,
          "endDate": "",
          "status": ""
        });
        // const res_campaign_add = { isSuccess: true, campaignID: "70b77f95-0fb2-ef11-ac7b-0a9328dfcacd" }

        if (res_campaign_add.isSuccess) {
          const resAddWithTemplate = await ApiService.post<any>(urls.asset_addWithTemplate, {
            "campaignID": res_campaign_add.campaignID,
            "assetName": params.asset_name,
            "templateID": selectedTemplate.templateID,
            "language": "",
            "assetAIPrompt": ""
          });
          // const resAddWithTemplate = { isSuccess: true, assetID: "" }

          if (resAddWithTemplate.isSuccess) {
            campaignIDTemplateRef.current = res_campaign_add.campaignID
            assetIDTemplateRef.current = resAddWithTemplate.assetID
            selectedTemplateRef.current = selectedTemplate
            setCurrentStep(pre => pre + 1)
            setContextData({ assetGenerateStatus: 1, assetTemplateShow: false })
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
      <TemplateGenerationSection
        params={{
          type_page: params.type_page,
          assetID: assetIDTemplateRef.current,
          campaignID: campaignIDTemplateRef.current,
          template: selectedTemplateRef.current
        }}
      />
    )
  }

  return pageProgressComponents[currentStep]
}

export default ProgressSection