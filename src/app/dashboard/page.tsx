'use client';

import React, { FC, useEffect, useMemo } from "react";
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

const tableHeading = ["Asset Name", "Campaign Name", "Project Name", "Created On", "Current Status"];

const Dashboard: FC = () => {
    const router = useRouter();
    const {
        clientAssetTypes,
        selectAssetType,
        dashboardAssets,
        pendingApproval,
        userRole,
        isLoading
    } = useDashboard();

    const { setContextData } = useAppData();

    // Memoize processed dashboard data
    const { updatedDashboardData, assetsDisplayTable } = useMemo(() => 
        processDashboardAssets(dashboardAssets),
        [dashboardAssets]
    );

    // Reset context on mount
    useEffect(() => {
        setContextData({
            isRegenerateHTML: false,
            stepGenerate: 0,
            AssetHtml: {} as AssetHtmlProps,
            assetGenerateStatus: 1,
            assetTemplateShow: false
        });
    }, [setContextData]);

    const handleAssetClick = (item: any) => {
        router.push(`/edit-html-content?assetID=${item.assetID}&status=${item.currentStatus}&projectName=${item.projectName}&campaignName=${item.campaignName}&assetTypeIcon=${item.assetTypeIcon}`);
    };

    const handleApprovalClick = (data: any) => {
        router.push(`/approver-page?assetVersionID=${data.assetVersionID}&assetName=${data.assetName}&layoutName=${data.assetTypeName}&status=${data.status}&campaignName=${data.campaignName}&projectName=${data.projectName}`);
    };

    if (isLoading) {
        return <div className="mt-10 text-center">Loading...</div>;
    }

    return (
        <div className="mt-10">
            {/* Dashboard Cards */}
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

            <div className="pl-8 pt-5 flex w-full mb-32 flex-wrap flex-col lg:flex-row">
                {/* Asset Creation Section */}
                <div className="lg:w-[70%] w-[95%] border-[#D9D9D9]">
                    <div className="lg:w-full border-b border-[#D9D9D9]">
                        <p className="text-lg font-bold tracking-wide">
                            What would you like to create today?
                        </p>

                        <div className="flex w-full overflow-x-auto gap-4 my-5 scrollbar-hide overflow-y-hidden">
                            {clientAssetTypes
                                .filter(item => item.assetTypeName !== "All in One")
                                .map((item, index) => (
                                    <Button
                                        key={index}
                                        buttonText={item.assetTypeName}
                                        showIcon={false}
                                        IconComponent={item.assetTypeName === "All in One" && 
                                            <ExpressIcon strokeColor="white" width="40" height="38" />}
                                        backgroundColor="bg-white"
                                        customClass="group px-12 py-2 border border-[#07363480] w-[25%] px-[50px] transition-all duration-300 hover:bg-[#00A881] tracking-wide hover:border-none"
                                        textColor="text-foreground group-hover:text-white"
                                        handleClick={() => selectAssetType(item)}
                                        textStyle="font-normal text-sm text-center whitespace-nowrap"
                                    />
                                ))}
                        </div>
                    </div>

                    {/* Recent Assets Table */}
                    <div className="border-t border-[#D9D9D9]">
                        <div className="mt-5">
                            <p className="text-lg font-bold tracking-wide">Recent Assets:</p>
                        </div>
                        <div>
                            {assetsDisplayTable?.length > 0 ? (
                                <Table 
                                    hiddenFields={["assetID"]} 
                                    handleClick={handleAssetClick}
                                    listItems={assetsDisplayTable} 
                                    tableHeadings={tableHeading} 
                                />
                            ) : (
                                <p className="text-center text-gray-500 mt-4">No recent assets</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pending Approvals Section */}
                <div className="lg:w-[27%] w-[95%] mt-[3rem] lg:mt-0">
                    <p className="text-lg font-bold pl-10 pb-2">
                        {userRole === "Approver" ? "Assets to Approve" : "Pending Approval"}
                    </p>
                    <div className="w-full bg-[#F9F9F9] rounded-[14px] ml-4">
                        <div className="p-5 max-h-[620px] overflow-y-auto">
                            {pendingApproval?.length > 0 ? (
                                pendingApproval.map((data, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleApprovalClick(data)}
                                        className={`rounded-[15px] border p-3 mt-2 cursor-pointer ${
                                            index % 2 === 0 ? 'bg-white' : 'bg-[#EFEFEF]'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-[##2F363F] text-wrap text-lg font-bold">
                                                {data.assetName}
                                            </p>
                                            <p className="text-[#636363] text-sm font-normal">
                                                {formatDate(data.createdOn)}
                                            </p>
                                        </div>
                                        <p className="text-sm text-[#636363]">{data.versionName}</p>
                                        <div className="w-full flex flex-col items-center">
                                            <p className="w-full text-wrap">{data.campaignName}</p>
                                            <p className="w-full text-wrap">{data.projectName}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-[#636363] text-sm">
                                    No pending approvals
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
