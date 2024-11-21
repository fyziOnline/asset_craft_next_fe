'use client'
import { FC, useState } from 'react'
import AssetIndicator from '../global/AssetIndicator'
import UpdateIndicator from '../global/UpdateIndicator'
import CardContent from '../global/CardContent'
import StatusLabel from '../global/StatusLabel'
import Button from '../global/Button'

interface AssetCardProp {
  data : {
    projectName: string
    campaignName: string
    assetName: string
    creadedOn: string
    approvedBy: string
    approvedOn: string 
    currentStatus: string
  }
}


const AssetCard:FC<AssetCardProp> = ({data}) => {
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
      className='group p-[1.5rem] border-2 rounded-3xl hover:bg-green-100' 
      onMouseEnter={onHover} 
      onMouseLeave={onLeave}
    >
      <div className='flex items-start justify-between mb-1'>
        <AssetIndicator hoverStatus={isHovered} asset_type={data.assetName}/>
        <StatusLabel status_value={status}/>
      </div>
        <CardContent header={data.projectName} cardClass='mb-5' content='Ipsum dolor sit amet consectetur adipisicing elit. Ipsum deleniti ab perspiciatis obcaecati inventore quae officiis debitis ullam dolorem illo? dsjfkwhai udjsfhuwieuh fuehu' /> 
        <div className='flex justify-between items-center'>
          <UpdateIndicator date={data.creadedOn}/>
          <Button 
            buttonText='Clone It' 
            showIcon textStyle='text-[1rem] font-base text-[#00A881]' 
            customClass='static border-[1.5px] border-[#00A881]  px-[1.4rem] py-2 group-hover:border-white' 
            textColor={!isHovered ? 'text-[#00A881]' : 'text-[#fff]'}  
            backgroundColor='white' 
            iconColor={!isHovered ? '#00A881' : '#fff'}/>
        </div>
    </div>
  )
} 

export default AssetCard