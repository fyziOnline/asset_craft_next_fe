'use client'

import React, { FC, useMemo } from 'react';
import ProgressSection from "./components/progressSection"
import AssetGenerationHeader from "./layout/AssetGenerationHeader"

interface ProjectAssetProp {
  params: Promise<{
    project_name: string
    campaign_name: string
    type_page: string
  }>
}

const ProjectAssetPage: FC<ProjectAssetProp> = ({ params }) => {
  const resolvedParams = React.use(params) // unwrap the Promise

  const project_name = useMemo(() => decodeURIComponent(resolvedParams.project_name), [resolvedParams])
  const campaign_name = useMemo(() => decodeURIComponent(resolvedParams.campaign_name), [resolvedParams])
  const type_page = useMemo(() => decodeURIComponent(resolvedParams.type_page), [resolvedParams]) // use ListTypePage

  return (
    <>
      <AssetGenerationHeader params={{ project_name, campaign_name }} />
      <div className="overflow-x-hidden">
        <ProgressSection params={{ project_name, campaign_name, type_page }} />
      </div>
    </>
  )
}

export default ProjectAssetPage
