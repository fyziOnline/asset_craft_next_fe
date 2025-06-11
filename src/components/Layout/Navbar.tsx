'use client'
import NavOption from "../global/NavOption";
import { AssetIcon, CompetedIcon, DashboardIcon, FolderIcon } from "@/assets/icons/NavIcons";
import { HPE_APP_Logo, HPE_Logo } from "@/assets/icons/HPE_Logo";
import { usePathname, useRouter } from "next/navigation";
import { LuFolderSearch } from "react-icons/lu";
import { useAppData } from "@/context/AppContext";
interface NavOptions {
    label: string
    href: string
    component: React.ReactNode
    id: string
}

const Navbar: React.FC = () => {
    const pathname = usePathname()
    const router = useRouter()
    const { userDetails } = useAppData()

    const userRole = userDetails?.userRole

    const navOption: NavOptions[] = [
        {
            label: 'Dashboard',
            href: '/dashboard',
            component: <DashboardIcon />,
            id: 'dashboard'
        },
        {
            label: 'Asset In Progress',
            href: '/asset-in-progress',
            component: <AssetIcon />,
            id: 'asset-prog'
        },
        {
            label: 'Assets Under Review',
            href: '/assets-under-review',
            component: <LuFolderSearch size={22} />,
            id: 'asset-under'
        },
        ...(userRole === 'Approver' || userRole === 'Admin'
            ? [
                {
                    label: 'Assets to Approve',
                    href: '/assets-to-approve',
                    component: <FolderIcon />,
                    id: 'asset-approve'
                }
            ]
            : []),
        {
            label: 'Completed Assets',
            href: '/completed-assets',
            component: <CompetedIcon />,
            id: 'asset-comp'
        },
    ];

    return (
        <nav className="group bg-primary-black fixed top-0 left-0 p-[1.87rem] h-full w-[5.5rem] hover:w-[17rem] nav-transition overflow-hidden z-50">
            <div>
                <HPE_Logo className="absolute top-[1.62rem] left-[8%] group-hover:opacity-0 nav-transition" />
                <div onClick={() => router.push('/dashboard')}>
                    <HPE_APP_Logo className="absolute top-[2.81rem] invisible opacity-0 left-[8%] group-hover:visible group-hover:opacity-100 nav-transition cursor-pointer" />
                </div>
                <div className="flex_item-start absolute top-[12.7rem] left-[2.43rem]  group-hover:left-[1.625rem] nav-transition">
                    {navOption.map(options => (
                        <NavOption key={options.id} href={options.href} label={options.label} pathname={pathname}>
                            {options.component}
                        </NavOption>
                    ))}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
