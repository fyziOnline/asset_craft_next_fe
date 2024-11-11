import Link from "next/link"

interface NavOptionProp {
    children : React.ReactNode
    href : string
    label : string
    spanClass : string
    childClass : string

}

const NavOption:React.FC<NavOptionProp> = ({children,href,label,spanClass='',childClass=''}) => {
  return (
    <Link
        href={href}
        className="text-steel-gray flex gap-3"
    >
        <div className={childClass}>
            {children}
        </div>
        <span className={spanClass}>{label}</span>
    </Link>
  )
}
export default NavOption
