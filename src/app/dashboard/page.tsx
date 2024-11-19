'use client';
import { FC } from "react";
import LayoutWrapper from "@/layout/LayoutWrapper";
import SearchBox from "@/components/global/SearchBox";
import DashboardCard from "@/components/cards/DashboardCard";
import Button from "@/components/global/Button";
import Table from "@/components/global/Table";
import { AllinOne } from "@/assets/icons/AppIcons";
import { useRouter } from 'next/navigation';

const Dashboard: FC = () => {
  const router = useRouter();

  const buttonData = [
    { text: "All in One", backgroundColor: "bg-green-300", customClass: "px-[50px]", showIcon: false },
    { text: "Email", backgroundColor: "bg-white", customClass: "border-2 border-green-300 min-w-min px-[50px]", showIcon: false , color: "text-foreground"},
    { text: "LinkedIn", backgroundColor: "bg-white", customClass: "border-2 border-green-300 min-w-min px-[50px]", showIcon: false , color: "text-foreground" },
    { text: "Landing Page", backgroundColor: "bg-white", customClass: "border-2 border-green-300 min-w-min px-[50px]", showIcon: false , color: "text-foreground"},
    { text: "Call Script", backgroundColor: "bg-white", customClass: "border-2 border-green-300 min-w-min px-[50px]", showIcon: false, color: "text-foreground" },
    { text: "All Pre-Created Assets", backgroundColor: "bg-white", customClass: "border-2 border-green-300 min-w-min px-[50px]", showIcon: false , color: "text-foreground" },
  ];

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


  const tableHeading = ["Project Name" , "Campaign Name", "Asset Details", "Created On" , "Approved By" , "Approved On" , "Current Status"]

  return (
    <>
      <LayoutWrapper layout="main">
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
                    IconComponent={button.text === "All in One" && <AllinOne />}
                    backgroundColor={button.backgroundColor}
                    customClass={button.customClass}
                    textColor={button.color}
                    handleClick={() => {
                      if (button.text === "Call Script") {
                        router.push("/call-script")
                      }
                    }}
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
              {pendingApprovals.map((data , index) => (
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
      </LayoutWrapper>
    </>
  );
};

export default Dashboard;
