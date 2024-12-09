'use client';
import React from 'react';
import Breadcrumb from "@/components/global/Breadcrumb";
import Button from '@/components/global/Button';
import Search from '@/components/global/Search';
import TextField from '@/components/global/TextField';
import AddVersionModel from './components/AddVersionModel';
import { useEditHTMLContent } from '@/hooks/useEditHTMLContent';

const Page = () => {
    const {
        htmlContent,
        isShowAddVer,
        versionSelected,
        isShowSave,
        versionList,
        setShowSave,
        setVersionSelected,
        handleAddVersion,
        handleChangeTextVersion,
        handleSave,
        handleClick,
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
                                <path d="M14.7037 16.1797V14.513C14.7037 13.629 14.3428 12.7811 13.7003 12.156C13.0578 11.5309 12.1864 11.1797 11.2778 11.1797H4.42593C3.51731 11.1797 2.64592 11.5309 2.00343 12.156C1.36094 12.7811 1 13.629 1 14.513V16.1797" stroke="black" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.85171 7.84635C9.74379 7.84635 11.2776 6.35397 11.2776 4.51302C11.2776 2.67207 9.74379 1.17969 7.85171 1.17969C5.95962 1.17969 4.42578 2.67207 4.42578 4.51302C4.42578 6.35397 5.95962 7.84635 7.85171 7.84635Z" stroke="black" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M19.8429 16.0714V14.4047C19.8423 13.6661 19.5897 12.9487 19.1246 12.3649C18.6595 11.7812 18.0084 11.3643 17.2734 11.1797" stroke="black" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M13.8477 1.28906C14.5846 1.47265 15.2378 1.88965 15.7042 2.47432C16.1706 3.059 16.4238 3.77809 16.4238 4.51823C16.4238 5.25837 16.1706 5.97746 15.7042 6.56214C15.2378 7.14681 14.5846 7.56381 13.8477 7.7474" stroke="black" stroke-width="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                            <div className="w-full h-full px-52 py-9" dangerouslySetInnerHTML={{ __html: htmlContent }} onClick={handleClick} />
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
            </div>
        </>
    );
};

export default Page;