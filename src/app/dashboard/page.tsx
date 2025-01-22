'use client';

import React, { FC, useEffect } from "react";
import SearchBox from "@/components/global/SearchBox";
import DashboardCard from "@/components/cards/DashboardCard";
import Button from "@/components/global/Button";
import Table from "@/components/global/Table";
import { EmailIcon, LandingAssetIcon2, LinkedinIcon, SalesCallIcon } from "@/assets/icons/TableIcon";
import { ExpressIcon } from "@/assets/icons/AppIcons";
import { useDashboard } from "@/hooks/useDashboard";
import InputAreaSearch from "@/components/global/InputAreaSearch";
import DropDown from "@/components/global/DropDown";
import processDashboardAssets from "@/app/dashboard/utils/dashboardFilters"
import { formatDate } from "@/utils/formatDate";
import { useAppData } from "@/context/AppContext";
import { AssetHtmlProps } from "@/types/templates";
import { useRouter } from "next/navigation";


const tableHeading = ["Asset Name", "Campaign Name", "Project Name", "Created On", "Current Status"]

const Dashboard: FC = () => {
  const router = useRouter();
  const {
    clientAssetTypes,
    selectedIndexes,
    selectedButton,
    handleNext,
    closeModal,
    closeAssetModal,
    handleShowPopup,
    onSelect,
    handleChangeAssetDetails,
    selectAssetType,
    dashboardAssets,
    userDetails,
    pendingApproval,
    userRole
  } = useDashboard()

  const { updatedDashboardData, assetsDisplayTable } = processDashboardAssets(dashboardAssets);

  const { setContextData } = useAppData()

  useEffect(() => {
    setContextData({
      isRegenerateHTML: false,
      stepGenerate: 0,
      AssetHtml: {} as AssetHtmlProps,
      assetGenerateStatus: 1,
      assetTemplateShow: false
    })
  }, [])

  return (
    <div className="mt-10">
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4 md:px-8">
        {updatedDashboardData.map((data, index) => (
          <DashboardCard
            key={index}
            projectName={data.projectName}
            allProjectDate={data.allProjectDate}
            totalAssets={data.totalAssets}
            underReview={data.underReview}
            inProgress={data.inProgress}
          />
        ))}
      </div>

      <div className="pl-8 pt-5 flex w-full mb-32">
        <div className="w-[70%] border-[#D9D9D9]">
          <div className="w-[140%] lg:w-full border-b border-[#D9D9D9]">
            <p className="text-lg font-bold tracking-wide">
              What would you like to create today?
            </p>

            <div className="flex w-full overflow-x-auto gap-4 my-5 scrollbar-hide overflow-y-hidden">
              {clientAssetTypes.filter(item => item.assetTypeName !== "All in One").map((item, index) => (
                <Button
                  key={index}
                  buttonText={item.assetTypeName}
                  showIcon={false}
                  IconComponent={item.assetTypeName === "All in One" && <ExpressIcon strokeColor="white" width="40" height="38" />}
                  backgroundColor="bg-white"
                  customClass="group px-12 py-2 border border-[#07363480] w-[25%] px-[50px] transition-all duration-300 hover:bg-[#00A881] tracking-wide hover:border-none"
                  textColor="text-foreground group-hover:text-white"
                  handleClick={() => selectAssetType(item)}
                  textStyle="font-normal text-sm text-center whitespace-nowrap"
                />
              ))}
            </div>
          </div>
          <div className="border-t border-[#D9D9D9]">
            <div className="mt-5">
              <p className="text-lg font-bold tracking-wide">Recent Assets:</p>
            </div>
            <div>
              {assetsDisplayTable && assetsDisplayTable.length > 0 ? (
                <Table hiddenFields={["assetID"]} handleClick={(item) => {
                  console.log('itme', item)
                  
                  router.push(`/approver-page?assetID=${item.assetID}&status=${item.currentStatus}`)
                }}
                  listItems={assetsDisplayTable} tableHeadings={tableHeading} />
              ) : (
                <p></p> // Optionally, display a message if no data is available
              )}
            </div>
          </div>
        </div>

        <div className="w-[27%] mt-[7.7rem] lg:mt-0">
          <p className="text-lg font-bold pl-10 pb-2">{userRole === "Approver" ? "Assets to Approve" : "Pending Approval"}</p>
          <div className="w-full bg-[#F9F9F9] rounded-[14px] ml-4">
            <div className="p-5 max-h-[620px] overflow-y-auto">

              {pendingApproval && pendingApproval.length > 0 ? (
                pendingApproval.map((data, index) => {
                  return (
                    <div
                      onClick={() => {
                        router.push(`/approver-page?assetVersionID=${data.assetVersionID}&assetName=${data.assetName}&layoutName=${data.assetTypeName}&status=${data.status}`)
                      }}
                      key={index} className={`rounded-[15px] border p-3 mt-2 ${index % 2 === 0 ? 'bg-white' : 'bg-[#EFEFEF]'}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-[##2F363F] text-wrap text-lg font-bold">{data.assetName}</p>
                        <p className="text-[#636363] text-sm font-normal">{formatDate(data.createdOn)}</p>
                      </div>
                      <p className="text-sm text-[#636363]">{data.versionName}</p>
                      <div className="w-full flex flex-col items-center">
                        <p className="w-full text-wrap">{data.campaignName}</p>
                        <p className="w-full text-wrap">{data.projectName}</p>
                      </div>
                    </div>
                  )
                })) : (
                <div className="text-center text-[#636363] text-sm ">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
