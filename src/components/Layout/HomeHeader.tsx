import { HPE_BRAND_Logo } from '@/assets/icons/HPE_Logo'
import { FC } from 'react'

const HomeHeader:FC = () => {
  return (
    <header className='bg-black py-3 px-32 relative z-10 pad20px headerfix'>
        <HPE_BRAND_Logo className='flex justify-start' width={150} height={60}/>
    </header>
  )
}

export default HomeHeader