import { FC, useEffect, useMemo } from "react";
import { UserIcon } from "@/assets/icons/AppIcons";
import { usePathname, useSearchParams } from "next/navigation";
import { useAppData } from "@/context/AppContext";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import Link from 'next/link'
import Title from "../global/Title";
import useHeader from "@/hooks/useHeader";
import GoBackButton from "../global/GoBackButton";

const UserSection: FC<{ showWelcome?: boolean }> = ({ showWelcome = false }) => {
  const { userDetails } = useAppData();
  const text = showWelcome ? `Welcome, ${userDetails?.name}` : userDetails?.name;

  return (
    <div className="flex items-center gap-3">
      <h1 className="text-lg font-semibold text-[#00A881] tracking-wide">{text}</h1>
      <Link href="/Profile" className="cursor-pointer">
        {userDetails?.fileUrl ? (
          <img
            src={userDetails.fileUrl}
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <UserIcon />
        )}
      </Link>
    </div>
  );
}

const Header: FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams()
  const { getUserDetails } = useHeader();
  const { userDetails, contextData } = useAppData();

  useEffect(() => {
    if (!userDetails?.userID) {
      getUserDetails();
    }
  }, [userDetails?.userID]);

  useEffect(() => {
    if (userDetails) {
      console.log("User Details from Header:", userDetails.fileUrl);
    }
  }, [userDetails]);

  useAppNavigation();

  const projectName = searchParams.get("projectName");
  const campaignName = searchParams.get("campaignName");
  const assetName = searchParams.get("assetName");
  const assetType = searchParams.get("asset-type");
  const type = searchParams.get("type");

  const getTitlePage = useMemo(() => {
    if (pathname === "/generate-asset") {
      if (contextData.stepGenerate === 0) {
        return "Select One Of The Templates";
      } else {
        return `Build Your Prompt to Generate the ${assetType || ""}`;
      }
    } else if (pathname === "/asset-in-progress") {
      return "Asset In Progress";
    } else if (pathname === "/assets-under-review") {
      return "Assets Under Review";
    } else if (pathname === "/completed-assets") {
      return "Completed Assets";
    } else if (pathname === "/assets-to-approve") {
      return "Assets to Approve";
    } else if (pathname === "/asset") {
      return `Assets : ${type || ""}`;
    }
    return ""
  }, [pathname, searchParams, contextData.stepGenerate]);

  if (pathname === "/dashboard") {
    return (
      <header className="fixed top-0 right-0 left-[5.4rem] bg-white p-[0.6rem] z-50 border-b shadow-md">
        <div className="w-full flex items-center justify-between px-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <UserSection showWelcome={true} />
        </div>
      </header>
    )
  }

  const showDetails = pathname === "/approver-page" || pathname === "/edit-html-content";

  return (
    <header className="fixed top-0 right-0 left-[5.4rem] bg-white p-[0.6rem] px-7 md:px-10 z-50 border-b shadow-sm">
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-row items-center space-x-3">
          <GoBackButton />
          {showDetails &&
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-xl text-[#7F7F7F] leading-normal font-bold">{projectName}</span>
              <span className="text-sm md:text-xl text-[#7F7F7F] leading-normal font-bold">|</span>
              <span className="text-sm md:text-xl text-[#7F7F7F] leading-normal font-bold">{campaignName}</span>
              <span className="text-sm md:text-xl text-[#7F7F7F] leading-normal font-bold">|</span>
              <span className="text-sm md:text-xl text-[#7F7F7F] leading-normal font-bold">{assetName}</span>
            </div>
          }
          <Title classNameCustom="ml-4" titleName={getTitlePage} />
        </div>

        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[#00A881] tracking-wide">{userDetails?.name}</h1>
          <Link href="/Profile" className="cursor-pointer">
            {userDetails?.fileUrl ? (
              <img
                src={userDetails.fileUrl}
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <UserIcon />
            )}
          </Link>
        </div>
      </div>
    </header>
  );

}

export default Header
