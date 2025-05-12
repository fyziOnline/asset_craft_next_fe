'use client';

import { FC, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useEditHTMLContent } from '@/hooks/useEditHTMLContent';
import { AssetBlockProps, AssetVersionProps } from '@/types/templates';
import { useOverflowHidden } from '@/hooks/useOverflowHidden';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { MdOutlineFileUpload } from "react-icons/md";
// import { MdOutlineClose } from "react-icons/md";
import { useAssetApproval } from '@/hooks/useAssetApproval';
import Button from '@/components/global/Button';
import DragAndDrop from '@/components/global/DragAndDrop';
import AddVersionModel from '../edit-html-content/components/AddVersionModel';
import EditContentModel from '../edit-html-content/components/EditContentModel';
import ShadowDomContainer from '../edit-html-content/components/ShadowDomContainer';
import FeedBackCard from '@/components/cards/FeedBackCard';
import { PeopleIcon } from '@/assets/icons/AppIcons';
import PopupCard from '@/components/global/Popup/PopupCard';
import { AiOutlineCheckCircle } from "react-icons/ai";
// import { formatDate } from '@/utils/formatDate';
import { useEditAssetStoreSelector } from '@/store/editAssetStore';
import FeedbackPanel from '../edit-html-content/components/FeedbackPanel';


