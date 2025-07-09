'use client';

import React, { FC, useEffect, useState } from "react";
import DashboardCard from "@/components/cards/DashboardCard";
import Button from "@/components/global/Button";
import Table from "@/components/global/Table";
import { ExpressIcon } from "@/assets/icons/AppIcons";
import { useDashboard } from "@/hooks/useDashboard";
import processDashboardAssets from "@/app/dashboard/utils/dashboardFilters"
import { formatDate } from "@/utils/formatDate";
import { useAppData } from "@/context/AppContext";
import { AssetHtmlProps } from "@/types/templates";
import { useRouter } from "next/navigation";
import Preloader from "../../../Preloader";
import { AssetType } from "@/types/asset";
import ButtonSkeletonLoader from "@/components/loaders/ButtonSkeletonLoader";

const tableHeading = ["Asset Name", "Campaign Name", "Project Name", "Created On", "Current Status"]

const Dashboard: FC = () => {
  const router = useRouter();
  const {
    clientAssetTypes,
    selectAssetType,
    dashboardAssets,
    pendingApproval,
    userRole,
    getPendingApproval,
    getAssetAllAtDashboard,
    getAssetTypes
  } = useDashboard()

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getAssetTypes(),
        getAssetAllAtDashboard(),
        getPendingApproval()
      ]);
      setLoading(false); // Set loading to false after fetching data
    };

    fetchData();
  }, []);

  const [loading, setLoading] = useState(true);
  const { updatedDashboardData, assetsDisplayTable } = processDashboardAssets(
    dashboardAssets,
    AssetType.EMAIL,
    clientAssetTypes,
    false // Hide approval fields in dashboard
  );

  const { setContextData } = useAppData()
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  useEffect(() => {
    setContextData({
      isRegenerateHTML: false,
      stepGenerate: 0,
      AssetHtml: {} as AssetHtmlProps,
      assetGenerateStatus: 1,
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
            completedAssets={data.completedAssets}
            customClass="transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            loading={loading}
          />
        ))}
      </div>

      <div className="pl-8 pt-6 flex w-full mb-32 flex-wrap flex-col lg:flex-row">
        <div className="lg:w-[70%] w-[95%] border-[#D9D9D9] ">
          <div className="lg:w-full border-b border-[#D9D9D9] ">
            <p className={`text-lg font-bold tracking-wide ${loading && 'animate-pulse'}`}>
              What would you like to create today?
            </p>

            {
              loading ? (
                <div className="flex w-full overflow-x-auto gap-4 my-5 scrollbar-hide overflow-y-hidden">
                  <ButtonSkeletonLoader />
                </div>
              ) : (
                <div className="flex w-full overflow-x-auto gap-4 my-5 scrollbar-hide overflow-y-hidden">
                  {clientAssetTypes
                    .filter(item =>
                      item.assetTypeName !== "All in One"
                      && item.isEnabled === true
                      && item.isActive
                    )
                    .map((item, index) => (
                      <Button
                        key={index}
                        buttonText={item.description || item.assetTypeName}
                        showIcon={false}
                        IconComponent={item.assetTypeName === "All in One" && <ExpressIcon strokeColor="white" width="40" height="38" />}
                        backgroundColor="bg-white"
                        customClass="group px-12 py-2 border border-[#07363480] w-[25%] px-[50px] transition-all duration-500 ease-in-out hover:bg-[#00A881] hover:shadow-md  tracking-wide hover:border-transparent"
                        textColor="text-foreground group-hover:text-white"
                        handleClick={() => selectAssetType(item)}
                        textStyle="font-normal text-sm text-center whitespace-nowrap"
                      />
                    ))}
                </div>
              )
            }
          </div>

          <div>
            <div className="mt-5">
              <p className={`text-lg font-bold tracking-wide  ${loading && 'animate-pulse'}`}>Recent Assets:</p>
            </div>
            <div className="relative">
              {loading && assetsDisplayTable.length === 0 && <Preloader rowCount={4} rowHeight="75px" />}
              {!loading && assetsDisplayTable.length === 0 && (
                <p className="text-center text-gray-500 mt-4">No data available</p>
              )}
              {!loading && assetsDisplayTable.length > 0 && (
                <Table
                  hiddenFields={["assetID"]}
                  handleClick={(item) => {
                    // router.push(`/edit-html-content?assetID=${item.assetID}&status=${item.currentStatus}&projectName=${item.projectName}&campaignName=${item.campaignName}&assetTypeIcon=${item.assetTypeIcon}&assetName=${item.assetName}`)

                    const params = new URLSearchParams({
                      assetID: item.assetID,
                      status: item.currentStatus,
                      projectName: item.projectName,
                      campaignName: item.campaignName,
                      assetTypeIcon: item.assetTypeIcon,
                      assetName: item.assetName
                    })

                    router.push(`/edit-html-content?${params.toString()}`)
                  }}
                  listItems={assetsDisplayTable}
                  tableHeadings={tableHeading}

                />
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-[27%] w-[95%] mt-[3rem] lg:mt-0 ">
          <p className={`text-lg font-bold pl-10 pb-2  ${loading && 'animate-pulse'}`}>{userRole === "Approver" ? "Assets to Approve" : "Pending Approval"}</p>
          <div className={`w-full ${loading ? 'bg-none' : 'bg-[#F9F9F9]'} rounded-[14px] ml-4 $`}>
            {
              loading ? <Preloader rowCount={3} rowHeight="8rem" /> : (
                <div className="p-5 max-h-[620px] overflow-y-auto">
                  {pendingApproval && pendingApproval.length > 0 ? (
                    pendingApproval.map((data, index) => {
                      return (
                        <div
                          onClick={() => {

                            setActiveIndex(index); // Set the active index to apply the scale effect
                            setTimeout(() => setActiveIndex(null), 500); // Reset after 500ms

                            // router.push(`/approver-page?assetVersionID=${data.assetVersionID}&assetName=${data.assetName}&layoutName=${data.assetTypeName}&status=${data.status}&campaignName=${data.campaignName}&projectName=${data.projectName}`)
                            const params = new URLSearchParams({
                              assetVersionID: data.assetVersionID,
                              assetName: data.assetName,
                              layoutName: data.assetTypeName,
                              status: data.status,
                              campaignName: data.campaignName,
                              projectName: data.projectName
                            })

                            router.push(`/approver-page?${params.toString()}`)
                          }}
                          key={index} className={`rounded-[15px] border p-3 mt-2 cursor-pointer transition-all duration-300 ease-in-out
                      ${activeIndex === index ? ' scale-[.98] bg-green-50 border-green-100' : 'scale-100'}
                      ${index % 2 === 0 ? 'bg-white' : 'bg-[#F9F9F9]'}`}>
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
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
