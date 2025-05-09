import { FC, useEffect } from "react";
import { UserIcon } from "@/assets/icons/AppIcons"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAppData } from "@/context/AppContext";
import Link from 'next/link'
import Title from "../global/Title";
import useHeader from "@/hooks/useHeader";
import GoBackButton from "../global/GoBackButton";
import { useAppNavigation } from "@/hooks/useAppNavigation";

const Header: FC = () => {
  const pathname = usePathname()
  const { getUserDetails } = useHeader()
  const { userDetails, contextData } = useAppData()

  useEffect(() => {
    if (!userDetails?.userID) {
      getUserDetails();
    }
  }, [userDetails?.userID]);

  useAppNavigation();

  const searchParams = useSearchParams()
  const projectName = searchParams.get('projectName')
  const campaignName = searchParams.get('campaignName')
  const assetName = searchParams.get('assetName')

  const getTitlePage = () => {
    if (pathname === "/generate-asset") {
      let assetType = ""
      assetType = searchParams.get('asset-type') || ""

      if (contextData.stepGenerate === 0) {
        return "Select One Of The Templates"
      } else {
        return `Build Your Prompt to Generate the ${assetType}`
      }
    } else if (pathname === "/asset-in-progress") {
      return "Asset In Progress"
    } else if (pathname === "/assets-under-review") {
      return "Assets Under Review"
    } else if (pathname === "/completed-assets") {
      return "Completed Assets"
    } else if (pathname === "/assets-to-approve") {
      return "Assets to Approve"
    } else if (pathname === '/asset') {
      let type = searchParams.get('type')
      return `Assets : ${type}`
    }
    return ""
  }

  if (pathname === "/dashboard") {
    return (
      <header className="fixed top-0 right-0 left-[5.4rem] bg-white p-[0.6rem] z-50 border-b shadow-md">
        <div className="w-full flex items-center justify-between px-8">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-5">
              <h1 className="text-2xl font-bold">Dashboard</h1>
            </div>
            <h3 className="text-xl font-bold text-[#00A881] pr-3">Welcome, <span>{userDetails?.name}</span></h3>
          </div>
          <Link href="/Profile" className="cursor-pointer"><UserIcon /></Link>
        </div>
      </header>
    )
  }

  if (pathname === "/approver-page" || pathname === "/edit-html-content") {
    return (
      <header className="fixed top-0 right-0 left-[5.4rem] bg-white p-[0.6rem] px-7 md:px-10 z-50 border-b shadow-sm">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-row items-center space-x-2">
            <GoBackButton />
            <div className="flex gap-2 pl-4">
              <span className="text-sm md:text-xl text-[#7F7F7F] leading-normal font-bold">{projectName}</span>
              <span className="text-sm md:text-xl text-[#7F7F7F] leading-normal font-bold">|</span>
              <span className="text-sm md:text-xl text-[#7F7F7F] leading-normal font-bold">{campaignName}</span>
              <span className="text-sm md:text-xl text-[#7F7F7F] leading-normal font-bold">|</span>
              <span className="text-sm md:text-xl text-[#7F7F7F] leading-normal font-bold">{assetName}</span>
            </div>
            <Title classNameCustom="ml-4" titleName={getTitlePage()} />
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#00A881] tracking-wide">{userDetails?.name}</h1>
            <Link href="/Profile" className="cursor-pointer"><UserIcon /></Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 right-0 left-[5.4rem] bg-white p-[0.6rem] px-10 z-50 border-b shadow-sm">
      <div className="w-full flex justify-between items-center">

        <div className="flex flex-row items-center">
          <GoBackButton />
          <Title classNameCustom="ml-4" titleName={getTitlePage()} />
        </div>

        <div className="flex items-center gap-3">
          <h1 className="text-xl tracking-wide text-[#00A881] font-bold">{userDetails?.name}</h1>
          <Link href="/Profile" className="cursor-pointer"><UserIcon /></Link>
        </div>
      </div>
    </header>
  )
}

export default Header
