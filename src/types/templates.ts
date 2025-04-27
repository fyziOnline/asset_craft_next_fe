export interface Template {
    assetTypeID?: string,
    assetTypeName?: string,
    description?: string,
    isActive?: number,
    layoutID?: string,
    templateID?: string,
    templateImageURL?: string,
    templateName?: string,
    templatesBlocks?: TemplateBlocks[]
}

export interface TemplateBlocks {
    templateBlockID?: string;
    templateID?: string;
    blockID?: string;
    order?: number;
    aiTitle?: string;
    aiPrompt?: string | null;
    aiDescription?: string;
    isStatic?: boolean
}

export interface CampaignSelectResponse {
    aIPromptCampaign: {
        campaignID: string
        product: string
        campaignGoal: string
        targetAudience: string
        outputScale: number
        fileName: {} | string
        webUrl: string
    }
    isSuccess: boolean
    errorOnFailure: string
}
// later stage needed to extend the AIPromptAsset to create CampaignSelectResponse
export interface AIPromptAsset {
    assetID: string
    topic: string
    type: string
    keyPoints: string
    targetAudience: string
    tone: string
    outputScale: number
    primaryMessage?: string
    additionalInfo?: string
  }


export interface AssetHtmlProps {
    isSuccess: boolean,
    errorOnFailure: string,
    assetID: string,
    clientID: string,
    campaignID: string,
    assetVersionID: string,
    assetName: string,
    language: string,
    assetAIPrompt: string,
    isVisible: number,
    layoutID: string,
    layoutName: string,
    layoutHTML: string,
    assetVersions: AssetVersionProps[]
}

export type AssetHTMLData = Omit<
    AssetHtmlProps,
    "isSuccess" | "errorOnFailure" |  "assetVersions" 
>


export interface AssetVersionProps {
    assetVersionID: string,
    assetID: string,
    templateID?:string
    versionNumber: number,
    versionName: string,
    htmlGenerated: string,
    layoutHTMLGenerated: string,
    htmlFileURL: string,
    zipFileURL: string,
    status?: string,
    assetVersionBlocks: AssetBlockProps[]
}

export interface AssetBlockProps {
    assetVersionBlockID: string,
    assetVersionID: string,
    blockID: string,
    blockName: string,
    aiPrompt: string,
    blockData: string,
    blockHTMLGenerated: string,
    sortOrder: number,
    description: string,
    type: string,
    schema: string,
    uiSchema: string,
    html: string,
    ignoreBlock: number,
    isStatic: boolean
}

export interface ProjectDetails {
    project_name: string
    campaign_name: string
    asset_name: string
    campaignID: string
}