import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname()
  
  return (
    <>
      <Header />
      <Navbar />
      <main className={`${pathname === "/Profile" ? 'ml-[2.5rem]' : 'ml-[5.5rem]'} mt-[2.5rem] pb-[2rem] overflow-auto`}>
        {children}
      </main>
      <Footer />
    </>
  )
}

export default MainLayout