const Page: FC = () => {
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false); // State to toggle feedback visibility
    
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isShowModelEdit,setIsShowModelEdit] = useState<boolean>(false)

    const selectedVersionID = useEditAssetStoreSelector.use.selectedVersionID()
    const versionList = useEditAssetStoreSelector.use.versionList()
    const assetHTMLData = useEditAssetStoreSelector.use.assetHTMLData()
    
    const versionSelected = versionList.find(v=>v.assetVersionID===selectedVersionID) as AssetVersionProps

    const handleDownloadFile = (fileUrl: string) => {
        const link = document.createElement('a');
        link.href = fileUrl || approvalDetails?.fileUrl || '';
        link.download = 'feedback-attachment';
        link.click();
      };

    const handleShowPopUp = () => {
        setShowUploadPopup((prev) => !prev)
        setIsReAssignSuccessFull(false)
    }

    useOverflowHidden()
    const {
        sectionEdit,
        isShowAddVer,
        // versionSelected,
        isShowSave,
        // isShowModelEdit,
        setShowSave,
        // setVersionSelected,
        // setVersionList,
        handleAddVersion,
        handleChangeTextVersion,
        handleSave,
        // setIsShowModelEdit,
        setIsShowAddVer,
        setSectionEdit,
        handleHideBlock,
    } = useEditHTMLContent()

    const {
        reAssignAsset,
        handleUploadFile,
        handleRemoveFile,
        setIsReAssignSuccessFull,
        approveAsset,
        canReassign,
        approvalDetails,
        reAssignLoading,
        eventInputComment,
        isReAssignSuccessFull,
        comments
    } = useAssetApproval(
        {
            assetVersionID: versionSelected?.assetVersionID || "",
            assetID: versionSelected?.assetID || "",
            versionStatus: versionSelected?.status || ""
        }
    )

    const handleReAssignToEditor = async () => {
        if (versionSelected?.assetVersionID && versionSelected?.assetID) {
            try {
                await reAssignAsset(); // Wait for the reassignment process to complete

                setShowUploadPopup(false); // Hide popup
                setShowSuccessMessage(true); // Show success message

                // Auto-hide success message after 3 seconds
                setTimeout(() => setShowSuccessMessage(false), 2000);
            } catch (error) {
                console.error("Reassignment failed:", error);
            }
        } else {
            console.error("Invalid versionSelected data");
        }
    };

    const htmlOtherAsset = () => {
        let htmlContent = ''
        versionSelected.assetVersionBlocks.forEach((item) => {
            if ((item.blockData !== "{}" && item.blockData !== "" && item.blockHTMLGenerated)) {
                htmlContent += (item.ignoreBlock === 0 ? `
                    <div style="position:relative;">
                        ${item.blockHTMLGenerated}
                    </div>\n`
                    : `
                    <div style="position:relative;">
                        <div style="height:40px;"></div>
                    </div>\n`
                )
            } else {
                htmlContent += item.blockHTMLGenerated ?? ""
            }
        })

        return versionSelected.layoutHTMLGenerated?.replace("[(blocks)]", htmlContent) || '<div>An error occurred, please try again later.</div>'
    }

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
        const hasMatchLayoutName = listLayout.some(substring => assetHTMLData.layoutName?.toLowerCase().includes(substring.toLowerCase()));
        if (hasMatchLayoutName) {
            return <div className='flex justify-center'>
                <ShadowDomContainer onClick={handleClickEdit} htmlContent={htmlOtherAsset()}></ShadowDomContainer>
            </div>
        }

        // render email layout
        return (versionSelected.assetVersionBlocks.map((item, idx) => {
            return (
                <div key={idx} >
                    {item.ignoreBlock === 0 ? <ShadowDomContainer htmlContent={item.blockHTMLGenerated || ""}></ShadowDomContainer> :
                        <div>
                            <div className={`flex w-[100%] justify-center absolute ml-[275px] mt-[-5px]`} >
                                <div onClick={() => { handleHideBlock(item.assetVersionBlockID, item.ignoreBlock) }}>
                                    <svg clipRule="evenodd" width="46" height="46" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                        <path d="m-960-256h1280v800h-1280z" fill="none" /><path d="m13.673 10.345-3.097 3.096 39.853 39.854 3.097-3.097z" />
                                        <path d="m17.119 19.984 2.915 2.915c-3.191 2.717-5.732 6.099-7.374 9.058l-.005.01c4.573 7.646 11.829 14.872 20.987 13.776 2.472-.296 4.778-1.141 6.885-2.35l2.951 2.95c-4.107 2.636-8.815 4.032-13.916 3.342-9.198-1.244-16.719-8.788-21.46-17.648 2.226-4.479 5.271-8.764 9.017-12.053zm6.63-4.32c2.572-1.146 5.355-1.82 8.327-1.868.165-.001 2.124.092 3.012.238.557.092 1.112.207 1.659.35 8.725 2.273 15.189 10.054 19.253 17.653-1.705 3.443-3.938 6.398-6.601 9.277l-2.827-2.827c1.967-2.12 3.622-4.161 4.885-6.45 0 0-1.285-2.361-2.248-3.643-.619-.824-1.27-1.624-1.954-2.395-.54-.608-2.637-2.673-3.136-3.103-3.348-2.879-7.279-5.138-11.994-5.1-1.826.029-3.582.389-5.249.995z" fillRule="nonzero" />
                                        <path d="m25.054 27.92 2.399 2.398c-.157.477-.243.987-.243 1.516 0 2.672 2.169 4.841 4.841 4.841.529 0 1.039-.085 1.516-.243l2.399 2.399c-1.158.65-2.494 1.02-3.915 1.02-4.425 0-8.017-3.592-8.017-8.017 0-1.421.371-2.756 1.02-3.914zm6.849-4.101c.049-.001.099-.002.148-.002 4.425 0 8.017 3.593 8.017 8.017 0 .05 0 .099-.001.148z" />
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

    const useClickOutside = (handler: () => void) => {
        const ref = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    handler();
                }
            };

            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [handler]);

        return ref;
    };

    const dropdownRef = useClickOutside(() => {
        setShowSave(false)
    });

    return (
        <>
            <Suspense>
                <div className='overflow-hidden'>
                    {/* <div className="flex p-1 px-2">
                        <div className='flex-1'>
                        </div>
                        <div className='w-full flex items-center justify-between p-[0.6rem]'>

                            <div onClick={() => router.back()} className="relative w-7 h-7 rounded-full bg-[#00A881] cursor-pointer">
                                <svg className="absolute top-1 left-[0.40rem]" width="17" height="18" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M21 17.918C18.5533 14.9313 16.3807 13.2367 14.482 12.834C12.5833 12.4313 10.7757 12.3705 9.059 12.6515V18L1 9.2725L9.059 1V6.0835C12.2333 6.1085 14.932 7.24733 17.155 9.5C19.3777 11.7527 20.6593 14.5587 21 17.918Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <Link href="/Profile" className="cursor-pointer"><UserIcon /></Link>
                        </div>
                    </div> */}

                    {/* Edit section  */}
                    <div className="min-h-[82vh] border-t border-solid">
                        {/* Edit section header  */}
                        <div className='w-full flex items-center  px-14 py-6'>
                            <div className='w-full flex items-center justify-between gap-4'>

                                <div className='flex items-center gap-2'>
                                    <div className='flex items-center gap-2'>
                                        <PeopleIcon />
                                        <p className='text-lg tracking-wide'>Submitted By</p>
                                    </div>
                                    <p className='text-lg tracking-wide font-metricSemibold'>{approvalDetails.editorName}</p>
                                </div>

                                <div className='flex gap-4'>

                                    <div className='relative w-[150px] bg-white shadow-sm rounded' ref={dropdownRef}>
                                        <div onClick={() => { setShowSave(!isShowSave) }} className='flex items-center justify-between px-4 py-2 cursor-pointer'>
                                            <p className='text-base px-2'>Download</p>
                                            <span className={`cursor-pointer transition-transform ${isShowSave ? "rotate-180" : ""}`}><MdOutlineKeyboardArrowDown size={25} /></span>
                                        </div>
                                        {isShowSave &&
                                            <div className="absolute z-[100] w-full bg-white shadow-sm flex flex-col rounded-b-md px-2 py-1">
                                                <button onClick={() => handleSave(2)} className="h-[40px] flex items-center justify-between px-4 hover:bg-[#00A8811A] hover:text-white rounded">
                                                    <div className="text-black text-base font-normal">HTML File</div>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 17.3625C11.8 17.3625 11.6125 17.3315 11.4375 17.2695C11.2625 17.2075 11.1 17.101 10.95 16.95L5.55 11.55C5.25 11.25 5.106 10.9 5.118 10.5C5.13 10.1 5.274 9.75 5.55 9.45C5.85 9.15 6.2065 8.994 6.61949 8.982C7.03249 8.97 7.38849 9.1135 7.68749 9.4125L10.5 12.225V1.5C10.5 1.075 10.644 0.719005 10.932 0.432005C11.22 0.145005 11.576 0.00100517 12 5.17241e-06C12.424 -0.000994827 12.7805 0.143005 13.0695 0.432005C13.3585 0.721005 13.502 1.077 13.5 1.5V12.225L16.3125 9.4125C16.6125 9.1125 16.969 8.9685 17.382 8.9805C17.795 8.9925 18.151 9.149 18.45 9.45C18.725 9.75 18.869 10.1 18.882 10.5C18.895 10.9 18.751 11.25 18.45 11.55L13.05 16.95C12.9 17.1 12.7375 17.2065 12.5625 17.2695C12.3875 17.3325 12.2 17.3635 12 17.3625ZM3 24C2.175 24 1.469 23.7065 0.881999 23.1195C0.294999 22.5325 0.000999999 21.826 0 21V18C0 17.575 0.144 17.219 0.432 16.932C0.72 16.645 1.076 16.501 1.5 16.5C1.924 16.499 2.2805 16.643 2.5695 16.932C2.8585 17.221 3.002 17.577 3 18V21H21V18C21 17.575 21.144 17.219 21.432 16.932C21.72 16.645 22.076 16.501 22.5 16.5C22.924 16.499 23.2805 16.643 23.5695 16.932C23.8585 17.221 24.002 17.577 24 18V21C24 21.825 23.7065 22.5315 23.1195 23.1195C22.5325 23.7075 21.826 24.001 21 24H3Z" fill="#00A881" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => handleSave(3)} className="h-[40px] flex items-center justify-between px-4 hover:bg-[#00A8811A] hover:text-white rounded">
                                                    <div className="text-black text-base font-normal">Zip File</div>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 17.3625C11.8 17.3625 11.6125 17.3315 11.4375 17.2695C11.2625 17.2075 11.1 17.101 10.95 16.95L5.55 11.55C5.25 11.25 5.106 10.9 5.118 10.5C5.13 10.1 5.274 9.75 5.55 9.45C5.85 9.15 6.2065 8.994 6.61949 8.982C7.03249 8.97 7.38849 9.1135 7.68749 9.4125L10.5 12.225V1.5C10.5 1.075 10.644 0.719005 10.932 0.432005C11.22 0.145005 11.576 0.00100517 12 5.17241e-06C12.424 -0.000994827 12.7805 0.143005 13.0695 0.432005C13.3585 0.721005 13.502 1.077 13.5 1.5V12.225L16.3125 9.4125C16.6125 9.1125 16.969 8.9685 17.382 8.9805C17.795 8.9925 18.151 9.149 18.45 9.45C18.725 9.75 18.869 10.1 18.882 10.5C18.895 10.9 18.751 11.25 18.45 11.55L13.05 16.95C12.9 17.1 12.7375 17.2065 12.5625 17.2695C12.3875 17.3325 12.2 17.3635 12 17.3625ZM3 24C2.175 24 1.469 23.7065 0.881999 23.1195C0.294999 22.5325 0.000999999 21.826 0 21V18C0 17.575 0.144 17.219 0.432 16.932C0.72 16.645 1.076 16.501 1.5 16.5C1.924 16.499 2.2805 16.643 2.5695 16.932C2.8585 17.221 3.002 17.577 3 18V21H21V18C21 17.575 21.144 17.219 21.432 16.932C21.72 16.645 22.076 16.501 22.5 16.5C22.924 16.499 23.2805 16.643 23.5695 16.932C23.8585 17.221 24.002 17.577 24 18V21C24 21.825 23.7065 22.5315 23.1195 23.1195C22.5325 23.7075 21.826 24.001 21 24H3Z" fill="#00A881" />
                                                    </svg>
                                                </button>
                                                <button onClick={() => handleSave(4)} className="h-[40px] flex items-center justify-between px-4 hover:bg-[#00A8811A] hover:text-white rounded">
                                                    <div className="text-black text-base font-normal">PDF File</div>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 17.3625C11.8 17.3625 11.6125 17.3315 11.4375 17.2695C11.2625 17.2075 11.1 17.101 10.95 16.95L5.55 11.55C5.25 11.25 5.106 10.9 5.118 10.5C5.13 10.1 5.274 9.75 5.55 9.45C5.85 9.15 6.2065 8.994 6.61949 8.982C7.03249 8.97 7.38849 9.1135 7.68749 9.4125L10.5 12.225V1.5C10.5 1.075 10.644 0.719005 10.932 0.432005C11.22 0.145005 11.576 0.00100517 12 5.17241e-06C12.424 -0.000994827 12.7805 0.143005 13.0695 0.432005C13.3585 0.721005 13.502 1.077 13.5 1.5V12.225L16.3125 9.4125C16.6125 9.1125 16.969 8.9685 17.382 8.9805C17.795 8.9925 18.151 9.149 18.45 9.45C18.725 9.75 18.869 10.1 18.882 10.5C18.895 10.9 18.751 11.25 18.45 11.55L13.05 16.95C12.9 17.1 12.7375 17.2065 12.5625 17.2695C12.3875 17.3325 12.2 17.3635 12 17.3625ZM3 24C2.175 24 1.469 23.7065 0.881999 23.1195C0.294999 22.5325 0.000999999 21.826 0 21V18C0 17.575 0.144 17.219 0.432 16.932C0.72 16.645 1.076 16.501 1.5 16.5C1.924 16.499 2.2805 16.643 2.5695 16.932C2.8585 17.221 3.002 17.577 3 18V21H21V18C21 17.575 21.144 17.219 21.432 16.932C21.72 16.645 22.076 16.501 22.5 16.5C22.924 16.499 23.2805 16.643 23.5695 16.932C23.8585 17.221 24.002 17.577 24 18V21C24 21.825 23.7065 22.5315 23.1195 23.1195C22.5325 23.7075 21.826 24.001 21 24H3Z" fill="#00A881" />
                                                    </svg>
                                                </button>
                                            </div>}
                                    </div>
                                    <div className='h-full w-[1.5px] bg-sectionGrey'></div>
                                    <Button handleClick={handleShowPopUp} buttonText='Upload' showIcon={false} iconComponentEnd={<MdOutlineFileUpload size={22} />} customClass='px-10 py-1 border border-green-300' backgroundColor='bg-transparent' textColor='text-green-300' textStyle="font-semibold" />
                                    <Button buttonText='Approve' handleClick={approveAsset} showIcon={false} customClass='px-10 py-1' />
                                </div>
                            </div>
                        </div>

                        {/* <div className='pt-2 pl-14'>
                            {versionList.map((item, index) => {
                                return (
                                    <button
                                        key={item.assetID + index}
                                        onClick={() => { setVersionSelected(item) }}
                                        className={`${versionSelected.assetVersionID === item.assetVersionID ? "text-[#333333] bg-[#e4e4e4]" : "text-black bg-[#fff]"} inline-block h-[42px] text-center text-lg font-normal  rounded-tl-[5px] rounded-tr-[5px] px-[30px] py-2`}>
                                        {item.versionName}
                                    </button>)
                            })}
                        </div> */}

                        {/* FeedBack logo */}

                        {(comments && comments?.length > 0) &&
                            <div className='flex justify-end pr-16 items-center py-2'>
                                <FeedBackCard
                                    isFeedbackOpen={isFeedbackOpen}
                                    setIsFeedbackOpen={setIsFeedbackOpen} // Pass state to the feedback card 
                                />
                            </div>
                        }
                        <div className="flex h-[92vh] relative mx-14">

                            {/* Edit section main  */}
                            <div className="flex flex-col bg-[#e4e4e4] pb-10  px-20 overflow-x-hidden overflow-y-scroll scrollbar-hide relative w-[100%]">
                                <div>
                                    <div id="container">
                                        <div className='h-[20px]' />
                                        {renderHTMLSelect}
                                        <div className='h-[20vh]' />
                                    </div>
                                </div>
                                {isShowAddVer ? <AddVersionModel
                                    isShowAddVer={isShowAddVer}
                                    setIsShowAddVer={setIsShowAddVer}
                                    handleAddVersion={handleAddVersion}
                                    handleChangeTextVersion={handleChangeTextVersion} /> : null}


                            </div>

                            {/* Feedback Panel */}
                            <FeedbackPanel 
                                comments={comments || []}
                                isOpen ={isFeedbackOpen}
                                onClose={()=>setIsFeedbackOpen(false)}
                                onDownloadFile={handleDownloadFile}
                            />
                            {/* {isFeedbackOpen && (
                                <div
                                    className={`fixed md:relative top-0 right-0 bg-white md:w-[35%] feedback-panel ${isFeedbackOpen ? "block" : "hidden "
                                        }`}
                                >
                                    <div className="bg-[#00A881] text-white p-4 flex justify-between items-center gap-4 sticky top-0">


                                        <div className='flex justify-start'>

                                            <svg width="30" height="20" viewBox="0 0 43 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4.625 17.5C2.5625 17.5 0.875 15.8125 0.875 13.75V4.375C0.875 2.3125 2.5625 0.625 4.625 0.625H19.625C21.6875 0.625 23.375 2.3125 23.375 4.375V13.75C23.375 15.8125 21.6875 17.5 19.625 17.5H15.875V23.125L10.25 17.5H4.625ZM38.375 28.75C40.4375 28.75 42.125 27.0625 42.125 25V15.625C42.125 13.5625 40.4375 11.875 38.375 11.875H27.125V13.75C27.125 17.875 23.75 21.25 19.625 21.25V25C19.625 27.0625 21.3125 28.75 23.375 28.75H27.125V34.375L32.75 28.75H38.375Z" fill="white" />
                                            </svg>
                                            <span className="font-semibold text-base ps-1">Feedbacks</span>

                                        </div>

                                        <button
                                            onClick={() => setIsFeedbackOpen(false)} // Minimize feedback panel
                                            className="text-white hover:text-gray-300"
                                        >
                                            <svg width="18" height="5" viewBox="0 0 26 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="26" height="4" rx="2" fill="white" />
                                            </svg>


                                        </button>
                                    </div>

                                    <div className="h-auto overflow-y-auto p-1 md:h-[60%] custom-scrollbar border pb-2">
                                        {
                                            comments.map((item, index) => {
                                                return (
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
                                                )
                                            })
                                        }

                                    </div>
                                </div>
                            )} */}

                        </div>



                    </div>
                    {isShowModelEdit ? <EditContentModel
                        assetBlock={sectionEdit as AssetBlockProps}
                        assetVersion={versionSelected}
                        setIsShowModelEdit={setIsShowModelEdit}
                    /> : null}
                </div>
            </Suspense>

            {
                showUploadPopup && !isReAssignSuccessFull &&
                <PopupCard
                    headerTitle="Enter Your Feedbacks"
                    onClose={() => {
                        setShowUploadPopup(false);
                        setIsReAssignSuccessFull(false);
                    }}
                    submitbutton={
                        <Button
                            buttonText='Submit'
                            handleClick={handleReAssignToEditor}
                            disabled={!canReassign || reAssignLoading}
                            showIcon={false}
                            customClass="text-white px-8 py-1 rounded-full font-medium"
                            backgroundColor={canReassign ? "bg-green-300" : "bg-[#B1B1B1]"}
                        />
                    }
                >
                    <p className="text-lg font-semibold text-fileupload-text mb-4">Attach your file</p>
                    <DragAndDrop onFileSelect={handleUploadFile} onRemoveSelectedFile={handleRemoveFile} showButtons={false} />

                    <p className="text-lg font-semibold text-fileupload-text mb-4">Enter your comments here</p>
                    <textarea
                        placeholder="Type your comments"
                        onChange={eventInputComment}
                        className="w-full h-32 p-3 border rounded-xl resize-none mb-4 focus:outline-none "
                    />
                </PopupCard>
            }
            {/* Success Message */}
            {showSuccessMessage && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[100]">
                    <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg p-5 rounded-lg z-[400] flex flex-col items-center">
                        <AiOutlineCheckCircle size={40} className="text-[#00A881] mb-2" />
                        <p className="text-lg">Your feedback has been submitted</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Page;