import { HPE_BRAND_Logo } from '@/assets/icons/HPE_Logo'
import { FC } from 'react'

const HomeHeader:FC = () => {
  return (
    <header className='px-8 md:px-20 lg:px-32'>
        <HPE_BRAND_Logo className='flex justify-start' width={150} height={60}/>
    </header>
  )
}

export default HomeHeader