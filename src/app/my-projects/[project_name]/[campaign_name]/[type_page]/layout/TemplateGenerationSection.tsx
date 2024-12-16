'use client';
import React, { FC, useState } from 'react';
import Image from 'next/image';
import { ListTypePage } from '@/data/dataGlobal';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { useAppData } from '@/context/AppContext';
import LandingPage from '../asset-generate/LandingPage';
import LinkedInPage from '../asset-generate/LinkedinPage';
import CallScriptPage from '../asset-generate/CallScriptPage';
import EmailPage from '../asset-generate/EmailPage';
import { Template } from '@/types/templates';

interface TemplateViewerProps {
    params: {
        assetID: string,
        campaignID: string,
        template: Template
        type_page: string
    }
}

const TemplateGenerationSection: FC<TemplateViewerProps> = ({ params }) => {
    const { contextData } = useAppData();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const renderAssetGenerateContent = () => {
        switch (params.type_page) {
            case ListTypePage.Email:
                return <EmailPage params={{ assetID: params.assetID, campaignID: params.campaignID, template: params.template }} />;
            case ListTypePage.LandingPage:
                return <LandingPage />;
            case ListTypePage.LinkedIn:
                return <LinkedInPage />;
            case ListTypePage.CallScript:
                return <CallScriptPage />;
            default:
                return null;
        }
    };

    const sidebarStep1 = () => {

        const content = (title: string, content: string) => {
            return (
                <>
                    <span className="font-semibold">{title}</span><br />
                    <span className="[font-family:'Inter-Regular',Helvetica] text-[10px]">{content}<br /></span>
                    <span className="[font-family:'Inter-Regular',Helvetica]"> <br /></span>
                </>
            )
        }

        return (<div>
            <div className='py-5'>
                <Image
                    src={params.template?.templateImageURL || ""}
                    alt="call script"
                    width="267"
                    height="360"
                />
                <p className="w-[275px] mt-[16px] [font-family:'Inter-SemiBold',Helvetica] font-normal text-black text-[11px] tracking-[0] leading-[normal]">
                    {content("Section 1: Event Overview", "Overview of essential details: title, date, location, purpose, and a CTA to attract attendees.")}
                    {content("Section 2: Event Agenda", "Detailed event schedule: session timings, key activities, speakers, and closing plans.")}
                    {content("Section 3: Key Benefits and Highlights", "Event value summary: main benefits, featured technologies, and the target audience.")}
                    {content("Section 4: Partnership and Sponsorship", "Sponsor recognition: list of sponsors by level with logos and optional sponsor descriptions.")}
                </p>
            </div>
        </div>)
    }

    const sidebarStep2 = () => {
        return (
            <div className='w-[70%] h-[90%] relative'>
                <Image
                    src={params.template?.templateImageURL || ""}
                    alt=""
                    fill
                    className="object-fill"
                />
            </div>
        )
    }

    const sidebarStep3 = () => {
        return (
            <>
                {[ListTypePage.Email, ListTypePage.CallScript].includes(params.type_page) ? (
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
                            <div dangerouslySetInnerHTML={{ __html: contextData.AssetHtml?.assetVersions?.[0]?.htmlGenerated || "" }} />
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

    return (
        <div className='min-h-[70vh]'>
            <div className="flex">
                <div className="flex-1 py-8">
                    <div className="flex items-center justify-center">
                        <p className="font-inter font-bold text-black text-lg tracking-[0] leading-[normal] whitespace-nowrap pb-[10px]">
                            Please provide the necessary information to generate AI content
                        </p>
                    </div>
                    <div className='px-[10%] overflow-y-scroll scrollbar-hide h-[62vh]'>
                        {renderAssetGenerateContent()}
                    </div>
                </div>
                <div className="flex">
                    {contextData.assetGenerateStatus === 1 &&
                        <div>
                            <div onClick={toggleSidebar} className='flex items-center w-[25px] h-14 gap-2.5 px-2 py-[18px] relative bg-[#00b188] rounded-[10px_0px_0px_10px] mt-[20px] cursor-pointer'>
                                <img src="/vector_right_arrow.svg" className={`relative w-[10.5px] h-[18.5px] mt-[-0.25px] mb-[-0.25px] mr-[-0.75px] transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`} alt="vector" />
                            </div>
                        </div>
                    }
                    <div className={`bg-[#F5F5F7] h-[72vh] flex items-center justify-center overflow-y-scroll scrollbar-hide transition-all duration-300 ease-in-out ${contextData.assetTemplateShow || isOpen ? (contextData.assetGenerateStatus === 1 ? 'w-[320px]' : 'w-[525px]') : 'w-[0px]'}`}>
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
