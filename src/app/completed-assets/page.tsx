'use client'
import { FC, useEffect } from "react"
import { useDashboard } from "@/hooks/useDashboard"
import { formatDate } from "@/utils/formatDate"
import { useRouter } from "next/navigation";
import AssetsPageLayout from "@/layout/specific_layout/AssetsPageLayout"


const CompletedAssets: FC = () => {
  const router = useRouter()
  const { dashboardAssets, getAssetAllAtDashboard } = useDashboard()

  useEffect(() => {
    getAssetAllAtDashboard()
  },[])

  const completedAssets = dashboardAssets.filter(asset => asset.status === "Completed")

  const assetsDisplayTable = completedAssets.map((data) => ({
    assetTypeIcon: data.assetTypeName,
    assetName: data.assetName,
    campaignName: data.campaignName,
    projectName: data.project,
    createdOn: formatDate(data.createdOn),
    approvedBy: data.approvedBy || "",
    approvedOn: formatDate(data.approvedOn),
    currentStatus: data.status,
    assetID: data.assetID,
  }));


  const tableHeading = ["Asset Name", "Campaign Name", "Project Name", "Created On", "Approved By", "Approved On", "Current Status"]
  const arrowshowItems = ["Created On", "Approved On"]
  const hiddenFields = ["assetID"]

  const handleClick = (item: any) => {
    router.push(`/edit-html-content?assetID=${item.assetID}`)
    router.push(`/edit-html-content?assetID=${item.assetID}&campaignName=${item.campaignName}&projectName=${item.projectName}&assetTypeIcon=${item.assetTypeIcon}`)
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
        page=""
      />
    </>
  )
}

export default CompletedAssets