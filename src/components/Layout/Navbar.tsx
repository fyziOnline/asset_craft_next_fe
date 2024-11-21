'use client'
import { HPE_APP_Logo, HPE_Logo } from "@/assets/icons/HPE_Logo";
import { AboutIcon, AssetIcon, CompetedIcon, DashboardIcon, DashedSeparator, FolderIcon, SettingsIcon } from "@/assets/icons/NavIcons";
import NavOption from "../global/NavOption";
import { usePathname } from "next/navigation";

interface NavOptions {
    label : string
    href : string
    component : React.ReactNode
    id:string
}

const navOption: NavOptions[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      component:<DashboardIcon />,
      id:'dashboard'
    },
    {
      label: 'Asset In Progress',
      href: '/asset-in-progress',
      component:<AssetIcon />,
      id:'asset-prog'
    },
    {
      label: 'Completed Assets',
      href: '/completed-assets',
      component:<CompetedIcon />,
      id:'asset-comp'
    },
    {
      label: 'My Projects',
      href: '/my-projects',
      component:<FolderIcon />,
      id:'projects'
    }
]

const bottomOptions: NavOptions[] = [
    {
        label: 'Settings',
        href: '/settings',
        component: <SettingsIcon />,
        id:'settings'
    },
    {
        label: 'About',
        href: '/about',
        component: <AboutIcon />,
        id:'about'
    }
]

const Navbar:React.FC = () => {
    const pathname = usePathname()
    
  return (
    <nav className="group bg-primary-black fixed top-0 left-0 p-[1.87rem] h-full w-[5.5rem] hover:w-[18.68rem] nav-transition overflow-hidden z-50">
        <div>
            <HPE_Logo className="absolute top-[1.62rem] left-[0.7rem] group-hover:opacity-0 nav-transition" />
            <HPE_APP_Logo className="absolute top-[2.81rem] invisible opacity-0 left-[2.13rem] group-hover:visible group-hover:opacity-100 nav-transition" />
            <div className="flex_item-start absolute top-[12.7rem] left-[2.43rem]  group-hover:left-[1.625rem] nav-transition">
                {navOption.map(options => (
                    <NavOption key={options.id} href={options.href} label={options.label} pathname={pathname}>
                        {options.component}
                    </NavOption>
                )) }
            </div>
            {/* <div className="pointer-events-none absolute top-[19.8rem] left-[1rem] right-[3rem] w-16 overflow-hidden group-hover:w-full nav-transition">
                <DashedSeparator />
            </div>
            <div className="flex_item-start absolute top-[28rem] left-[2.43rem] group-hover:left-[1.625rem] nav-transition">
                <p className=" text-steel-gray-shade opacity-0 group-hover:opacity-100 nav-transition mb-2">Options</p>
                <div>
                    {bottomOptions.map(options => (
                        <NavOption key={options.id} href={options.href} label={options.label} pathname={pathname}>
                            {options.component}
                        </NavOption>
                    )) }
                </div>
            </div> */}
        </div>
    </nav>
  )
}

export default Navbar
