'use client'
import { FC, useState } from "react"
import { GridIcon, ListIcon } from "@/assets/icons/AppIcons"
// import Breadcrumb from "@/components/global/Breadcrumb"
import Table from "@/components/global/Table"
import Title from "@/components/global/Title"
import AssetCard from "@/components/wrapper/AssetCard"
import { useDashboard } from "@/hooks/useDashboard"
import { formatDate } from "@/utils/formatDate"
import AssetsPageLayout from "@/layout/specific_layout/AssetsPageLayout"
import { AssetHtmlProps } from "@/types/templates"
import { useAppData } from "@/context/AppContext"
import { useRouter } from "next/navigation";


const CompletedAssets: FC = () => {
  const router = useRouter()
  const { dashboardAssets } = useDashboard()
  const { setContextData } = useAppData()

  const completedAssets = dashboardAssets.filter(asset => asset.status === "Completed")

  const assetsDisplayTable = completedAssets.map((data) => ({
    projectName: data.project,
    campaignName: data.campaignName,
    assetTypeIcon: data.assetTypeName,
    assetName: data.assetName,
    createdOn: formatDate(data.createdOn),
    approvedBy: data.approvedBy || "N/A",
    approvedOn: formatDate(data.approvedOn),
    currentStatus: data.status,
  }));


  const tableHeading = ["Project Name", "Campaign Name", "Asset Name", "Created On", "Approved By", "Approved On", "Current Status"]
  const arrowshowItems = ["Project Name", "Created On", "Approved On"]
  const hiddenFields = ["dataItem"]

  const handleClick = (item: any) => {
    router.push(`/edit-html-content?project_name=${item.projectName}&campaign_name=${item.campaignName}&asset_name=${item.assetName}`)
  }

  return (
    <>
      <AssetsPageLayout
        hiddenFields={hiddenFields}
        handleClick={handleClick}
        campaign_data={assetsDisplayTable}
        tableHeadings={tableHeading}
        headersHavingToggle={arrowshowItems}
        columnWidthsTable={["repeat(7, 1fr)"]}
        page="Completed Assets"
      />
    </>
  )
}

export default CompletedAssets