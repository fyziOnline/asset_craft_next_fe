import Footer from '@/components/layout/Footer'
import HomeHeader from '@/components/layout/HomeHeader'
import { FC, ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const HomeLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className='h-screen w-screen bg-black overflow-hidden'>
      <HomeHeader />
      <main className="px-32 relative overflow-hidden h-full">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default HomeLayout