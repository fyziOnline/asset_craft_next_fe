'use client';
import React, { FC, useState } from 'react';
import Image from 'next/image';
import { Template } from '@/types/templates';
import { useGenerateAssetStoreSelector } from '@/store/generatAssetStore';
import AssetForm from '../assetsPromptCreationSection/AssetForm';
import { AssetType } from '@/types/assetTypes';

interface TemplateViewerProps {
    params: {
        template: Template
        type_page: AssetType
    }
}

const TemplateGenerationSection: FC<TemplateViewerProps> = ({ params }) => {
    console.log('params in template generation section :',params);
    
    const assetGenerateSteps = useGenerateAssetStoreSelector.use.assetGenerateSteps()

    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const renderAssetGenerateContent = () => {
        // const Component = PAGE_COMPONENT[params.type_page]
        return <AssetForm params= {params} />
        // return Component ? <Component params={params} /> : null
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

        return (
            <div className='py-5 h-[100%]'>
                <Image
                    src={params.template?.templateImageURL || ""}
                    alt={params.type_page}
                    width="267"
                    height="360"
                />
                <div className='h-7' />
            </div>
        )
    }

    const sidebarStep2 = () => {

        return (
            <div className='w-[94%] h-[94%] relative'>
                <Image
                    src={params.template?.templateImageURL || ""}
                    alt=""
                    fill
                    className="object-contain"
                />
            </div>
        )
    }

    // const sidebarStep3 = () => {
    //     return (
    //         <>
    //             <div className='pointer-events-none' dangerouslySetInnerHTML={{ __html: contextData.AssetHtml?.assetVersions?.[0]?.htmlGenerated || "" }} />
    //         </>
    //     );
    // }

    return (
        <div className='min-h-[82vh]'>
            <div className="flex">
                <div className="flex-1 py-4">
                    <div className="flex items-center justify-center">
                        <p className="font-bold text-black text-lg tracking-[0] leading-[normal] whitespace-nowrap pb-[20px] pt-4">
                            {/* Please provide the necessary information to generate AI content */}
                        </p>
                    </div>
                    <div className="px-[10%] overflow-y-scroll h-[82vh] thin-scrollbar">
                        {renderAssetGenerateContent()}
                    </div>
                </div>
                <div className="flex">
                    {assetGenerateSteps === 1 &&
                        <div className='ml-1'> 
                            <div onClick={toggleSidebar} className='flex items-center w-[25px] h-14 gap-2.5 px-2 py-[18px] relative bg-[#00b188] rounded-[10px_0px_0px_10px] mt-[20px] cursor-pointer'>
                                <img src="/vector_right_arrow.svg" className={`relative w-[10.5px] h-[18.5px] mt-[-0.25px] mb-[-0.25px] mr-[-0.75px] transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`} alt="vector" />
                            </div>
                        </div>
                    }
                    <div className={`bg-[#F5F5F7] min-h-screen flex items-center justify-center overflow-y-scroll scrollbar-hide transition-all duration-300 ease-in-out ${ isOpen ? (assetGenerateSteps === 1 ? 'w-[320px]' : 'w-[525px]') : 'w-[0px]'}`}>
                        {assetGenerateSteps === 1 && sidebarStep1()}
                        {assetGenerateSteps === 2 && sidebarStep2()}
                        {/* {assetGenerateSteps === 3 && sidebarStep3()} */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateGenerationSection;
