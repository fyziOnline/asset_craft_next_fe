'use client';
import Accordion from "@/components/global/Accordion";
import DragAndDrop from "@/components/global/DragAndDrop";
import LayoutWrapper from "@/layout/LayoutWrapper";

export default function Home() {

  const handleFileSelect = (file: File) => {
    console.log("Selected file:", file);
    // Handle the file, e.g., upload to server or process locally
  };
  
  return (
    // <div className="w-100 h-screen flex items-center justify-center flex-col gap-2">
    <>
      <LayoutWrapper layout="main">
          <div className="mt-10 mx-20">
            <Accordion
              HeaderTitle="Additional Campaign Assets"
              checked={true}
            >
              <DragAndDrop
                onFileSelect={handleFileSelect}
               />
            </Accordion>
          </div>
      </LayoutWrapper>
    </>
  );
}
