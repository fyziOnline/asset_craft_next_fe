'use client'

import { useAppData } from "@/context/AppContext"
import { nkey } from "@/data/keyStore"
import AssetsPageLayout from "@/layout/specific_layout/AssetsPageLayout"
import { AssetInProgressProps } from "@/types/asset"
import { AssetHtmlProps, AssetVersionProps } from "@/types/templates"
import { useRouter } from "next/navigation"
import React, { FC, useEffect, useState } from "react"

interface Asset {
  [key: string]: string
}

const AssetInProgress: FC = () => {
  const router = useRouter();
  const { setContextData } = useAppData();
  const [tableData, setTableData] = useState<Asset[]>([])

  useEffect(() => {
    try {
      const assetInProgressTemporary = JSON.parse(localStorage.getItem(nkey.assetInProgressTemporary) || "[]") as AssetInProgressProps[]

      console.log("assetInProgressTemporary: ", assetInProgressTemporary);
      
      const newassetInProgress = assetInProgressTemporary.map((item) => {
        return {
          projectName: item.projectName,
          campaignName: item.campaignName,
          assetName: `${item.assetName}_${item.versionName}`.replace(" ", ""),
          creadedOn: item.createdOn,
          approvedBy: "",
          approvedOn: "",
          currentStatus: item.currentStatus,
          dataItem: JSON.stringify({
            assetVersion: item.assetVersion,
            projectName: item.projectName,
            campaignName: item.campaignName,
            assetName: item.assetName
          }),
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
