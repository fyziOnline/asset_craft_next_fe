'use client'
import { FC } from "react"
import { useDashboard } from "@/hooks/useDashboard"
import { formatDate } from "@/utils/formatDate"
import { useRouter } from "next/navigation";
import AssetsPageLayout from "@/layout/specific_layout/AssetsPageLayout"


const CompletedAssets: FC = () => {
  const router = useRouter()
  const { dashboardAssets } = useDashboard()

  const completedAssets = dashboardAssets.filter(asset => asset.status === "Completed")

  const assetsDisplayTable = completedAssets.map((data) => ({
    assetTypeIcon: data.assetTypeName,
    assetName: data.assetName,
    campaignName: data.campaignName,
    projectName: data.project,
    createdOn: formatDate(data.createdOn),
    approvedBy: data.approvedBy || "N/A",
    approvedOn: formatDate(data.approvedOn),
    currentStatus: data.status,
  }));


  const tableHeading = ["Asset Name", "Campaign Name", "Project Name", "Created On", "Approved By", "Approved On", "Current Status"]
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
        page="completed-assets"
      />
    </>
  )
}

export default CompletedAssets