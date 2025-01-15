import { FC } from "react"
import Table from "@/components/global/Table"

const page: FC = () => {

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

  const tableHeading = ["Asset Name", "Created On", "Approver", "Last Edited", "Current Status"]

  const arrowshowItems = ["Asset Name", "Created On", "Approver", "Last Edited"]

  return (
    <>
      <div className="px-16">
        <Table columnWidths={["4fr", "1fr", "1fr", "1fr", "1fr"]} listItems={tableData} tableHeadings={tableHeading} arrowInHeadings={arrowshowItems} />
      </div>
    </>
  )
}

export default page
