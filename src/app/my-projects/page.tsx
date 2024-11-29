'use client'
import { FC, useState } from "react"
import { GridIcon, ListIcon } from "@/assets/icons/AppIcons"
import Breadcrumb from "@/components/global/Breadcrumb"
import Table from "@/components/global/Table"
import LayoutWrapper from "@/layout/LayoutWrapper"
import MyProjectCard from "@/components/wrapper/MyProjectCard"
import { useRouter } from "next/navigation"
import ProjectPageLayout from "@/components/layout/ProjectPageLayout"

  
const MyProjects:FC = () => {
  const router = useRouter()
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

  const onSelectingProject = (project_name:string) => {
    router.push(`my-projects/${encodeURIComponent(project_name)}`)
    
  }

  const tableHeading = ["Project Name", "Created On", "Last Edited"]

  const arrowshowItems = ["Project Name", "Created On", "Last Edited"]
 

  return (
    <>
        <ProjectPageLayout project_data={tableData} onSelectingProjects={onSelectingProject} tableHeadings={tableHeading} headersHavingToggle={arrowshowItems} page="My Project"/>
    </>
  )
}

export default MyProjects
