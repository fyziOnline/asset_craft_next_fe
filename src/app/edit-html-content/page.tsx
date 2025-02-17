'use client';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Button from '@/components/global/Button';
import AddVersionModel from './components/AddVersionModel';
import { useEditHTMLContent } from '@/hooks/useEditHTMLContent';
import EditContentModel from './components/EditContentModel';
import { useRouter } from 'next/navigation';
import ShadowDomContainer from './components/ShadowDomContainer';
import { AssetBlockProps } from '@/types/templates';
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

// Add a new interface for the version to delete
interface VersionToDelete {
    id: string;
    name: string;
}

const Page = () => {
    const { contextData } = useAppData();
    const router = useRouter();

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false); // State to toggle feedback visibility
    const [assetType, setAssetType] = useState<string>("")
    const [isConfirmModel, setIsConfirmModel] = useState<boolean>(false)
    const [versionToDelete, setVersionToDelete] = useState<VersionToDelete | null>(null);

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

    const htmlOtherAsset = () => {
        let htmlContent = '';
        versionSelected.assetVersionBlocks.forEach((item) => {
            if (item.blockName === '_global_1') {
                htmlContent += `
                    <div style="position:relative;">
                        <div style="position:absolute; top:0; right:8px; z-index:20;">
                            <div id="handle-button" data-block-id="${item.assetVersionBlockID}" data-type-div="edit">
                                ${item.blockHTMLGenerated || ""}
                            </div>
                        </div>
                    </div>\n`;
            } else if ((item.blockData !== "{}" && item.blockData !== "" && item.blockHTMLGenerated)) {
                htmlContent += (item.ignoreBlock === 0 ? `
                    <div style="position:relative;">
                        <div style="right: ${assetType === "Landing Page" ? "-140px" : assetType === "LinkedIn" ? "-120px" : "-140px"};  z-index:20; position:absolute; display:flex; align-items:center; gap: 2px; background-color: #f9f9f9; border: 2px dashed #ccc; border-radius: 5px; padding:4px 8px;">
                             <div id="handle-button" data-block-id="${item.assetVersionBlockID}" data-type-div="edit"
                                style="display: flex; align-items: center; justify-content: center; width: 35px; height: 35px; cursor: pointer; border-right: 2px solid #ccc; padding-right: 5px; position: relative;"
                                onmouseover="this.querySelectorAll('svg path').forEach(p => p.setAttribute('stroke', '#01a982')); this.querySelector('.tooltip').style.visibility = 'visible'; this.querySelector('.tooltip').style.opacity = '1';"
                                onmouseout="this.querySelectorAll('svg path').forEach(p => p.setAttribute('stroke', '#b8b8b8')); this.querySelector('.tooltip').style.visibility = 'hidden'; this.querySelector('.tooltip').style.opacity = '0';">
                                <span class="tooltip" style="visibility: hidden; opacity: 0; position: absolute; top: -35px; left: 50%; transform: translateX(-50%); background-color: #b8b8b8; color: white; font-size: 12px; padding: 4px 8px; border-radius: 4px; white-space: nowrap; transition: opacity 0.2s;">
                                    Edit
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 39 39" fill="none">
                                    <path d="M17.875 6.5H6.5C5.63805 6.5 4.8114 6.84241 4.2019 7.4519C3.59241 8.0614 3.25 8.88805 3.25 9.75V32.5C3.25 33.362 3.59241 34.1886 4.2019 34.7981C4.8114 35.4076 5.63805 35.75 6.5 35.75H29.25C30.112 35.75 30.9386 35.4076 31.5481 34.7981C32.1576 34.1886 32.5 33.362 32.5 32.5V21.125"
                                        stroke="#b8b8b8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M30.0625 4.06433C30.709 3.41787 31.5858 3.05469 32.5 3.05469C33.4142 3.05469 34.291 3.41787 34.9375 4.06433C35.584 4.7108 35.9471 5.58759 35.9471 6.50183C35.9471 7.41607 35.584 8.29287 34.9375 8.93933L19.5 24.3768L13 26.0018L14.625 19.5018L30.0625 4.06433Z"
                                        stroke="#b8b8b8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
    
                            <div id="handle-button" data-block-id="${item.assetVersionBlockID}" data-type-div="hidden-block"
                                style="display: flex; align-items: center; justify-content: center; width: 35px; height: 35px; cursor: pointer; position: relative;"
                                data-ignore-block="${item.ignoreBlock}"
                                onmouseover="this.querySelectorAll('svg path').forEach(p => { p.setAttribute('stroke', '#01a982'); p.setAttribute('fill', '#01a982'); }); this.querySelector('.tooltip').style.visibility = 'visible'; this.querySelector('.tooltip').style.opacity = '1';"
                                onmouseout="this.querySelectorAll('svg path').forEach(p => { p.setAttribute('stroke', '#b8b8b8'); p.setAttribute('fill', '#b8b8b8'); }); this.querySelector('.tooltip').style.visibility = 'hidden'; this.querySelector('.tooltip').style.opacity = '0';">
                                <span class="tooltip" style="visibility: hidden; opacity: 0; position: absolute; top: -35px; left: 50%; transform: translateX(-50%); background-color: #b8b8b8; color: white; font-size: 12px; padding: 4px 8px; border-radius: 4px; white-space: nowrap; transition: opacity 0.2s;">
                                    Hide
                                </span>
                                <svg clipRule="evenodd" width="33" height="33" fill-rule="evenodd" stroke-linejoin="round"
                                    stroke-miterlimit="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m32.513 13.926c10.574.15 19.141 9.894 23.487 18.074 0 0-1.422 2.892-2.856 4.895-.694.969-1.424 1.913-2.191 2.826-.547.65-1.112 1.283-1.698 1.898-5.237 5.5-12.758 9.603-20.7 8.01-8.823-1.77-15.732-9.498-20.058-17.629 0 0 1.248-2.964 2.69-4.964.646-.897 1.324-1.77 2.034-2.617.544-.649 1.108-1.282 1.691-1.897 4.627-4.876 10.564-8.63 17.601-8.596zm-.037 4c-5.89-.022-10.788 3.267-14.663 7.35-.527.555-1.035 1.127-1.527 1.713-.647.772-1.265 1.569-1.854 2.386-.544.755-1.057 1.805-1.451 2.59 3.773 6.468 9.286 12.323 16.361 13.742 6.563 1.317 12.688-2.301 17.016-6.846.529-.555 1.04-1.128 1.534-1.715.7-.833 1.366-1.694 1.999-2.579.557-.778 1.144-1.767 1.588-2.567-3.943-6.657-10.651-13.944-19.003-14.074z"
                                        stroke="#b8b8b8" fill="#b8b8b8"/>
                                    <path d="m32.158 23.948c4.425 0 8.018 3.593 8.018 8.017 0 4.425-3.593 8.017-8.018 8.017-4.424 0-8.017-3.592-8.017-8.017 0-4.424 3.593-8.017 8.017-8.017zm0 4.009c2.213 0 4.009 1.796 4.009 4.008 0 2.213-1.796 4.009-4.009 4.009-2.212 0-4.008-1.796-4.008-4.009 0-2.212 1.796-4.008 4.008-4.008z"
                                        stroke="#b8b8b8" fill="#b8b8b8"/>
                                </svg>
                            </div>
                        </div>
                        ${item.blockHTMLGenerated}
                    </div> \n` : `
                    <div style="position:relative;">
                        <div style="right:-90px; top:-5px; z-index:20; position:absolute; display:flex;  margin: -12px 0px;">
                            <div id="handle-button" style="cursor: pointer; background-color: #f9f9f9; border: 2px dashed #ccc; border-radius: 5px;" data-block-id="${item.assetVersionBlockID}" data-type-div="hidden-block" data-ignore-block="${item.ignoreBlock}"
                                onmouseover="this.querySelector('.tooltip').style.visibility = 'visible'; this.querySelector('.tooltip').style.opacity = '1';"
                                onmouseout="this.querySelector('.tooltip').style.visibility = 'hidden'; this.querySelector('.tooltip').style.opacity = '0';">
                                <span class="tooltip" style="visibility: hidden; opacity: 0; position: absolute; top: -35px; left: 50%; transform: translateX(-50%); background-color: #b8b8b8; color: white; font-size: 12px; padding: 4px 8px; border-radius: 4px; white-space: nowrap; transition: opacity 0.2s;">
                                    Show
                                </span>
                                <svg clipRule="evenodd" width="43" height="43" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m-960-256h1280v800h-1280z" fill="none" /><path d="m13.673 10.345-3.097 3.096 39.853 39.854 3.097-3.097z" />
                                    <path d="m17.119 19.984 2.915 2.915c-3.191 2.717-5.732 6.099-7.374 9.058l-.005.01c4.573 7.646 11.829 14.872 20.987 13.776 2.472-.296 4.778-1.141 6.885-2.35l2.951 2.95c-4.107 2.636-8.815 4.032-13.916 3.342-9.198-1.244-16.719-8.788-21.46-17.648 2.226-4.479 5.271-8.764 9.017-12.053zm6.63-4.32c2.572-1.146 5.355-1.82 8.327-1.868.165-.001 2.124.092 3.012.238.557.092 1.112.207 1.659.350 8.725 2.273 15.189 10.054 19.253 17.653-1.705 3.443-3.938 6.398-6.601 9.277l-2.827-2.827c1.967-2.12 3.622-4.161 4.885-6.45 0 0-1.285-2.361-2.248-3.643-.619-.824-1.27-1.624-1.954-2.395-.54-.608-2.637-2.673-3.136-3.103-3.348-2.879-7.279-5.138-11.994-5.1-1.826.029-3.582.389-5.249.995z" fill-rule="nonzero" />
                                    <path d="m25.054 27.92 2.399 2.398c-.157.477-.243.987-.243 1.516 0 2.672 2.169 4.841 4.841 4.841.529 0 1.039-.085 1.516-.243l2.399 2.399c-1.158.65-2.494 1.02-3.915 1.02-4.425 0-8.017-3.592-8.017-8.017 0-1.421.371-2.756 1.02-3.914zm6.849-4.101c.049-.001.099-.002.148-.002 4.425 0 8.017 3.593 8.017 8.017 0 .05 0 .099-.001.148z" />
                                </svg>
                            </div>
                        </div>
                        <div style="height:40px;"></div>
                    </div>\n`);
            } else {
                htmlContent += item.blockHTMLGenerated ?? "";
            }
        });

        return versionSelected.layoutHTMLGenerated?.replace("[(blocks)]", htmlContent) || '<div>An error occurred, please try again later.</div>';
    };

    const handleClickEdit = (event: Event) => {
        const target = event.target as HTMLElement;

        const container = target.id === "handle-button"
            ? target
            : target.closest("#handle-button") as HTMLElement;

        if (container) {
            const assetVersionBlockID = container.dataset.blockId;
            const typeDiv = container.dataset.typeDiv
            if (typeDiv === "edit") {
                const section = versionSelected.assetVersionBlocks.find((item) => item.assetVersionBlockID === assetVersionBlockID);
                if (section) {
                    setSectionEdit(section)
                    setIsShowModelEdit(true)
                } else {
                    alert(`Error selecting edit section, please try again later`);
                }
            } else if (typeDiv === "hidden-block") {
                const ignoreBlock = container.dataset.ignoreBlock
                handleHideBlock(assetVersionBlockID || "", ignoreBlock as unknown as number)
            }
        }
    };

    const renderHTMLSelect = useMemo(() => {
        if (!versionSelected?.assetVersionBlocks) {
            return null;
        }

        // render other layout 
        const listLayout = ["landing", "linkedin", "callscript"]
        const hasMatchLayoutName = listLayout.some(substring => contextData.AssetHtml?.layoutName?.toLowerCase().includes(substring.toLowerCase()));
        
        const globalBlock = versionSelected.assetVersionBlocks.find(item => item.blockName === '_global_1' && item.blockData !== "{}" && item.blockData !== "");
        
        if (hasMatchLayoutName) {
            return (
                <div className='flex justify-center relative isolate'>
                    {globalBlock && (
                        <GlobalEditButton 
                            onClick={() => {
                                setSectionEdit(globalBlock);
                                setIsShowModelEdit(true);
                            }}
                        />
                    )}
                    <ShadowDomContainer 
                        onClick={handleClickEdit} 
                        htmlContent={htmlOtherAsset()}
                    />
                </div>
            );
        }

        // render email layout
        return (versionSelected.assetVersionBlocks.map((item, idx) => {
            return (
                <div key={idx} >
                    {(item.blockData !== "{}" && item.blockData !== "" && item.blockName!='_global_1' && item.ignoreBlock === 0) ? <div className={`flex w-[100%] items-center justify-center absolute ml-[295px] mt-4`} >
                        <div className='flex bg-[#f9f9f9b9] rounded-md border-[2px] border-dashed border-gray-300 border-opacity-70 py-1'>
                            <div className='cursor-pointer pl-2 flex justify-center items-center border-r-2 pr-1 group relative'
                                onClick={() => {
                                    setSectionEdit(item)
                                    setIsShowModelEdit(true)
                                }}>
                                {/* Edit icon tooltip */}
                                <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-300 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                    Edit
                                </span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="33"
                                    height="25"
                                    viewBox="0 0 39 39"
                                    fill="none"
                                    data-id="101"
                                    className="stroke-gray-300 hover:stroke-green-300 transition-colors duration-200"
                                >
                                    <path d="M17.875 6.5H6.5C5.63805 6.5 4.8114 6.84241 4.2019 7.4519C3.59241 8.0614 3.25 8.88805 3.25 9.75V32.5C3.25 33.362 3.59241 34.1886 4.2019 34.7981C4.8114 35.4076 5.63805 35.75 6.5 35.75H29.25C30.112 35.75 30.9386 35.4076 31.5481 34.7981C32.1576 34.1886 32.5 33.362 32.5 32.5V21.125" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M30.0625 4.06433C30.709 3.41787 31.5858 3.05469 32.5 3.05469C33.4142 3.05469 34.291 3.41787 34.9375 4.06433C35.584 4.7108 35.9471 5.58759 35.9471 6.50183C35.9471 7.41607 35.584 8.29287 34.9375 8.93933L19.5 24.3768L13 26.0018L14.625 19.5018L30.0625 4.06433Z" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <div className='cursor-pointer pl-1 pr-2 group relative'
                                onClick={() => { handleHideBlock(item.assetVersionBlockID, item.ignoreBlock) }}>
                                {/* Hide icon tooltip */}
                                <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-300 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                    Hide
                                </span>
                                <svg
                                    clipRule="evenodd"
                                    width="33"
                                    height="33"
                                    fillRule="evenodd"
                                    strokeLinejoin="round"
                                    strokeMiterlimit="2"
                                    viewBox="0 0 64 64"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="stroke-gray-300 hover:stroke-green-300 fill-gray-300 hover:fill-green-300 transition-colors duration-200"
                                >
                                    <path d="m-896-256h1280v800h-1280z" fill="none" />
                                    <path d="m32.513 13.926c10.574.15 19.141 9.894 23.487 18.074 0 0-1.422 2.892-2.856 4.895-.694.969-1.424 1.913-2.191 2.826-.547.65-1.112 1.283-1.698 1.898-5.237 5.5-12.758 9.603-20.7 8.01-8.823-1.77-15.732-9.498-20.058-17.629 0 0 1.248-2.964 2.69-4.964.646-.897 1.324-1.77 2.034-2.617.544-.649 1.108-1.282 1.691-1.897 4.627-4.876 10.564-8.63 17.601-8.596zm-.037 4c-5.89-.022-10.788 3.267-14.663 7.35-.527.555-1.035 1.127-1.527 1.713-.647.772-1.265 1.569-1.854 2.386-.544.755-1.057 1.805-1.451 2.59 3.773 6.468 9.286 12.323 16.361 13.742 6.563 1.317 12.688-2.301 17.016-6.846.529-.555 1.04-1.128 1.534-1.715.7-.833 1.366-1.694 1.999-2.579.557-.778 1.144-1.767 1.588-2.567-3.943-6.657-10.651-13.944-19.003-14.074z" />
                                    <path d="m32.158 23.948c4.425 0 8.018 3.593 8.018 8.017 0 4.425-3.593 8.017-8.018 8.017-4.424 0-8.017-3.592-8.017-8.017 0-4.424 3.593-8.017 8.017-8.017zm0 4.009c2.213 0 4.009 1.796 4.009 4.008 0 2.213-1.796 4.009-4.009 4.009-2.212 0-4.008-1.796-4.008-4.009 0-2.212 1.796-4.008 4.008-4.008z" />
                                </svg>
                            </div>
                        </div>

                    </div> : 
                        (item.blockName =='_global_1' && item.blockData !== "{}" && item.blockData !== "") ?
                            <GlobalEditButton 
                                onClick={() => {
                                    setSectionEdit(item);
                                    setIsShowModelEdit(true);
                                }}
                            />
                        : null
                    }
                    {item.ignoreBlock === 0 ? <ShadowDomContainer htmlContent={item.blockHTMLGenerated || ""}></ShadowDomContainer> :
                        <div>
                            <div className={`flex w-[100%] justify-center absolute ml-[275px] mt-[3px]`} >
                                <div className='bg-[#f9f9f9] rounded-md border-[2.2px] border-dotted border-gray-300 cursor-pointer group relative' onClick={() => { handleHideBlock(item.assetVersionBlockID, item.ignoreBlock) }}>
                                    <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-300 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50">
                                        Show
                                    </span>
                                    <svg clipRule="evenodd" width="35" height="35" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                        <path d="m-960-256h1280v800h-1280z" fill="none" />
                                        <path d="m13.673 10.345-3.097 3.096 39.853 39.854 3.097-3.097z" fill="#cfcfcf" stroke="#cfcfcf" />
                                        <path d="m17.119 19.984 2.915 2.915c-3.191 2.717-5.732 6.099-7.374 9.058l-.005.01c4.573 7.646 11.829 14.872 20.987 13.776 2.472-.296 4.778-1.141 6.885-2.35l2.951 2.95c-4.107 2.636-8.815 4.032-13.916 3.342-9.198-1.244-16.719-8.788-21.46-17.648 2.226-4.479 5.271-8.764 9.017-12.053zm6.63-4.32c2.572-1.146 5.355-1.82 8.327-1.868.165-.001 2.124.092 3.012.238.557.092 1.112.207 1.659.350 8.725 2.273 15.189 10.054 19.253 17.653-1.705 3.443-3.938 6.398-6.601 9.277l-2.827-2.827c1.967-2.12 3.622-4.161 4.885-6.45 0 0-1.285-2.361-2.248-3.643-.619-.824-1.27-1.624-1.954-2.395-.54-.608-2.637-2.673-3.136-3.103-3.348-2.879-7.279-5.138-11.994-5.1-1.826.029-3.582.389-5.249.995z" fill="#cfcfcf" stroke="#cfcfcf" fillRule="nonzero" />
                                        <path d="m25.054 27.92 2.399 2.398c-.157.477-.243.987-.243 1.516 0 2.672 2.169 4.841 4.841 4.841.529 0 1.039-.085 1.516-.243l2.399 2.399c-1.158.65-2.494 1.02-3.915 1.02-4.425 0-8.017-3.592-8.017-8.017 0-1.421.371-2.756 1.02-3.914zm6.849-4.101c.049-.001.099-.002.148-.002 4.425 0 8.017 3.593 8.017 8.017 0 .05 0 .099-.001.148z" fill="#cfcfcf" stroke="white" />
                                    </svg>
                                </div>
                            </div>
                            <div className='h-10' />
                        </div>
                    }
                </div>
            )
        }))
    }, [versionSelected])

    return (
        <Suspense>
            <div className='overflow-hidden'>
                <div className="flex p-1 px-2">
                    <div className='flex-1'></div>
                </div>
                
                <div className="min-h-[82vh] border-t border-solid">
                    <EditHeader 
                        versionSelected={versionSelected}
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

                    <div className="flex h-[92vh] relative mx-14">
                        <div className="flex flex-col bg-[#e4e4e4] flex-grow pb-10 overflow-x-hidden overflow-y-scroll scrollbar-hide relative">
                            <div className='px-[6rem]'>
                                <div id="container">
                                    <div className="h-[20px]" />
                                    {renderHTMLSelect}
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

                        {isFeedbackOpen && (
                            <div
                                className={`fixed md:relative top-0 right-0 bg-white md:w-[25%]  feedback-panel ${isFeedbackOpen ? "block" : "hidden "
                                    }`}
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
                </div>
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
            </div>
        </Suspense>
    );
};

export default Page;