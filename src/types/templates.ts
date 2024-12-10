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
    isSuccess?: boolean,
    errorOnFailure?: string,
    assetID?: string,
    clientID?: string,
    campaignID?: string,
    assetContentVersionID?: string,
    assetName?: string,
    language?: string,
    assetAIPrompt?: string,
    isVisible?: number,
    layoutID?: string,
    layoutName?: string,
    layoutHTML?: string,
    assetContentVersions?: [
        {
            assetContentVersionID?: string,
            assetID?: string,
            version?: number,
            assetHTML?: string,
            layoutHTML?: string,
            htmlFileID?: number,
            zipFileID?: number
        }
    ],
    assetBlocks?: [
        {
            assetBlockID?: string,
            assetID?: string,
            blockID?: string,
            assetBlockDataVersionID?: string,
            type?: string,
            name?: string,
            html?: string,
            schema?: string,
            uiSchema?: string,
            description?: string,
            sortOrder?: number,
            assetBlockDataVersions?: [
                {
                    assetBlockDataVersionID?: string,
                    assetBlockID?: string,
                    version?: number,
                    aiPrompt?: string,
                    blockData?: string,
                    blockHTMLGenerated?: string
                }
            ]
        }
    ]
}

export interface AssetBlockProps {
    assetBlockID?: string,
    assetID?: string,
    blockID?: string,
    assetBlockDataVersionID?: string,
    type?: string,
    name?: string,
    html?: string,
    schema?: string,
    uiSchema?: string,
    description?: string,
    sortOrder?: number,
    assetBlockDataVersions?: [
        {
            assetBlockDataVersionID?: string,
            assetBlockID?: string,
            version?: number,
            aiPrompt?: string,
            blockData?: string,
            blockHTMLGenerated?: string
        }
    ]
}