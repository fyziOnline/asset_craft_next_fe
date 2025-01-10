'use client'

import { useDashboard } from "@/hooks/useDashboard"
import { useOverflowHidden } from "@/hooks/useOverflowHidden"
import AssetsPageLayout from "@/layout/specific_layout/AssetsPageLayout"
import { formatDate } from "@/utils/formatDate"
import { useRouter } from "next/navigation"
import React, { FC, useEffect, useState } from "react"

const tableHeading = ["Project Name", "Campaign Name", "Asset Name", "Created On", "Current Status"]
const headerHavingSortingToggle = ["Project Name", "Created On"]
const fieldClick = "assetID"

const AssetInProgress: FC = () => {
  useOverflowHidden()
  const router = useRouter();
  const { dashboardAssets } = useDashboard()
  const [assetsDisplayTable, setAssetsDisplayTable] = useState<any[]>([])

  useEffect(() => {
    const assetInProgress = dashboardAssets.filter(asset => asset.status === "In Progress" || asset.status === "On Review")

    const newAssetsDisplayTable = assetInProgress.map((data) => ({
      projectName: data.project,
      campaignName: data.campaignName,
      assetTypeIcon: data.assetTypeName,
      assetName: data.assetName,
      createdOn: formatDate(data.createdOn),
      currentStatus: data.status,
      assetID: data.assetID
    }));
    setAssetsDisplayTable(newAssetsDisplayTable)
  }, [dashboardAssets])

  const handleClick = (assetID: any) => {
    console.log("item", assetID);
    router.push(`/edit-html-content?assetID=${assetID}`)
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
