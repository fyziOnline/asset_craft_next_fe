'use client';

import React, { FC } from "react";
import SearchBox from "@/components/global/SearchBox";
import DashboardCard from "@/components/cards/DashboardCard";
import Button from "@/components/global/Button";
import Table from "@/components/global/Table";
import ProjectSetUpModal from "@/components/wrapper/ProjectSetUpModal";
import TextField from "@/components/global/TextField";
import { EmailIcon, LandingAssetIcon2, LinkedinIcon, SalesCallIcon } from "@/assets/icons/TableIcon";
import { ExpressIcon } from "@/assets/icons/AppIcons";
import { useDashboard } from "@/hooks/useDashboard";
import InputAreaSearch from "@/components/global/InputAreaSearch";
import DropDown from "@/components/global/DropDown";
import processDashboardAssets from "@/app/dashboard/utils/dashboardFilters"
import { formatDate } from "@/utils/formatDate";



// const pendingApprovals = [
//   {
//     id: 1,
//     name: "Email_1",
//     lastUpdated: "2nd Oct 2024",
//   },
//   {
//     id: 2,
//     name: "LinkedIn_1",
//     lastUpdated: "3rd Oct 2024",
//   },
//   {
//     id: 3,
//     name: "SalesCall_1",
//     lastUpdated: "4th Oct 2024",
//   },
//   {
//     id: 4,
//     name: "Lorem",
//     lastUpdated: "4th Oct 2024",
//   },
//   {
//     id: 5,
//     name: "Lorem",
//     lastUpdated: "4th Oct 2024",
//   },
// ];


const tableHeading = ["Asset Name", "Campaign Name", "Project Name", "Created On", "Current Status"]

