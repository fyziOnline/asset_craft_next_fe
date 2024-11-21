'use client'
import { FC, useState } from 'react'
import CardContent from '../global/CardContent'
import UpdateIndicator from '../global/UpdateIndicator'
import Button from '../global/Button'


interface AssetCardProp {
  data : {
    projectName: string
    creadedOn: string
    approvedOn: string 
  }
}


const MyProjectCard:FC<AssetCardProp> = ({data}) => {
const [isHovered,setIsHovered] = useState<boolean>(false)
const onHover = () => {
  setIsHovered(true)
}
const onLeave = () => {
  setIsHovered(false);
}
  return (
    <div
        className='group p-[2rem] border-2  rounded-3xl hover:bg-green-100' 
        onMouseEnter={onHover} 
        onMouseLeave={onLeave}
    >
        <CardContent header={data.projectName} cardClass='mb-14' content='Ipsum dolor sit amet consectetur adipisicing elit. Ipsum deleniti ab perspiciatis obcaecati inventore quae officiis debitis ullam dolorem illo? dsjfkwhai udjsfhuwieuh fuehu Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, fugiat! ' />  
        <div className='flex justify-between'>
        <UpdateIndicator date={data.creadedOn}/>
          <Button
            buttonText='Clone It' 
            showIcon textStyle='text-[1rem] font-base' 
            customClass='static border-[1.5px] border-[#00A881]  px-[1.4rem] py-2 group-hover:border-white' 
            textColor={!isHovered ? 'text-[#00A881]' : 'text-[#fff]'} 
            backgroundColor='white' 
            iconColor={!isHovered ? '#00A881' : '#fff'}/>
        </div>
    </div>
  )
}

export default MyProjectCard