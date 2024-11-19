import React from 'react'

interface DashboardCardProps {
    projectName: string;
    allProjectDate?: string;
    totalAssets: number;
    underReview: number;
    inProgress: number;
  }

const DashboardCard: React.FC<DashboardCardProps> = ({projectName, allProjectDate, totalAssets, underReview, inProgress }) => {
  return (
    <div className="group bg-white hover:bg-green-100 border-2 border-[#D9D9D9] rounded-[15px] w-[280px] h-[240px] p-4 cursor-pointer">
      <h2 className="text-xl leading-none font-bold mb-2 group-hover:text-white">{projectName}:</h2>
      <p className='text-base text-[#7B7B7B] group-hover:text-white'>{allProjectDate}</p>

      <div className={`${allProjectDate ? "flex items-baseline gap-1" : "" }`}>
        <p className="text-5xl leading-none font-bold text-teal-600 group-hover:text-white">{totalAssets}</p>
        <p className="text-base font-normal group-hover:text-white">Total Assets</p>
      </div>

      <div className="flex flex-col items-end mt-4">
        <div className='flex items-baseline'>
          <p className="text-4xl font-bold group-hover:text-white">{underReview}</p>
          <p className="text-sm text-start w-[120px] pl-3 group-hover:text-white">Under Review</p>
        </div>
        <div className='flex items-baseline'>
          <p className="text-4xl font-bold group-hover:text-white">{inProgress}</p>
          <p className="text-sm text-start w-[120px] pl-3 group-hover:text-white">In Progress</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardCard