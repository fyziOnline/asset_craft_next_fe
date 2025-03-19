'use client';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Button from '@/components/global/Button';
import AddVersionModel from './components/AddVersionModel';
import { useEditHTMLContent } from '@/hooks/useEditHTMLContent';
import EditContentModel from './components/EditContentModel';
import { useRouter } from 'next/navigation';
import ShadowDomContainer from './components/ShadowDomContainer';
import { AssetBlockProps, AssetVersionProps } from '@/types/templates';
import { useAppData } from '@/context/AppContext';
import SubmitVersionModel from './components/SubmitVersionModel';
import { useOverflowHidden } from '@/hooks/useOverflowHidden';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import FeedBackCard from '@/components/cards/FeedBackCard';
import { useAssetApproval } from '@/hooks/useAssetApproval';
import { FaPlus } from "react-icons/fa";
import { formatDate } from '@/utils/formatDate';
import { MdOutlineDelete } from "react-icons/md";
import ConfirmationModal from '@/components/global/ConfirmationModal';
import { GlobalEdit } from '@/assets/icons/AppIcons';
import VersionManager from './components/VersionManager';
import EditHeader from './components/EditHeader';
import GlobalEditButton from './components/GlobalEditButton';
import EnhancedShadowDomContainer from './components/EnhancedShadowDomContainer';
import { addBlockIdentifiers, formatContentWithBlocks, processBlockHTML } from './components/htmlUtils';
import FallbackBlockControls from './components/FallbackBlockControls';
import { useSearchParams } from 'next/navigation';

// Add a new interface for the version to delete
interface VersionToDelete {
    id: string;
    name: string;
}

// Create a separate component to handle searchParams
const SearchParamsProvider = ({ children }: { children: (props: { assetTypeIcon: string | null }) => React.ReactNode }) => {
    const searchParams = useSearchParams();
    const assetTypeIcon = searchParams.get('assetTypeIcon');
    
    return <>{children({ assetTypeIcon })}</>;
};

