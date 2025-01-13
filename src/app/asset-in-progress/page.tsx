'use client'

import { useAssetInProgress } from "@/hooks/useAssetInProgress"
import { useOverflowHidden } from "@/hooks/useOverflowHidden"
import AssetsPageLayout from "@/layout/specific_layout/AssetsPageLayout"
import { formatDate } from "@/utils/formatDate"
import { useRouter } from "next/navigation"
import React, { FC } from "react"

const tableHeading = ["Asset Name", "Asset Version", "Campaign Name", "Project Name", "Created On", "Current Status"]
const headerHavingSortingToggle = ["Project Name", "Created On"]
const hiddenFields = ["assetVersionID", "layoutName"]

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
    createdOn: formatDate(data.createdOn),
    currentStatus: data.status,
    assetVersionID: data.assetVersionID,
    layoutName: data.assetTypeName
  }));

  const handleClick = (item: any) => {
    router.push(`/edit-html-content?assetVersionID=${item.assetVersionID}&assetName=${item.assetName}&layoutName=${item.layoutName}`)
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
        page="Asset In Progress"
      />
    </>
  )
}

export default AssetInProgress
