'use client'

import { nkey } from "@/data/keyStore"
import AssetsPageLayout from "@/layout/specific_layout/AssetsPageLayout"
import { AssetInProgressProps } from "@/types/asset"
import React, { FC, useEffect, useState } from "react"

interface Asset {
  [key: string]: string
}

const AssetInProgress: FC = () => {
  const [tableData, setTableData] = useState<Asset[]>([])

  useEffect(() => {
    try {
      const assetInProgressTemporary = JSON.parse(localStorage.getItem(nkey.assetInProgressTemporary) || "[]") as AssetInProgressProps[]
      const newassetInProgress = assetInProgressTemporary.map((item) => {
        return {
          projectName: item.projectName,
          campaignName: item.campaignName,
          assetName: item.assetName,
          creadedOn: item.createdOn,
          approvedBy: "",
          approvedOn: "",
          currentStatus: item.currentStatus,
          dataClick: item.assetVersionId || "",
        }
      })
      if (newassetInProgress.length > 0) {
        setTableData(newassetInProgress)
      }
    } catch (error) {
      console.log('error: ', error);
    }
  }, [])

  const tableHeading = ["Project Name", "Campaign Name", "Asset Name", "Created On", "Approved By", "Approved On", "Current Status"]
  const headerHavingSortingToggle = ["Project Name", "Created On", "Approved On"]
  const fieldClick = "dataClick"

  const handleClick = (value: any) => {
    console.log('value: ', value);
  }

  return (
    <>
      <AssetsPageLayout
        fieldClick={fieldClick}
        campaign_data={tableData}
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
