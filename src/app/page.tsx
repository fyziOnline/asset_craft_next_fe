'use client';

import Button from "../components/global/Button";

export default function Home() {
  return (
    <div className="w-100 h-screen flex items-center justify-center flex-col gap-2">
      <Button 
        buttonText="Generate" 
        handleClick={() => console.log("Generate")}
      />

      <Button 
        buttonText="Generate"  
        backgroundColor="bg-gray-300"
        handleClick={() => console.log("Generate disabled")}
      />

      <Button 
        buttonText="Regenerate"
        handleClick={() => console.log("Regenerate")}
      />

      <Button 
        buttonText="View & Edit"
        backgroundColor="bg-white"
        textColor="text-green-300"
        iconColor="#01A982"
        customClass="border-2 border-green-300"
        handleClick={() => console.log("view & edit")}
      />

      <Button
        buttonText="Save As"
        backgroundColor="bg-white"
        textColor="text-green-300"
        iconColor="#01A982"
        customClass="border-2 border-green-300"
        handleClick={() => console.log("Save As clicked")}
      />

      <Button 
        buttonText="Submit" 
        handleClick={() => console.log("Submit clicked")}
      />
    </div>
  );
}
