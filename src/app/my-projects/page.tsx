import { FC } from "react"
import { GridIcon } from "@/assets/icons/AppIcons"
import Breadcrumb from "@/components/global/Breadcrumb"
import Table from "@/components/global/Table"
import LayoutWrapper from "@/layout/LayoutWrapper"

  
const MyProjects:FC = () => {

  const tableData = [
    {
      projectName: 'GreenLake',
      creadedOn: '18.01.2024',
      approvedOn: '20.01.2024',
      
    },
    {
      projectName: 'Lorem ipsum dolor sit amet',
      creadedOn: '18.01.2024',
      approvedOn: '20.01.2024',
    },
    {
      projectName: 'Lorem ipsum dolor sit amet',
      creadedOn: '21.01.2024',
      approvedOn: '22.01.2024',
    },
    {
      projectName: 'Lorem ipsum dolor sit amet',
      creadedOn: '21.01.2024',
      approvedOn: '22.01.2024',
      
    },
    {
      projectName: 'Lorem ipsum dolor sit amet',
      creadedOn: '21.01.2024',
      approvedOn: '22.01.2024',  
    },
    {
      projectName: 'Lorem ipsum dolor sit amet',
      creadedOn: '21.01.2024',
      approvedOn: '22.01.2024',
    }
];

  const tableHeading = ["Project Name", "Created On", "Last Edited"]

  const arrowshowItems = ["Project Name", "Created On", "Last Edited"]
 

  return (
    <>
        <LayoutWrapper layout="main" >
            <div className="flex items-center justify-between pt-[2rem] px-[1.5rem]">
                <Breadcrumb TaskType="My Projects"/>
                <span className="pr-10"><GridIcon /></span>
            </div>

            <div className="px-16">
              <Table columnWidths={['9fr', '1.5fr', '1fr']} listItems={tableData} tableHeadings={tableHeading} arrowInHeadings={arrowshowItems} />
          </div>
        </LayoutWrapper>
    </>
  )
}

export default MyProjects
