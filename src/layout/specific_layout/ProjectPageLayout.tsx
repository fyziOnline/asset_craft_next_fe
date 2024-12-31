// this layout is used for /my-projects , /my-projects/[project] 

import { FC, useState } from 'react'
import Breadcrumb from '../../components/global/Breadcrumb'
import { GridIcon, ListIcon } from '@/assets/icons/AppIcons'
import MyProjectCard from '../../components/wrapper/MyProjectCard'
import Table from '../../components/global/Table'

interface Project {
  [key: string]: string
}

interface ProjectSectionProps {
  project_data: Project[]
  onSelectingProjects: (project_name: string) => void
  tableHeadings: string[]
  headersHavingToggle: string[]
  page: string
  viewType: 'project' | 'campaign'
}

const ProjectPageLayout: FC<ProjectSectionProps> = ({ project_data, onSelectingProjects, tableHeadings, headersHavingToggle, page, viewType }) => {
  const [isList, setIsList] = useState<Boolean>(true)
  const toggleListType = () => {
    setIsList(pre => !pre)
  }

  return (
    <>
      <div className="flex items-center justify-between pt-[1rem] px-[1.5rem]">
        <Breadcrumb TaskType={page} />
        <span className="pr-10 cursor-pointer" onClick={toggleListType}>{!isList ? <ListIcon /> : <GridIcon />}</span>
      </div>
      <div className="asset-grid-padding">
        {
          !isList ?
            <div className="asset-grid-layout mt-4  justify-center overflow-auto">
              {project_data.map((data, index) => (
                <div key={index}>
                  <MyProjectCard viewType={viewType} data={data} handleSelectProject={onSelectingProjects} />
                </div>
              ))}
            </div>
            : (
              project_data.length > 0 ?
              <Table viewType={viewType} onSelectingProject={onSelectingProjects} columnWidths={['8fr', '2fr', '1fr']}  listItems={project_data} tableHeadings={tableHeadings} arrowInHeadings={headersHavingToggle} />
              : <div className="w-full h-[70vh] flex justify-center items-center text-gray-500">No data available</div>
            )
        }
      </div>

    </>
  )
}

export default ProjectPageLayout