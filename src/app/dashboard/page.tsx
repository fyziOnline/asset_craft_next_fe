'use client';

import React, { FC } from "react";
import SearchBox from "@/components/global/SearchBox";
import DashboardCard from "@/components/cards/DashboardCard";
import Button from "@/components/global/Button";
import Table from "@/components/global/Table";
import { ExpressIcon } from "@/assets/icons/AppIcons";
import ProjectSetUpModal from "@/components/wrapper/ProjectSetUpModal";
import TextField from "@/components/global/TextField";
import { EmailIcon, LandingAssetIcon2, LinkedinIcon, SalesCallIcon } from "@/assets/icons/TableIcon";
import { useDashboard } from "@/hooks/useDashboard";
import InputAreaSearch from "@/components/global/InputAreaSearch";
import DropDown from "@/components/global/DropDown";
import SectionAssetDetails from "@/components/assetGeneration/SectionAssetDetails";

const dashboardData = [
  { projectName: "All Projects", allProjectDate: "as of 04.10.2024", totalAssets: 15, underReview: 4, inProgress: 11 },
  { projectName: "Email", totalAssets: 15, underReview: 4, inProgress: 11 },
  { projectName: "LinkedIn", totalAssets: 15, underReview: 4, inProgress: 11 },
  { projectName: "Call Script", totalAssets: 15, underReview: 4, inProgress: 11 },
  { projectName: "Landing Page", totalAssets: 15, underReview: 4, inProgress: 11 },
];

const tableData = [
  {
    projectName: 'Lorem Ipsum',
    campaignName: 'Lorem Ipsum',
    assetName: 'Lorem',
    creadedOn: '18.01.2024',
    approvedBy: 'Prakash C.',
    approvedOn: '20.01.2024',
    currentStatus: 'In Progress',
  },
  {
    projectName: 'Lorem Ipsum',
    campaignName: 'Lorem Ipsum',
    assetName: 'Lorem',
    creadedOn: '18.01.2024',
    approvedBy: 'Avish J.',
    approvedOn: '20.01.2024',
    currentStatus: 'Pending Approval',
  },
  {
    projectName: 'Project Alpha',
    campaignName: 'Campaign X',
    assetName: 'Asset A',
    creadedOn: '21.01.2024',
    approvedBy: 'John D.',
    approvedOn: '22.01.2024',
    currentStatus: 'Completed',
  }
];

const pendingApprovals = [
  {
    id: 1,
    name: "Email_1",
    lastUpdated: "2nd Oct 2024",
  },
  {
    id: 2,
    name: "LinkedIn_1",
    lastUpdated: "3rd Oct 2024",
  },
  {
    id: 3,
    name: "SalesCall_1",
    lastUpdated: "4th Oct 2024",
  },
  {
    id: 4,
    name: "Lorem",
    lastUpdated: "4th Oct 2024",
  },
  {
    id: 5,
    name: "Lorem",
    lastUpdated: "4th Oct 2024",
  },
];


const tableHeading = ["Project Name", "Campaign Name", "Asset Details", "Created On", "Approved By", "Approved On", "Current Status"]

