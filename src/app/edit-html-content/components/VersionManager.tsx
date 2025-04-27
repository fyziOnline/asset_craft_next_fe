import React, { useState } from 'react';
import { FaPlus } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { AssetVersionProps } from '@/types/templates';
import { formatDate } from '@/utils/formatDate';
import { useEditAssetStoreSelector } from '@/store/editAssetStore';

// Define status color mapping
const statusColors: Record<string, string> = {
    "In Progress": "#2196F3", // Blue
    "On Review": "#FF9800", // Orange
    "Completed": "#4CAF50", // Green
};

interface VersionManagerProps {
    versionList: AssetVersionProps[];
    selectedVersionID:string
    handleSave: (type: number) => void;
    editingVersionId: string | null;
    setEditingVersionId: (id: string | null) => void;
    handleUpdateVersionName: (id: string, name: string) => void;
    openConfirmationModal: (id: string, name: string) => void;
}

const VersionManager: React.FC<VersionManagerProps> = ({
    versionList,
    selectedVersionID,
    handleSave,
    editingVersionId,
    setEditingVersionId,
    handleUpdateVersionName,
    openConfirmationModal
}) => {
    const setSelectedVersion = useEditAssetStoreSelector.use.setSelectedVersion()
    const [editedName, setEditedName] = useState<Record<string, string>>({
        existingOne: "",
        updatedOne: ""
    });

    return (
        <div className='pt-2 pl-14 flex items-center gap-1'>
            {versionList.map((item, index) => {
                const isSelected = selectedVersionID === item.assetVersionID;
                const showDeleteButton = versionList.length > 1;
                const isEditing = editingVersionId === item.assetVersionID;
                const statusColor = item.status ? statusColors[item.status] || "#9E9E9E" : "#9E9E9E";
                const isStatusCompleted = item.status === "Completed"

                return (
                    <div
                        key={item.assetID + index}
                        onClick={() => setSelectedVersion(item.assetVersionID)}
                        onDoubleClick={(e) => {
                            if (isStatusCompleted) return;
                            if (isSelected) {
                                e.stopPropagation();
                                setEditingVersionId(item.assetVersionID);
                                setEditedName({updatedOne:item.versionName,existingOne:item.versionName});
                            }
                        }}
                        className={`group relative flex items-center justify-between px-4 py-[10px] rounded-t-md cursor-pointer transition-all min-w-36 ${
                            isSelected ? "bg-[#e4e4e4] text-black" : "hover:bg-gray-100"
                        }`}
                    >
                        {isEditing ? (
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={editedName.updatedOne}
                                    disabled={isStatusCompleted}
                                    onChange={(e) => setEditedName((prev)=>({...prev,updatedOne: e.target.value}))}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && editedName.updatedOne.trim()) {
                                            e.preventDefault();
                                            editedName.updatedOne.trim() !== editedName.existingOne && handleUpdateVersionName(item.assetVersionID, editedName.updatedOne.trim());
                                            setEditingVersionId(null);
                                            setEditedName((prev)=>({...prev,updatedOne:""}));
                                        } else if (e.key === 'Escape') {
                                            setEditingVersionId(null);
                                            setEditedName((prev)=>({...prev,updatedOne:""}));
                                        }
                                    }}
                                    onBlur={() => {
                                        setEditingVersionId(null);
                                        setEditedName((prev)=>({...prev,updatedOne:""}));
                                    }}
                                    className="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#01a982] w-full pr-8"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                                
                                {/* Enter key icon with persistent tooltip */}
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center opacity-70">
                                    <div className="relative group">
                                        <svg 
                                            width="16" 
                                            height="16" 
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="text-gray-500"
                                        >
                                            <path 
                                                d="M20 4V16C20 17.1046 19.1046 18 18 18H12H6C4.89543 18 4 17.1046 4 16V10M16 10L12 14M12 14L8 10M12 14V3" 
                                                stroke="currentColor" 
                                                strokeWidth="2" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        
                                        <div className="absolute bottom-full right-0 transform translate-y-[-8px] bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap pointer-events-none">
                                            Press Enter to save
                                            <div className="absolute top-full right-2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center">
                                    <div
                                        className="w-2 h-2 rounded-full mr-2"
                                        style={{ backgroundColor: statusColor }}
                                        title={item.status || "Status"}
                                    />
                                    <span className="truncate max-w-28" title={item.versionName}>
                                        {item.versionName}
                                    </span>
                                </div>

                                {showDeleteButton && isSelected && !isStatusCompleted && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openConfirmationModal(item.assetVersionID, item.versionName);
                                        }}
                                        className="ml-2 text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete version"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" 
                                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                );

            })}

            {versionList.length < 7 && (
                <div
                    onClick={() => handleSave(1)}
                    className='group relative flex items-center justify-center w-10 h-[42px] rounded-t-md hover:bg-gray-100 cursor-pointer transition-all -bottom-[1px]'
                >
                    {versionList.length > 0 &&
                        <FaPlus
                            className="text-[#01a982] group-hover:scale-110 transition-transform"
                            size={14}
                        />
                    }
                    <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 -top-10 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-sm py-1 px-3 rounded whitespace-nowrap">
                        Add New Version
                    </div>
                </div>
            )}
        </div>
    );
};

export default VersionManager; 