import { FC, ReactNode } from "react"
import MainLayout from "./MainLayout"

type LayoutType = 'main' 

interface WrapperProps {
    children : ReactNode
    layout ?: LayoutType
}

const Layout = {
    main : MainLayout
}

const LayoutWrapper:FC<WrapperProps> = ({children,layout='main'}) => {
 const WrappingLayout = Layout[layout]
  return <WrappingLayout>{children}</WrappingLayout>
}

export default LayoutWrapper