const Dashboard: FC = () => {
  const {
    // isProductNameValid,
    // isAssetNameExists,
    // listProjects,
    // listCampaigns,
    clientAssetTypes,
    isModalOpen,
    chooseAssetModal,
    selectedIndexes,
    selectedButton,
    handleNext,
    // projectName,
    closeModal,
    closeAssetModal,
    // onChangeAssetDetails,
    handleShowPopup,
    onSelect,
    // handleChangeAssetDetails ,
    selectAssetType
  } = useDashboard()

  const options = [
    { id: 1, label: "Email", icon: <EmailIcon width="100" height="95" strokeWidth="0.5" strokeColor={selectedIndexes.includes(1) ? "white" : "black"} /> },
    { id: 2, label: "LinkedIn", icon: <LinkedinIcon width="100" height="95" strokeWidth="0.5" strokeColor={selectedIndexes.includes(2) ? "white" : "black"} /> },
    { id: 3, label: "Call Script", icon: <SalesCallIcon width="100" height="95" strokeWidth="0.5" strokeColor={selectedIndexes.includes(3) ? "white" : "black"} /> },
    { id: 4, label: "Landing Page", icon: <LandingAssetIcon2 strokeColor={selectedIndexes.includes(4) ? "white" : "black"} /> },
  ];

  return (
    <>
      {/* <ProjectSetUpModal title="Project Details" selectedValue={selectedButton?.assetTypeName} onNext={handleNext} isOpen={isModalOpen} onClose={closeModal} > */}
        {/* <div className='w-full flex flex-col gap-3 px-12 pb-7'>
          <div className='pt-[15px] flex flex-col gap-3'>
            <p className='text-[#160647] text-base tracking-wide font-semibold'>Project/Solution Name</p>
            <DropDown
              onSelected={(optionSelected) => { handleChangeAssetDetails("project_name", optionSelected.value,optionSelected.label || '') }}
              selectPlaceHolder="Select Project/Solution Name" optionLists={listProjects} otherFieldText="Specify project name"  otherFieldErrorText={!isProductNameValid ? `Product/Solution name cannot be ${projectName}` : '' }></DropDown>
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
        </div> */}
        {/* <SectionAssetDetails /> */}
      {/* </ProjectSetUpModal> */}

      {/* <ProjectSetUpModal title="Choose your Assets" onClose={closeAssetModal} selectedValue="All in One" isOpen={chooseAssetModal} onNext={handleNext}>
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
      </ProjectSetUpModal> */}

      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[30px] text-green-100 font-bold leading-normal">
            Welcome, Stan Lee.
          </h1>
          <SearchBox />
        </div>
        <p className="text-lg font-bold">Overview:</p>
      </div>
      <div className="px-8 flex items-center gap-9">
        {dashboardData.map((data, index) => (
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
        <div className="w-[70%] border-t border-[#D9D9D9]">
          <div className="mt-5">
            <p className="text-xl font-bold">
              What would you like to create today?
            </p>

            <div className="flex w-full overflow-x-auto gap-4 my-5 scrollbar-hide overflow-y-hidden">
              {clientAssetTypes.map((item, index) => (
                <Button
                  key={index}
                  buttonText={item.assetTypeName}
                  showIcon={false}
                  IconComponent={item.assetTypeName === "All in One" && <ExpressIcon strokeColor="white" width="40" height="38" />}
                  backgroundColor={item.assetTypeName === "All in One" ? "bg-green-300" : "bg-white"}
                  customClass={item.assetTypeName === "All in One" ? "px-[50px] py-1" : "border-2 border-green-300 min-w-min px-[50px]"}
                  textColor={item.assetTypeName === "All in One" ? undefined : "text-foreground"}
                  handleClick={() => selectAssetType(item)}
                  textStyle={`font-normal text-sm text-center whitespace-nowrap`}
                />
              ))}
            </div>
          </div>
          <div className="border-t border-[#D9D9D9]">
            <div className="mt-5">
              <p className="text-xl font-bold">Recent Assets:</p>
            </div>

            <div>
              <Table listItems={tableData} tableHeadings={tableHeading} />
            </div>
          </div>
        </div>
        <div className="w-[30%] bg-[#F9F9F9] rounded-[14px] ml-4">
          <div className="p-6">
            <div className="flex items-baseline justify-between">
              <p className="text-xl font-bold">Pending Approval:</p>
              <p className="text-base font-normal underline">View all</p>
            </div>
            {pendingApprovals.map((data, index) => (
              <div key={index} className="rounded-[15px] border-2 border-[#00A881] bg-white p-3 mt-2">
                <p className="text-[##2F363F] font-inter text-base font-normal mb-1">{data.name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[#636363] font-semibold text-sm">Last Updated:</p>
                  <p className="text-[#636363] text-sm font-normal">{data.lastUpdated}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
