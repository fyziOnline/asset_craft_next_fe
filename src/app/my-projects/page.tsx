'use client'
import { FC } from "react"
import { useRouter } from "next/navigation"
import ProjectPageLayout from "@/layout/specific_layout/ProjectPageLayout"

const tableHeading = ["Project Name", "Created On", "Last Edited"]
const arrowshowItems = ["Project Name", "Created On", "Last Edited"]

const MyProjects: FC = () => {
  const router = useRouter()

  const tableData = [
    {
      projectName: 'GreenLake',
      creadedOn: '18.01.2024',
      approvedOn: '20.01.2024',
      dataClick: 'GreenLake'
    }
  ];

  const onSelectingProject = (project_name: string) => {
    router.push(`my-projects/${encodeURIComponent(project_name)}`)
  }

  return (
    <>
      <ProjectPageLayout hiddenFields={["dataClick"]} viewType="project" project_data={tableData} onSelectingProjects={onSelectingProject} tableHeadings={tableHeading} headersHavingToggle={arrowshowItems} page="My Project" />
    </>
  )
}

export default MyProjects
