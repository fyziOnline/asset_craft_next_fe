import { HPE_BRAND_Logo } from '@/assets/icons/HPE_Logo'
import { FC } from 'react'

const HomeHeader:FC = () => {
  return (
    <header className='bg-black py-3 px-32 relative z-10'>
        <HPE_BRAND_Logo className='flex justify-start'/>
    </header>
  )
}

export default HomeHeader