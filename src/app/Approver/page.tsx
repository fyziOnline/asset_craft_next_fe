import Breadcrumb from '@/components/global/Breadcrumb'
import Table from '@/components/global/Table'
import LayoutWrapper from '@/layout/LayoutWrapper'
import React from 'react'

const page = () => {

  const tableData = [
    {
      projectName: 'Lorem Ipsum',
      campaignName: 'Lorem Ipsum',
      assetName: 'Email_1',
      creadedOn: '18.01.2024',
      approvedBy: 'Suman Ann Thomas',
      approvedOn: '20.01.2024',
      currentStatus: 'Pending Approval',
    },
    {
      projectName: 'Lorem Ipsum',
      campaignName: 'Lorem Ipsum',
      assetName: 'LinkedIn_1',
      creadedOn: '18.01.2024',
      approvedBy: 'Suman Ann Thomas',
      approvedOn: '20.01.2024',
      currentStatus: 'Pending Approval',
    },
    {
      projectName: 'Project Alpha',
      campaignName: 'Campaign X',
      assetName: 'SalesCall_1',
      creadedOn: '21.01.2024',
      approvedBy: 'Suman Ann Thomas',
      approvedOn: '22.01.2024',
      currentStatus: 'Pending Approval',
    },
    {
      projectName: 'Project Alpha',
      campaignName: 'Campaign X',
      assetName: 'LinkedIn_1',
      creadedOn: '21.01.2024',
      approvedBy: 'Avish J.',
      approvedOn: '22.01.2024',
      currentStatus: 'Pending Approval',
    },
    {
      projectName: 'Project Alpha',
      campaignName: 'Campaign X',
      assetName: 'LinkedIn_1',
      creadedOn: '21.01.2024',
      approvedBy: 'Avish J.',
      approvedOn: '22.01.2024',
      currentStatus: 'Pending Approval',
    }
];

  const tableHeading = ["Project Name" , "Campaign Name", "Asset Name", "Created On" , "Approver" , "Last Edited" , "Current Status"]

  const arrowshowItems = ["Project Name" , "Campaign Name", "Asset Name", "Created On", "Last Edited" , "Current Status"]
 
  return (
    <LayoutWrapper layout='main'>
        <div className="py-[2rem] px-[1.5rem]">
            <Breadcrumb TaskType='Approval Assets:' />
        </div>

        <div className='px-16'>
          <Table listItems={tableData} tableHeadings={tableHeading} arrowInHeadings={arrowshowItems} />
        </div>
    </LayoutWrapper>
  )
}

export default page