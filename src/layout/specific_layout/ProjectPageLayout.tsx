// this layout is used for /my-projects , /my-projects/[project] 

import LayoutWrapper from '@/layout/LayoutWrapper'
import { FC, useState } from 'react'
import Breadcrumb from '../../components/global/Breadcrumb'
import { GridIcon, ListIcon } from '@/assets/icons/AppIcons'
import MyProjectCard from '../../components/wrapper/MyProjectCard'
import Table from '../../components/global/Table'

interface Project {
  [key:string] : string
}

interface ProjectSectionProps {
    project_data : Project[]
    onSelectingProjects : (project_name:string)=>void
    tableHeadings : string[]
    headersHavingToggle : string[]
    page:string
}

const ProjectPageLayout:FC<ProjectSectionProps> = ({project_data,onSelectingProjects,tableHeadings,headersHavingToggle,page}) => {
  const [isList,setIsList] = useState<Boolean>(true)
  const toggleListType = () => {
    setIsList(pre=>!pre)
  }

  return (
    <>
        <LayoutWrapper layout='main'>
            <div className="flex items-center justify-between pt-[1rem] px-[1.5rem]">
                <Breadcrumb TaskType={page}/>
                <span className="pr-10 cursor-pointer" onClick={toggleListType}>{!isList ? <ListIcon /> : <GridIcon /> }</span>
            </div>
            <div className="asset-grid-padding">
                {
                !isList ? 
                  <div className="asset-grid-layout mt-4  justify-center overflow-auto">
                  {project_data.map((data,index)=>(
                    <div key={index}> 
                      <MyProjectCard data={data} handleSelectProject={onSelectingProjects} />
                    </div>
                  ))}
                  </div>
                  :
                <Table columnWidths={['9fr', '1.5fr', '1fr']} listItems={project_data} tableHeadings={tableHeadings} arrowInHeadings={headersHavingToggle} />
              }
            </div>

        </LayoutWrapper>
    </>
  )
}

export default ProjectPageLayout