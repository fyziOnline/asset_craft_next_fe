import React from 'react'
import Link from 'next/link';

/**
 * Breadcrumb component displays navigation links with project name, task name, and task type.
 * 
 * @component

 * @param {object} props - The properties passed to the component.
 * @param {string} props.projectName - The name of the project to display in the breadcrumb.
 * @param {string} [props.projectUrl=""] - The URL of the project. Defaults to an empty string.
 * @param {string} [props.TaskName=""] - The name of the task. Defaults to an empty string.
 * @param {string} [props.TaskType=""] - The type of the task. Defaults to an empty string.
 * 
 * @returns {JSX.Element} The breadcrumb navigation component.
 */

interface BreadcrumbProps {
    projectName?: string;
    projectUrl?: string;
    TaskName?: string;
    TaskType?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ projectName, projectUrl = "", TaskName = "", TaskType = "" }) => {
    
  return (
    <div className='flex items-center '>
        <div className='pr-5 cursor-pointer'>
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="22" viewBox="0 0 13 22" fill="none">
                <path d="M12 1L2 10.7959L12 20.5918" stroke="#BBBBBB" strokeWidth="2.5"/>
            </svg>
        </div>
        <Link href={projectUrl} className='border-r-[1px] border-r-[#073634]'>
            <p className='text-[26px] text-[#7F7F7F] leading-normal font-bold px-[6px]'>{projectName}</p>
        </Link>
        <Link href={projectUrl} className='border-r-[1px] border-r-[#073634]'>
            <p className='text-[26px] leading-normal font-bold text-green-100 px-[6px]'>{TaskName}</p>
        </Link>
        <Link href={projectUrl}>
            <p className='text-[26px] leading-normal font-bold text-green-100 px-[6px]'>{TaskType}</p>
        </Link>
    </div>
  )
}

export default Breadcrumb