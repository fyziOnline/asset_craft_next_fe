'use client'
import { FC, useState, useRef, useEffect } from 'react'
import { MdDescription } from 'react-icons/md'
import { useAppData } from '@/context/AppContext'
import { ApiService } from '@/lib/axios_generic'
import { AIPromptAsset, AssetVersionProps, Template, TemplateBlocks } from '@/types/templates'
import PAGE_COMPONENT, { PageType } from '@/componentsMap/pageMap'
import { useGetTemplates } from '@/hooks/useGetTemplates'
import { useRawAIOutput } from '@/hooks/useRawAIOutput'
import { useGenerateTemplate } from '@/hooks/useGenerateTemplate'
import MarkdownPopup from '@/components/global/MarkdownPopup'
import BaseToggleAside from '@/components/global/BaseToggleAsideSection'

// Define a type for the campaign prompt data
interface CampaignPromptData {
    campaignGoal?: string
    targetAudience?: string
    webUrl?: string
    fileName?: string
}

interface AssetToggleAsideProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    versionSelected?: AssetVersionProps | null
    existingAssetDetails?: {
        campaign_name: string
        project_name: string
        asset_name: string
        campaign_id: string
        asset_id: string
    }
    isEditMode?: boolean
}

const AssetToggleAside: FC<AssetToggleAsideProps> = ({
    isOpen,
    setIsOpen,
    versionSelected,
    existingAssetDetails,
    isEditMode = false
}) => {
    const asideRef = useRef<HTMLDivElement>(null)
    const { setError } = useAppData()

    const [templateDetails, setTemplateDetails] = useState<Template | null>(null)
    const [aiPromptAssetData,setAIPromptAssetData] = useState<AIPromptAsset | Record<string, any> | null>(null)
    
    const [isMarkdownPopupOpen, setIsMarkdownPopupOpen] = useState(false)
    const [campaignPromptData, setCampaignPromptData] = useState<CampaignPromptData | null>(null)
    
    const { fetchRawAIOutput, isLoading: isLoadingRawAI, rawAIOutput, assetAIPrompt, baseRawPrompt } = useRawAIOutput()
    const { getTemplateById, getAiPromptAssetSelect, getAiPromptCampaignSelect } = useGetTemplates({ type_page: "" })
    const { aiPromptAssetUpsert, aiPromptCampaignUpsert } = useGenerateTemplate({ 
        params: { templateID: templateDetails?.templateID || '' } 
    })

    const handleViewRawAIOutput = async () => {
        try {
            if (existingAssetDetails?.asset_id || versionSelected?.assetVersionID) {
                await fetchRawAIOutput({
                    assetID: existingAssetDetails?.asset_id,
                    assetVersionID: versionSelected?.assetVersionID
                })
                setIsMarkdownPopupOpen(true)
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
                } as AIPromptAsset | Record<string,any>
                setAIPromptAssetData(aiPromptDataForContext)
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
                    fileName:fetchedData.fileName
                };
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

    const renderAssetGenerateContent = () => {
        if (!templateDetails?.assetTypeName) {
            return null
        }

        const Component = PAGE_COMPONENT[templateDetails?.assetTypeName as PageType]
        
        const propsToPass = {
            template: templateDetails,
            project_name: existingAssetDetails?.project_name,
            campaign_name: existingAssetDetails?.campaign_name,
            asset_name: existingAssetDetails?.asset_name,
            assetVersionID: versionSelected?.assetVersionID,
            editContextData: {
                // Asset specific fields from context

                topic: aiPromptAssetData?.topic,
                keyPoints: aiPromptAssetData?.keyPoints,
                tone: aiPromptAssetData?.tone,
                type: aiPromptAssetData?.type,
                
                // Campaign specific fields from component state
                campaignGoal: campaignPromptData?.campaignGoal,
                targetAudience: campaignPromptData?.targetAudience,
                webUrl: campaignPromptData?.webUrl,
                outputScale: aiPromptAssetData?.outputScale, // Already string or null from context fetch
                fileName:campaignPromptData?.fileName
            }
        };


        return Component ? (
            <Component 
                params={propsToPass}
                isEditMode={isEditMode}
                aiPromptAssetUpsert={aiPromptAssetUpsert}
                aiPromptCampaignUpsert={aiPromptCampaignUpsert}
                existingAssetDetails={existingAssetDetails}
                setIsOpen={setIsOpen}
            />
        ) : null
    }

    useEffect(() => {
        if (versionSelected && versionSelected.templateID) {
            fetchTemplateData()
        }
    }, [versionSelected])

    useEffect(() => {
        if (existingAssetDetails && existingAssetDetails.asset_id) {
            fetchAiPromptAsset()
        }
        if (existingAssetDetails && existingAssetDetails.campaign_id) { 
            fetchAiPromptCampaign()
        }
    }, [existingAssetDetails])

    if (!versionSelected || !existingAssetDetails) {
        return null
    }

    return (
        <BaseToggleAside
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            asideRef={asideRef}
            width="40vw"
            backgroundColor="#F5F5F7"
            toggleButtonColor="#00b188"
            toggleButtonSize={{ width: "25px", height: "56px" }}
        >
            <div className='w-full px-5 pt-10 pb-5 relative overflow-y-auto'> 
                <div className="absolute top-2 right-4">
                    <button
                        onClick={handleViewRawAIOutput}
                        disabled={isLoadingRawAI}
                        className="flex items-center gap-1 text-[#00b188] hover:text-[#008c6a] transition-colors p-1 rounded hover:bg-gray-200 bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="View Raw AI Output"
                    >
                        <MdDescription size={18} />
                        <span className="text-xs">View AI Data</span>
                    </button>
                </div>
                {renderAssetGenerateContent()}
            </div>
            

            <MarkdownPopup
                markdownContent={rawAIOutput}
                promptContent={assetAIPrompt}
                basePromptContent={baseRawPrompt}
                isOpen={isMarkdownPopupOpen}
                onClose={() => setIsMarkdownPopupOpen(false)}
                projectName={existingAssetDetails.project_name}
                campaignName={existingAssetDetails.campaign_name}
                assetName={existingAssetDetails.asset_name}
            />
        </BaseToggleAside>
    )
}

export default AssetToggleAside