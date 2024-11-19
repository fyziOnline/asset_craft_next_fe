'use client';
import React, { useState } from 'react';
import LayoutWrapper from "@/layout/LayoutWrapper";
import Breadcrumb from "@/components/global/Breadcrumb";
import Image from 'next/image';
import Accordion from '@/components/global/Accordion';
import Button from '@/components/global/Button';

const Page = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <LayoutWrapper layout="main">
            <div className="py-[2rem] px-[1.5rem]">
                <Breadcrumb projectName="GreenLake" TaskName="Storage Asia 2024" TaskType="SalesCall_1" />
            </div>
            <div className="min-h-[70vh] border-t border-solid border-[#D9D9D9]">
                <div className="flex">
                    <div className="flex-1 py-10 overflow-y-scroll scrollbar-hide h-[70vh]">
                        <div className="flex items-center justify-center">
                            <p className="[font-family:'Inter-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                                Please provide the necessary information to generate AI content
                            </p>
                        </div>
                        <div className='px-[10%]'>
                            <div className='mt-[40px]'>
                                {/* step 1 */}
                                <Accordion HeaderTitle="Call Objective and Target Audience" checked={true} disableShowContent={true}>
                                    <div>Accordion content goes here</div>
                                </Accordion>
                            </div>
                            <div className='mt-[25px]'>
                                {/* step 2 */}
                                <Accordion HeaderTitle="Tone, Style, and Objections" checked={false}>
                                    <div>Accordion content goes here</div>
                                </Accordion>
                            </div>
                            <div className='mt-[25px]'>
                                {/* step 3 */}
                                <Accordion HeaderTitle="Content Structuring for Communication" checked={false}>
                                    <div>Accordion content goes here</div>
                                </Accordion>
                            </div>
                            <div className='flex justify-end mt-[50px]'>
                                <Button
                                    buttonText='Generate'
                                    showIcon
                                    textStyle='text-[1rem] font-base text-[#00A881]'
                                    backgroundColor='bg-[#B1B1B1]'
                                    customClass='static  px-[1.4rem] py-2 group-hover:border-white' />
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        {/* Button */}
                        <div
                            className="flex w-[25px] h-14 items-center gap-2.5 px-2 py-[19px] relative bg-[#00b188] rounded-[10px_0px_0px_10px] mt-[20px] cursor-pointer"
                            onClick={toggleSidebar}
                        >
                            <img
                                className="relative w-[10.5px] h-[18.5px] mt-[-0.25px] mb-[-0.25px] ml-[-0.75px] mr-[-0.75px]"
                                alt="Vector"
                                src="/vector_right_arrow.svg"
                            />
                        </div>
                        {/* Sidebar */}
                        <div
                            className={`bg-[#F5F5F7] flex items-center justify-center overflow-y-scroll scrollbar-hide transition-all duration-300 ease-in-out ${isOpen ? 'w-[320px]' : 'w-[0px]'} h-[70vh]`}
                        >
                            <div>
                                <div>
                                    <Image
                                        src="/images/event_invite_call_script.png"
                                        alt="call script"
                                        width={267}
                                        height={362}
                                    />
                                    <p className="w-[275px] mt-[16px] [font-family:'Inter-SemiBold',Helvetica] font-normal text-black text-[11px] tracking-[0] leading-[normal]">
                                        <span className="font-semibold">Prospect Details</span>

                                        <span className="[font-family:'Inter-Regular',Helvetica]"> </span>

                                        <span className="[font-family:'Inter-Regular',Helvetica] text-[10px]">
                                            Personalise the introduction based on the prospect’s background.
                                            <br />
                                        </span>

                                        <span className="[font-family:'Inter-Regular',Helvetica]">
                                            <br />
                                        </span>

                                        <span className="font-semibold">Solution Introduction</span>

                                        <span className="[font-family:'Inter-Regular',Helvetica]"> </span>

                                        <span className="[font-family:'Inter-Regular',Helvetica] text-[10px]">
                                            Explain how your product or service is relevant to the prospect’s
                                            needs.
                                            <br />
                                        </span>

                                        <span className="[font-family:'Inter-Regular',Helvetica]">
                                            <br />
                                        </span>

                                        <span className="font-semibold">Value Proposition</span>

                                        <span className="[font-family:'Inter-Regular',Helvetica]"> </span>

                                        <span className="[font-family:'Inter-Regular',Helvetica] text-[10px]">
                                            Showcase the primary benefits of your product or service that directly
                                            address the prospect’s pain points.
                                            <br />
                                        </span>

                                        <span className="[font-family:'Inter-Regular',Helvetica]">
                                            <br />
                                        </span>

                                        <span className="font-semibold">The Next Steps</span>

                                        <span className="[font-family:'Inter-Regular',Helvetica]"> </span>

                                        <span className="[font-family:'Inter-Regular',Helvetica] text-[10px]">
                                            Encourage the prospect to take action to move the conversation
                                            forward.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutWrapper>
    );
};

export default Page;
