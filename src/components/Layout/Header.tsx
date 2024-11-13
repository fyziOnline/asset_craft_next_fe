import { UserIcon } from "@/assets/icons/AppIcons"

const Header:React.FC = () => {
  return (
    <header className="fixed top-0 right-0 left-[5.4rem] bg-off-white-primary p-[0.85rem]">
        <div className="w-full flex justify-end">
            <UserIcon />
        </div>
    </header>
  )
}

export default Header
