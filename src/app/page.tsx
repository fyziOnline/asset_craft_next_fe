'use client';
import Accordion from "@/components/global/Accordion";
import Button from "@/components/global/Button";
import FileUploadPopup from "@/components/global/FileUploadPopup";
import LayoutWrapper from "@/layout/LayoutWrapper";
import { useState } from "react";

export default function Home() {
  const [popUpOpen , setPopUpOpen] = useState(false)

  const togglePopUp = () => {
    setPopUpOpen(!popUpOpen)
  }
  
  return (
    // <div className="w-100 h-screen flex items-center justify-center flex-col gap-2">
    <>
      <LayoutWrapper layout="main">
          <div className="mt-10 mx-20">

            <Button buttonText="popup" handleClick={togglePopUp}/>
            <FileUploadPopup isOpen={popUpOpen}  onClose={() => setPopUpOpen(false)}/>
          </div>
      </LayoutWrapper>
    </>
  );
}
