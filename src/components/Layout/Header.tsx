import { UserIcon } from "@/assets/icons/AppIcons"
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import SearchBox from "@/components/global/SearchBox";
import { useDashboard } from "@/hooks/useDashboard";

const Header: React.FC = () => {
  const { userDetails } = useDashboard()

  const pathname = usePathname()
  const router = useRouter()

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

        <div onClick={() => router.back()} className="relative w-10 h-10 rounded-full bg-[#00A881] cursor-pointer">
          <svg className="absolute top-2 left-2" width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M21 17.918C18.5533 14.9313 16.3807 13.2367 14.482 12.834C12.5833 12.4313 10.7757 12.3705 9.059 12.6515V18L1 9.2725L9.059 1V6.0835C12.2333 6.1085 14.932 7.24733 17.155 9.5C19.3777 11.7527 20.6593 14.5587 21 17.918Z" fill="white" stroke="white" stroke-width="2" stroke-linejoin="round" />
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
