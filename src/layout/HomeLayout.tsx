import Footer from '@/components/Layout/Footer'
import { FC, ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const HomeLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className='h-full w-full bg-black'>
      <main className="relative">
        {children}
      </main>
      <Footer footerPosition="static"/>
    </div>
  )
}

export default HomeLayout