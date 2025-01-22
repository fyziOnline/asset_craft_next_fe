import Footer from '@/components/Layout/Footer'
import HomeHeader from '@/components/Layout/HomeHeader'
import { FC, ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const HomeLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className='h-screen w-screen bg-black '>
      <HomeHeader />
      <main className="px-16 md:px-32 relative h-[130vh] md:h-full">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default HomeLayout