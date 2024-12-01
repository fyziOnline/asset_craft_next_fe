'use client'
import AssetsPageLayout from '@/layout/specific_layout/AssetsPageLayout'
import { usePathname } from 'next/navigation'
import React, { FC } from 'react'

const CampaignPage:FC = () => {
    const pathname = usePathname()
    const campaign_name = decodeURIComponent(pathname.split('/').pop() || '')
    const tableData = [
        {
          projectName: 'Email_1',
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
          assetName: 'Email_1',
          creadedOn: '18.01.2024',
          approvedBy: 'Avish J.',
          approvedOn: '20.01.2024',
          currentStatus: 'Pending Approval',
        },
        {
          projectName: 'Lorem Ipsum',
          campaignName: 'Lorem Ipsum',
          assetName: 'Email_1',
          creadedOn: '18.01.2024',
          approvedBy: 'Avish J.',
          approvedOn: '20.01.2024',
          currentStatus: 'Pending Approval',
        }
    ]
    const tableHeading = ["Project Name" , "Campaign Name", "Asset Name", "Created On" , "Approved By" , "Approved On" , "Current Status"]

    const headerHavingSortingToggle = ["Project Name", "Created On", "Approved On"]
 
  return (
    <>
        <AssetsPageLayout 
            campaign_data={tableData}
            tableHeadings={tableHeading}
            headersHavingToggle={headerHavingSortingToggle}
            page={campaign_name}
        />
    </>
  )
}

export default CampaignPage