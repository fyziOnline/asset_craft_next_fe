'use client';
import React from 'react';
import LayoutWrapper from "@/layout/LayoutWrapper";
import Breadcrumb from "@/components/global/Breadcrumb"
import Image from 'next/image';

const Page = () => {
    return (
        <LayoutWrapper layout="main">
            <div className="pt-[2rem] px-[1.5rem]">
                <Breadcrumb projectName="GreenLake" TaskName='Storage Asia 2024' TaskType='SalesCall_1' />
            </div>
            <div className="py-10 px-16 border-t border-solid border-[#D9D9D9]">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-center">
                        <p className="[font-family:'Inter-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                            Select one of the templates
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 mt-11">
                        <div className="mx-10">
                            <Image
                                src="/images/event_invite_call_script.png"
                                alt="call script"
                                width={528}
                                height={390}
                            />
                            <div className="mt-8 [font-family:'Inter-Medium',Helvetica] font-medium text-black text-[21.6px] text-center tracking-[0]">
                                Event Invite Call Script
                            </div>
                        </div>
                        <div className="mx-10">
                            <Image
                                src="/images/sales_call_script.png"
                                alt="call script"
                                width={528}
                                height={390}
                            />
                            <div className="mt-8 [font-family:'Inter-Medium',Helvetica] font-medium text-black text-[21.6px] text-center tracking-[0]">
                                Sales Call Script
                            </div>
                        </div>
                        <div className="mx-10">
                            <Image
                                src="/images/demo_call_script.png"
                                alt="call script"
                                width={528}
                                height={390}
                            />
                            <div className="mt-8 [font-family:'Inter-Medium',Helvetica] font-medium text-black text-[21.6px] text-center tracking-[0]">
                                Demo Call Script
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutWrapper>
    );
};

export default Page;