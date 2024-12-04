'use client';
import React, { FC, useState } from 'react';
import Image from 'next/image';
import AssetGenerate from '../ui/AssetGenerate';
import AssetViewer from '../ui/AssetViewer';
import LandingPage from '../asset-generate/LandingPage';
import { useAppData } from '@/context/AppContext';
import LinkedInPage from '../asset-generate/LinkedinPage';
import CallScriptPage from '../asset-generate/CallScriptPage';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { html_content } from '@/app/call-script/call-script-form/data/data';


interface TemplateViewerProps {
    templateId?: string
}

const TemplateGenerationSection: FC<TemplateViewerProps> = ({ templateId = "" }) => {
    const { contextData } = useAppData();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    console.log("log", contextData.assetGenerateStatus)

    const sidebarStep1 = () => {
        return (<div>
            <div>
                <Image
                    className='w-[267px] h-[420px]'
                    src="/images/landing_templates/landing3.png"
                    alt="call script"
                    width="267"
                    height="360"
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
        </div>)
    }

    const sidebarStep2 = () => {
        return (
            <div className='w-full h-full flex items-center justify-center overflow-y-scroll'>
                <img className='w-[350px] h-[550px]' src="/images/post-template.png" alt="" />
            </div>
        )
    }

    const sidebarStep3 = () => {
        return (
            <>
                {contextData.assetGenerateTemplate === "CALLSCRIPT" ? (
                    <TransformWrapper
                        initialScale={0.4}
                        minScale={0.4}
                        maxScale={0.4}
                        panning={{ lockAxisX: true }}
                        centerZoomedOut
                        smooth
                        centerOnInit
                    >
                        <TransformComponent
                            wrapperStyle={{ width: '100%', height: '100%' }}
                        >
                            <div dangerouslySetInnerHTML={{ __html: html_content }} />
                        </TransformComponent>
                    </TransformWrapper>
                ) : (
                    <div className='w-full h-full flex items-center justify-center overflow-y-scroll'>
                        <img className='w-[350px] h-[550px]' src="/images/Template1.png" alt="" />
                    </div>
                )}
            </>
        );
    }

    const renderAssetGenerateContent = () => {
        switch (contextData.assetGenerateTemplate) {
            case "LANDINGPAGE":
                return <LandingPage />;
            case "LINKEDIN":
                return <LinkedInPage />;
            case "CALLSCRIPT":
                return <CallScriptPage />;
            default:
                return null;
        }
    };


    return (
        <div className='min-h-[70vh]'>
            <div className="flex">
                <div className="flex-1 py-8">
                    <div className="flex items-center justify-center">
                        <p className="font-inter font-bold text-black text-lg tracking-[0] leading-[normal] whitespace-nowrap pb-[10px]">
                            Please provide the necessary information to generate AI content
                        </p>
                    </div>
                    <AssetGenerate>
                        {renderAssetGenerateContent()}
                    </AssetGenerate>
                </div>
                <div className="flex">
                    {contextData.assetGenerateStatus === 1 &&
                        <AssetViewer>
                            <div onClick={toggleSidebar} className='flex items-center w-[25px] h-14 gap-2.5 px-2 py-[18px] relative bg-[#00b188] rounded-[10px_0px_0px_10px] mt-[20px] cursor-pointer'>
                                <img src="/vector_right_arrow.svg" className={`relative w-[10.5px] h-[18.5px] mt-[-0.25px] mb-[-0.25px] mr-[-0.75px] transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`} alt="vector" />
                            </div>
                        </AssetViewer>
                    }
                    <div className={`bg-[#F5F5F7] flex items-center justify-center overflow-y-scroll scrollbar-hide transition-all duration-300 ease-in-out ${contextData.assetTemplateShow || isOpen ? (contextData.assetGenerateStatus === 1 ? 'w-[320px]' : 'w-[525px]') : 'w-[0px]'} h-[70vh]`}>
                        {contextData.assetGenerateStatus === 1 && sidebarStep1()}
                        {contextData.assetGenerateStatus === 2 && sidebarStep2()}
                        {contextData.assetGenerateStatus === 3 && sidebarStep3()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateGenerationSection;
