import { UserIcon } from "@/assets/icons/AppIcons"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchBox from "@/components/global/SearchBox";
import { useDashboard } from "@/hooks/useDashboard";

const Header: React.FC = () => {
  const pathname = usePathname()

  const {userDetails} = useDashboard()

  if (pathname === "/dashboard") {
    return (
      <header className="fixed top-0 right-0 left-[5.4rem] bg-white p-[0.6rem] z-50">
        <div className="w-full flex items-center justify-between px-8">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">Dashboard</h1>
              <SearchBox customClass="bg-[#F6F6F6]"/>
            </div>

              <h3 className="font-bold text-[#00A881] pr-5">Welcome, <span>{userDetails?.name}</span></h3>
          </div>
          <Link href="/Profile" className="cursor-pointer"><UserIcon /></Link>
        </div>
      </header>
    )
  }

  return (
    <header className="fixed top-0 right-0 left-[5.4rem] bg-white p-[0.6rem] z-50">
      <div className="w-full flex justify-end">
        <Link href="/Profile" className="cursor-pointer"><UserIcon /></Link>
      </div>
    </header>
  )
}

export default Header
