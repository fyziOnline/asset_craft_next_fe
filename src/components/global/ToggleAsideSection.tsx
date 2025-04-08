'use client';
import PAGE_COMPONENT, { PageType } from '@/componentsMap/pageMap';
import { useAppData } from '@/context/AppContext';
import { useEditData } from '@/context/EditContext';
import { useGetTemplates } from '@/hooks/useGetTemplates';
import { useRawAIOutput } from '@/hooks/useRawAIOutput';
import { ApiService } from '@/lib/axios_generic';
import { AssetVersionProps, Template, TemplateBlocks } from '@/types/templates';
import { Dispatch, FC, SetStateAction, useCallback, memo, useEffect, useState } from 'react';
import { MdDescription } from 'react-icons/md';
import MarkdownPopup from './MarkdownPopup';
import { useGenerateTemplate } from '@/hooks/useGenerateTemplate';

// Define a type for the campaign prompt data
interface CampaignPromptData {
    campaignGoal?: string;
    targetAudience?: string;
    webUrl?: string;
}

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
    isEditMode?: boolean;
}

const ToggleAsideSection: FC<ToggleAsideSectionProps> = memo(
    ({ isOpen, setIsOpen, versionSelected, existingAssetDetails, asideRef, isEditMode = false }) => {
        const { setError } = useAppData();
        const { editSection, setEditSection } = useEditData();
        const [templateDetails, setTemplateDetails] = useState<Template | null>(null);
        const [isMarkdownPopupOpen, setIsMarkdownPopupOpen] = useState(false);
        // Add state for campaign prompt data
        const [campaignPromptData, setCampaignPromptData] = useState<CampaignPromptData | null>(null); 
        // Get baseRawPrompt from the hook
        const { fetchRawAIOutput, isLoading: isLoadingRawAI, rawAIOutput, assetAIPrompt, baseRawPrompt } = useRawAIOutput();

        const { getTemplateById, getAiPromptAssetSelect, getAiPromptCampaignSelect } = useGetTemplates({ type_page: "" });
        const { aiPromptAssetUpsert, aiPromptCampaignUpsert } = useGenerateTemplate({ params: { templateID: templateDetails?.templateID || '' } });

        // Toggle sidebar open/close state.
        const toggleAside = useCallback(() => {
            setIsOpen(prev => !prev);
        }, [setIsOpen]);

        const fetchTemplateData = async () => {
            try {
                // Ensure we have a valid templateID
                if (!versionSelected?.templateID) {
                    console.warn("No template ID selected.");
                    return; 
                }
                const res = await getTemplateById(versionSelected.templateID)
                if (res && res.isSuccess) {
                    // Extract template data from the response
                    const fetchedTemplate: Template = {
                        assetTypeID: res.assetTypeID,
                        assetTypeName: res.assetTypeName,
                        description: res.description,
                        isActive: res.isActive,
                        layoutID: res.layoutID,
                        templateID: res.templateID,
                        templateImageURL: res.templateImageURL,
                        templateName: res.templateName,
                        templatesBlocks: res.templatesBlocks
                    };

                    const updatedTemplateBlocks = fetchedTemplate.templatesBlocks?.map((item): TemplateBlocks => (
                        {
                            ...item,
                            aiPrompt: versionSelected?.assetVersionBlocks.find(block => block.blockID === item.blockID)?.aiPrompt
                        }
                    ))
                    const finalTemplate = { ...fetchedTemplate, templatesBlocks: updatedTemplateBlocks }
                    setEditSection({ templateData: finalTemplate });
                    setTemplateDetails(finalTemplate)
                } else {
                     throw new Error(res?.message || "Failed to fetch template details");
                }
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
                 if (!existingAssetDetails?.asset_id) {
                    console.warn("No asset ID available.");
                    return;
                }
                const aiAssetRes = await getAiPromptAssetSelect(existingAssetDetails?.asset_id)
                if (aiAssetRes && aiAssetRes.isSuccess) {
                    // Convert outputScale to string to match context type
                    const aiPromptDataForContext = {
                        ...aiAssetRes.aIPromptAsset,
                        outputScale: aiAssetRes.aIPromptAsset.outputScale?.toString() ?? null
                    };
                    // ---- Log 1: Data fetched for context ----
                    console.log("[ToggleAsideSection] Fetched AI Prompt Data for Context:", aiPromptDataForContext);
                    setEditSection({ aiPrompt: aiPromptDataForContext })
                } else {
                     throw new Error(aiAssetRes?.message || "Failed to fetch AI prompt asset details");
                }
            } catch (error) {
                const apiError = ApiService.handleError(error)
                setError({
                    status: apiError.statusCode,
                    message: apiError.message,
                    showError: true
                })
            }
        }

        // Add function to fetch campaign prompt data
        const fetchAiPromptCampaign = async () => {
            try {
                 if (!existingAssetDetails?.campaign_id) {
                    console.warn("No campaign ID available.");
                    return;
                }
                const aiCampaignRes = await getAiPromptCampaignSelect(existingAssetDetails.campaign_id);
                if (aiCampaignRes && aiCampaignRes.isSuccess) {
                    const fetchedData = aiCampaignRes.aIPromptCampaign;
                    const campaignDataForState: CampaignPromptData = {
                        campaignGoal: fetchedData.campaignGoal,
                        targetAudience: fetchedData.targetAudience,
                        webUrl: fetchedData.webUrl,
                    };
                     // console.log("[ToggleAsideSection] Fetched AI Campaign Data:", campaignDataForState); // Remove log
                    setCampaignPromptData(campaignDataForState);
                } else {
                     throw new Error(aiCampaignRes?.message || "Failed to fetch AI prompt campaign details");
                }
            } catch (error) {
                 const apiError = ApiService.handleError(error);
                 setError({
                    status: apiError.statusCode,
                    message: apiError.message,
                    showError: true
                });
            }
        };

        const handleViewRawAIOutput = async () => {
            try {
                if (existingAssetDetails?.asset_id || versionSelected?.assetVersionID) {
                    await fetchRawAIOutput({
                        assetID: existingAssetDetails?.asset_id,
                        assetVersionID: versionSelected?.assetVersionID
                    });
                    setIsMarkdownPopupOpen(true);
                }
            } catch (error) {
                const apiError = ApiService.handleError(error);
                setError({
                    status: apiError.statusCode,
                    message: apiError.message,
                    showError: true
                });
            }
        };

        const renderAssetGenerateContent = () => {
            if (!templateDetails?.assetTypeName) {
                return null
            }

            const Component = PAGE_COMPONENT[templateDetails?.assetTypeName as PageType]
            
            // ---- Log 2: Props passed to the specific asset component ----
            const propsToPass = {
                template: templateDetails,
                project_name: existingAssetDetails?.project_name,
                campaign_name: existingAssetDetails?.campaign_name,
                asset_name: existingAssetDetails?.asset_name,
                editContextData: {
                    // Asset specific fields from context
                    topic: editSection.aiPrompt?.topic,
                    keyPoints: editSection.aiPrompt?.keyPoints,
                    tone: editSection.aiPrompt?.tone,
                    type: editSection.aiPrompt?.type,
                    
                    // Campaign specific fields from component state
                    campaignGoal: campaignPromptData?.campaignGoal,
                    targetAudience: campaignPromptData?.targetAudience,
                    webUrl: campaignPromptData?.webUrl,
                    // Use outputScale from the Asset Prompt context (editSection)
                    outputScale: editSection.aiPrompt?.outputScale // Already string or null from context fetch
                }
            };
            // ---- Remove Logs ----
            // console.log("[ToggleAsideSection] OutputScale from context:", editSection.aiPrompt?.outputScale);
            // console.log("[ToggleAsideSection] editContextData being passed:", propsToPass.editContextData);

            return Component ?
                <>
                    <div className="relative">
                        <Component params={propsToPass}
                            isEditMode={isEditMode}
                            aiPromptAssetUpsert={aiPromptAssetUpsert}
                            aiPromptCampaignUpsert={aiPromptCampaignUpsert}
                            existingAssetDetails={existingAssetDetails}
                        />
                        
                        {/* Absolute positioned button that will appear on the same line as Generate */}
                        <div className="absolute bottom-[3px] left-5">
                            <button
                                onClick={handleViewRawAIOutput}
                                disabled={isLoadingRawAI}
                                className="flex items-center gap-2 text-[#00b188] hover:text-[#008c6a] transition-colors p-2"
                                title="View Raw AI Output"
                            >
                                <MdDescription size={20} />
                                <span className="text-sm">View</span>
                            </button>
                        </div>
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
            // Fetch campaign data as well
            if (existingAssetDetails && existingAssetDetails.campaign_id) { 
                fetchAiPromptCampaign();
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

                <MarkdownPopup
                    markdownContent={rawAIOutput}
                    promptContent={assetAIPrompt}
                    basePromptContent={baseRawPrompt}
                    isOpen={isMarkdownPopupOpen}
                    onClose={() => setIsMarkdownPopupOpen(false)}
                />
            </div>
        )
    })

ToggleAsideSection.displayName = 'ToggleAsideSection';

export default ToggleAsideSection;