'use client'

import { useGetAsset } from "@/hooks/useGetAsset"
import { useOverflowHidden } from "@/hooks/useOverflowHidden"
import AssetsPageLayout from "@/layout/specific_layout/AssetsPageLayout"
import { formatDate } from "@/utils/formatDate"
import { useRouter } from "next/navigation"
import React, { FC } from "react"

const tableHeading = ["Asset Name", "Asset Version", "Campaign Name", "Project Name", "Approver", "Created On", "Current Status"]
const headerHavingSortingToggle = ["Project Name", "Created On"]
const hiddenFields = ["assetID"]

const AssetInProgress: FC = () => {
  useOverflowHidden()
  const router = useRouter();
  const { listAssets } = useGetAsset({ assignedTo: 0 })

  const assetsDisplayTable = listAssets.map((data) => ({
    assetTypeIcon: data.assetTypeName,
    assetName: data.assetName,
    version: data.versionName,
    campaignName: data.campaignName,
    projectName: data.projectName,
    assignedTo: data.approverName || "",
    createdOn: formatDate(data.createdOn),
    currentStatus: data.status,
    assetID: data.assetID,
  }));

  const handleClick = (item: any) => {
    console.log(item);
    
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