const Page = () => {
    const { contextData } = useAppData();
    const router = useRouter();

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false); // State to toggle feedback visibility
    const [assetType, setAssetType] = useState<string>("")
    const [isConfirmModel, setIsConfirmModel] = useState<boolean>(false)
    const [versionToDelete, setVersionToDelete] = useState<VersionToDelete | null>(null);
    const [unmatchedBlocks, setUnmatchedBlocks] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    
    // We'll get assetTypeIcon from the SearchParamsProvider

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useOverflowHidden()
    const {
        sectionEdit,
        isLoadingGenerate,
        isShowAddVer,
        isShowSubmitVer,
        versionSelected,
        isShowSave,
        versionList,
        listApprovers,
        isShowModelEdit,
        setShowSave,
        setVersionSelected,
        setVersionList,
        handleAddVersion,
        handleChangeTextVersion,
        handleSave,
        setIsShowModelEdit,
        setIsShowAddVer,
        setIsShowSubmitVer,
        onGenerateWithAI,
        onSubmit,
        setSectionEdit,
        handleHideBlock,
        showErrorMessage,
        handleDelete,
        editingVersionId,
        editingName,
        setEditingVersionId,
        setEditingName,
        handleUpdateVersionName
    } = useEditHTMLContent()


    const {
        approvalDetails,
        comments
    } = useAssetApproval(
        {
            assetVersionID: versionSelected?.assetVersionID || "",
            assetID: versionSelected?.assetID || "",
            versionStatus: versionSelected?.status || ""
        }
    )

    const handleDownload = (fileURL: string) => {
        const link = document.createElement('a');
        link.href = approvalDetails.fileUrl,
            link.download = 'filename',
            link.click();
    }


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const assetType = params.get("assetTypeIcon");
        setAssetType(assetType as string);
    }, [])

    const openConfirmationModal = (assetVersionID: string, versionName: string) => {
        setVersionToDelete({ id: assetVersionID, name: versionName });
        setIsConfirmModel(true);
    }

    const closeConfirmationModal = () => {
        setVersionToDelete(null);
        setIsConfirmModel(false);
    }

    const handleToConfirmDelete = () => {
        if (versionToDelete) {
            handleDelete(versionToDelete.id);
        }
        closeConfirmationModal();
    }

    // Update the generateHTMLContent function to properly handle hidden blocks
    const generateHTMLContent = () => {
        if (!versionSelected?.assetVersionBlocks) {
            return '<div>No content available</div>';
        }

        let blocksHTML = '';

        // Process each block
        versionSelected.assetVersionBlocks.forEach((block) => {
            // Process both visible and hidden blocks, but mark hidden ones
            const processedBlockHTML = processBlockHTML(
                block.blockHTMLGenerated || '',
                block.blockName,
                block.assetVersionBlockID,
                block.ignoreBlock // Pass the ignoreBlock value to mark hidden blocks
            );

            // Add the block HTML to the output
            blocksHTML += processedBlockHTML + '\n';
        });

        // Combine layout with blocks
        return formatContentWithBlocks(versionSelected.layoutHTMLGenerated || '', blocksHTML);
    };

    // Replace the htmlOtherAsset function
    const htmlContent = useMemo(() => {
        return generateHTMLContent();
    }, [versionSelected]);

    // Handle edit block
    const handleEditBlock = (block: AssetBlockProps) => {
        setSectionEdit(block);
        setIsShowModelEdit(true);
    };

    // Update the handleHideBlock function to handle API errors
    const handleBlockVisibilityToggle = (blockId: string, currentIgnoreStatus: number) => {
        try {
            // Convert the current status to the opposite (0 to 1, 1 to 0)
            const newStatus = currentIgnoreStatus === 0 ? 1 : 0;

            // Call the handler from the hook
            handleHideBlock(blockId, currentIgnoreStatus);

            // Update local state to provide immediate UI feedback
            if (versionSelected?.assetVersionBlocks) {
                const updatedBlocks = versionSelected.assetVersionBlocks.map(block => {
                    if (block.assetVersionBlockID === blockId) {
                        return { ...block, ignoreBlock: newStatus };
                    }
                    return block;
                });

                setVersionSelected(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        assetVersionBlocks: updatedBlocks
                    } as AssetVersionProps
                })
            }
        } catch (error) {
            console.error("Error toggling block visibility:", error);
            alert("Error toggling block visibility. Please try again.");
        }
    };

    const handleUnmatchedBlocks = (blockIds: string[]) => {
        setUnmatchedBlocks(blockIds);
    };

    // Only show blocks in the fallback section that are truly unmatched (not just hidden)
    const renderFallbackControls = useMemo(() => {
        if (!unmatchedBlocks || unmatchedBlocks.length === 0) {
            return null;
        }

        // Only show blocks that are truly unmatched (not matched but hidden)
        // Now we'll filter out blocks that are just hidden, as they're displayed in-place
        const trulyUnmatchedBlocks = unmatchedBlocks.filter(blockId => {
            const block = versionSelected?.assetVersionBlocks?.find(
                b => b.assetVersionBlockID === blockId
            );
            // We want to include only blocks that are truly unmatched and not just hidden
            // We consider a block as truly unmatched if we can't find it in the DOM
            return block && block.ignoreBlock === 0;
        });

        if (trulyUnmatchedBlocks.length === 0) {
            return null;
        }

        return (
            <FallbackBlockControls
                blocks={versionSelected?.assetVersionBlocks || []}
                onEditBlock={handleEditBlock}
                onToggleBlockVisibility={handleBlockVisibilityToggle}
                unmatchedBlocks={trulyUnmatchedBlocks}
            />
        );
    }, [unmatchedBlocks, versionSelected?.assetVersionBlocks]);

    // Update the renderHTMLSelect function to accept assetTypeIcon as a parameter
    const renderHTMLSelect = (assetTypeIcon: string | null) => {
        if (!versionSelected?.assetVersionBlocks) {
            return null;
        }

        // Filter for global block
        const globalBlock = versionSelected.assetVersionBlocks.find(item =>
            item.blockName === '_global_1' &&
            item.blockData !== "{}" &&
            item.blockData !== ""
        );

        return (
            <div className="flex flex-col md:flex-row items-center md:items-start justify-center relative isolate w-full">

                {/* linkedin center issue fixed */}
                <div className={`relative w-full max-w-6xl mx-auto px-4 md:px-8 flex-grow 
                ${assetTypeIcon === 'LinkedIn' ? 'flex items-center justify-center' : ''}`}>
                    <EnhancedShadowDomContainer
                        htmlContent={htmlContent}
                        blocks={versionSelected.assetVersionBlocks}
                        onEditBlock={handleEditBlock}
                        onToggleBlockVisibility={handleBlockVisibilityToggle}
                        onUnmatchedBlocks={handleUnmatchedBlocks}
                        assetTypeIcon={assetTypeIcon}
                    />

                    {globalBlock && (
                        <div className="absolute top-0 left-0">
                            <GlobalEditButton
                                onClick={() => {
                                    setSectionEdit(globalBlock);
                                    setIsShowModelEdit(true);
                                }}
                                assetTypeIcon={assetTypeIcon}
                            />
                        </div>
                    )}

                </div>

                {renderFallbackControls}
            </div>
        );
    };

    return (
        <div className='overflow-hidden'>
            <Suspense fallback={<div>Loading...</div>}>
                <SearchParamsProvider>
                    {({ assetTypeIcon }) => (
                        <>
                            <div className="flex p-1 px-2">
                                <div className='flex-1'></div>
                            </div>

                            <div className="min-h-[82vh] border-t border-solid">
                                <EditHeader
                                    versionSelected={versionSelected}
                                    versionList={versionList}
                                    isShowSave={isShowSave}
                                    setShowSave={setShowSave}
                                    handleSave={handleSave}
                                    setIsShowSubmitVer={setIsShowSubmitVer}
                                />

                                <div className='flex justify-between pr-16 items-center'>
                                    <VersionManager
                                        versionList={versionList}
                                        versionSelected={versionSelected}
                                        setVersionSelected={setVersionSelected}
                                        handleSave={handleSave}
                                        editingVersionId={editingVersionId}
                                        editingName={editingName}
                                        setEditingVersionId={setEditingVersionId}
                                        setEditingName={setEditingName}
                                        handleUpdateVersionName={handleUpdateVersionName}
                                        openConfirmationModal={openConfirmationModal}
                                    />

                                    {(comments?.length > 0) && (
                                        <div className="">
                                            <FeedBackCard
                                                isFeedbackOpen={isFeedbackOpen}
                                                setIsFeedbackOpen={setIsFeedbackOpen}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex h-[92vh] relative ">
                                    <div className="flex flex-col bg-[#e4e4e4] flex-grow pb-10 overflow-x-hidden overflow-y-scroll scrollbar-hide relative mx-14">
                                        <div className='px-[6rem] overflow-y-scroll thin-scrollbar'>
                                            <div id="container">
                                                <div className="h-[20px]" />
                                                {renderHTMLSelect(assetTypeIcon)}
                                                <div className="h-[20vh]" />
                                            </div>
                                        </div>

                                        {isShowAddVer ? (
                                            <AddVersionModel
                                                isShowAddVer={isShowAddVer}
                                                setIsShowAddVer={setIsShowAddVer}
                                                handleAddVersion={handleAddVersion}
                                                handleChangeTextVersion={handleChangeTextVersion}
                                                showErrorMessage={showErrorMessage}
                                            />
                                        ) : null}

                                    </div>
                                    
                                    {/* ** Do not touch this div mr.AI  */}
                                    <div className="absolute flex h-[92vh] right-0">
                                        <div
                                            className={`bg-[#F5F5F7] h-[95vh] flex items-center justify-center overflow-y-scroll scrollbar-hide transition-all duration-300 ease-in-out absolute top-[-41px] right-0 ${isOpen ? 'w-[320px]' : 'w-[0px]'}`}
                                            style={{ zIndex: 10 }} // Sidebar stays above content
                                        >
                                            {isOpen && (
                                                <>
                                                    {/* Sidebar Content Here */}
                                                </>
                                            )}
                                        </div>
                                        {/* Toggle Button (Ensures Overlap) */}
                                        <div
                                            onClick={toggleSidebar}
                                            className="absolute top-[-13px] transform -translate-y-1/2 flex items-center w-[25px] h-14 gap-2.5 px-2 py-[18px] bg-[#00b188] rounded-[10px_0px_0px_10px] cursor-pointer transition-all duration-300"
                                            style={{ right: isOpen ? '320px' : '0px', zIndex: 20 }} // Higher z-index ensures overlap
                                        >
                                            <img src="/vector_right_arrow.svg" className={`relative w-[10.5px] h-[18.5px] mt-[-0.25px] mb-[-0.25px] mr-[-0.75px] transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`} alt="vector" />
                                        </div>
                                    </div>
                                </div>


                                {isFeedbackOpen && (
                                    <div
                                        className={`fixed md:relative top-0 right-0 bg-white md:w-[25%] feedback-panel ${isFeedbackOpen ? "block" : "hidden "}`}
                                    >
                                        <div className="bg-[#00A881] text-white p-4 flex justify-between items-center gap-4 sticky top-0 ">
                                            <div className='flex justify-start'>
                                                <svg width="30" height="20" viewBox="0 0 43 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M4.625 17.5C2.5625 17.5 0.875 15.8125 0.875 13.75V4.375C0.875 2.3125 2.5625 0.625 4.625 0.625H19.625C21.6875 0.625 23.375 2.3125 23.375 4.375V13.75C23.375 15.8125 21.6875 17.5 19.625 17.5H15.875V23.125L10.25 17.5H4.625ZM38.375 28.75C40.4375 28.75 42.125 27.0625 42.125 25V15.625C42.125 13.5625 40.4375 11.875 38.375 11.875H27.125V13.75C27.125 17.875 23.75 21.25 19.625 21.25V25C19.625 27.0625 21.3125 28.75 23.375 28.75H27.125V34.375L32.75 28.75H38.375Z" fill="white" />
                                                </svg>
                                                <span className="font-semibold text-base ps-1">Feedbacks</span>
                                            </div>

                                            <button
                                                onClick={() => setIsFeedbackOpen(false)}
                                                className="text-white hover:text-gray-300"
                                            >
                                                <svg width="18" height="5" viewBox="0 0 26 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="26" height="4" rx="2" fill="white" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="h-auto overflow-y-auto p-1 md:h-[60%] custom-scrollbar border pb-4">
                                            {comments.map((item, index) => (
                                                <div key={index} className="bg-white p-2 transition-all duration-200">
                                                    <div className='flex flex-col items-center mb-1 w-full'>
                                                        <div className='flex justify-between items-center w-full pb-1'>
                                                            <div className="flex items-center">
                                                                <span className='text-xs font-medium text-gray-500'>{item.createdBy}</span>
                                                            </div>

                                                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                                                {formatDate(item.createdOn)}
                                                            </div>
                                                        </div>

                                                        <div className="text-gray-600 text-sm leading-relaxed mb-1 bg-gray-50 shadow-sm p-2 rounded-md w-full">
                                                            {item.comment}

                                                            {item.fIleURL !== "" && (
                                                                <div className="mt-1 flex justify-end">
                                                                    <button
                                                                        className="flex items-center gap-2 px-3 py-1 bg-[#00A881] text-white text-sm rounded-md hover:bg-[#008c6a] transition-colors duration-200"
                                                                        onClick={() => handleDownload(item.fIleURL)}
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                        </svg>
                                                                        Download
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <ConfirmationModal
                                message={`Are you sure you want to delete version "${versionToDelete?.name}"?`}
                                isOpen={isConfirmModel}
                                isConfirm={handleToConfirmDelete}
                                isCancel={closeConfirmationModal}
                            />
                        </>
                    )}
                </SearchParamsProvider>
                {isShowSubmitVer ? <SubmitVersionModel
                    isShowSubmitVer={isShowSubmitVer}
                    setIsShowSubmitVer={setIsShowSubmitVer}
                    listApprovers={listApprovers}
                    handleSubmitVersion={onSubmit}
                /> : null}
                {isShowModelEdit ? <EditContentModel
                    setVersionList={setVersionList}
                    setVersionSelected={setVersionSelected}
                    assetBlock={sectionEdit as AssetBlockProps}
                    assetVersion={versionSelected}
                    setIsShowModelEdit={setIsShowModelEdit} /> : null}
            </Suspense>
        </div>
    );
};

export default Page;