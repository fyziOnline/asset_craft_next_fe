import { MailIcon } from "@/assets/icons/AssetIcons"
import { FC } from "react"

const AssetIndicator:FC = () => {
  return (
    <div className="w-fit text-center text-green-100">
        <MailIcon />
        <p className="text-[0.9rem]">Email</p>
    </div>
  )
}

export default AssetIndicator