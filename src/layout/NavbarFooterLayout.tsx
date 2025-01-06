import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";

interface LayoutProps {
    children: React.ReactNode;
}

const NavbarFooterLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <>
            <Navbar />
            <main className="ml-[5.5rem] pb-[2rem] overflow-auto">
                {children}
            </main>
            <Footer />
        </>
    )
}

export default NavbarFooterLayout
