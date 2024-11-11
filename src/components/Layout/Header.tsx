import { UserIcon } from "@/assets/icons/AppIcons"

const Header:React.FC = () => {
  return (
    <div className="fixed top-0 right-0 left-[6.25rem] bg-off-white-primary p-[0.85rem]">
        <div className="w-full flex justify-end">
            <UserIcon />
        </div>
    </div>
  )
}

export default Header
