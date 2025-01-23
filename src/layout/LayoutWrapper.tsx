'use client'
import { FC, ReactNode } from "react"
import MainLayout from "./MainLayout"
import HomeLayout from "./HomeLayout"
import { usePathname } from "next/navigation";
import NavbarFooterLayout from "./NavbarFooterLayout";

type LayoutType = "main" | "home" | "navbarFooterLayout";

interface WrapperProps {
    children: ReactNode;
    layout?: LayoutType;
}

const Layout = {
    main: MainLayout,
    home: HomeLayout,
    navbarFooterLayout: NavbarFooterLayout
};

const LayoutWrapper: FC<WrapperProps> = ({ children }) => {
    const pathname = usePathname()
    // const layoutType: LayoutType = ["/edit-html-content"].includes(pathname) ? "navbarFooterLayout" : pathname === "/" ? "home" : "main";
    const layoutType: LayoutType =  pathname === "/" ? "home" : "main";
    const WrappingLayout = Layout[layoutType];

    return <WrappingLayout>{children}</WrappingLayout>
}

export default LayoutWrapper