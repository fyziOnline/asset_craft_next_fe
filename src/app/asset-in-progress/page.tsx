import { GridIcon } from "@/assets/icons/AppIcons"
import Breadcrumb from "@/components/global/Breadcrumb"
import Table from "@/components/global/Table"
import LayoutWrapper from "@/layout/LayoutWrapper"
import { FC } from "react"

  
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

  const arrowshowItems = ["Project Name", "Created On", "Approved On"]
 

  return (
    <>
        <LayoutWrapper layout="main" >
            <div className="flex items-center justify-between pt-[2rem] px-[1.5rem]">
                <Breadcrumb TaskType="Asset In Progress"/>
                <span className="pr-10"><GridIcon /></span>
            </div>

            <div className="px-16">
              <Table listItems={tableData} tableHeadings={tableHeading} arrowInHeadings={arrowshowItems} />
          </div>
        </LayoutWrapper>
    </>
  )
}

export default AssetInProgress
