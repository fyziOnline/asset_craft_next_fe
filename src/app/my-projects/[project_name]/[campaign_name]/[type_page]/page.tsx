import ProgressSection from "@/app/my-projects/asset-generation-progress/progressSection"
import AssetGenerationHeader from "@/components/layout/AssetGenerationHeader"
import LayoutWrapper from "@/layout/LayoutWrapper"
import { FC } from "react"

interface ProjectAssetProp {
  params: {
    project_name: string
    campaign_name: string
    asset_name: string
    type_page: string
  }
}

const ProjectAssetPage: FC<ProjectAssetProp> = async ({ params }) => {
  const takeData = async () => {
    return params
  }
  const data = await takeData()
  const project_name = decodeURIComponent(data.project_name)
  const campaign_name = decodeURIComponent(data.campaign_name)
  const type_page = decodeURIComponent(data.type_page) //use ListTypePage

  return (
    <>
      <AssetGenerationHeader params={{ project_name, campaign_name }} />
      <div>
        <ProgressSection params={{ campaign_name, type_page }} />
      </div>
    </>
  )
}

export default ProjectAssetPage