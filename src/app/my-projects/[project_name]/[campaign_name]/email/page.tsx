import ProgressSection from "@/app/my-projects/asset-generation-progress/progressSection"
import AssetGenerationHeader from "@/components/layout/AssetGenerationHeader"
import TemplateSelectionContainer from "@/components/layout/TemplateSelectionContainer"
import LayoutWrapper from "@/layout/LayoutWrapper"
import { FC } from "react"

interface ProjectAssetProp {
  params: {
    project_name: string
    campaign_name : string
    asset_name: string

  }
}
interface Template {
  id: string
  imageUrl: string
  template_name: string
}

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

const ProjectAssetPage: FC<ProjectAssetProp> = async ({ params }) => {
  const takeData = async () => {
    return params
  }
  const data = await takeData()
  const project_name = decodeURIComponent(data.project_name)
  const campaign_name = decodeURIComponent(data.campaign_name)

  return (
    <LayoutWrapper layout="main">
      <AssetGenerationHeader params={{project_name,campaign_name}} />
      <div className=" px-[1.5rem]">
        <ProgressSection />
        {/* <TemplateSelectionContainer aspect_ratio="1 / 2" templateData={dummyTemplateData} title="Select one of the templates"/> */}
      </div>
    </LayoutWrapper>
  )
}

export default ProjectAssetPage