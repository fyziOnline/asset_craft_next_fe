import { FC } from 'react'
import AssetIndicator from '../global/AssetIndicator'
import UpdateIndicator from '../global/UpdateIndicator'
import CardContent from '../global/CardContent'
import StatusLabel from '../global/StatusLabel'
import Button from '../global/Button'

const AssetCard:FC = () => {
  return (
    <div className='p-[2rem] border-2 w-[27rem] rounded-3xl'>
      <div className='flex items-start justify-between mb-1'>
        <AssetIndicator />
        <StatusLabel status_value='0'/>
      </div>
        <CardContent header='Lorem Text' cardClass='mb-5' content='Ipsum dolor sit amet consectetur adipisicing elit. Ipsum deleniti ab perspiciatis obcaecati inventore quae officiis debitis ullam dolorem illo? dsjfkwhai udjsfhuwieuh fuehu' /> 
        <div className='flex justify-between items-center'>
          <UpdateIndicator date="20 Jan 2024"/>
          <Button 
            buttonText='Clone It' 
            showIcon textStyle='text-[1rem] font-base text-[#00A881]' 
            customClass='static border-[1.5px] border-[#00A881]  px-[1.4rem] py-2' 
            textColor='#00A881' 
            backgroundColor='white' 
            iconColor='#00A881'/>
        </div>
    </div>
  )
} 

export default AssetCard