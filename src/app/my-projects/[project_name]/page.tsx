'use client'
import ProjectPageLayout from '@/components/layout/ProjectPageLayout';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react'

const ProjectPage:FC = () => {
    const router = useRouter()
    const pathname = usePathname()
    const project_name = decodeURIComponent(pathname.split('/').pop() || '')
    
  const tableData = [
    {
      projectName: 'Storage Asia 2024',
      creadedOn: '18.01.2024',
      approvedOn: '20.01.2024',
      
    },
    {
      projectName: 'Campaign Name',
      creadedOn: '18.01.2024',
      approvedOn: '20.01.2024',
    },
    {
      projectName: 'Campaign Name',
      creadedOn: '18.01.2024',
      approvedOn: '20.01.2024',
    }
    ];
    const tableHeading = ["Project Name", "Created On", "Last Edited"]

    const headerHavingSortingToggle = ["Project Name", "Created On", "Last Edited"]

const onSelectingProject = (campaign_name:string) => {
    router.push(`my-projects/${project_name}/${encodeURIComponent(campaign_name)}`)
  }

  return (
    <>
        <ProjectPageLayout 
            project_data={tableData} 
            onSelectingProjects={onSelectingProject} 
            tableHeadings={tableHeading} 
            headersHavingToggle={headerHavingSortingToggle} 
            page={project_name}
        />
    </>
  )
}

export default ProjectPage