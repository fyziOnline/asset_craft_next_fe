import LoadingIndicator from "@/components/global/LoadingIndicator";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname()
  
  return (
    <>
    <Suspense fallback={<LoadingIndicator />}>
      <Header />
    </Suspense>
      <Navbar />
      <main className={`${pathname === "/Profile" ? 'ml-[2.5rem]' : 'ml-[5.5rem]'} pt-[2.5rem]  pb-[2rem] overflow-auto`}>
        {children}
      </main>
      <Footer />
    </>
  )
}

export default MainLayout
