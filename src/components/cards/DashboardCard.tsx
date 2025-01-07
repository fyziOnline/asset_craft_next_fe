import React from 'react'

interface DashboardCardProps {
  projectName: string;
  allProjectDate?: string;
  totalAssets: number;
  underReview: number;
  inProgress: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ projectName, allProjectDate, totalAssets, underReview, inProgress }) => {
  return (
    <div className="group bg-[#F6F6F6] hover:bg-gradient-to-br hover:from-[#00A881] hover:to-[#073634] border-2 border-[#D9D9D9] rounded-[15px] w-[20%] p-4 cursor-pointer">
      <h2 className="text-lg text-[#073634] leading-none font-bold mb-2 group-hover:text-white">{projectName}</h2>
      {/* <p className='text-base text-[#7B7B7B] group-hover:text-white'>{allProjectDate}</p> */}

      <div className={`${allProjectDate ? "flex items-baseline gap-1" : ""} border-b pb-3`}>
        <div className='flex gap-3 items-center'>
          <p className="text-4xl md:text-5xl leading-none font-bold text-teal-600 group-hover:text-white">{totalAssets}</p>
          <p className="text-base font-semibold group-hover:text-white">Total Assets</p>
        </div>
      </div>

      <div className="flex flex-col items-start mt-3">
        <div className='flex items-baseline gap-4'>
          <p className="text-3xl w-4 font-bold group-hover:text-white">{underReview}</p>
          <p className="text-sm text-[#00A881] leading-none text-start w-[120px] pl-3 group-hover:text-[white]">Under Review</p>
        </div>
        <div className='flex items-baseline gap-4'>
          <p className="text-3xl w-4 font-bold group-hover:text-white">{inProgress}</p>
          <p className="text-sm text-[#B0890E] leading-none text-start w-[120px] pl-3 group-hover:text-white">In Progress</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardCard