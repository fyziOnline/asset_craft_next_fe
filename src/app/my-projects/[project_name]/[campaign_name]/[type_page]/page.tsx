'use client'

import { FC } from "react"
import ProgressSection from "./components/progressSection"
import AssetGenerationHeader from "./layout/AssetGenerationHeader"
import { useRouter } from "next/navigation"
interface ProjectAssetProp {
  params: {
    project_name: string
    campaign_name: string
    asset_name: string
    type_page: string
  }
}

const ProjectAssetPage: FC<ProjectAssetProp> = async ({ params }) => {
  const router = useRouter();

  const takeData = async () => {
    return params
  }
  const data = await takeData()
  const project_name = decodeURIComponent(data.project_name)
  const campaign_name = decodeURIComponent(data.campaign_name)
  const type_page = decodeURIComponent(data.type_page) //use ListTypePage

  const onEdit = () => {
    router.push("/edit-html-content")
  }

  return (
    <>
      <AssetGenerationHeader params={{ project_name, campaign_name }} handleEdit={onEdit} />
      <div className="overflow-x-hidden">
        <ProgressSection params={{ campaign_name, type_page }} />
      </div>
    </>
  )
}

export default ProjectAssetPage