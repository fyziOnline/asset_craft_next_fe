import Breadcrumb from "@/components/global/Breadcrumb"
import RangeSlider from "@/components/global/RangeSlider"
import AssetCard from "@/components/wrapper/AssetCard"
import LayoutWrapper from "@/layout/LayoutWrapper"
import { FC } from "react"

  
const AssetInProgress:FC = () => {
  return (
    <>
        <LayoutWrapper layout="main" >
            <div className="py-[2rem] px-[1.5rem]">
                <Breadcrumb projectName="Asset In Progress"/>
                <div className="py-10 px-16">
                  <AssetCard />
                </div>
                <div className="border-gray-300 border-1 p-4 w-1/3">
                  {/* <RangeSlider /> */}
                </div>

            </div>
        </LayoutWrapper>
    </>
  )
}

export default AssetInProgress