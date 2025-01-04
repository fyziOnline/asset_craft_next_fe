import { UserIcon } from "@/assets/icons/AppIcons"
import Link from 'next/link'

const Header:React.FC = () => {
  return (
    <header className="fixed top-0 right-0 left-[5.4rem] bg-white p-[0.6rem] z-50">
        <div className="w-full flex justify-end">
          <Link href="/Profile" className="cursor-pointer"><UserIcon /></Link>
        </div>
    </header>
  )
}

export default Header
