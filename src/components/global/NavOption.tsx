import { cloneElement, FC, ReactElement } from "react"
import Link from "next/link"

interface NavOptionProp {
    children : React.ReactNode
    href : string
    label : string
    spanClass ?: string
    childClass ?: string
    pathname ? :string

}

const NavOption:FC<NavOptionProp> = ({children,href,label,spanClass='',childClass='',pathname=''}) => {
  const isActive = pathname.startsWith(href)
  const iconColor = isActive ? '#00A881' : '#ADB3CC'
  return (
    <Link
        href={href}
        className="  flex items-center gap-3 first:mt-0  mt-[1.45rem] relative"
    >
        {isActive && <div className="w-2 bg-green-100 absolute top-[20%] bottom-[20%] rounded-tr-[2px] rounded-br-[2px] left-[-2.68rem] group-hover:left-[-1.875rem] nav-transition"></div>}
        <div className={`${childClass}`}>
            {cloneElement(children as ReactElement,{color : iconColor})}
        </div>
        <span className={`${spanClass} opacity-0 text-lg font-medium text-nowrap group-hover:opacity-100 nav-transition ${isActive ? 'text-green-100' : 'text-steel-gray' }`}>{label}</span>
    </Link>
  )
}
export default NavOption
