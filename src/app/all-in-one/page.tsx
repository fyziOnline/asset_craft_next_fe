'use client';
import React, { useState } from 'react';
import LayoutWrapper from "@/layout/LayoutWrapper";
import FormCard from './components/FormCard';

const Page = () => {
    const [activeButton, setActiveButton] = useState<"upload" | "recent">("upload");
    const [selectedStyle, setSelectedStyle] = useState<string>("");

    const handleButtonClick = (button: "upload" | "recent") => {
        setActiveButton(button);
    };

    const keyMessage = [
        { label: "Innovation and Leadership", checked: false },
        { label: "Cost-Effectiveness and Value", checked: false },
        { label: "Performance and Reliability", checked: false },
        { label: "Security and Compliance", checked: false },
        { label: "Scalability and Flexibility", checked: false },
        { label: "Other (Please Specify)", checked: false },
    ];

    const contentStyle = [
        { label: "Technical & Informative", checked: false },
        { label: "Engaging & Conversational", checked: false },
        { label: "Inspirational & Motivational", checked: false },
        { label: "Direct & To-the-Point", checked: false },
    ];

    return (
        <LayoutWrapper layout="main">
            <div className="pt-[2rem] pb-5 px-[1.5rem]">
            </div>
            <div className="py-5 px-16 border-t border-solid border-[#D9D9D9]">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center">
                        <p className="[font-family:'Inter-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                            Please provide the necessary information to generate AI content
                        </p>
                    </div>

                    <div className='flex items-center justify-between mt-4'>
                        <div className='flex flex-col gap-2'>
                            <p className='font-semibold text-2xl tracking-wide'>STEP 1:</p>
                            <FormCard HeaderTitle='Campaign Brief' Content='Please upload the Campaign Brief.'>
                                <div className='w-full'>
                                    <div className="flex items-center justify-center gap-1 bg-white h-[90px]">
                                        <div className='bg-[#F7F9FB] p-[5px] rounded-3xl'>
                                            <button
                                                onClick={() => handleButtonClick("upload")}
                                                className={`px-5 py-[7px] rounded-3xl text-xs ${
                                                    activeButton === "upload" ? "bg-[#666] group-hover:bg-green-300 text-white" : "bg-transparent text-black"
                                                }`}
                                            >
                                                New Upload
                                            </button>
                                            <button
                                                onClick={() => handleButtonClick("recent")}
                                                className={`px-4 py-[7px] rounded-3xl text-xs ${
                                                activeButton === "recent" ? "bg-[#666] group-hover:bg-green-300 text-white" : "bg-transparent text-black"
                                            }`}
                                            >
                                                Recent
                                            </button>
                                        </div>
                                    </div>
                                    <div className='bg-[#D9D9D9] group-hover:bg-custom-green-light w-full  rounded-b-3xl p-8 flex items-center justify-center relative'>
                                        <div className='w-full h-full flex-1 max-w-full flex items-center justify-center border-2 border-dashed rounded-3xl'>
                                        <div className="flex flex-col items-center justify-center w-full min-h-[213.5px]">
                                            <p className="text-sm text-[#242634] opacity-50">Click to browse or</p>
                                            <p className="text-sm text-[#242634] opacity-50">drag and drop your files</p>
                                        </div>
                                        </div>
                                            <input type="file" className='hidden' id='file-input' />
                                            <label htmlFor="file-input" className='absolute w-full h-full top-0 left-0 cursor-pointer'></label>
                                    </div>
                                </div>
                            </FormCard>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='font-semibold text-2xl tracking-wide'>STEP 2:</p>
                            <FormCard HeaderTitle='Key messaging' Content='What key message should be conveyed in this campaign?' >
                                <div className='bg-[#D9D9D9] group-hover:bg-custom-green-light rounded-b-3xl min-h-[371px] p-7 flex flex-col gap-4'>
                                    {keyMessage.map((data, index) => (
                                            <div key={index} className='flex items-center gap-2'>
                                                <div>
                                                <label className="flex flex-row items-center gap-2.5 dark:text-white light:text-black">
                                                <input id="hr" type="checkbox" readOnly className="peer hidden" />
                                                <div className="h-5 w-5 flex items-center justify-center bg-white rounded-md border border-green-300 light:bg-[#e8e8e8] peer-checked:bg-green-300 peer-checked:opacity-68 peer-checked:border-none transition cursor-pointer">
                                                    <svg width="12" height="12" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M18.2427 2.90918L7.57602 13.5758L2.72754 8.72736" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                </label>
                                                </div>
                                                <p className='text-base font-normal'>{data.label}</p>
                                            </div>
                                    ))}
                                    <div className='border border-black rounded-xl'>
                                        <input type="text" className='w-full h-full border-none outline-none bg-transparent px-4 py-3 text-sm placeholder:font-light placeholder:italic placeholder:tracking-wide placeholder:text-[#525252]' placeholder='Specify other key messages' />
                                    </div>
                                </div>
                            </FormCard>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='font-semibold text-2xl tracking-wide'>STEP 3:</p>
                            <FormCard HeaderTitle='Content Style' Content='What style best represents your campaign’s tone?'>
                            <div className='bg-[#D9D9D9] group-hover:bg-custom-green-light rounded-b-3xl min-h-[371px] px-7 py-10 flex flex-col gap-6'>
                                    {contentStyle.map((data, index) => (
                                            <div key={index} className='flex items-center gap-2'>
                                                <input
                                                    type="radio"
                                                    name="style"
                                                    checked={selectedStyle === data.label}
                                                    onChange={() => setSelectedStyle(data.label)}
                                                    className="peer hidden"
                                                />
                                                <div className="w-5 h-5 rounded-full border border-green-300 flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-transparent peer-checked:bg-black peer-checked:opacity-100 opacity-0 transition"></div>
                                                </div>
                                                <p className='text-base font-normal'>{data.label}</p>
                                            </div>
                                    ))}
                                </div>
                            </FormCard>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutWrapper>
    );
};

export default Page;