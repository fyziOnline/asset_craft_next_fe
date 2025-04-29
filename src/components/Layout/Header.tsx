import { FC, useEffect } from "react";
import { UserIcon } from "@/assets/icons/AppIcons"
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAppData } from "@/context/AppContext";
import { BackIcon } from "@/assets/icons/AppIcons";
import Link from 'next/link'
import Title from "../global/Title";
import useHeader from "@/hooks/useHeader";

const Header: FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { getUserDetails } = useHeader()
  const { userDetails, contextData, setContextData } = useAppData()

  useEffect(() => {
    if (!userDetails?.userID) {
      getUserDetails();
    }
  }, [userDetails?.userID]);

  const searchParams = useSearchParams()
  const projectName = searchParams.get('projectName')
  const campaignName = searchParams.get('campaignName')
  const assetName = searchParams.get('assetName')

  const handleReturnToPrevious = () => {

    if (contextData.stepGenerate === 1) {
      setContextData({ stepGenerate: 0 })
    } else {
      router.back()
    }
  }

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
          <div className="flex flex-row items-center">
            <div onClick={handleReturnToPrevious} className="h-[2rem] cursor-pointer absolute w-[2rem] rounded-full bottom-[-1rem] left-2 bg-[#f5f5f7] flex items-center justify-center">
              {/* <BackIcon /> */}
              {/* <ArrowBigLeft /> */}
              <svg width="7" height="14" viewBox="0 0 7 14" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.64645 6.94975L6.19972 1.39647V2.55381L1.80378 6.94975L6.19972 11.3457V12.503L0.64645 6.94975Z" fill="#00a881" stroke="#00a881" stroke-width="1.25"/>
              </svg>


            </div>
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
          <div onClick={handleReturnToPrevious} className="w-[30px] h-[30px] cursor-pointer">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="30" height="30" rx="15" fill="#00A881" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M22.5 20.9385C20.165 18.6985 18.4255 17.4275 16.7615 17.1255C15.0975 16.8235 13.531 16.771 
                12.057 17.0135V21L6 14.4545L12.057 8V11.822C14.425 11.841 16.449 12.9355 18.1165 14.784C19.784 16.6325 
                20.7445 18.918 22.5 20.9385Z"
                fill="white"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
                transform="translate(2, 0)"  //<!-- Moves the arrow 1px to the right -->
              />
            </svg>
          </div>

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
