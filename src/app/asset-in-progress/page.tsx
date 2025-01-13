'use client'

import { useAssetInProgress } from "@/hooks/useAssetInProgress"
import { useDashboard } from "@/hooks/useDashboard"
import { useOverflowHidden } from "@/hooks/useOverflowHidden"
import AssetsPageLayout from "@/layout/specific_layout/AssetsPageLayout"
import { formatDate } from "@/utils/formatDate"
import { useRouter } from "next/navigation"
import React, { FC, useEffect, useState } from "react"

const tableHeading = ["Asset Name", "Asset Version", "Campaign Name", "Project Name", "Approver", "Created On", "Current Status"]
const headerHavingSortingToggle = ["Created On"]
const fieldClick = "assetID"

const AssetInProgress: FC = () => {
  useOverflowHidden()
  const router = useRouter();
  const { assetInProgress } = useAssetInProgress()

  const assetsDisplayTable = assetInProgress.map((data) => ({
    assetTypeIcon: data.assetTypeName,
    assetName: data.assetName,
    version: data.versionName,
    campaignName: data.campaignName,
    projectName: data.projectName,
    assignedTo: data.approverName || "",
    createdOn: formatDate(data.createdOn),
    currentStatus: data.status,
    assetID: data.assetID
  }));
  console.log(assetsDisplayTable);
  
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
