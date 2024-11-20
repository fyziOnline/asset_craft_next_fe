import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";

interface LayoutProps {
    children: React.ReactNode;
}

const MainLayout:React.FC<LayoutProps> = ({children}) => {
  return (
    <div>
        <Header />
        <Navbar />
        <main className="ml-[5.5rem] mt-[3.5rem] pb-[2rem] overflow-auto">
            {children}
        </main>
        <Footer />
    </div>
  )
}

export default MainLayout
