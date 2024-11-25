import { FC, ReactNode } from "react"
import MainLayout from "./MainLayout"
import HomeLayout from "./HomeLayout"

type LayoutType = "main" | "home";

interface WrapperProps {
    children: ReactNode;
    layout?: LayoutType;
}

const Layout = {
    main: MainLayout,
    home: HomeLayout,
};

const LayoutWrapper:FC<WrapperProps> = ({ children, layout='main' }) => {
    const WrappingLayout = Layout[layout];

    return <WrappingLayout>{children}</WrappingLayout>
}

export default LayoutWrapper