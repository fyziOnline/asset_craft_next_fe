import Breadcrumb from "@/components/global/Breadcrumb"
import MyProjectCard from "@/components/wrapper/MyProjectCard"
import LayoutWrapper from "@/layout/LayoutWrapper"
import { FC } from "react"

  
const MyProjects:FC = () => {
  return (
    <>
        <LayoutWrapper layout="main" >
            <div className="py-[2rem] px-[1.5rem]">
                <Breadcrumb projectName="My Projects"/>
                <div className="py-10 px-16">
                  <MyProjectCard />
                </div>
            </div>
        </LayoutWrapper>
    </>
  )
}

export default MyProjects