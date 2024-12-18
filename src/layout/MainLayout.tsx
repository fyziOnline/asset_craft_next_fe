import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import Navbar from "@/components/Layout/Navbar";

interface LayoutProps {
    children: React.ReactNode;
}

const MainLayout:React.FC<LayoutProps> = ({children}) => {
  return (
    <>
        <Header />
        <Navbar />
        <main className="ml-[5.5rem] mt-[3.5rem] pb-[2rem] overflow-auto">
            {children}
        </main>
        <Footer />
    </>
  )
}

export default MainLayout
