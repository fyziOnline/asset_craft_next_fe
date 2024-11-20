'use client';
import React, { useState } from 'react';
import Breadcrumb from "@/components/global/Breadcrumb";
import Button from '@/components/global/Button';
import LayoutWrapper from "@/layout/LayoutWrapper";

const Page = () => {

    return (
        <LayoutWrapper layout="main">
            <div className="flex py-[2rem] px-[1.5rem]">
                <div className='flex-1'>
                    <Breadcrumb projectName="GreenLake" TaskName="Storage Asia 2024" TaskType="SalesCall_1" />
                </div>
                <div className='flex'>
                    <Button
                        buttonText='View & Edit'
                        showIcon
                        textStyle='text-[1rem] font-base text-[#00A881]'
                        textColor="text-[#00A881]"
                        iconColor="#00A881"
                        backgroundColor='bg-[#fff]'
                        customClass='min-w-[180px] static border-[3px] border-[#00A881] px-[1.4rem] py-2 group-hover:border-white mr-[70px]' />
                    <Button
                        buttonText='Save'
                        showIcon
                        textStyle='text-[1rem] font-base text-[#00A881]'
                        textColor="text-[#00A881]"
                        iconColor="#00A881"
                        backgroundColor='bg-[#fff]'
                        customClass='min-w-[180px] static border-[3px] border-[#00A881] px-[1.4rem] py-2 group-hover:border-white' />
                </div>
            </div>
            <div className="min-h-[70vh] border-t border-solid border-[#D9D9D9]">

            </div>
        </LayoutWrapper>
    );
};

export default Page;
