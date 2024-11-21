'use client'
import { FC } from "react"
import Breadcrumb from "../global/Breadcrumb"
import { useSearchParams } from "next/navigation"

interface ProjectAssetProp {
  params: {
    project_name: string
    campaign_name : string
  }
}

const AssetGenerationHeader:FC<ProjectAssetProp> = ({params}) => {
  const queryParams = useSearchParams()
  const asset_name =queryParams.get('asset_name') ?? 'default' 

  const accessParams = () => {
    return params
  }

  const {project_name, campaign_name} = accessParams()
  console.log('searchParams:', project_name,campaign_name,asset_name);


  return (
    <div className="border-grey-200 border-b-[1px] border-solid pt-[2rem] pb-5 px-[1.5rem] mb-4">
        <Breadcrumb projectName={project_name.split('%20').join(' ')} TaskName={campaign_name.split('%20').join(' ')} TaskType={asset_name.split('%20').join(' ')}/>
    </div>
  )
}

export default AssetGenerationHeader