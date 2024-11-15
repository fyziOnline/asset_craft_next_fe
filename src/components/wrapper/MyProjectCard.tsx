'use client'
import { FC, useState } from 'react'
import CardContent from '../global/CardContent'
import UpdateIndicator from '../global/UpdateIndicator'
import Button from '../global/Button'

const MyProjectCard:FC = () => {
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
        <CardContent header='Lorem Text' cardClass='mb-10' content='Ipsum dolor sit amet consectetur adipisicing elit. Ipsum deleniti ab perspiciatis obcaecati inventore quae officiis debitis ullam dolorem illo? dsjfkwhai udjsfhuwieuh fuehu' /> 
        <div className='flex justify-between'>
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

export default MyProjectCard