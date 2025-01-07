'use client'

import { useAppData } from "@/context/AppContext"
import { nkey } from "@/data/keyStore"
import { useDashboard } from "@/hooks/useDashboard"
import AssetsPageLayout from "@/layout/specific_layout/AssetsPageLayout"
import { AssetInProgressProps } from "@/types/asset"
import { AssetHtmlProps, AssetVersionProps } from "@/types/templates"
import { formatDate } from "@/utils/formatDate"
import { useRouter } from "next/navigation"
import React, { FC, useEffect, useState } from "react"

interface Asset {
  [key: string]: string
}

const AssetInProgress: FC = () => {
  const { dashboardAssets } = useDashboard()
  const router = useRouter();
  const { setContextData } = useAppData();
 
  const assetInProgress = dashboardAssets.filter(asset => asset.status === "In Progress" || asset.status === "On Review")

  const assetsDisplayTable = assetInProgress.map((data) => ({
    projectName: data.project,
    campaignName: data.campaignName,
    assetTypeIcon: data.assetTypeName,
    assetName: data.assetName,
    createdOn: formatDate(data.createdOn),
    currentStatus: data.status,
  }));

  const tableHeading = ["Project Name", "Campaign Name", "Asset Name", "Created On", "Current Status"]
  const headerHavingSortingToggle = ["Project Name", "Created On"]
  const fieldClick = "dataItem"

  const handleClick = (item: any) => {
    try {
      const dataItem = JSON.parse(item)
      const assetHtml = {} as AssetHtmlProps
      assetHtml.assetVersions = [dataItem.assetVersion]
      setContextData({ AssetHtml: assetHtml })
      router.push(`/edit-html-content?project_name=${dataItem.projectName}&campaign_name=${dataItem.campaignName}&asset_name=${dataItem.assetName}`)

    } catch (error) {

    }
  }

  return (
    <>
      <AssetsPageLayout
        fieldClick={fieldClick}
        campaign_data={assetsDisplayTable}
        tableHeadings={tableHeading}
        headersHavingToggle={headerHavingSortingToggle}
        columnWidthsTable={["repeat(7, 1fr)"]}
        handleClick={handleClick}
        page="Asset In Progress"
      />
    </>
  )
}

export default AssetInProgress
