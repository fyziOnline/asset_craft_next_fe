import { useRouter } from 'next/navigation';
import React from 'react'

interface DashboardCardProps {
  projectName: string;
  allProjectDate?: string;
  totalAssets: number;
  underReview: number;
  inProgress: number;
  customClass?: string;
  completedAssets: number;
  loading?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ projectName, allProjectDate, totalAssets, underReview, inProgress, customClass, completedAssets, loading }) => {
  const router = useRouter()
  const navigateToAssetPage = () => {
    router.push(`/asset?type=${projectName}`)
  }
  return (
    <div
      className={`w-auto h-[250px] group cursor-pointer ${loading ? "bg-gray-100" : "bg-[#F6F6F6]"} hover:bg-gradient-to-br hover:from-[#00A881] hover:to-[#073634] border border-[#D9D9D9] shadow-sm rounded-[15px] p-4 hover:border-none ${customClass}`}
      onClick={navigateToAssetPage}
    >
      <div className='flex items-center justify-between mb-2'>
        <h2 className="text-lg text-[#073634] leading-none font-bold group-hover:text-white">{projectName}</h2>
        <p className={`text-base leading-none font-medium text-[#818F8E] group-hover:text-white ${projectName === 'All Projects' ? '' : "hidden"}`}> Last 90 days</p>
      </div>

      <div className={`${allProjectDate ? "flex items-baseline gap-1" : ""} border-b pb-3`}>
        <div className='flex gap-3 items-center'>
          <p className="text-4xl md:text-5xl Fleading-none font-bold text-teal-600 group-hover:text-white">{totalAssets}</p>
          <p className="text-lg font-semibold group-hover:text-white">{projectName === "All Projects" ? "Total Assets" : "Assets"}</p>
        </div>
      </div>

      <div className="grid card_res gap-1 mt-1 items-start">
        <div className="grid grid-rows-2 gap-1 ">
          <p className="text-3xl font-bold group-hover:text-white h-10 text-center">{underReview}</p>
          <p className="text-3xl font-bold group-hover:text-white h-10 text-center">{inProgress}</p>
          <p className="text-3xl font-bold group-hover:text-white h-10 text-center">{completedAssets}</p>
        </div>
        <div className="grid grid-rows-2 gap-1  items-center w-fit">
          <p className="text-base text-[#00A881] leading-none text-start pl-3 group-hover:text-white h-10 flex items-center">Under Review</p>
          <p className="text-base text-[#B0890E] leading-none text-start pl-3 group-hover:text-white h-10 flex items-center">In Progress</p>
          <p className="text-base text-[#00A881] leading-none text-start pl-3 group-hover:text-white h-10 flex items-center">Completed</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardCard