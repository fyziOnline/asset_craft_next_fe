// import { EmailIcon, LinkedinIcon, SalesCallIcon } from "@/assets/icons/TableIcon"
import { LinkedinIcon, MailIcon, SalesCallIcon } from "@/assets/icons/AssetIcons"
import {  ComponentType, FC } from "react"

// Standardize the icon props interface
interface IconProps {
  width?: number;
  height?: number;
  className?: string;
  color: string;
}

type IconComponent = ComponentType<IconProps>

const ASSET_ICONS: Record<string, IconComponent> = {
  'Email': MailIcon,
  'LinkedIn': LinkedinIcon,
  'Call Script': SalesCallIcon
}


interface AssetIndicatorProp {
  hoverStatus : boolean
  asset_type : string
}

const AssetIndicator:FC<AssetIndicatorProp> = ({hoverStatus,asset_type='Email_1'}) => {

  const AssetIcon = ASSET_ICONS[asset_type] || MailIcon
   
  return (
    <div className="w-fit text-center text-green-100 group-hover:text-white">
        <AssetIcon color={hoverStatus ? 'white' : 'black'} />
        <p className="text-[0.9rem] mlg:text-[1rem]">{asset_type}</p>
    </div>
  )
}

export default AssetIndicator