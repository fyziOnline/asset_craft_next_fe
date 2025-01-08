'use client'
import { GridIcon, ListIcon } from "@/assets/icons/AppIcons"
// import Breadcrumb from "@/components/global/Breadcrumb"
import Table from "@/components/global/Table"
import Title from "@/components/global/Title"
import AssetCard from "@/components/wrapper/AssetCard"
import { useDashboard } from "@/hooks/useDashboard"
import { formatDate } from "@/utils/formatDate"
import App from "next/app"
import { FC, useState } from "react"


const CompletedAssets: FC = () => {
  const { dashboardAssets } = useDashboard()
  const [isList, setIsList] = useState<Boolean>(true)

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

  const toggleListType = () => {
    setIsList(pre => !pre)
  }

  return (
    <>
      <div className="flex items-center justify-between pt-[1rem] px-[1.5rem]">
        {/* <Breadcrumb TaskType='Completed Assets' /> */}
        <Title titleName="Completed Assets" />
        <span className="pr-10 cursor-pointer" onClick={toggleListType}>{!isList ? <ListIcon /> : <GridIcon />}</span>
      </div>

      <div className="px-4 lg:px-16 xl:px-20">
        {!isList ?
          <div className="asset-grid-layout mt-4  justify-center overflow-auto">
            {assetsDisplayTable.map((data, index) => (
              <div key={index}>
                <AssetCard data={data} />
              </div>
            ))}
          </div>
          :
          <Table listItems={assetsDisplayTable} tableHeadings={tableHeading} arrowInHeadings={arrowshowItems}
          />}
      </div>
    </>
  )
}

export default CompletedAssets