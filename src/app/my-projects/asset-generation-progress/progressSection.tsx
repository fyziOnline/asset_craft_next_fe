'use client'
import TemplateGenerationSection from '@/components/layout/TemplateGenerationSection'
import TemplateSelectionContainer from '@/components/layout/TemplateSelectionContainer'
import { FC, ReactNode, useState } from 'react'

interface Template {
    id: string
    imageUrl: string
    template_name: string
  }

type ProgressComponent = ReactNode;


const dummyTemplateData:Template[] = [
    {
      imageUrl : '/images/email_templates/template_1.png',
      template_name :'Event Invite',
      id : '1'
    },
    {
      imageUrl : '/images/email_templates/template_2.png',
      template_name :'Webinar',
      id : '2'
    },
    {
      imageUrl : '/images/email_templates/template_3.png',
      template_name :'Product Features',
      id:'3'
    }
  ]


const ProgressSection:FC = () => {
    const total_steps:number = 2
    const [currentStep,setCurrentStep] = useState<number>(0)
    const [templateOnSelect,setTemplateOnSelect] = useState<string>('')

    const handleNext = (selectedTemplate:string) => {
        if(currentStep < total_steps) {
            setTemplateOnSelect(selectedTemplate)
            console.log('selected template :',selectedTemplate);
            
            setCurrentStep(pre=>pre+1)
        } 
    }
    const handlePrevious = () => {
        if (currentStep > 0 ) {
            setCurrentStep(pre=>pre-1)
        }
    }


    
    const pageProgressComponents: { [key: number]: ProgressComponent } = {
        0: (
            <TemplateSelectionContainer 
                aspect_ratio='1 / 2' 
                templateData={dummyTemplateData} 
                title='Select one of the templates' 
                onProceed={handleNext} 
           />
        ),
        1: (
            <TemplateGenerationSection />
        )
    }

  return pageProgressComponents[currentStep]
}

export default ProgressSection