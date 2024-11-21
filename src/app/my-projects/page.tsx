'use client'
import { FC, useState } from "react"
import { GridIcon, ListIcon } from "@/assets/icons/AppIcons"
import Breadcrumb from "@/components/global/Breadcrumb"
import Table from "@/components/global/Table"
import LayoutWrapper from "@/layout/LayoutWrapper"
import MyProjectCard from "@/components/wrapper/MyProjectCard"

  
const MyProjects:FC = () => {
  const [isList,setIsList] = useState<Boolean>(true)

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
    

    const toggleListType = () => {
      setIsList(pre=>!pre)
    }


  const tableHeading = ["Project Name", "Created On", "Last Edited"]

  const arrowshowItems = ["Project Name", "Created On", "Last Edited"]
 

  return (
    <>
        <LayoutWrapper layout="main" >
            <div className="flex items-center justify-between pt-[2rem] px-[1.5rem]">
                <Breadcrumb TaskType="My Projects"/>
                <span className="pr-10 cursor-pointer" onClick={toggleListType}>{!isList ? <ListIcon /> : <GridIcon /> }</span>
            </div>

            <div className="px-24">
              {
                !isList ? 
                  <div className="grid grid-cols-[repeat(3,1fr)] mt-4 gap-x-12 gap-y-12 overflow-auto">
                  {tableData.map((data,index)=>(
                    <div key={index}> 
                      <MyProjectCard data={data} />
                    </div>
                  ))}
                  </div>
                  :
                <Table columnWidths={['9fr', '1.5fr', '1fr']} listItems={tableData} tableHeadings={tableHeading} arrowInHeadings={arrowshowItems} />
              }
          </div>
        </LayoutWrapper>
    </>
  )
}

export default MyProjects
