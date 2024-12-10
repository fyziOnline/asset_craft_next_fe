'use client';
import React from 'react';
import Breadcrumb from "@/components/global/Breadcrumb";
import Button from '@/components/global/Button';
import Search from '@/components/global/Search';
import TextField from '@/components/global/TextField';
import AddVersionModel from './components/AddVersionModel';
import { useEditHTMLContent } from '@/hooks/useEditHTMLContent';
import { useAppData } from '@/context/AppContext';
import EditContentModel from './components/EditContentModel';

const Page = () => {
    const { contextData } = useAppData();

    const {
        isShowAddVer,
        versionSelected,
        isShowSave,
        versionList,
        isShowModelEdit,
        setShowSave,
        setVersionSelected,
        handleAddVersion,
        handleChangeTextVersion,
        handleSave,
        handleCopy,
        setIsShowModelEdit,
        setIsShowAddVer } = useEditHTMLContent()

    return (
        <>
            <div className='overflow-hidden'>
                <div className="flex pt-[2rem] pb-2 px-[1.5rem]">
                    <div className='flex-1'>
                        <Breadcrumb projectName="GreenLake" TaskName="Storage Asia 2024" TaskType="SalesCall_1" />
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
                                <div className="w-[170px] h-[130px] ml-[40px] absolute z-10 rounded-[14px] bg-[#fdfdfd] flex flex-col">
                                    <button onClick={() => handleSave(1)} className="h-[43px] flex items-center justify-start px-4 rounded-t-[14px]">
                                        <span className="text-black text-lg font-normal font-['Inter']">New Version</span>
                                    </button>
                                    <button onClick={() => handleSave(2)} className="h-[43px] flex items-center justify-start px-4 border-t-[0.5px] border-[#7F7F7F] border-solid">
                                        <span className="text-black text-lg font-normal font-['Inter']">HTML File</span>
                                    </button>
                                    <button onClick={() => handleSave(3)} className="h-[43px] flex items-center justify-start px-4 rounded-b-[14px] border-t-[0.5px] border-[#7F7F7F] border-solid">
                                        <span className="text-black text-lg font-normal font-['Inter']">PDF File</span>
                                    </button>
                                </div> : null}
                        </div>
                        <Button
                            buttonText='Submit'
                            showIcon
                            textStyle='text-[1rem] font-base text-[#00A881]'
                            textColor="text-[#fff]"
                            iconColor="#fff"
                            customClass='static mr-[80px] ml-[0px] px-[35px] py-[10px] group-hover:border-white' />
                    </div>
                </div>
                <div className='pl-[64px]'>
                    {versionList.map((item, index) => {
                        return (
                            <button
                                key={item + index}
                                onClick={() => { setVersionSelected(item) }}
                                className={`${versionSelected === item ? "text-white bg-[#01A982]" : "text-black bg-[#e4e4e4]"} inline-block h-[42px] mx-1 text-center text-lg font-normal  rounded-tl-[20px] rounded-tr-[20px] px-[30px] py-2`}>
                                {item}
                            </button>)
                    })}
                </div>
                <div className="min-h-[70vh] border-t border-solid border-[#D9D9D9]">
                    <div className="flex flex-col h-[70vh] overflow-y-scroll scrollbar-hide relative">
                        <div>
                            <div className='flex w-[100%] items-center justify-end pr-52 absolute mt-9 z-10' >
                                <div className='mr-[20px] mt-1' onClick={() => {
                                    console.log('aaaa');

                                    setIsShowModelEdit(true)
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39" fill="none" data-id="101">
                                        <path d="M17.875 6.5H6.5C5.63805 6.5 4.8114 6.84241 4.2019 7.4519C3.59241 8.0614 3.25 8.88805 3.25 9.75V32.5C3.25 33.362 3.59241 34.1886 4.2019 34.7981C4.8114 35.4076 5.63805 35.75 6.5 35.75H29.25C30.112 35.75 30.9386 35.4076 31.5481 34.7981C32.1576 34.1886 32.5 33.362 32.5 32.5V21.125" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M30.0625 4.06433C30.709 3.41787 31.5858 3.05469 32.5 3.05469C33.4142 3.05469 34.291 3.41787 34.9375 4.06433C35.584 4.7108 35.9471 5.58759 35.9471 6.50183C35.9471 7.41607 35.584 8.29287 34.9375 8.93933L19.5 24.3768L13 26.0018L14.625 19.5018L30.0625 4.06433Z" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {/* <div className='mr-2 mt-1'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="39" height="39" viewBox="0 0 39 39" fill="none" data-id="102">
                                        <path d="M32.5 14.625H17.875C16.0801 14.625 14.625 16.0801 14.625 17.875V32.5C14.625 34.2949 16.0801 35.75 17.875 35.75H32.5C34.2949 35.75 35.75 34.2949 35.75 32.5V17.875C35.75 16.0801 34.2949 14.625 32.5 14.625Z" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8.125 24.375H6.5C5.63805 24.375 4.8114 24.0326 4.2019 23.4231C3.59241 22.8136 3.25 21.987 3.25 21.125V6.5C3.25 5.63805 3.59241 4.8114 4.2019 4.2019C4.8114 3.59241 5.63805 3.25 6.5 3.25H21.125C21.987 3.25 22.8136 3.59241 23.4231 4.2019C24.0326 4.8114 24.375 5.63805 24.375 6.5V8.125" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div> */}
                            </div>
                            <div className="w-full h-full px-52 py-9" dangerouslySetInnerHTML={{ __html: contextData.AssetHtml?.assetContentVersions?.[0]?.assetHTML || "" }} />
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
                {isShowModelEdit ? <EditContentModel setIsShowModelEdit={setIsShowModelEdit} /> : null}
            </div>
        </>
    );
};

export default Page;