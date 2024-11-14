import React, { useEffect, useRef, useState } from "react";

/**
 * DragAndDrop Component
 * Provides an interface for file uploads using drag-and-drop or file input.
 *
 * @param {DragAndDropProps} props - Component props.
 * @returns {JSX.Element} The rendered DragAndDrop component.
 */

interface FileUploadPopupProps {
  isOpen?: boolean;
  onClose?: () => void;
  onFileSelect?: (file: File) => void;
  dragAndDropOuterClass?: string;
}

const FileUploadPopup: React.FC<FileUploadPopupProps> = ({ isOpen, onClose, onFileSelect, dragAndDropOuterClass = "", }) => {
  const [files, setFiles] = useState<File | null>(null);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [activeButton, setActiveButton] = useState<"upload" | "recent">("upload");

  const modalRef = useRef<HTMLDivElement>(null);

  // Handles button click events and updates the active state.
  const handleButtonClick = (button: "upload" | "recent") => {
    setActiveButton(button);
  };

  // Handles drag events to update the drag active state.
  const handleDrag = ( e: React.DragEvent<HTMLDivElement>, isActive: boolean ) => {
    e.preventDefault();
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

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setSelectedFile(droppedFile.name);
      setFiles(droppedFile);
      if (onFileSelect) onFileSelect(droppedFile);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (onClose) onClose();  // Call onClose to close the modal if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
      <div ref={modalRef} className={`w-full max-w-lg h-[390px] rounded-3xl shadow overflow-hidden flex flex-col ${dragAndDropOuterClass}`}>
        <div className="w-full h-[109px] flex items-center justify-center bg-white border-b border-[#EBEFF2] relative">
          <div className="flex items-center gap-1 bg-[#F7F9FB] rounded-3xl p-[5px]">
            <button
              onClick={() => handleButtonClick("upload")}
              className={`px-5 py-[7px] rounded-3xl text-xs ${
                activeButton === "upload"
                  ? "bg-[#00A881] text-white"
                  : "bg-transparent text-black"
              }`}
            >
              New Upload
            </button>
            <button
              onClick={() => handleButtonClick("recent")}
              className={`px-4 py-[7px] rounded-3xl text-xs ${
                activeButton === "recent"
                  ? "bg-[#00A881] text-white"
                  : "bg-transparent text-black"
              }`}
            >
              Recent
            </button>
          </div>
 
          <div className="flex items-center gap-3 absolute left-auto right-6 cursor-pointer">
            <p className="text-green-300 text-lg font-bold">Next</p>
            <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                 <path d="M10.7194 5.85377L6.58976 1.62076L8.17094 0L14.2094 6.18962L15 7L14.2094 7.81038L8.17094 14L6.58976 12.3792L10.7194 8.14623H0V5.85377H10.7194Z" fill="#01A982"/>
            </svg>
            </span>
          </div>
        </div>

        <div
          className={`w-full flex-1 p-8 flex  relative ${ activeButton === "upload" ? "bg-[#D5E4DF] items-center justify-center" : "bg-white" }`}>
          {activeButton === "upload" && (
            <>
              <div
                className={`w-full h-full max-w-full flex items-center justify-center border-2 border-dashed rounded-3xl border-[#FDFEFF]`}
                onDragOver={(e) => handleDrag(e, true)}
                onDragEnter={(e) => handleDrag(e, true)}
                onDragLeave={(e) => handleDrag(e, false)}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center">
                  <p className="text-sm text-[#242634] opacity-50">
                    Click to browse or
                  </p>
                  <p className="text-sm text-[#242634] opacity-50">
                    drag and drop your files
                  </p>
                </div>
              </div>
              <input
                type="file"
                onChange={handleFileInputChange}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="absolute w-full h-full top-0 left-0 cursor-pointer"
              ></label>
            </>
          )}

          {activeButton === "recent" && (
            <div className="flex flex-col gap-1">
              <div className="bg-slate-500 p-4 rounded">
                <svg
                  width="52"
                  height="52"
                  viewBox="0 0 52 52"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M30.3332 4.33325H12.9998C11.8506 4.33325 10.7484 4.7898 9.93571 5.60246C9.12305 6.41511 8.6665 7.51731 8.6665 8.66658V43.3332C8.6665 44.4825 9.12305 45.5847 9.93571 46.3974C10.7484 47.21 11.8506 47.6666 12.9998 47.6666H38.9998C40.1491 47.6666 41.2513 47.21 42.064 46.3974C42.8766 45.5847 43.3332 44.4825 43.3332 43.3332V17.3333L30.3332 4.33325Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M30.3335 4.33325V17.3333H43.3335"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M34.6668 28.1667H17.3335"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M34.6668 36.8333H17.3335"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21.6668 19.5H19.5002H17.3335"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-xs">Campaign.doc</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadPopup;
