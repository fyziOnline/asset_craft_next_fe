'use client'
import { FC, ReactNode } from "react"
import MainLayout from "./MainLayout"
import HomeLayout from "./HomeLayout"
import { usePathname } from "next/navigation";

type LayoutType = "main" | "home";

interface WrapperProps {
    children: ReactNode;
    layout?: LayoutType;
}

const Layout = {
    main: MainLayout,
    home: HomeLayout,
};

const LayoutWrapper:FC<WrapperProps> = ({ children}) => {
    const pathname = usePathname()
    const layoutType: LayoutType = pathname === "/" ? "home" : "main";
    const WrappingLayout = Layout[layoutType];

    return <WrappingLayout>{children}</WrappingLayout>
}

export default LayoutWrapper