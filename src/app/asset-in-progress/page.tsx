'use client'

import { GridIcon, ListIcon } from "@/assets/icons/AppIcons"
import Breadcrumb from "@/components/global/Breadcrumb"
import Table from "@/components/global/Table"
import AssetCard from "@/components/wrapper/AssetCard"
import LayoutWrapper from "@/layout/LayoutWrapper"
import { FC, useState } from "react"

  
const AssetInProgress:FC = () => {

  const [isList,setIsList] = useState<Boolean>(true)

  const tableData = [
    {
      projectName: 'Lorem Ipsum',
      campaignName: 'Lorem Ipsum',
      assetName: 'Email_1',
      creadedOn: '18.01.2024',
      approvedBy: 'Prakash C.',
      approvedOn: '20.01.2024',
      currentStatus: 'In Progress',
    },
    {
      projectName: 'Lorem Ipsum',
      campaignName: 'Lorem Ipsum',
      assetName: 'LinkedIn_1',
      creadedOn: '18.01.2024',
      approvedBy: 'Avish J.',
      approvedOn: '20.01.2024',
      currentStatus: 'Pending Approval',
    },
    {
      projectName: 'Lorem Ipsum',
      campaignName: 'Campaign X',
      assetName: 'SalesCall_1',
      creadedOn: '21.01.2024',
      approvedBy: 'Prakash C.',
      approvedOn: '22.01.2024',
      currentStatus: 'Pending Approval',
    },
    {
      projectName: 'Lorem Ipsum',
      campaignName: 'Campaign X',
      assetName: 'LinkedIn_1',
      creadedOn: '21.01.2024',
      approvedBy: 'Avish J.',
      approvedOn: '22.01.2024',
      currentStatus: 'In Progress',
    },
    {
      projectName: 'Lorem Ipsum',
      campaignName: 'Campaign X',
      assetName: 'LinkedIn_1',
      creadedOn: '21.01.2024',
      approvedBy: 'Avish J.',
      approvedOn: '22.01.2024',
      currentStatus: 'In Progress',
    },
    {
      projectName: 'Lorem Ipsum',
      campaignName: 'Campaign X',
      assetName: 'LinkedIn_1',
      creadedOn: '21.01.2024',
      approvedBy: 'Avish J.',
      approvedOn: '22.01.2024',
      currentStatus: 'Pending Approval',
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
            <div className="flex items-center justify-between pt-[1rem] px-[1.5rem]">
                <Breadcrumb TaskType="Asset In Progress"/>
                <span className="pr-10 cursor-pointer" onClick={toggleListType}>{!isList ? <ListIcon /> : <GridIcon />}</span>
            </div>

            <div className="px-4 lg:px-16 xl:px-20">
              { !isList ? 
                 <div className=" asset-grid-layout mt-4  justify-center overflow-auto">
                  {tableData.map((data,index)=>( 
                    <div key={index} 
                    > 
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

export default AssetInProgress
