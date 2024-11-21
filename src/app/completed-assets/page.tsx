'use client'
import { GridIcon, ListIcon } from "@/assets/icons/AppIcons"
import Breadcrumb from "@/components/global/Breadcrumb"
import Table from "@/components/global/Table"
import AssetCard from "@/components/wrapper/AssetCard"
import LayoutWrapper from "@/layout/LayoutWrapper"
import { FC, useState } from "react"

  
const CompletedAssets:FC = () => {
  const [isList,setIsList] = useState<Boolean>(false)

  const tableData = [
    {
      projectName: 'Lorem Ipsum',
      campaignName: 'Lorem Ipsum',
      assetName: 'Email_1',
      creadedOn: '18.01.2024',
      approvedBy: 'Prakash C.',
      approvedOn: '20.01.2024',
      currentStatus: 'Completed',
    },
    {
      projectName: 'Lorem Ipsum',
      campaignName: 'Lorem Ipsum',
      assetName: 'LinkedIn_1',
      creadedOn: '18.01.2024',
      approvedBy: 'Avish J.',
      approvedOn: '20.01.2024',
      currentStatus: 'Completed',
    },
    {
      projectName: 'Lorem Ipsum',
      campaignName: 'Campaign X',
      assetName: 'SalesCall_1',
      creadedOn: '21.01.2024',
      approvedBy: 'Prakash C.',
      approvedOn: '22.01.2024',
      currentStatus: 'Completed',
    },
    {
      projectName: 'Lorem Ipsum',
      campaignName: 'Campaign X',
      assetName: 'LinkedIn_1',
      creadedOn: '21.01.2024',
      approvedBy: 'Avish J.',
      approvedOn: '22.01.2024',
      currentStatus: 'Completed',
    },
    {
      projectName: 'Lorem Ipsum',
      campaignName: 'Campaign X',
      assetName: 'LinkedIn_1',
      creadedOn: '21.01.2024',
      approvedBy: 'Avish J.',
      approvedOn: '22.01.2024',
      currentStatus: 'Completed',
    }
];

const tableHeading = ["Project Name" , "Campaign Name", "Asset Name", "Created On" , "Approved By" , "Approved On" , "Current Status"]

const arrowshowItems = ["Project Name", "Created On", "Approved On"]

const toggleListType = () => {
  setIsList(pre=>!pre)
}

  return (
    <>
        <LayoutWrapper layout="main" >
          <div className="flex items-center justify-between pt-[2rem] px-[1.5rem]">
              <Breadcrumb TaskType='Completed Assets' />
              <span className="pr-10 cursor-pointer" onClick={toggleListType}>{isList ? <ListIcon /> : <GridIcon />}</span>
          </div>

          <div className="px-16">
          { !isList ? 
                 <div className="grid grid-cols-[repeat(3,1fr)] mt-4 gap-x-10 gap-y-10 overflow-auto">
                  {tableData.map((data,index)=>(
                    <div key={index}> 
                      <AssetCard data={data} />
                    </div>
                  ))}
                </div>
                :
                <Table listItems={tableData} tableHeadings={tableHeading} arrowInHeadings={arrowshowItems} 
              />}
          </div>
        </LayoutWrapper>
    </>
  )
}

export default CompletedAssets