const Dashboard: FC = () => {
  const {
    isProductNameValid,
    isAssetNameExists,
    listProjects,
    listCampaigns,
    clientAssetTypes,
    isModalOpen,
    chooseAssetModal,
    selectedIndexes,
    selectedButton,
    handleNext,
    projectName,
    closeModal,
    closeAssetModal,
    onChangeAssetDetails,
    handleShowPopup,
    onSelect,
    handleChangeAssetDetails,
    dashboardAssets
  } = useDashboard()

  const { updatedDashboardData, assetsDisplayTable, pendingApproval } = processDashboardAssets(dashboardAssets);

  const options = [
    { id: 1, label: "Email", icon: <EmailIcon width="100" height="95" strokeWidth="0.5" strokeColor={selectedIndexes.includes(1) ? "white" : "black"} /> },
    { id: 2, label: "LinkedIn", icon: <LinkedinIcon width="100" height="95" strokeWidth="0.5" strokeColor={selectedIndexes.includes(2) ? "white" : "black"} /> },
    { id: 3, label: "Call Script", icon: <SalesCallIcon width="100" height="95" strokeWidth="0.5" strokeColor={selectedIndexes.includes(3) ? "white" : "black"} /> },
    { id: 4, label: "Landing Page", icon: <LandingAssetIcon2 strokeColor={selectedIndexes.includes(4) ? "white" : "black"} /> },
  ];

  return (
    <>
      <ProjectSetUpModal title="Project Details" selectedValue={selectedButton?.assetTypeName} onNext={handleNext} isOpen={isModalOpen} onClose={closeModal} >
        <div className='w-full flex flex-col gap-3 px-12 pb-7'>
          <div className='pt-[15px] flex flex-col gap-3'>
            <p className='text-[#160647] text-base tracking-wide font-semibold'>Project/Solution Name</p>
            <DropDown
              onSelected={(optionSelected) => { handleChangeAssetDetails("project_name", optionSelected.value, optionSelected.label || '') }}
              selectPlaceHolder="Select Project/Solution Name" optionLists={listProjects} otherFieldText="Specify project name" otherFieldErrorText={!isProductNameValid ? `Product/Solution name cannot be ${projectName}` : ''}></DropDown>
            {/* <InputAreaSearch name="project_name" placeholder="Type the name of your Project/Solution here." listData={listProjects} onChange={(value) => { handleChangeAssetDetails("project_name", value) }} /> */}
          </div>
          <div className='flex flex-col gap-3'>
            <p className='text-[#160647] text-base tracking-wide font-semibold'>Campaign Name</p>
            <InputAreaSearch name="campaign_name" placeholder="Type the name of your Campaign here, E.g. New year campaign, Launch campaign etc" listData={listCampaigns.map((value) => value.campaignName)} onChange={(value) => { handleChangeAssetDetails("campaign_name", value) }} />
          </div>
          {selectedButton?.assetTypeName !== "All in One" &&
            <div className='flex flex-col gap-3'>
              <p className='text-[#160647] text-base tracking-wide font-semibold'>Digital Marketing Asset Name</p>
              <TextField customClass='h-12' placeholder='Type the name of your Digital Marketing Assets here, E.g. Email_1, Linkedin_1 etc' name="asset_name" handleChange={onChangeAssetDetails} />
              {isAssetNameExists ? <p className='text-red-500 text-[12px] mt-[-10px]'>Asset name already exists, please enter another asset name.</p> : null}
            </div>
          }
        </div>
      </ProjectSetUpModal>

      <ProjectSetUpModal title="Choose your Assets" onClose={closeAssetModal} selectedValue="All in One" isOpen={chooseAssetModal} onNext={handleNext}>
        <div className="flex items-center justify-between px-11 py-8 ">
          {options.map((data, index) => (
            <div key={index} className="cursor-pointer" onClick={() => onSelect(data.id)}>
              <div className={` ${selectedIndexes.includes(data.id) ? "bg-green-300" : "bg-white border border-foreground"} flex items-center flex-col rounded-2xl py-4 w-[160px]`}>
                {data.icon}
                <p className={`text-cente text-base tracking-wide ${selectedIndexes.includes(data.id) ? "text-white" : "text-black"}`}>{data.label}</p>
              </div>
            </div>
          ))}
        </div>
      </ProjectSetUpModal>

      {/* <div className="px-8 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl tracking-wide text-green-100 font-bold leading-normal">
            Welcome, {userDetails?.name}
          </h1>
          <SearchBox />
        </div>
        <p className="text-base font-bold tracking-wide">Overview:</p>
      </div> */}
      <div className="w-full px-8 flex items-center justify-between mt-4 gap-10">
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
          <div>
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
                  customClass="group px-12 py-2 border border-[#07363480] w-[25%] px-[50px] transition-all duration-300 hover:bg-[#073634]"
                  textColor="text-foreground group-hover:text-white"
                  handleClick={() => handleShowPopup(item)}
                  textStyle="font-normal text-sm text-center whitespace-nowrap"
                />
              ))}
            </div>
          </div>
          <div className="border-t border-[#D9D9D9]">
            <div className="mt-5">
              <p className="text-lg font-bold tracking-wide">Recent Assets:</p>
            </div>
            <div className="overflow-y-scroll h-[50vh] scrollbar-hide">
              {assetsDisplayTable && assetsDisplayTable.length > 0 ? (
                <Table listItems={assetsDisplayTable} tableHeadings={tableHeading} />
              ) : (
                <p></p> // Optionally, display a message if no data is available
              )}
              <div className="h-[15vh]" />
            </div>

          </div>
        </div>

        <div className="w-[27%]">
          <p className="text-lg font-bold pl-10 pb-2">Pending Approval</p>
          <div className="w-full bg-[#F9F9F9] rounded-[14px] ml-4">
            <div className="p-5 max-h-[580px] overflow-y-auto">

              {pendingApproval && pendingApproval.length > 0 ? (
                pendingApproval.map((data, index) => (
                  <div key={index} className={`rounded-[15px] border p-3 mt-2 ${index % 2 === 0 ? 'bg-white' : 'bg-[#EFEFEF]'}`}>
                    <p className="text-[##2F363F] font-inter text-base font-bold mb-1">{data.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[#636363] font-thin text-sm">Last Updated :</p>
                      <p className="text-[#636363] text-sm font-normal">{data.lastUpdated}</p>
                    </div>
                  </div>
                ))) : (
                <div className="text-center text-[#636363] font-inter text-sm ">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
