'use client';
import React, { Suspense, useMemo, useState } from 'react';
import Button from '@/components/global/Button';
import AddVersionModel from './components/AddVersionModel';
import { useEditHTMLContent } from '@/hooks/useEditHTMLContent';
import EditContentModel from './components/EditContentModel';
import { useRouter } from 'next/navigation';
import ShadowDomContainer from './components/ShadowDomContainer';
import { AssetBlockProps } from '@/types/templates';
import { useAppData } from '@/context/AppContext';
import { UserIcon } from "@/assets/icons/AppIcons"
import Link from 'next/link'
import SubmitVersionModel from './components/SubmitVersionModel';
import { useOverflowHidden } from '@/hooks/useOverflowHidden';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import { BiMessageAltError } from "react-icons/bi";
import FeedBackCard from '@/components/cards/FeedBackCard';
import { useAssetApproval } from '@/hooks/useAssetApproval';



const Page = () => {
    const { contextData } = useAppData();
    const router = useRouter();

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false); // State to toggle feedback visibility

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
        handleHideBlock
    } = useEditHTMLContent()


    const { approvalDetails } = useAssetApproval({ assetVersionID: versionSelected.assetVersionID, assetID: versionSelected.assetID })
    
    

    const htmlOtherAsset = () => {
        let htmlContent = ''
        versionSelected.assetVersionBlocks.forEach((item) => {
            if ((item.blockData !== "{}" && item.blockData !== "" && item.blockHTMLGenerated)) {
                htmlContent += (item.ignoreBlock === 0 ? `
                    <div style="position:relative;">
                    <div style="right:-120px; z-index:20; position:absolute; display:flex;">
                        <div id="handle-button" data-block-id="${item.assetVersionBlockID}" data-type-div="edit" style="margin-right: 0.5rem">
                            <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" view-box="0 0 39 39" fill="none">
                            <path d="M17.875 6.5H6.5C5.63805 6.5 4.8114 6.84241 4.2019 7.4519C3.59241 8.0614 3.25 8.88805 3.25 9.75V32.5C3.25 33.362 3.59241 34.1886 4.2019 34.7981C4.8114 35.4076 5.63805 35.75 6.5 35.75H29.25C30.112 35.75 30.9386 35.4076 31.5481 34.7981C32.1576 34.1886 32.5 33.362 32.5 32.5V21.125" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M30.0625 4.06433C30.709 3.41787 31.5858 3.05469 32.5 3.05469C33.4142 3.05469 34.291 3.41787 34.9375 4.06433C35.584 4.7108 35.9471 5.58759 35.9471 6.50183C35.9471 7.41607 35.584 8.29287 34.9375 8.93933L19.5 24.3768L13 26.0018L14.625 19.5018L30.0625 4.06433Z" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div id="handle-button" data-block-id="${item.assetVersionBlockID}" data-type-div="hidden-block" data-ignore-block="${item.ignoreBlock}">
                            <svg clip-rule="evenodd" width="46" height="46" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                <path d="m-896-256h1280v800h-1280z" fill="none" />
                                <path d="m32.513 13.926c10.574.15 19.141 9.894 23.487 18.074 0 0-1.422 2.892-2.856 4.895-.694.969-1.424 1.913-2.191 2.826-.547.65-1.112 1.283-1.698 1.898-5.237 5.5-12.758 9.603-20.7 8.01-8.823-1.77-15.732-9.498-20.058-17.629 0 0 1.248-2.964 2.69-4.964.646-.897 1.324-1.77 2.034-2.617.544-.649 1.108-1.282 1.691-1.897 4.627-4.876 10.564-8.63 17.601-8.596zm-.037 4c-5.89-.022-10.788 3.267-14.663 7.35-.527.555-1.035 1.127-1.527 1.713-.647.772-1.265 1.569-1.854 2.386-.544.755-1.057 1.805-1.451 2.59 3.773 6.468 9.286 12.323 16.361 13.742 6.563 1.317 12.688-2.301 17.016-6.846.529-.555 1.04-1.128 1.534-1.715.7-.833 1.366-1.694 1.999-2.579.557-.778 1.144-1.767 1.588-2.567-3.943-6.657-10.651-13.944-19.003-14.074z" />
                                <path d="m32.158 23.948c4.425 0 8.018 3.593 8.018 8.017 0 4.425-3.593 8.017-8.018 8.017-4.424 0-8.017-3.592-8.017-8.017 0-4.424 3.593-8.017 8.017-8.017zm0 4.009c2.213 0 4.009 1.796 4.009 4.008 0 2.213-1.796 4.009-4.009 4.009-2.212 0-4.008-1.796-4.008-4.009 0-2.212 1.796-4.008 4.008-4.008z" />
                            </svg>
                        </div>
                    </div>
                    ${item.blockHTMLGenerated} </div> \n` : `
                    <div style="position:relative;">
                    <div style="right:-70px; top:-5px; z-index:20; position:absolute; display:flex;">
                        <div id="handle-button" data-block-id="${item.assetVersionBlockID}" data-type-div="hidden-block" data-ignore-block="${item.ignoreBlock}">
                            <svg clip-rule="evenodd" width="46" height="46" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                <path d="m-960-256h1280v800h-1280z" fill="none" /><path d="m13.673 10.345-3.097 3.096 39.853 39.854 3.097-3.097z" />
                                <path d="m17.119 19.984 2.915 2.915c-3.191 2.717-5.732 6.099-7.374 9.058l-.005.01c4.573 7.646 11.829 14.872 20.987 13.776 2.472-.296 4.778-1.141 6.885-2.35l2.951 2.95c-4.107 2.636-8.815 4.032-13.916 3.342-9.198-1.244-16.719-8.788-21.46-17.648 2.226-4.479 5.271-8.764 9.017-12.053zm6.63-4.32c2.572-1.146 5.355-1.82 8.327-1.868.165-.001 2.124.092 3.012.238.557.092 1.112.207 1.659.35 8.725 2.273 15.189 10.054 19.253 17.653-1.705 3.443-3.938 6.398-6.601 9.277l-2.827-2.827c1.967-2.12 3.622-4.161 4.885-6.45 0 0-1.285-2.361-2.248-3.643-.619-.824-1.27-1.624-1.954-2.395-.54-.608-2.637-2.673-3.136-3.103-3.348-2.879-7.279-5.138-11.994-5.1-1.826.029-3.582.389-5.249.995z" fill-rule="nonzero" />
                                <path d="m25.054 27.92 2.399 2.398c-.157.477-.243.987-.243 1.516 0 2.672 2.169 4.841 4.841 4.841.529 0 1.039-.085 1.516-.243l2.399 2.399c-1.158.65-2.494 1.02-3.915 1.02-4.425 0-8.017-3.592-8.017-8.017 0-1.421.371-2.756 1.02-3.914zm6.849-4.101c.049-.001.099-.002.148-.002 4.425 0 8.017 3.593 8.017 8.017 0 .05 0 .099-.001.148z" />
                                </svg>
                        </div>
                    </div>
                    <div style="height:40px;"></div>
                     </div>\n`)
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
        const hasMatchLayoutName = listLayout.some(substring => contextData.AssetHtml?.layoutName?.toLowerCase().includes(substring.toLowerCase()));
        if (hasMatchLayoutName) {
            return <div className='flex justify-center'>
                <ShadowDomContainer onClick={handleClickEdit} htmlContent={htmlOtherAsset()}></ShadowDomContainer>
            </div>
        }

        // render email layout
        return (versionSelected.assetVersionBlocks.map((item, idx) => {
            return (
                <div key={idx} >
                    {(item.blockData !== "{}" && item.blockData !== "" && item.ignoreBlock === 0) ? <div className={`flex w-[100%] items-center justify-center absolute ml-[300px] mt-9`} >
                        <div className='mt-1 mr-2' onClick={() => {
                            setSectionEdit(item)
                            setIsShowModelEdit(true)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39" fill="none" data-id="101">
                                <path d="M17.875 6.5H6.5C5.63805 6.5 4.8114 6.84241 4.2019 7.4519C3.59241 8.0614 3.25 8.88805 3.25 9.75V32.5C3.25 33.362 3.59241 34.1886 4.2019 34.7981C4.8114 35.4076 5.63805 35.75 6.5 35.75H29.25C30.112 35.75 30.9386 35.4076 31.5481 34.7981C32.1576 34.1886 32.5 33.362 32.5 32.5V21.125" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M30.0625 4.06433C30.709 3.41787 31.5858 3.05469 32.5 3.05469C33.4142 3.05469 34.291 3.41787 34.9375 4.06433C35.584 4.7108 35.9471 5.58759 35.9471 6.50183C35.9471 7.41607 35.584 8.29287 34.9375 8.93933L19.5 24.3768L13 26.0018L14.625 19.5018L30.0625 4.06433Z" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className='mt-1' onClick={() => { handleHideBlock(item.assetVersionBlockID, item.ignoreBlock) }}>
                            <svg clip-rule="evenodd" width="46" height="46" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                <path d="m-896-256h1280v800h-1280z" fill="none" />
                                <path d="m32.513 13.926c10.574.15 19.141 9.894 23.487 18.074 0 0-1.422 2.892-2.856 4.895-.694.969-1.424 1.913-2.191 2.826-.547.65-1.112 1.283-1.698 1.898-5.237 5.5-12.758 9.603-20.7 8.01-8.823-1.77-15.732-9.498-20.058-17.629 0 0 1.248-2.964 2.69-4.964.646-.897 1.324-1.77 2.034-2.617.544-.649 1.108-1.282 1.691-1.897 4.627-4.876 10.564-8.63 17.601-8.596zm-.037 4c-5.89-.022-10.788 3.267-14.663 7.35-.527.555-1.035 1.127-1.527 1.713-.647.772-1.265 1.569-1.854 2.386-.544.755-1.057 1.805-1.451 2.59 3.773 6.468 9.286 12.323 16.361 13.742 6.563 1.317 12.688-2.301 17.016-6.846.529-.555 1.04-1.128 1.534-1.715.7-.833 1.366-1.694 1.999-2.579.557-.778 1.144-1.767 1.588-2.567-3.943-6.657-10.651-13.944-19.003-14.074z" />
                                <path d="m32.158 23.948c4.425 0 8.018 3.593 8.018 8.017 0 4.425-3.593 8.017-8.018 8.017-4.424 0-8.017-3.592-8.017-8.017 0-4.424 3.593-8.017 8.017-8.017zm0 4.009c2.213 0 4.009 1.796 4.009 4.008 0 2.213-1.796 4.009-4.009 4.009-2.212 0-4.008-1.796-4.008-4.009 0-2.212 1.796-4.008 4.008-4.008z" />
                            </svg>
                        </div>
                    </div> : null}
                    {item.ignoreBlock === 0 ? <ShadowDomContainer htmlContent={item.blockHTMLGenerated || ""}></ShadowDomContainer> :
                        <div>
                            <div className={`flex w-[100%] justify-center absolute ml-[275px] mt-[-5px]`} >
                                <div onClick={() => { handleHideBlock(item.assetVersionBlockID, item.ignoreBlock) }}>
                                    <svg clip-rule="evenodd" width="46" height="46" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                        <path d="m-960-256h1280v800h-1280z" fill="none" /><path d="m13.673 10.345-3.097 3.096 39.853 39.854 3.097-3.097z" />
                                        <path d="m17.119 19.984 2.915 2.915c-3.191 2.717-5.732 6.099-7.374 9.058l-.005.01c4.573 7.646 11.829 14.872 20.987 13.776 2.472-.296 4.778-1.141 6.885-2.35l2.951 2.95c-4.107 2.636-8.815 4.032-13.916 3.342-9.198-1.244-16.719-8.788-21.46-17.648 2.226-4.479 5.271-8.764 9.017-12.053zm6.63-4.32c2.572-1.146 5.355-1.82 8.327-1.868.165-.001 2.124.092 3.012.238.557.092 1.112.207 1.659.35 8.725 2.273 15.189 10.054 19.253 17.653-1.705 3.443-3.938 6.398-6.601 9.277l-2.827-2.827c1.967-2.12 3.622-4.161 4.885-6.45 0 0-1.285-2.361-2.248-3.643-.619-.824-1.27-1.624-1.954-2.395-.54-.608-2.637-2.673-3.136-3.103-3.348-2.879-7.279-5.138-11.994-5.1-1.826.029-3.582.389-5.249.995z" fill-rule="nonzero" />
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

    return (
        <Suspense>
            <div className='overflow-hidden'>
                <div className="flex p-1 px-2">
                    <div className='flex-1'>
                    </div>
                    {/* <div className='w-full flex items-center justify-between p-[0.6rem]'>

                        <div onClick={() => router.back()} className="relative w-7 h-7 rounded-full bg-[#00A881] cursor-pointer">
                            <svg className="absolute top-1 left-[0.40rem]" width="17" height="18" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M21 17.918C18.5533 14.9313 16.3807 13.2367 14.482 12.834C12.5833 12.4313 10.7757 12.3705 9.059 12.6515V18L1 9.2725L9.059 1V6.0835C12.2333 6.1085 14.932 7.24733 17.155 9.5C19.3777 11.7527 20.6593 14.5587 21 17.918Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <Link href="/Profile" className="cursor-pointer"><UserIcon /></Link>
                    </div> */}
                </div>

                {/* Edit section  */}
                <div className="min-h-[82vh] border-t border-solid">
                    {/* Edit section header  */}
                    <div className='flex justify-end px-14 py-4'>
                        <div className='flex gap-4'>
                            <div className='relative w-[150px] bg-white shadow-sm rounded'>
                                <div onClick={() => { setShowSave(!isShowSave) }} className='flex items-center justify-between px-4 py-2 cursor-pointer'>
                                    <p className='text-base px-2'>Download</p>
                                    <span className={`cursor-pointer transition-transform ${isShowSave ? "rotate-180" : ""}`}><MdOutlineKeyboardArrowDown size={25} /></span>
                                </div>
                                {isShowSave &&
                                    <div className="absolute z-[100] w-full bg-white shadow-sm flex flex-col rounded-b-md px-2 py-1">
                                        <button onClick={() => handleSave(1)} className="h-[40px] flex items-center px-4 hover:bg-[#00A8811A] hover:text-white rounded">
                                            <span className="text-black text-base font-normal">New Version</span>
                                        </button>
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
                            <Button buttonText='Submit' handleClick={() => setIsShowSubmitVer(true)} showIcon={false} customClass='px-10 py-1' />
                        </div>
                    </div>

                    <div className='flex justify-between pr-16 items-center'>

                        <div className='pt-2 pl-14'>
                            {versionList.map((item, index) => {
                                return (
                                    <button
                                        key={item.assetID + index}
                                        onClick={() => { setVersionSelected(item) }}
                                        className={`${versionSelected.assetVersionID === item.assetVersionID ? "text-[#333333] bg-[#e4e4e4]" : "text-black bg-[#fff]"} inline-block h-[42px] text-center text-lg font-normal  rounded-tl-[5px] rounded-tr-[5px] px-[30px] py-2`}>
                                        {item.versionName}
                                    </button>)
                            })}

                        </div>


                        {/* message logo  please provide ! to show icon for isFeedbackOpen && in feedbackcard.tsx*/}
                        <div className="">

                            <FeedBackCard
                                isFeedbackOpen={isFeedbackOpen}
                                setIsFeedbackOpen={setIsFeedbackOpen} // Pass state to the feedback card
                            />
                        </div>

                    </div>

                    {/* Edit section main  */}
                    <div className="flex h-[92vh] relative mx-14">
                        {/* Main Content Section */}
                        <div className="flex flex-col bg-[#e4e4e4] flex-grow pb-10  px-20 overflow-x-hidden overflow-y-scroll scrollbar-hide relative">
                            <div className="flex justify-between">
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
                                />
                            ) : null}
                        </div>

                        {/* Feedback Panel */}
                        {isFeedbackOpen && (
                            <div
                                className={`fixed md:relative top-0 right-0 bg-white border-[2px] border-[#E4E4E4] md:w-[500px] md:h-[75%] feedback-panel ${isFeedbackOpen ? "block" : "hidden "
                                    }`}
                            >
                                {/* Header */}
                                <div className="bg-[#00A881] text-white p-4 flex justify-between items-center">


                                    <div className='flex justify-start'>

                                        <svg width="43" height="35" viewBox="0 0 43 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.625 17.5C2.5625 17.5 0.875 15.8125 0.875 13.75V4.375C0.875 2.3125 2.5625 0.625 4.625 0.625H19.625C21.6875 0.625 23.375 2.3125 23.375 4.375V13.75C23.375 15.8125 21.6875 17.5 19.625 17.5H15.875V23.125L10.25 17.5H4.625ZM38.375 28.75C40.4375 28.75 42.125 27.0625 42.125 25V15.625C42.125 13.5625 40.4375 11.875 38.375 11.875H27.125V13.75C27.125 17.875 23.75 21.25 19.625 21.25V25C19.625 27.0625 21.3125 28.75 23.375 28.75H27.125V34.375L32.75 28.75H38.375Z" fill="white" />
                                        </svg>
                                        <span className="font-semibold text-lg ps-1">Feedbacks</span>

                                    </div>

                                    <button
                                        onClick={() => setIsFeedbackOpen(false)} // Minimize feedback panel
                                        className="text-white hover:text-gray-300"
                                    >
                                        <svg width="26" height="4" viewBox="0 0 26 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="26" height="4" rx="2" fill="white" />
                                        </svg>


                                    </button>
                                </div>

                                {/* Feedback Content */}
                                <div className="p-4">
                                    <p>Feedback content goes here...</p>
                                </div>
                            </div>
                        )}
                    </div>
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