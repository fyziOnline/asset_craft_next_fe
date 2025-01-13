'use client'
import { FC, useState } from "react"
import { useRouter } from "next/navigation"
import ProjectPageLayout from "@/layout/specific_layout/ProjectPageLayout"

const MyProjects: FC = () => {
  const router = useRouter()
  const [isList, setIsList] = useState<Boolean>(true)

  const tableData = [
    {
      projectName: 'GreenLake',
      creadedOn: '18.01.2024',
      approvedOn: '20.01.2024',
      dataClick: 'GreenLake'
    },
    {
      projectName: 'Lorem ipsum dolor sit amet',
      creadedOn: '18.01.2024',
      approvedOn: '20.01.2024',
      dataClick: 'Lorem ipsum dolor sit amet',
    },
    {
      projectName: 'Lorem ipsum dolor sit amet',
      creadedOn: '21.01.2024',
      approvedOn: '22.01.2024',
      dataClick: 'Lorem ipsum dolor sit amet',
    },
    {
      projectName: 'Lorem ipsum dolor sit amet',
      creadedOn: '21.01.2024',
      approvedOn: '22.01.2024',
      dataClick: 'Lorem ipsum dolor sit amet',
    },
    {
      projectName: 'Lorem ipsum dolor sit amet',
      creadedOn: '21.01.2024',
      approvedOn: '22.01.2024',
      dataClick: 'Lorem ipsum dolor sit amet',
    },
    {
      projectName: 'Lorem ipsum dolor sit amet',
      creadedOn: '21.01.2024',
      approvedOn: '22.01.2024',
      dataClick: 'Lorem ipsum dolor sit amet',
    }
  ];


  const toggleListType = () => {
    setIsList(pre => !pre)
  }

  const onSelectingProject = (project_name: string) => {
    console.log('project_name **', project_name);
    router.push(`my-projects/${encodeURIComponent(project_name)}`)
  }

  const tableHeading = ["Project Name", "Created On", "Last Edited"]

  const arrowshowItems = ["Project Name", "Created On", "Last Edited"]


  return (
    <>
      <ProjectPageLayout hiddenFields={["dataClick"]} viewType="project" project_data={tableData} onSelectingProjects={onSelectingProject} tableHeadings={tableHeading} headersHavingToggle={arrowshowItems} page="My Project" />
    </>
  )
}

export default MyProjects
