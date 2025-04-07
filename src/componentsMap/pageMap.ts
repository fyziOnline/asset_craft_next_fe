import AssetForm from "@/app/generate-asset/assetsPromptCreationSection/AssetForm"
import { AIPromptAsset, Template } from "@/types/templates"
import { ComponentType } from "react"
import { AssetType } from "@/types/assetTypes"

// Export the AssetType enum for backward compatibility
export { AssetType as PageType };

// For backwards compatibility - allow both enum values and legacy string
export type LegacyPageType = AssetType | 'Callscript (WIP)';

interface PageParams {
    params: {
        template: Template
        assetPrompts?: AIPromptAsset 
        project_name?: string
        campaign_name?:string
        asset_name?: string
        editContextData?: {
            topic?: string;
            keyPoints?: string;
        }
    }
}

// Map using the enum as keys
const PAGE_COMPONENT: Record<LegacyPageType, ComponentType<PageParams>> = {
    [AssetType.EMAIL]: AssetForm,
    [AssetType.LINKEDIN]: AssetForm,
    [AssetType.LANDING_PAGE]: AssetForm,
    [AssetType.CALL_SCRIPT]: AssetForm,
    'Callscript (WIP)': AssetForm // Legacy key - will be removed once migration is complete
} as Record<LegacyPageType, ComponentType<PageParams>>;

export default PAGE_COMPONENT