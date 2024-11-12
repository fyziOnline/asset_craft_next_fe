import Link from "next/link"
import { usePathname } from "next/navigation"

interface NavOptionProp {
    children : React.ReactNode
    href : string
    label : string
    spanClass ?: string
    childClass ?: string
    pathname ? :string

}

const NavOption:React.FC<NavOptionProp> = ({children,href,label,spanClass='',childClass='',pathname=''}) => {
  const isActive = pathname === href
  return (
    <Link
        href={href}
        className=" text-steel-gray flex items-center gap-3 first:mt-0  mt-[1.45rem]"
    >
        <div className={childClass}>
            {children}
        </div>
        <span className={`${spanClass} opacity-0 text-lg font-medium text-nowrap group-hover:opacity-100 nav-transition`}>{label}</span>
    </Link>
  )
}
export default NavOption
