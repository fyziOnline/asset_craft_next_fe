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
    console.log("item", item);
    router.push(`/edit-html-content?project_name=${item.projectName}&campaign_name=${item.campaignName}&asset_name=${item.assetName}`)
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
