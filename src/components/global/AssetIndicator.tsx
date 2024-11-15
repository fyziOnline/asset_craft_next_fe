import { MailIcon } from "@/assets/icons/AssetIcons"
import { FC } from "react"

interface AssetIndicatorProp {
  hoverStatus : boolean
}

const AssetIndicator:FC<AssetIndicatorProp> = ({hoverStatus}) => {
  return (
    <div className="w-fit text-center text-green-100 group-hover:text-white">
        <MailIcon color={hoverStatus ? 'white' : 'black'}/>
        <p className="text-[0.9rem]">Email</p>
    </div>
  )
}

export default AssetIndicator