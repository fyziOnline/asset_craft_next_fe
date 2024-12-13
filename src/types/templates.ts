export interface Template {
    assetTypeID?: string,
    assetTypeName?: string,
    description: string,
    isActive?: number,
    layoutID?: string,
    templateID: string,
    templateImageURL: string,
    templateName: string,
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
    assetVersions: [
        {
            assetVersionID: string,
            assetID: string,
            versionNumber: number,
            versionName: string,
            htmlGenerated: string,
            layoutHTMLGenerated: string,
            htmlFileURL: string,
            zipFileURL: string,
            assetVersionBlocks: [
                {
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
                    html: string
                }
            ]
        }
    ]
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
    html: string
}