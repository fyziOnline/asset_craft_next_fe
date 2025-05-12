'use client'
import { FC, ReactNode } from "react"
import MainLayout from "./MainLayout"
import HomeLayout from "./HomeLayout"
import { usePathname } from "next/navigation"
import NavbarFooterLayout from "./NavbarFooterLayout"

type LayoutType = "main" | "home" | "navbarFooterLayout"

interface WrapperProps {
  children: ReactNode
  layout?: LayoutType
}

const Layout = {
  main: MainLayout,
  home: HomeLayout,
  navbarFooterLayout: NavbarFooterLayout,
}

const LayoutWrapper: FC<WrapperProps> = ({ children }) => {
  const pathname = usePathname()

  let layoutType: LayoutType

  if (pathname === "/") {
    layoutType = "home"
  } else if (pathname === "/Profile") {
    layoutType = "navbarFooterLayout"
  } else {
    layoutType = "main"
  }

  const WrappingLayout = Layout[layoutType]

  return <WrappingLayout>{children}</WrappingLayout>
}

export default LayoutWrapper
