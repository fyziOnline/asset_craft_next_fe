'use client'
import { FC, useState } from 'react'
import AssetIndicator from '../global/AssetIndicator'
import UpdateIndicator from '../global/UpdateIndicator'
import CardContent from '../global/CardContent'
import StatusLabel from '../global/StatusLabel'
import Button from '../global/Button'

const AssetCard:FC = () => {
  const [isHovered,setIsHovered] = useState<boolean>(false)
  const onHover = () => {
    setIsHovered(true)
  }
  const onLeave = () => {
    setIsHovered(false);
  }
  return (
    <div 
      className='group p-[2rem] border-2 w-[27rem] rounded-3xl hover:bg-green-100' 
      onMouseEnter={onHover} 
      onMouseLeave={onLeave}
    >
      <div className='flex items-start justify-between mb-1'>
        <AssetIndicator hoverStatus={isHovered}/>
        <StatusLabel status_value='0'/>
      </div>
        <CardContent header='Lorem Text' cardClass='mb-5' content='Ipsum dolor sit amet consectetur adipisicing elit. Ipsum deleniti ab perspiciatis obcaecati inventore quae officiis debitis ullam dolorem illo? dsjfkwhai udjsfhuwieuh fuehu' /> 
        <div className='flex justify-between items-center'>
          <UpdateIndicator date="20 Jan 2024"/>
          <Button 
            buttonText='Clone It' 
            showIcon spanClass='text-[1rem] font-base' 
            customClass='static border-[1.5px] border-[#00A881]  px-[1.4rem] py-2 group-hover:border-white' 
            textColor={!isHovered ? 'text-[#00A881]' : 'text-[#fff]'} 
            backgroundColor='white' 
            iconColor={!isHovered ? '#00A881' : '[#fff'}/>
        </div>
    </div>
  )
} 

export default AssetCard