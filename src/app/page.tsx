'use client';

import Table from "@/components/global/Table";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";

export default function Home() {

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
    },
    {
      projectName: 'Project Beta',
      campaignName: 'Campaign Y',
      assetName: 'Asset B',
      creadedOn: '22.01.2024',
      approvedBy: 'Sarah M.',
      approvedOn: '23.01.2024',
      currentStatus: 'In Progress',
    },
    {
      projectName: 'Project Gamma',
      campaignName: 'Campaign Z',
      assetName: 'Asset C',
      creadedOn: '23.01.2024',
      approvedBy: 'Emily T.',
      approvedOn: '24.01.2024',
      currentStatus: 'In Progress',
    },
];

const headings = [
  'Project Name',
  'Campaign Name',
  'Asset Name',
  'Created On',
  'Approved By',
  'Approved On',
  'Current Status',
]

const arrowColumns = ['Project Name','Created On', 'Approved On'];


  return (
    <main className="w-100 h-screen  flex flex-col gap-2">
      <Header />
      <Navbar />
      <div className="w-[85%] mx-auto mt-40 pl-20">
        <Table listItems={tableData} tableHeadings={headings} arrowInHeadings={arrowColumns} />
      </div>
      <Footer/>
    </main>
  );
}
