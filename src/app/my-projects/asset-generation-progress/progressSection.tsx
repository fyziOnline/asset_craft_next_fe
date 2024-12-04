'use client'
import { urls } from '@/apis/urls'
import { useLoading } from '@/components/global/Loading/LoadingContext'
import TemplateGenerationSection from '@/components/layout/TemplateGenerationSection'
import TemplateSelectionContainer from '@/components/layout/TemplateSelectionContainer'
import { nkey } from '@/data/keyStore'
import { useGetTemplates } from '@/hooks/useGetTemplates'
import { ApiService } from '@/lib/axios_generic'
import { FC, ReactNode, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import moment from 'moment';

type ProgressComponent = ReactNode;
interface ProjectAssetProp {
  params: {
    project_name?: string
    campaign_name?: string
  }
  handleEdit?: () => void
}

const ProgressSection: FC<ProjectAssetProp> = ({ params }) => {
  const total_steps: number = 2
  const [currentStep, setCurrentStep] = useState<number>(0)
  const { listTemplates } = useGetTemplates()
  const templateChooseRef = useRef("e348c23c-a4ac-ef11-ac7b-0a9328dfcacd")
  const campaignIdRef = useRef("70b77f95-0fb2-ef11-ac7b-0a9328dfcacd")
  const { setShowLoading } = useLoading()

  const handleNext = async (selectedTemplate: string) => {
    if (currentStep < total_steps) {
      try {
        setShowLoading(true)
        const client_ID = Cookies.get(nkey.client_ID);
        const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

        // const res = await ApiService.post<any>(urls.campaign_add, {
        //   "clientID": client_ID,
        //   "campaignName": params.campaign_name,
        //   "country": "",
        //   "squad": "",
        //   "startDate": currentDate,
        //   "endDate": "",
        //   "status": ""
        // });
        const res = { isSuccess: true, campaignID: "70b77f95-0fb2-ef11-ac7b-0a9328dfcacd" }

        if (res.isSuccess) {
          templateChooseRef.current = selectedTemplate
          campaignIdRef.current = res.campaignID
          setCurrentStep(pre => pre + 1)
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
      <TemplateGenerationSection params={{ templateId: templateChooseRef.current, campaignId: campaignIdRef.current }} />
    )
  }

  return pageProgressComponents[currentStep]
}

export default ProgressSection