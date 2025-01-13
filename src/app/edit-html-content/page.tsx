'use client';
import React, { Suspense, useMemo } from 'react';
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

const Page = () => {
    const { contextData } = useAppData();
    const router = useRouter();

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
        setSectionEdit
    } = useEditHTMLContent()

    const htmlOtherAsset = () => {
        let htmlContent = ''
        versionSelected.assetVersionBlocks.forEach((item) => {
            if ((item.blockData !== "{}" && item.blockData !== "" && item.blockHTMLGenerated)) {
                htmlContent += `
                <div style="position:relative;">
                <div style="right:-60px; z-index:20; position:absolute;">
                    <div id="edit-button" data-block-id="${item.assetVersionBlockID}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39" fill="none">
                        <path d="M17.875 6.5H6.5C5.63805 6.5 4.8114 6.84241 4.2019 7.4519C3.59241 8.0614 3.25 8.88805 3.25 9.75V32.5C3.25 33.362 3.59241 34.1886 4.2019 34.7981C4.8114 35.4076 5.63805 35.75 6.5 35.75H29.25C30.112 35.75 30.9386 35.4076 31.5481 34.7981C32.1576 34.1886 32.5 33.362 32.5 32.5V21.125" stroke="black" strokeWidth="2.5" stroke-linecap="round" strokeLinejoin="round" />
                        <path d="M30.0625 4.06433C30.709 3.41787 31.5858 3.05469 32.5 3.05469C33.4142 3.05469 34.291 3.41787 34.9375 4.06433C35.584 4.7108 35.9471 5.58759 35.9471 6.50183C35.9471 7.41607 35.584 8.29287 34.9375 8.93933L19.5 24.3768L13 26.0018L14.625 19.5018L30.0625 4.06433Z" stroke="black" strokeWidth="2.5" stroke-linecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
                ` + item.blockHTMLGenerated + '</div>\n'
            } else {
                htmlContent += item.blockHTMLGenerated ?? ""
            }
        })

        return versionSelected.layoutHTMLGenerated?.replace("[(blocks)]", htmlContent) || '<div>An error occurred, please try again later.</div>'
    }

    const handleClickEdit = (event: Event) => {
        const target = event.target as HTMLElement;

        const container = target.id === "edit-button"
            ? target
            : target.closest("#edit-button") as HTMLElement;

        if (container) {
            const assetVersionBlockID = container.dataset.blockId;
            const section = versionSelected.assetVersionBlocks.find((item) => item.assetVersionBlockID === assetVersionBlockID);
            if (section) {
                setSectionEdit(section)
                setIsShowModelEdit(true)
            } else {
                alert(`Error selecting edit section, please try again later`);
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
                    {(item.blockData !== "{}" && item.blockData !== "") ? <div className='flex w-[100%] items-center justify-center absolute ml-[280px] mt-9' >
                        <div className='mt-1' onClick={() => {
                            setSectionEdit(item)
                            setIsShowModelEdit(true)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39" fill="none" data-id="101">
                                <path d="M17.875 6.5H6.5C5.63805 6.5 4.8114 6.84241 4.2019 7.4519C3.59241 8.0614 3.25 8.88805 3.25 9.75V32.5C3.25 33.362 3.59241 34.1886 4.2019 34.7981C4.8114 35.4076 5.63805 35.75 6.5 35.75H29.25C30.112 35.75 30.9386 35.4076 31.5481 34.7981C32.1576 34.1886 32.5 33.362 32.5 32.5V21.125" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M30.0625 4.06433C30.709 3.41787 31.5858 3.05469 32.5 3.05469C33.4142 3.05469 34.291 3.41787 34.9375 4.06433C35.584 4.7108 35.9471 5.58759 35.9471 6.50183C35.9471 7.41607 35.584 8.29287 34.9375 8.93933L19.5 24.3768L13 26.0018L14.625 19.5018L30.0625 4.06433Z" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div> : null}
                    <ShadowDomContainer htmlContent={item.blockHTMLGenerated || ""}></ShadowDomContainer>
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
                    <div className='w-full flex items-center justify-between p-[0.6rem]'>

                        <div onClick={() => router.back()} className="relative w-7 h-7 rounded-full bg-[#00A881] cursor-pointer">
                            <svg className="absolute top-1 left-[0.40rem]" width="17" height="18" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M21 17.918C18.5533 14.9313 16.3807 13.2367 14.482 12.834C12.5833 12.4313 10.7757 12.3705 9.059 12.6515V18L1 9.2725L9.059 1V6.0835C12.2333 6.1085 14.932 7.24733 17.155 9.5C19.3777 11.7527 20.6593 14.5587 21 17.918Z" fill="white" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                            </svg>
                        </div>

                        <Link href="/Profile" className="cursor-pointer"><UserIcon /></Link>
                    </div>
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

                    {/* Edit section main  */}
                    <div className="flex flex-col bg-[#e4e4e4] h-[92vh] pb-10 mx-14 px-20 overflow-x-hidden overflow-y-scroll scrollbar-hide relative ">
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