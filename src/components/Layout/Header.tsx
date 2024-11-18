import { UserIcon } from "@/assets/icons/AppIcons"
import Link from 'next/link'

const Header:React.FC = () => {
  return (
    <header className="fixed top-0 right-0 left-[5.4rem] bg-off-white-primary p-[0.85rem] z-50">
        <div className="w-full flex justify-end">
          <Link href="/Profile" className="cursor-pointer"><UserIcon /></Link>
        </div>
    </header>
  )
}

export default Header
