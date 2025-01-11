import { UserIcon } from "@/assets/icons/AppIcons"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import SearchBox from "@/components/global/SearchBox";
import { useDashboard } from "@/hooks/useDashboard";
import { useAppData } from "@/context/AppContext";

const Header: React.FC = () => {
  const { userDetails } = useDashboard()

  const pathname = usePathname()
  const router = useRouter()
  const {contextData,setContextData} = useAppData()

  const handleReturnToPrevious = () => {
    console.log('clicking the return');
    
    if (contextData.stepGenerate === 1) {
      setContextData({stepGenerate:0})
    } else {
      router.back()
    }
  }

  if (pathname === "/dashboard") {
    return (
      <header className="fixed top-0 right-0 left-[5.4rem] bg-white p-[0.6rem] z-50 border-b shadow-md">
        <div className="w-full flex items-center justify-between px-8">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-5">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <SearchBox customClass="bg-[#F6F6F6]" />
            </div>
            <h3 className="text-xl font-bold text-[#00A881] pr-3">Welcome, <span>{userDetails?.name}</span></h3>
          </div>
          <Link href="/Profile" className="cursor-pointer"><UserIcon /></Link>
        </div>
      </header>
    )
  }

  return (
    <header className="fixed top-0 right-0 left-[5.4rem] bg-white p-[0.6rem] px-10 z-50 border-b shadow-sm">
      <div className="w-full flex justify-between items-center">

        <div onClick={handleReturnToPrevious} className="relative w-7 h-7 rounded-full bg-[#00A881] cursor-pointer">
          <svg className="absolute top-1 left-[0.40rem]" width="17" height="18" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M21 17.918C18.5533 14.9313 16.3807 13.2367 14.482 12.834C12.5833 12.4313 10.7757 12.3705 9.059 12.6515V18L1 9.2725L9.059 1V6.0835C12.2333 6.1085 14.932 7.24733 17.155 9.5C19.3777 11.7527 20.6593 14.5587 21 17.918Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/Profile" className="cursor-pointer"><UserIcon /></Link>
          <h1 className="text-xl tracking-wide">{userDetails?.name}</h1>
        </div>
      </div>
    </header>
  )
}

export default Header
