'use client';
import React, { FC } from 'react';
import LandingPage from '../asset-generate/LandingPage';
import LinkedInPage from '../asset-generate/LinkedinPage';
import CallScriptPage from '../asset-generate/CallScriptPage';
import { ListTypePage } from '@/data/dataGlobal';

interface TemplateViewerProps {
    params: {
        templateId?: string,
        campaignId?: string,
        type_page?: string
    }
}

const TemplateGenerationSection: FC<TemplateViewerProps> = ({ params }) => {
    const renderAssetGenerateContent = () => {
        switch (params.type_page) {
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
            </div>
        </div>
    );
};

export default TemplateGenerationSection;
