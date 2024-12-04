'use client';

import { ChangeEvent, FC, useState } from "react";
import { useRouter } from 'next/navigation';
import SearchBox from "@/components/global/SearchBox";
import DashboardCard from "@/components/cards/DashboardCard";
import Button from "@/components/global/Button";
import Table from "@/components/global/Table";
import { AllinOne, ExpressIcon } from "@/assets/icons/AppIcons";
import ProjectSetUpModal from "@/components/wrapper/ProjectSetUpModal";
import TextField from "@/components/global/TextField";
import { EmailIcon, LandingAssetIcon, LandingAssetIcon2, LinkedinIcon, SalesCallIcon } from "@/assets/icons/TableIcon";

type AssetDetails = {
  project_name: string;
  campaign_name: string;
  asset_name: string;
};

const Dashboard: FC = () => {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [chooseAssetModal, setChooseAssetModal] = useState<boolean>(false);
  const [selectedButton, setSelectedButton] = useState<string>()
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const [assetDetails,setAssetDetails] = useState<AssetDetails>({
    project_name:'',
    campaign_name:'',
    asset_name:''
  })

  const buttonData = [
    { text: "All in One", backgroundColor: "bg-green-300", customClass: "px-[50px] py-1", showIcon: false },
    { text: "Email", backgroundColor: "bg-white", customClass: "border-2 border-green-300 min-w-min px-[50px]", showIcon: false, color: "text-foreground" },
    { text: "LinkedIn", backgroundColor: "bg-white", customClass: "border-2 border-green-300 min-w-min px-[50px]", showIcon: false, color: "text-foreground" },
    { text: "Landing Page", backgroundColor: "bg-white", customClass: "border-2 border-green-300 min-w-min px-[50px]", showIcon: false, color: "text-foreground" },
    { text: "Call Script", backgroundColor: "bg-white", customClass: "border-2 border-green-300 min-w-min px-[50px]", showIcon: false, color: "text-foreground" },
    { text: "All Pre-Created Assets", backgroundColor: "bg-white", customClass: "border-2 border-green-300 min-w-min px-[50px]", showIcon: false, color: "text-foreground" },
  ];

  const dashboardData = [
    { projectName: "All Projects", allProjectDate: "as of 04.10.2024", totalAssets: 15, underReview: 4, inProgress: 11 },
    { projectName: "Email", totalAssets: 15, underReview: 4, inProgress: 11 },
    { projectName: "LinkedIn", totalAssets: 15, underReview: 4, inProgress: 11 },
    { projectName: "Call Script", totalAssets: 15, underReview: 4, inProgress: 11 },
    { projectName: "Landing Page", totalAssets: 15, underReview: 4, inProgress: 11 },
  ];

  const options = [
    { id: 1, label: "Email", icon: <EmailIcon width="100" height="95" strokeWidth="0.5" strokeColor={selectedIndexes.includes(1) ? "white" : "black"} /> },
    { id: 2, label: "LinkedIn", icon: <LinkedinIcon width="100" height="95" strokeWidth="0.5" strokeColor={selectedIndexes.includes(2) ? "white" : "black"} /> },
    { id: 3, label: "Call Script", icon: <SalesCallIcon width="100" height="95" strokeWidth="0.5" strokeColor={selectedIndexes.includes(3) ? "white" : "black"} /> },
    { id: 4, label: "Landing Page", icon: <LandingAssetIcon2 strokeColor={selectedIndexes.includes(4) ? "white" : "black"} /> },
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


  const handleShowPopup = (value: string) => {
    setModalOpen(true)
    setSelectedButton(value)
  }

  const onSelect = (index: number) => {
    // Toggle selection: if index is already selected, deselect it; otherwise, select it
    setSelectedIndexes(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  }

  const closeModal = () => setModalOpen(false);
  const closeAssetModal = () => setChooseAssetModal(false)

  const onChangeAssetDetails = (e:ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAssetDetails(pre => ({
      ...pre,
      [name] : value
    }))
    
  }

  const handleNext = () => {
    console.log('selected button :',assetDetails);
    
    if (selectedButton === "All in One") {
      setChooseAssetModal(true)
      setModalOpen(false)
    } else if (selectedButton === "Call Script") {
      router.push("/call-script")
      closeModal()
    } else if(selectedButton === 'Email') {
      router.push(`my-projects/${assetDetails.project_name}/${assetDetails.campaign_name}/email?asset_name=${assetDetails.asset_name}`)
    }
  }

  return (
    <>
        <ProjectSetUpModal title="Project Details" selectedValue={selectedButton} onNext={handleNext} isOpen={isModalOpen} onClose={closeModal} >
          <div className='w-full flex flex-col gap-3 px-12 pb-7'>
            <div className='pt-[15px] flex flex-col gap-3'>
              <p className='text-[#160647] text-base tracking-wide font-semibold'>Project/Solution Name</p>
              <TextField customClass='h-12' placeholder='Type the name of your Project/Solution here.' name="project_name"  handleChange={onChangeAssetDetails} />
            </div>
            <div className='flex flex-col gap-3'>
              <p className='text-[#160647] text-base tracking-wide font-semibold'>Campaign Name</p>
              <TextField customClass='h-12' placeholder='Type the name of your Campaign here.' name="campaign_name" handleChange={onChangeAssetDetails}/>
            </div>
            {selectedButton !== "All in One" &&
              <div className='flex flex-col gap-3'>
                <p className='text-[#160647] text-base tracking-wide font-semibold'>Digital Marketing Asset Name</p>
                <TextField customClass='h-12' placeholder='Type the name of your Digital Marketing Assets here.' name="asset_name" handleChange={onChangeAssetDetails}/>
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
                {buttonData.map((button, index) => (
                  <Button
                    key={index}
                    buttonText={button.text}
                    showIcon={button.showIcon}
                    IconComponent={button.text === "All in One" && <ExpressIcon strokeColor="white" width="40" height="38" />}
                    backgroundColor={button.backgroundColor}
                    customClass={button.customClass}
                    textColor={button.color}
                    handleClick={() => handleShowPopup(button.text)}
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
