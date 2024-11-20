import { FC } from "react"
import Breadcrumb from "@/components/global/Breadcrumb"
import LayoutWrapper from "@/layout/LayoutWrapper"
import Table from "@/components/global/Table"
import { LandingAssetIcon } from "@/assets/icons/TableIcon"

  
const page:FC = () => {

  const tableData = [
    {
      assetName: 'Lorem ipsum dolor sit amet',
      creadedOn: '18.01.2024',
      approvedBy: 'Prakash C.',
      approvedOn: '20.01.2024',
      currentStatus: 'In Progress',
    },
    {
      assetName: 'Lorem ipsum dolor sit amet',
      creadedOn: '18.01.2024',
      approvedBy: 'Avish J.',
      approvedOn: '20.01.2024',
      currentStatus: 'In Progress',
    },
    {
      assetName: 'Lorem ipsum dolor sit amet',
      creadedOn: '21.01.2024',
      approvedBy: 'Prakash C.',
      approvedOn: '22.01.2024',
      currentStatus: 'Pending Approval',
    }
];

  const tableHeading = ["Asset Name", "Created On" , "Approver" , "Last Edited" , "Current Status"]

  const arrowshowItems = ["Asset Name", "Created On" , "Approver" , "Last Edited"]
 

  return (
    <>
        <LayoutWrapper layout="main" >
            <div className="pt-[2rem] px-[1.5rem]">
                <Breadcrumb TaskType="Landing Page Assets"/>
            </div>

            <div className="px-16">
              <Table IconComponent={<LandingAssetIcon />} IconAssetName="assetName" columnWidths={["4fr" , "1fr" ,"1fr" ,"1fr" ,"1fr"]} listItems={tableData} tableHeadings={tableHeading} arrowInHeadings={arrowshowItems} />
          </div>
        </LayoutWrapper>
    </>
  )
}

export default page
