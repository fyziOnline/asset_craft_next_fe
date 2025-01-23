import { CloseIcon, FileIcon } from "@/assets/icons/AssetIcons";
import formatFileSize from "@/utils/formatFileSize";
import React, { useRef, useState } from "react";

/**
 * DragAndDrop Component
 * Provides an interface for file uploads using drag-and-drop or file input.
 *
 * @param {DragAndDropProps} props - Component props.
 * @returns {JSX.Element} The rendered DragAndDrop component.
 */

interface DragAndDropProps {
  onFileSelect?: (file: File) => void;
  dragAndDropOuterClass?: string;
  showButtons?: boolean;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({ onFileSelect, dragAndDropOuterClass = "", showButtons = true }) => {
  const [files, setFiles] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<"upload" | "recent">("upload");

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handles button click events and updates the active state.
  const handleButtonClick = (button: "upload" | "recent") => {
    setActiveButton(button);
  };

  // Handles drag events to update the drag active state.
  const handleDrag = (e: React.DragEvent<HTMLDivElement>, isActive: boolean) => {
    e.preventDefault();
    setDragActive(isActive);
  };

  // Handles file input changes and updates the file state.
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setSelectedFile(selectedFile.name);
      setFiles(selectedFile);
      if (onFileSelect) onFileSelect(selectedFile);
    }
  };
  // Handles drop events for drag-and-drop functionality.
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setSelectedFile(droppedFile.name);
      setFiles(droppedFile);
      if (onFileSelect) onFileSelect(droppedFile);
    }
  };

  // Handles file removal when the close icon is clicked.
  const handleFileRemove = () => {
    setFiles(null);
    setSelectedFile("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  return (
    <div className={`${showButtons ? "h-[230px]" : "h-full"} rounded-3xl overflow-hidden flex flex-col ${dragAndDropOuterClass}`}>
      {
        showButtons &&
        <div className="w-full h-[68px] flex items-center justify-center bg-white border-b border-[#EBEFF2]">
          <div className="relative flex items-center w-[240px] h-[40px] bg-[#e6ecf1] rounded-full p-1">
            {/* Sliding Toggle Background */}
            <div
              className={`absolute top-1 left-1 h-[calc(100%-8px)] w-[48%] bg-[#00A881] rounded-full shadow-md transition-transform duration-300 ease-in-out ${activeButton === "upload" ? "translate-x-0" : "translate-x-full"
                }`}
            />

            {/* Upload Button */}
            <button
              onClick={() => handleButtonClick("upload")}
              className={`relative z-10 flex-1 text-sm  text-center rounded-full py-2 transition-colors duration-300 ${activeButton === "upload" ? "text-white" : "text-gray-400"
                }`}
            >
              New Upload
            </button>

            {/* Recent Button */}
            <button
              onClick={() => handleButtonClick("recent")}
              className={`relative z-10 flex-1 text-sm text-center rounded-full py-2 transition-colors duration-300 ${activeButton === "recent" ? "text-white" : "text-gray-400"
                }`}
            >
              Recent
            </button>
          </div>
        </div>
      }

      <div className={`w-full flex-1 p-8 flex items-center relative ${activeButton === 'upload' ? "bg-[#F7F9FB] justify-center" : "bg-white"}`}>
        {activeButton === "upload" && (
          <div className="w-full h-fit">
            {/* // w-full h-full */}
            <div className="h-[70%]" >
              <div
                className={`w-full h-full max-w-full flex items-center justify-center border-2 border-dashed rounded-3xl ${dragActive ? "border-[#004031]" : "border-[#E2E6EA]"} `}
                onDragOver={(e) => handleDrag(e, true)}
                onDragEnter={(e) => handleDrag(e, true)}
                onDragLeave={(e) => handleDrag(e, false)}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <p className="text-sm text-[#242634] opacity-50">Click to browse or</p>
                  <p className="text-sm text-[#242634] opacity-50">drag and drop your files</p>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="absolute w-full h-full top-0 left-0 cursor-pointer"
              ></label>
            </div>
            {files && <div className=" mt-2 bg-slate-100 p-2 rounded-lg relative">
              <div className="flex items-end">
                <FileIcon color="#EDEDED" text={files.type.split('/')[1]} />
                <div className="text-xs text-[#242634] opacity-50">
                  <p>{files.name}</p>
                  <p>{formatFileSize(files.size)}</p>
                </div>
              </div>
              <div onClick={handleFileRemove}>
                <CloseIcon
                  className="absolute top-0 right-1 w-4 cursor-pointer" color="#BCB8B8" />
              </div>
            </div>}
          </div>
        )}

        {activeButton === "recent" && (
          <div className="flex flex-col gap-1">
            <div className="bg-slate-500 p-4 rounded" >
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30.3332 4.33325H12.9998C11.8506 4.33325 10.7484 4.7898 9.93571 5.60246C9.12305 6.41511 8.6665 7.51731 8.6665 8.66658V43.3332C8.6665 44.4825 9.12305 45.5847 9.93571 46.3974C10.7484 47.21 11.8506 47.6666 12.9998 47.6666H38.9998C40.1491 47.6666 41.2513 47.21 42.064 46.3974C42.8766 45.5847 43.3332 44.4825 43.3332 43.3332V17.3333L30.3332 4.33325Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M30.3335 4.33325V17.3333H43.3335" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M34.6668 28.1667H17.3335" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M34.6668 36.8333H17.3335" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21.6668 19.5H19.5002H17.3335" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-xs">Campaign.doc</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DragAndDrop;
