import Footer from '@/components/Layout/Footer'
import HomeHeader from '@/components/Layout/HomeHeader'
import { FC, ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const HomeLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className='h-screen w-full bg-black '>
      <HomeHeader />
      <main className="px-16 md:px-32 relative height130">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default HomeLayout