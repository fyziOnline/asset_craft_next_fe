'use client'
import { FC, useState } from 'react'
import AssetIndicator from '@/components/global/AssetIndicator'
import UpdateIndicator from '@/components/global/UpdateIndicator'
import CardContent from '@/components/global/CardContent'
import StatusLabel from '@/components/global/StatusLabel'

interface AssetCardProp {
  data : {
    [key:string] : string
  }
  handleClick?: (value: any) => void; // Add handleClick prop
}


const AssetCard:FC<AssetCardProp> = ({ data, handleClick = () => {} }) => {
  const [isHovered,setIsHovered] = useState<boolean>(false)
  const onHover = () => {
    setIsHovered(true)
  }
  const onLeave = () => {
    setIsHovered(false);
  }

  type Status = '0' | '1' | '2' | '3';

  let status:Status = '0'
  switch (data.currentStatus) {
    case 'In Progress':
      status = '0'
      break;
    case 'To be approved':
      status = '1'
      break
    case 'Pending Approval':
      status = '2'
      break
    case 'Completed':
      status = '3'
      break
    default:
      break;
  }

  return (
    <div 
      className='group p-[5%] border-2 cursor-pointer  rounded-3xl hover:bg-green-100'
      onMouseEnter={onHover} 
      onMouseLeave={onLeave}
      onClick={() => handleClick(data)} // Implement handleClick
    >
      <div className='flex items-start justify-between mb-[2%]'>
        <AssetIndicator hoverStatus={isHovered} asset_type={data.assetTypeIcon}/>
        <StatusLabel status_value={status}/>
      </div>
        <CardContent header={data.projectName} cardClass=' mb-[4%]' content={data.campaignName} /> 
        <div className='flex justify-between items-center'>
          <UpdateIndicator date={data.createdOn}/>
        </div>
    </div>
  )
} 

export default AssetCard