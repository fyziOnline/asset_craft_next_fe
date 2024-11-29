'use client'

import { GridIcon, ListIcon } from "@/assets/icons/AppIcons"
import Breadcrumb from "@/components/global/Breadcrumb"
import Table from "@/components/global/Table"
import AssetCard from "@/components/wrapper/AssetCard"
import LayoutWrapper from "@/layout/LayoutWrapper"
import AssetsPageLayout from "@/layout/specific_layout/AssetsPageLayout"
import { FC, useState } from "react"

  
const AssetInProgress:FC = () => {

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

  const headerHavingSortingToggle = ["Project Name", "Created On", "Approved On"]
 

  return (
    <>
       <AssetsPageLayout
          campaign_data={tableData}
          tableHeadings={tableHeading}
          headersHavingToggle={headerHavingSortingToggle}
          page="Asset In Progress"
       />
    </>
  )
}

export default AssetInProgress
