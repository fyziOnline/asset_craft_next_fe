'use client';
import React, { Suspense, useMemo } from 'react';
// import Breadcrumb from "@/components/global/Breadcrumb";
import Button from '@/components/global/Button';
import Search from '@/components/global/Search';
import TextField from '@/components/global/TextField';
import AddVersionModel from './components/AddVersionModel';
import { useEditHTMLContent } from '@/hooks/useEditHTMLContent';
import EditContentModel from './components/EditContentModel';
import { useSearchParams } from 'next/navigation';
import ShadowDomContainer from './components/ShadowDomContainer';
import { AssetBlockProps } from '@/types/templates';
import { useAppData } from '@/context/AppContext';
import { UserIcon } from "@/assets/icons/AppIcons"
import Link from 'next/link'

interface HeaderProps {
    versionNameChoose: string
}

// const Header = ({ versionNameChoose }: HeaderProps) => {
//     const queryParams = useSearchParams()
//     const project_name = queryParams.get('project_name') ?? 'default'
//     const campaign_name = queryParams.get('campaign_name') ?? 'default'
//     const asset_name = queryParams.get('asset_name') ?? 'default'
//     return (<Breadcrumb projectName={project_name} TaskName={campaign_name} TaskType={`${asset_name}_${versionNameChoose}`.replace(" ", "")} />)
// }

