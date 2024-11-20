import Breadcrumb from "@/components/global/Breadcrumb"
import AssetGenerationHeader from "@/components/layout/AssetGenerationHeader"
import TemplateSelectionContainer from "@/components/layout/TemplateSelectionContainer"
import LayoutWrapper from "@/layout/LayoutWrapper"
import { FC } from "react"

interface ProjectAssetProp {
  params: {
    project_name: string
    campaign_name : string
  }
}
interface Template {
  id: string
  imageUrl: string
  template_name: string
}

const dummyLinkedinTemplateData:Template[] = [
  {
    imageUrl : '/images/linkedin_templates/template_1.png',
    template_name :'Text Post',
    id : '1'
  },
  {
    imageUrl : '/images/linkedin_templates/template_2.png',
    template_name :'Media Post',
    id : '2'
  },
  {
    imageUrl : '/images/linkedin_templates/template_3.png',
    template_name :'Multiple Media Post',
    id:'3'
  }
]

const ProjectAssetPage: FC<ProjectAssetProp> = async ({ params }) => {
  const takeData = async () => {
    return params
  }
  const {project_name,campaign_name} = await takeData()

  return (
    <LayoutWrapper layout="main">
      <AssetGenerationHeader params={{project_name,campaign_name}}/>
      <div className=" px-[1.5rem]">
        <TemplateSelectionContainer aspect_ratio="2 / 3" templateData={dummyLinkedinTemplateData} title="Select one of the templates"/>
      </div>
    </LayoutWrapper>
  )
}

export default ProjectAssetPage