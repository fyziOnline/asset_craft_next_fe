'use client'

import React, { FC, useEffect } from "react"
import { useOverflowHidden } from "@/hooks/useOverflowHidden"
import AssetsPageLayout from "@/layout/specific_layout/AssetsPageLayout"
import { formatDate } from "@/utils/formatDate"
import { useRouter } from "next/navigation"
import { useDashboard } from "@/hooks/useDashboard"

const tableHeading = ["Asset Name", "Campaign Name", "Project Name", "Approver", "Created On", "Current Status"]
const headerHavingSortingToggle = ["Project Name", "Created On"]
const hiddenFields = ["assetID"]

const AssetInProgress: FC = () => {
  useOverflowHidden()
  const router = useRouter();
  const { getAssetAllAtDashboard , dashboardAssets } = useDashboard()

  useEffect(() => {
    getAssetAllAtDashboard()
  },[])

  const filteredAssets = dashboardAssets.filter((data) => data.status === "In Progress")

  const assetsDisplayTable = filteredAssets.map((data) => ({
    assetTypeIcon: data.assetTypeName,
    assetName: data.assetName,
    campaignName: data.campaignName,
    projectName: data.project,
    assignedTo: data.approvedBy || "",
    createdOn: formatDate(data.createdOn),
    currentStatus: data.status,
    assetID: data.assetID,
  }));

  const handleClick = (item: any) => {  
    router.push(`/edit-html-content?assetID=${item.assetID}`)
    router.push(`/edit-html-content?assetID=${item.assetID}&campaignName=${item.campaignName}&projectName=${item.projectName}&assetTypeIcon=${item.assetTypeIcon}`)
  }

  return (
    <>
      <AssetsPageLayout
        hiddenFields={hiddenFields}
        campaign_data={assetsDisplayTable}
        tableHeadings={tableHeading}
        headersHavingToggle={headerHavingSortingToggle}
        columnWidthsTable={["repeat(7, 1fr)"]}
        handleClick={handleClick}
        page=""
      />
    </>
  )
}

export default AssetInProgress
