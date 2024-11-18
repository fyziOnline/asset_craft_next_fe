import Footer from '@/components/layout/Footer'
import { FC, ReactNode } from 'react'

interface LayoutProps {
    children : ReactNode
}

const HomeLayout:FC<LayoutProps> = ({children}) => {
  return (
    <div>
        <main>
            {children}
        </main>
        <Footer />
    </div>
  )
}

export default HomeLayout