const Page = () => {
    const { contextData } = useAppData();
    const {
        sectionEdit,
        isLoadingGenerate,
        isShowAddVer,
        versionSelected,
        isShowSave,
        versionList,
        isShowModelEdit,
        setShowSave,
        setVersionSelected,
        setVersionList,
        handleAddVersion,
        handleChangeTextVersion,
        handleSave,
        setIsShowModelEdit,
        setIsShowAddVer,
        onGenerateWithAI,
        onSubmit,
        setSectionEdit
    } = useEditHTMLContent()

    const htmlOtherAsset = () => {
        let htmlContent = ''
        versionSelected.assetVersionBlocks.forEach((item) => {
            if (!item.isStatic) {
                htmlContent += `
                <div style="position:relative;">
                <div style="right:-60px; z-index:100; position:absolute;">
                    <div id="edit-button" data-block-id="${item.assetVersionBlockID}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39" fill="none">
                        <path d="M17.875 6.5H6.5C5.63805 6.5 4.8114 6.84241 4.2019 7.4519C3.59241 8.0614 3.25 8.88805 3.25 9.75V32.5C3.25 33.362 3.59241 34.1886 4.2019 34.7981C4.8114 35.4076 5.63805 35.75 6.5 35.75H29.25C30.112 35.75 30.9386 35.4076 31.5481 34.7981C32.1576 34.1886 32.5 33.362 32.5 32.5V21.125" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M30.0625 4.06433C30.709 3.41787 31.5858 3.05469 32.5 3.05469C33.4142 3.05469 34.291 3.41787 34.9375 4.06433C35.584 4.7108 35.9471 5.58759 35.9471 6.50183C35.9471 7.41607 35.584 8.29287 34.9375 8.93933L19.5 24.3768L13 26.0018L14.625 19.5018L30.0625 4.06433Z" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                </div>
                ` + item.blockHTMLGenerated + '</div>\n'
            } else {
                htmlContent += item.blockHTMLGenerated ?? ""
            }
        })

        return versionSelected.layoutHTMLGenerated.replace("[(blocks)]", htmlContent)
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
        const hasMatchLayoutName = listLayout.some(substring => contextData.AssetHtml.layoutName.toLowerCase().includes(substring.toLowerCase()));
        if (hasMatchLayoutName) {
            return <div className='flex justify-center'>
                <ShadowDomContainer onClick={handleClickEdit} htmlContent={htmlOtherAsset()}></ShadowDomContainer>
            </div>
        }

        // render email layout
        return (versionSelected.assetVersionBlocks.map((item, idx) => {
            return (
                <div key={idx} >
                    {!item.isStatic ? <div className='flex w-[100%] items-center justify-center absolute ml-[350px] mt-9 z-20' >
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
                <div className="flex pt-3 pb-2 px-[1.5rem]">
                    <div className='flex-1'>
                        {/* <Header versionNameChoose={versionSelected?.versionName || ""} /> */}
                    </div>
                    <div className='flex items-center'>
                        <div className='flex items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="17" viewBox="0 0 21 17" fill="none">
                                <path d="M14.7037 16.1797V14.513C14.7037 13.629 14.3428 12.7811 13.7003 12.156C13.0578 11.5309 12.1864 11.1797 11.2778 11.1797H4.42593C3.51731 11.1797 2.64592 11.5309 2.00343 12.156C1.36094 12.7811 1 13.629 1 14.513V16.1797" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.85171 7.84635C9.74379 7.84635 11.2776 6.35397 11.2776 4.51302C11.2776 2.67207 9.74379 1.17969 7.85171 1.17969C5.95962 1.17969 4.42578 2.67207 4.42578 4.51302C4.42578 6.35397 5.95962 7.84635 7.85171 7.84635Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M19.8429 16.0714V14.4047C19.8423 13.6661 19.5897 12.9487 19.1246 12.3649C18.6595 11.7812 18.0084 11.3643 17.2734 11.1797" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M13.8477 1.28906C14.5846 1.47265 15.2378 1.88965 15.7042 2.47432C16.1706 3.059 16.4238 3.77809 16.4238 4.51823C16.4238 5.25837 16.1706 5.97746 15.7042 6.56214C15.2378 7.14681 14.5846 7.56381 13.8477 7.7474" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="mx-2 text-black text-lg font-normal font-['Inter']">Assign Approver</div>
                        </div>
                        <Search placeHolder=''></Search>
                        <div className='relative'>
                            <Button
                                buttonText='Save As'
                                showIcon
                                textStyle='text-[1rem] font-base text-[#00A881]'
                                textColor="text-[#00A881]"
                                iconColor="#00A881"
                                backgroundColor='bg-[#fff]'
                                handleClick={() => { setShowSave(!isShowSave) }}
                                customClass='static border-[3px] border-[#00A881] px-[1.4rem] mx-[40px] py-2 group-hover:border-white' />
                            {isShowSave ?
                                <div className="w-[170px] h-[130px] ml-[40px] absolute z-[1000] rounded-[14px] bg-[#fdfdfd] flex flex-col">
                                    <button onClick={() => handleSave(1)} className="h-[43px] flex items-center justify-start px-4 rounded-t-[14px]">
                                        <span className="text-black text-lg font-normal font-['Inter']">New Version</span>
                                    </button>
                                    <button onClick={() => handleSave(2)} className="h-[43px] flex items-center justify-start px-4 border-t-[0.5px] border-[#7F7F7F] border-solid">
                                        <span className="text-black text-lg font-normal font-['Inter']">HTML File</span>
                                    </button>
                                    <button onClick={() => handleSave(3)} className="h-[43px] flex items-center justify-start px-4 rounded-b-[14px] border-t-[0.5px] border-[#7F7F7F] border-solid">
                                        <span className="text-black text-lg font-normal font-['Inter']">Zip File</span>
                                    </button>
                                    <button onClick={() => handleSave(4)} className="h-[43px] flex items-center justify-start px-4 rounded-b-[14px] border-t-[0.5px] border-[#7F7F7F] border-solid">
                                        <span className="text-black text-lg font-normal font-['Inter']">PDF File</span>
                                    </button>
                                </div> : null}
                        </div>
                        <Button
                            buttonText='Submit'
                            showIcon
                            handleClick={onSubmit}
                            textStyle='text-[1rem] font-base text-[#00A881]'
                            textColor="text-[#fff]"
                            iconColor="#fff"
                            customClass='static mr-[80px] ml-[0px] px-[35px] py-[10px] group-hover:border-white' />

                        <Link href="/Profile" className="cursor-pointer"><UserIcon /></Link>
                    </div>
                </div>
                <div className='pl-[64px]'>
                    {versionList.map((item, index) => {
                        return (
                            <button
                                key={item.assetID + index}
                                onClick={() => { setVersionSelected(item) }}
                                className={`${versionSelected.assetVersionID === item.assetVersionID ? "text-white bg-[#01A982]" : "text-black bg-[#e4e4e4]"} inline-block h-[42px] mx-1 text-center text-lg font-normal  rounded-tl-[20px] rounded-tr-[20px] px-[30px] py-2`}>
                                {item.versionName}
                            </button>)
                    })}
                </div>
                <div className="min-h-[82vh] border-t border-solid border-[#D9D9D9] bg-[#e4e4e4]">
                    <div className="flex flex-col h-[82vh] pb-10 overflow-x-hidden overflow-y-scroll scrollbar-hide relative">
                        <div>
                            <div id="container">
                                {renderHTMLSelect}
                            </div>
                        </div>

                        {isShowAddVer ? <div className='fixed left-0 right-0 h-[70vh] bg-black bg-opacity-55 flex items-center justify-center'>
                            <div className="w-[900px] relative bg-white rounded-3xl">
                                <div className='flex items-center px-[50px] pt-[25px]'>
                                    <div className="flex-1 w-[207px] h-[21px] text-black text-xl font-semibold font-['Inter'] leading-[17.11px]">Save new version as:</div>
                                    <Button
                                        buttonText='Next'
                                        showIcon
                                        textStyle='text-[1rem] font-base text-[#00A881]'
                                        textColor="text-[#00A881]"
                                        iconColor="#00A881"
                                        backgroundColor='#fff'
                                        handleClick={handleAddVersion}
                                        customClass='static py-2 group-hover:border-white' />
                                </div>
                                <div className="w-full h-px bg-[#ebeff2]" />
                                <div className='mx-[50px] mt-[15px] pb-[35px]'>
                                    <div className="text-[#160647] mb-[15px] text-base font-bold font-['Inter'] leading-tight">New Version Name</div>
                                    <TextField handleChange={handleChangeTextVersion} placeholder={`Type the name of your new version.`} rows={1}></TextField>
                                </div>
                            </div>
                        </div> : null}
                        {isShowAddVer ? <AddVersionModel
                            isShowAddVer={isShowAddVer}
                            setIsShowAddVer={setIsShowAddVer}
                            handleAddVersion={handleAddVersion}
                            handleChangeTextVersion={handleChangeTextVersion} /> : null}
                    </div>
                </div>
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