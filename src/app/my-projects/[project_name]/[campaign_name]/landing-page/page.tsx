import AssetGenerationHeader from '@/components/layout/AssetGenerationHeader'
import TemplateSelectionContainer from '@/components/layout/TemplateSelectionContainer';
import LayoutWrapper from '@/layout/LayoutWrapper'
import { FC } from 'react';

interface ProjectAssetProp {
    params: {
        project_name: string;
        campaign_name: string;
        asset_name: string;
    }
}

interface Template {
    id: string;
    imageUrl: string;
    template_name: string
}

const dummyTemplateData:Template[] = [
    {
      imageUrl : '/images/landing_templates/landing1.png',
      template_name :'Option 1',
      id : '1'
    },
    {
      imageUrl : '/images/landing_templates/landing2.png',
      template_name :'Option 2',
      id : '2'
    },
    {
      imageUrl : '/images/landing_templates/landing3.png',
      template_name :'Option 3',
      id:'3'
    }
  ]

const page: FC<ProjectAssetProp> = async ({ params }) => {

    const takeData = async () => {
        return params
    }

    const { project_name , campaign_name } = await takeData()

  return (
    <LayoutWrapper layout='main'>
        <AssetGenerationHeader params={{ project_name , campaign_name }} />

        <div className='px-[1.5rem]'>
            <TemplateSelectionContainer aspect_ratio='1/2' templateData={dummyTemplateData} title='Select one of the templates'/>
        </div>
    </LayoutWrapper>
  )
}

export default page