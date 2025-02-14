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
}

const DashboardCard: React.FC<DashboardCardProps> = ({ projectName, allProjectDate, totalAssets, underReview, inProgress, customClass, completedAssets }) => {
  const router = useRouter()
  const navigateToAssetPage = () => {
    router.push(`/asset?type=${projectName}`)
  }
  return (
    <div
      className={`w-auto group cursor-pointer bg-[#F6F6F6] hover:bg-gradient-to-br hover:from-[#00A881] hover:to-[#073634] border border-[#D9D9D9] shadow-sm rounded-[15px] p-4 hover:border-none ${customClass}`}
      onClick={navigateToAssetPage}
    >
      <h2 className="text-lg text-[#073634] leading-none font-bold mb-2 group-hover:text-white">{projectName}</h2>

      <div className={`${allProjectDate ? "flex items-baseline gap-1" : ""} border-b pb-3`}>
        <div className='flex gap-3 items-center'>
          <p className="text-4xl md:text-5xl leading-none font-bold text-teal-600 group-hover:text-white">{totalAssets}</p>
          <p className="text-lg font-semibold group-hover:text-white">{projectName === "All Projects" ? "Total Assets" : "Assets"}</p>
        </div>
      </div>

      <div className="grid card_res gap-1 mt-3 items-start">
        {/* sec 1 */}
        <div className="grid grid-rows-2 gap-2 ">
          <p className="text-3xl font-bold group-hover:text-white h-10 text-center">{underReview}</p>
          <p className="text-3xl font-bold group-hover:text-white h-10 text-center">{inProgress}</p>
          <p className="text-3xl font-bold group-hover:text-white h-10 text-center">{completedAssets}</p>
        </div>
        {/* sec 2 */}
        <div className="grid grid-rows-2 gap-2  items-center w-fit">
          <p className="text-base text-[#00A881] leading-none text-start pl-3 group-hover:text-white h-10 flex items-center justify-center">Under Review</p>
          <p className="text-base text-[#B0890E] leading-none text-start pl-3 group-hover:text-white h-10 flex items-center justify-center">In Progress</p>
          <p className="text-base text-[#00A881] leading-none text-start pl-3 group-hover:text-white h-10 flex items-center justify-center">Completed</p>
        </div>
      </div>
      {/* <div className='grid grid-cols-[5ch_120px] items-baseline gap-4'>
          <p className="text-3xl w-4 font-bold group-hover:text-white">{underReview}</p>
          <p className="text-base text-[#00A881] leading-none text-start w-[120px] pl-3 group-hover:text-[white]">Under Review</p>
        </div>
        <div className="grid grid-cols-[5ch_120px] items-baseline gap-4">
          <p className="text-3xl font-bold group-hover:text-white">{inProgress}</p>
          <p className="text-base text-[#B0890E] leading-none text-start pl-3 group-hover:text-white">
            In Progress
          </p>
        </div>
      </div> */}
    </div>
  )
}

export default DashboardCard