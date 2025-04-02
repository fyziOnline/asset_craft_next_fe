import PAGE_COMPONENT, { PageType } from '@/componentsMap/pageMap';
import { useAppData } from '@/context/AppContext';
import { useEditData } from '@/context/EditContext';
import { useGetTemplates } from '@/hooks/useGetTemplates';
import { ApiService } from '@/lib/axios_generic';
import { AIPromptAsset, AssetVersionProps, Template, TemplateBlocks } from '@/types/templates';
import { Dispatch, FC, SetStateAction, useCallback, memo, useEffect, useState } from 'react';

interface ToggleAsideSectionProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    children?: React.ReactNode;
    versionSelected: AssetVersionProps | null;
    existingAssetDetails?: {
        campaign_name: string;
        project_name: string;
        asset_name: string;
        campaign_id: string;
        asset_id: string;
    };
    asideRef?: React.RefObject<HTMLDivElement>;
}


const ToggleAsideSection: FC<ToggleAsideSectionProps> = memo(
    ({ isOpen, setIsOpen, versionSelected, existingAssetDetails ,asideRef }) => {
        const { setError } = useAppData();
        const { setEditSection } = useEditData();
        const [templateDetails, setTemplateDetails] = useState<Template | null>(null);

        const { getTemplateById, getAiPromptAssetSelect } = useGetTemplates({ type_page: "" });

        // Toggle sidebar open/close state.
        const toggleAside = useCallback(() => {
            setIsOpen(prev => !prev);
        }, [setIsOpen]);

        const fetchTemplateData = async () => {
            try {
                let res_template: Template = await getTemplateById(versionSelected?.templateID)
                const updatedTemplateBlocks = res_template.templatesBlocks?.map((item): TemplateBlocks => (
                    {
                        ...item,
                        aiPrompt: versionSelected?.assetVersionBlocks.find(block => block.blockID === item.blockID)?.aiPrompt
                    }
                ))
                res_template = { ...res_template, templatesBlocks: updatedTemplateBlocks }
                setEditSection({ templateData: res_template });
                setTemplateDetails(res_template)
            } catch (error) {
                const apiError = ApiService.handleError(error)
                setError({
                    status: apiError.statusCode,
                    message: apiError.message,
                    showError: true
                })
            }
        }

        const fetchAiPromptAsset = async () => {
            try {
                let aiAssetRes = await getAiPromptAssetSelect(existingAssetDetails?.asset_id)
                setEditSection({ aiPrompt: aiAssetRes.aIPromptAsset })
            } catch (error) {
                const apiError = ApiService.handleError(error)
                setError({
                    status: apiError.statusCode,
                    message: apiError.message,
                    showError: true
                })
            }
        }

        const renderAssetGenerateContent = () => {
            if (!templateDetails?.assetTypeName) {
                return null
            }

            const Component = PAGE_COMPONENT[templateDetails?.assetTypeName as PageType]
            return Component ?
                <>
                    <div>
                        <Component params={
                            {
                                template: templateDetails,
                                project_name: existingAssetDetails?.project_name,
                                campaign_name: existingAssetDetails?.campaign_name,
                                asset_name: existingAssetDetails?.asset_name
                            }} />
                    </div>
                </> : null
        };

        useEffect(() => {
            if (versionSelected && versionSelected.templateID) {
                fetchTemplateData();
            }
        }, [versionSelected]);

        useEffect(() => {
            if (existingAssetDetails && existingAssetDetails.asset_id) {
                fetchAiPromptAsset();
            }
        }, [existingAssetDetails]);


        if (!versionSelected || !existingAssetDetails) {
            return null;
        }


        return (
            <div className={`absolute flex top-0 h-full right-0 ${isOpen ? 'min-w-[40vw] ' : 'w-[0px]'}`}>
                <div ref={asideRef} className={`bg-[#F5F5F7] pb-28 h-full overflow-y-scroll flex items-center justify-center transition-all duration-300 ease-in-out absolute top-[-41px] right-0 ${isOpen ? 'w-full' : 'w-[0px]'}`}
                    style={{ zIndex: 10 }} // Sidebar stays above content
                >
                    {isOpen && (
                        <div className='w-full h-full px-5 py-3 overflow-y-auto'>
                            {renderAssetGenerateContent()}
                        </div>
                    )}
                </div>

                <div
                    onClick={toggleAside}
                    className={`absolute top-[1rem] transform -translate-y-1/2 flex items-center w-[25px] h-14 gap-2.5 px-2 py-[18px] bg-[#00b188] rounded-[10px_0px_0px_10px] cursor-pointer transition-all duration-300`}
                    style={{ right: isOpen ? '100%' : '0px', zIndex: 20 }}
                >
                    <svg
                        width="8"
                        height="16"
                        viewBox="0 0 8 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
                    >
                        <path
                            d="M1.5 1L6.5 6L1.5 11"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </div>
        )
    })


export default ToggleAsideSection;