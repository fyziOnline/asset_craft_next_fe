import { CloseIcon, FileIcon } from "@/assets/icons/AssetIcons";
import formatFileSize from "@/utils/formatFileSize";
import React, { useRef, useState } from "react";

/**
 * DragAndDrop Component
 * Provides an interface for file uploads using drag-and-drop or file input.
 * Now supports multiple file selection and management.
 *
 * @param {DragAndDropProps} props - Component props.
 * @returns {JSX.Element} The rendered DragAndDrop component.
 */

interface DragAndDropProps {
  onFileSelect?: (files: File[]) => void;
  onRemoveSelectedFile?: (fileIndex: number) => void;
  onRemoveAllFiles?: () => void;
  dragAndDropOuterClass?: string;
  showButtons?: boolean;
  uploadedFiles?: string[];
  maxFiles?: number;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const DEFAULT_MAX_FILES = 10;

const ALLOWED_TYPES = {
  image: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  text: ["text/plain"],
  document: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"], // .doc, .docx
  spreadsheet: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"] // .xls, .xlsx, .csv
};

const DragAndDrop: React.FC<DragAndDropProps> = ({ 
  onFileSelect, 
  onRemoveSelectedFile, 
  onRemoveAllFiles,
  dragAndDropOuterClass = "", 
  showButtons = true, 
  uploadedFiles = [],
  maxFiles = DEFAULT_MAX_FILES
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<"upload" | "recent">("upload");
  const [errorMessage, setErrorMessage] = useState("");
  const [isOriginalFilesRemoved, setIsOriginalFilesRemoved] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALL_ALLOWED_TYPES = Object.values(ALLOWED_TYPES).flat();

  // Handles button click events and updates the active state.
  const handleButtonClick = (button: "upload" | "recent") => {
    setActiveButton(button);
  };

  // Handles drag events to update the drag active state.
  const handleDrag = (e: React.DragEvent<HTMLDivElement>, isActive: boolean) => {
    e.preventDefault();
    setDragActive(isActive);
  };

  // Validates the selected file based on type and size.
  // Returns an error message if the file is invalid, otherwise returns an empty string.
  const validateFile = (file: File) => {
    if (!ALL_ALLOWED_TYPES.includes(file.type)) {
      return "Unsupported file type. Please upload a valid image, document, or spreadsheet.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB.";
    }
    return "";
  };

  // Validates multiple files and returns an array of errors
  const validateFiles = (newFiles: File[]) => {
    const errors: string[] = [];
    
    // Check if adding new files would exceed the maximum
    if (files.length + newFiles.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed. You can select ${maxFiles - files.length} more files.`);
      return errors;
    }

    // Validate each file
    newFiles.forEach((file, index) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`File ${index + 1}: ${error}`);
      }
    });

    return errors;
  };

  // Handles multiple file selection and validation.
  const handleFileSelection = (newFiles: File[]) => {
    const errors = validateFiles(newFiles);
    
    if (errors.length > 0) {
      setErrorMessage(errors.join(' '));
      return;
    }

    setErrorMessage("");
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    setIsOriginalFilesRemoved(true);
    
    if (onFileSelect) onFileSelect(updatedFiles);
  };

  // Handles file input change events and calls handleFileSelection with the selected files.
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      handleFileSelection(selectedFiles);
    }
  };

  // Handles file drop events and prevents default behavior.
  // Calls handleFileSelection with the dropped files if available.
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFileSelection(droppedFiles);
    }
  };

  // Handles single file removal when the close icon is clicked.
  const handleFileRemove = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setErrorMessage("");
    
    if (onRemoveSelectedFile) onRemoveSelectedFile(index);
    if (onFileSelect) onFileSelect(updatedFiles);
    
    // Reset input value
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handles removing all files
  const handleRemoveAllFiles = () => {
    setFiles([]);
    setErrorMessage("");
    setIsOriginalFilesRemoved(true);
    
    if (onRemoveAllFiles) onRemoveAllFiles();
    if (onFileSelect) onFileSelect([]);
    
    // Reset input value
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Helper function to extract filename from uploaded file path
  const getFileNameFromPath = (filePath: string) => {
    return filePath.split('/').pop()?.split('_').slice(1).join('_') || filePath;
  };

  // Helper function to get file extension
  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop();
  };

  return (
    <div className={`${showButtons ? "h-[230px]" : "h-full"} rounded-3xl overflow-hidden flex flex-col ${dragAndDropOuterClass}`}>
      {/* Toggle buttons commented out as in original */}
      {/* {showButtons && (
        <div className="w-full h-[68px] flex items-center justify-center bg-white border-b border-[#EBEFF2]">
          <div className="relative flex items-center w-[240px] h-[40px] bg-[#e6ecf1] rounded-full p-1">
            <div className={`absolute top-1 left-1 h-[calc(100%-8px)] w-[48%] bg-[#00A881] rounded-full shadow-md transition-transform duration-300 ease-in-out ${activeButton === "upload" ? "translate-x-0" : "translate-x-full"}`} />
            <button
              onClick={() => handleButtonClick("upload")}
              className={`relative z-10 flex-1 text-sm text-center rounded-full py-2 transition-colors duration-300 ${activeButton === "upload" ? "text-white" : "text-gray-400"}`}
            >
              New Upload
            </button>
            <button
              onClick={() => handleButtonClick("recent")}
              className={`relative z-10 flex-1 text-sm text-center rounded-full py-2 transition-colors duration-300 ${activeButton === "recent" ? "text-white" : "text-gray-400"}`}
            >
              Recent
            </button>
          </div>
        </div>
      )} */}

      <div className={`w-full flex-1 p-8 flex items-center relative ${activeButton === 'upload' ? "bg-[#F7F9FB] justify-center" : "bg-white"}`}>
        {activeButton === "upload" && (
          <div className="w-full h-fit">
            <div className="h-[70%]">
              <div
                className={`w-full h-full max-w-full flex items-center justify-center border-2 border-dashed rounded-3xl ${dragActive ? "border-[#004031]" : "border-[#E2E6EA]"} cursor-pointer`}
                onDragOver={(e) => handleDrag(e, true)}
                onDragEnter={(e) => handleDrag(e, true)}
                onDragLeave={(e) => handleDrag(e, false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()} //  trigger input manually
              >
                <div className="flex flex-col items-center">
                  <p className="text-sm text-[#242634] opacity-50">Click to browse or</p>
                  <p className="text-sm text-[#242634] opacity-50">drag and drop your files</p>
                  <p className="text-sm text-[#242634] opacity-50">Only text/images, max 10MB each</p>
                  <p className="text-sm text-[#242634] opacity-50">Maximum {maxFiles} files</p>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
                id="file-input"
                accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.txt,.pdf,.doc,.docx,.xls,.xlsx,.csv"
                multiple
              />
            </div>

            {errorMessage && (
              <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
            )}

            {/* Display selected files */}
            {files.length > 0 && (
              <div className="mt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#242634] opacity-70">
                    Selected Files ({files.length}/{maxFiles})
                  </span>
                  {files.length > 1 && (
                    <button
                      onClick={handleRemoveAllFiles}
                      className="text-xs text-red-500 hover:text-red-700 underline"
                    >
                      Remove All
                    </button>
                  )}
                </div>
                {files.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="bg-slate-100 p-2 rounded-lg relative">
                    <div className="flex items-center gap-2">
                      <FileIcon color="#EDEDED" text={file.type?.split("/")?.[1] ?? "file"} />
                      <div className="text-xs text-[#242634] opacity-50 flex-1">
                        <p className="truncate">{file.name}</p>
                        <p>{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div onClick={() => handleFileRemove(index)}>
                      <CloseIcon className="absolute top-2 right-2 w-4 cursor-pointer hover:scale-110 transition-transform" color="#BCB8B8" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Display uploaded files (original files) */}
            {files.length === 0 && uploadedFiles.length > 0 && !isOriginalFilesRemoved && (
              <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                <span className="text-xs text-[#242634] opacity-70">
                  Uploaded Files ({uploadedFiles.length})
                </span>
                {uploadedFiles.map((uploadedFile, index) => {
                  const fileName = getFileNameFromPath(uploadedFile);
                  const extension = getFileExtension(fileName);
                  
                  return (
                    <div
                      key={`uploaded-${index}`}
                      onClick={() => window.open(uploadedFile, '_blank')}
                      className="bg-slate-100 p-2 rounded-lg relative cursor-pointer hover:bg-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <FileIcon color="#EDEDED" text={extension} />
                        <div className="text-xs text-[#242634] opacity-50">
                          <p className="truncate">{fileName}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeButton === "recent" && (
          <div className="flex flex-col gap-1">
            <div className="bg-slate-500 p-4 rounded">
              {/* Placeholder SVG */}
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30.3332 4.33325H12.9998C11.8506 4.33325 10.7484 4.7898 9.93571 5.60246C9.12305 6.41511 8.6665 7.51731 8.6665 8.66658V43.3332C8.6665 44.4825 9.12305 45.5847 9.93571 46.3974C10.7484 47.21 11.8506 47.6666 12.9998 47.6666H38.9998C40.1491 47.6666 41.2513 47.21 42.064 46.3974C42.8766 45.5847 43.3332 44.4825 43.3332 43.3332V17.3333L30.3332 4.33325Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M30.3335 4.33325V17.3333H43.3335" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M34.6668 28.1667H17.3335" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M34.6668 36.8333H17.3335" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21.6668 19.5H17.3335" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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