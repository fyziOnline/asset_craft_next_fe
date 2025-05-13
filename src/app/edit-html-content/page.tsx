'use client';

import React, { Suspense, useMemo, useState } from 'react';
import { formatContentWithBlocks, processBlockHTML } from './components/htmlUtils';
import { AssetBlockProps, AssetVersionProps } from '@/types/templates';
import { useEditHTMLContent } from '@/hooks/useEditHTMLContent';
import { useOverflowHidden } from '@/hooks/useOverflowHidden';
import { useAssetApproval } from '@/hooks/useAssetApproval';
import { useSearchParams } from 'next/navigation';
import AddVersionModel from './components/AddVersionModel';
import EditContentModel from './components/EditContentModel';
import SubmitVersionModel from './components/SubmitVersionModel';
import FeedBackCard from '@/components/cards/FeedBackCard';
import ConfirmationModal from '@/components/global/ConfirmationModal';
import VersionManager from './components/VersionManager';
import EditHeader from './components/EditHeader';
import GlobalEditButton from './components/GlobalEditButton';
import EnhancedShadowDomContainer from './components/EnhancedShadowDomContainer';
import FallbackBlockControls from './components/FallbackBlockControls';
import NotFound from '@/components/global/NotFound'
import { useEditAssetStoreSelector } from '@/store/editAssetStore';
import FeedbackPanel from './components/FeedbackPanel';
import AssetToggleAside from './components/AssetTogglAsideSection';

// Add a new interface for the version to delete
interface VersionToDelete {
    id: string;
    name: string;
}

// Create a separate component to handle search params
const SearchParamsHandler = ({ children }: {
    children: (params: {
        assetTypeIcon: string | null,
        campaign_name: string,
        project_name: string
    }) => React.ReactNode
}) => {
    const searchParams = useSearchParams();
    const assetTypeIcon = searchParams.get('assetTypeIcon');
    const campaign_name = searchParams.get('campaignName') || "";
    const project_name = searchParams.get('projectName') || "";

    if (!assetTypeIcon || !campaign_name || !project_name) {
        return (
            <NotFound
                description='Missing required URL parameters.'
            />
        )
    }

    return <>{children({ assetTypeIcon, campaign_name, project_name })}</>;
};

