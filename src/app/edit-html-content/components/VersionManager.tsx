import React from 'react';
import { FaPlus } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { AssetVersionProps } from '@/types/templates';
import { formatDate } from '@/utils/formatDate';

// Define status color mapping
const statusColors: Record<string, string> = {
    "In Progress": "#2196F3", // Blue
    "On Review": "#FF9800", // Orange
    "Completed": "#4CAF50", // Green
};

interface VersionManagerProps {
    versionList: AssetVersionProps[];
    versionSelected: AssetVersionProps;
    setVersionSelected: (version: AssetVersionProps) => void;
    handleSave: (type: number) => void;
    editingVersionId: string | null;
    editingName: string;
    setEditingVersionId: (id: string | null) => void;
    setEditingName: (name: string) => void;
    handleUpdateVersionName: (id: string, name: string) => void;
    openConfirmationModal: (id: string, name: string) => void;
}

const VersionManager: React.FC<VersionManagerProps> = ({
    versionList,
    versionSelected,
    setVersionSelected,
    handleSave,
    editingVersionId,
    editingName,
    setEditingVersionId,
    setEditingName,
    handleUpdateVersionName,
    openConfirmationModal
}) => {
    return (
        <div className='pt-2 pl-14 flex items-center gap-1'>
            {versionList.map((item, index) => {
                const isSelected = versionSelected.assetVersionID === item.assetVersionID;
                const showDeleteButton = versionList.length > 1;
                const isEditing = editingVersionId === item.assetVersionID;
                const statusColor = item.status ? statusColors[item.status] || "#9E9E9E" : "#9E9E9E";
                const isStatusCompleted = item.status === "Completed"

                return (
                    <div
                        key={item.assetID + index}
                        onClick={() => setVersionSelected(item)}
                        onDoubleClick={(e) => {
                            if (isStatusCompleted) return;
                            if (isSelected) {
                                e.stopPropagation();
                                setEditingVersionId(item.assetVersionID);
                                setEditingName(item.versionName);
                            }
                        }}
                        className={`group relative flex items-center justify-between px-4 py-[10px] rounded-t-md cursor-pointer transition-all min-w-36 ${
                            isSelected ? "bg-[#e4e4e4] text-black" : "hover:bg-gray-100"
                        }`}
                    >
                        {isEditing ? (
                            <input
                                type="text"
                                value={editingName}
                                disabled={isStatusCompleted}
                                onChange={(e) => setEditingName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && editingName.trim()) {
                                        e.preventDefault();
                                        handleUpdateVersionName(item.assetVersionID, editingName.trim());
                                    } else if (e.key === 'Escape') {
                                        setEditingVersionId(null);
                                        setEditingName("");
                                    }
                                }}
                                onBlur={() => {
                                    setEditingVersionId(null);
                                    setEditingName("");
                                }}
                                className="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#01a982] w-full"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <>
                                <div className="flex items-center">
                                    {/* Status indicator dot */}
                                    <div 
                                        className="w-3 h-3 rounded-full mr-2" 
                                        style={{ backgroundColor: statusColor }}
                                        title={item.status || "Status not set"}
                                    />
                                    <span className={`
                                        font-medium 
                                        ${isSelected && !isStatusCompleted ? 'hover:border-b hover:border-gray-400 cursor-text' : 'cursor-pointer'}
                                    `}>
                                        {item.versionName}
                                        {isSelected && !isStatusCompleted && (
                                            <span className="ml-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                ✎
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </>
                        )}
                        {showDeleteButton && !isEditing && (
                            <div className={`ml-2 relative group/delete ${isStatusCompleted ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''}`}>
                                <MdOutlineDelete
                                    size={22}
                                    onClick={(e) => {
                                        if (isStatusCompleted) return;
                                        e.stopPropagation();
                                        openConfirmationModal(item.assetVersionID, item.versionName);
                                    }}
                                    className={`
                                        ${isSelected ? 'text-gray-500' : 'text-gray-500 opacity-0'} 
                                        group-hover:opacity-100
                                        hover:text-red-500 
                                        transition-colors duration-200
                                    `}
                                />
                                <div className="absolute invisible group-hover/delete:visible opacity-0 group-hover/delete:opacity-100 transition-all duration-200 -top-8 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                                    Delete Version
                                </div>
                            </div>
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