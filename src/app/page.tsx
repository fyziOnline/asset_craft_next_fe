"use client"

import Search from "@/components/global/Search";

export default function Home() {

  const usersList = [
    {
        label: "Stan Lee (You)",
        value: "Stan Lee (You)",
        firstLetter: "S",
        IconColor: "bg-custom-light-blue"
    },
    {
        label: "Suman Ann Thomas",
        value: "Suman Ann Thomas",
        firstLetter: "S",
        IconColor: "bg-custom-light-red"
    }
]

const handleSelectEmployee = (value : {} ) => {
  console.log("selectEmployee" , value);
}

  return (
    <div className="w-full h-screen p-20">
       <Search optionsList={usersList} onSelect={handleSelectEmployee} />
    </div>
  );
}
