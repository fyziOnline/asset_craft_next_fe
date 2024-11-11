import { HPE_Brand_Logo, HPE_Logo } from "@/assets/icons/HPE_Logo";
import { AssetIcon, CompetedIcon, DashboardIcon, DashedSeparator, FolderIcon } from "@/assets/icons/NavIcons";
import NavOption from "../global/NavOption";

const Navbar:React.FC = () => {
  return (
    <nav className="group bg-primary-black fixed top-0 left-0 p-[1.87rem] h-full w-[6.25rem] hover:w-[18.68rem] nav-transition overflow-hidden">
        <div>
            <HPE_Logo className="absolute top-[1.62rem] left-[0.9rem] group-hover:opacity-0 nav-transition" />
            <HPE_Brand_Logo className="absolute top-[2.81rem] invisible opacity-0 left-[2.13rem] group-hover:visible group-hover:opacity-100 nav-transition" />
            <div className="flex_item-start absolute top-[15.7rem] left-[2.43rem] gap-[1.45rem] group-hover:left-[1.625rem] nav-transition">
                <NavOption href="" label="Dashboard" spanClass="" childClass="">
                    <DashboardIcon/>
                </NavOption>
                <NavOption href="" label="Asset In Progress" spanClass="" childClass="">
                    <CompetedIcon/>
                </NavOption>
                <NavOption href="" label="Completed Asset" spanClass="" childClass="">
                    <FolderIcon/>
                </NavOption>
            </div>
            <div className="absolute top-[27rem]">
                <DashedSeparator/>
            </div>
        </div>
    </nav>
  )
}

export default Navbar