const Page = () => {
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isConfirmModel, setIsConfirmModel] = useState<boolean>(false);
    const [versionToDelete, setVersionToDelete] = useState<VersionToDelete | null>(null);
    const [unmatchedBlocks, setUnmatchedBlocks] = useState<string[]>([]);
    const [isShowModelEdit, setIsShowModelEdit] = useState(false)
    const [toggleStateAsideSection, setToggleSideAsideSection] = useState<boolean>(false)

    const selectedVersionID = useEditAssetStoreSelector.use.selectedVersionID()
    const versionList = useEditAssetStoreSelector.use.versionList()
    const assetHTMLData = useEditAssetStoreSelector.use.assetHTMLData()
    const updateVersionField = useEditAssetStoreSelector.use.updateVersionField()

    // const selectedVersion = versionList.find(v=>v.assetVersionID===selectedVersionID) as AssetVersionProps
    const selectedVersion = versionList[0] as AssetVersionProps

    const handleDownloadFile = (fileUrl: string) => {
        const link = document.createElement('a');
        link.href = fileUrl || approvalDetails?.fileUrl || '';
        link.download = 'feedback-attachment';
        link.click();
    };

    useOverflowHidden();
    const {
        sectionEdit,
        isShowAddVer,
        isShowSubmitVer,
        isShowSave,
        listApprovers,
        setShowSave,
        handleAddVersion,
        handleChangeTextVersion,
        handleSave,
        setIsShowAddVer,
        setIsShowSubmitVer,
        onSubmit,
        setSectionEdit,
        handleHideBlock,
        showErrorMessage,
        handleDelete,
        editingVersionId,
        setEditingVersionId,
        handleUpdateVersionName
    } = useEditHTMLContent();

    const {
        approvalDetails,
        comments,
    } = useAssetApproval({
        assetVersionID: selectedVersion?.assetVersionID || "",
        assetID: selectedVersion?.assetID || "",
        versionStatus: selectedVersion?.status || ""
    });


    const openConfirmationModal = (assetVersionID: string, versionName: string) => {
        setVersionToDelete({ id: assetVersionID, name: versionName });
        setIsConfirmModel(true);
    };

    const closeConfirmationModal = () => {
        setVersionToDelete(null);
        setIsConfirmModel(false);
    };

    const handleToConfirmDelete = () => {
        if (versionToDelete) {
            handleDelete(versionToDelete.id);
        }
        closeConfirmationModal();
    };


    // Update the generateHTMLContent function to properly handle hidden blocks
    const generateHTMLContent = () => {
        if (!selectedVersion?.assetVersionBlocks) {
            return '<div>No content available</div>';
        }
        let blocksHTML = '';
        // Process each block
        selectedVersion.assetVersionBlocks.forEach((block) => {
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
        return formatContentWithBlocks(selectedVersion.layoutHTMLGenerated || '', blocksHTML);
    };


    // Replace the htmlOtherAsset function
    const htmlContent = useMemo(() => {
        return generateHTMLContent();
    }, [selectedVersion]);

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
            if (selectedVersion?.assetVersionBlocks) {
                const updatedBlocks = selectedVersion.assetVersionBlocks.map(block => {
                    if (block.assetVersionBlockID === blockId) {
                        return { ...block, ignoreBlock: newStatus };
                    }
                    return block;
                });

                updateVersionField(selectedVersion.assetVersionID, { assetVersionBlocks: updatedBlocks })
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
            const block = selectedVersion?.assetVersionBlocks?.find(
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
                blocks={selectedVersion?.assetVersionBlocks || []}
                onEditBlock={handleEditBlock}
                onToggleBlockVisibility={handleBlockVisibilityToggle}
                unmatchedBlocks={trulyUnmatchedBlocks}
            />
        );
    }, [unmatchedBlocks, selectedVersion?.assetVersionBlocks]);

    // Update the renderHTMLSelect function to accept assetTypeIcon as a parameter
    const renderHTMLSelect = (assetTypeIcon: string | null) => {
        if (!selectedVersion?.assetVersionBlocks) {
            return null;
        }

        // Filter for global block
        const globalBlock = selectedVersion.assetVersionBlocks.find(item =>
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
                        blocks={selectedVersion.assetVersionBlocks}
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

    const renderPageContent = ({
        assetTypeIcon,
        campaign_name,
        project_name
    }: {
        assetTypeIcon: string | null,
        campaign_name: string,
        project_name: string
    }) => {
        return (
            <div className='relative'>
                <div className="flex p-1 px-2">
                    <div className='flex-1'></div>
                </div>

                <div className="min-h-[82vh] border-t border-solid">
                    <EditHeader
                        isShowSave={isShowSave}
                        setShowSave={setShowSave}
                        handleSave={handleSave}
                        setIsShowSubmitVer={setIsShowSubmitVer}
                    />

                    <div className='flex justify-between pr-16 items-center'>
                        <VersionManager
                            versionList={versionList}
                            selectedVersionID={selectedVersionID}
                            handleSave={handleSave}
                            editingVersionId={editingVersionId}
                            setEditingVersionId={setEditingVersionId}
                            handleUpdateVersionName={handleUpdateVersionName}
                            openConfirmationModal={openConfirmationModal}
                        />

                        {(comments && comments?.length > 0) && (
                            <div>
                                <FeedBackCard
                                    isFeedbackOpen={isFeedbackOpen}
                                    setIsFeedbackOpen={setIsFeedbackOpen}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex h-[92vh] relative border-red-500 border-solid">
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

                    </div>
                    <FeedbackPanel
                        comments={comments || []}
                        isOpen={isFeedbackOpen}
                        onClose={() => setIsFeedbackOpen(false)}
                        onDownloadFile={handleDownloadFile}
                    />
                </div>
                <AssetToggleAside
                    isOpen={toggleStateAsideSection}
                    setIsOpen={setToggleSideAsideSection}
                    versionSelected={selectedVersion}
                    existingAssetDetails={{
                        project_name: project_name,
                        campaign_name: campaign_name,
                        asset_name: assetHTMLData.assetName,
                        campaign_id: assetHTMLData.campaignID,
                        asset_id: assetHTMLData.assetID
                    }}
                    isEditMode={true}
                />

                <ConfirmationModal
                    message={`Are you sure you want to delete version "${versionToDelete?.name}"?`}
                    isOpen={isConfirmModel}
                    isConfirm={handleToConfirmDelete}
                    isCancel={closeConfirmationModal}
                />

                {isShowSubmitVer ? (
                    <SubmitVersionModel
                        isShowSubmitVer={isShowSubmitVer}
                        setIsShowSubmitVer={setIsShowSubmitVer}
                        listApprovers={listApprovers}
                        handleSubmitVersion={onSubmit}
                    />
                ) : null}

                {isShowModelEdit ? (
                    <EditContentModel
                        assetBlock={sectionEdit as AssetBlockProps}
                        assetVersion={selectedVersion}
                        setIsShowModelEdit={setIsShowModelEdit}
                    />
                ) : null}
            </div>
        );
    };

    return (
        <div className='overflow-hidden'>
            <Suspense fallback={<div>Loading...</div>}>
                <SearchParamsHandler>
                    {(params) => renderPageContent(params)}
                </SearchParamsHandler>
            </Suspense>
        </div>
    );
};

export default Page;