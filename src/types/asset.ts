import { AssetType } from './assetTypes';

export interface ClientAssetTypeProps {
    clientAssetTypeID?: string,
    clientID?: string,
    assetTypeID?: string,
    isEnabled?: boolean,
    assetTypeName: string,
    description?: string,
    isActive?: number
}

export interface CampaignsProps {
    campaignID: string,
    project: string,
    campaignName: string,
    country: string,
    squad: string,
    startDate: string,
    endDate: string,
    status: string,
    isVisible: number
}

export interface AssetsProps {
    assetName: string,
    language: string,
    assetAIPrompt: string,
    isVisible: number,
    layoutID: string,
    assetTypeID: string,
    assetTypeName: string,
    modifiedOn: string,
    assetID: string
}

export interface AllAssetsTypeProps {
    project: string;
    campaignName: string;
    status: string;
    approvedBy: string;
    approvedOn: string;
    assetID: string;
    assetTypeName: string;
    clientID: string;
    campaignID: string;
    assetVersionID: string;
    assetName: string;
    language: string;
    createdOn: string;
    assetAIPrompt: string;
    isVisible: number;
    layoutID: string;
    layoutName: string;
    layoutHTML: string;
    assetVersions: AssetVersion[];
    isSuccess: boolean;
    errorOnFailure: string;
}

export interface AssetVersion {
    assetVersionID: string;
    assetID: string;
    templateID: string;
    versionNumber: number;
    versionName: string;
    htmlGenerated: string;
    htmlFileURL: string | null;
    zipFileURL: string | null;
    status: string;
}

export interface UserDetailsProps {
    userID: string;
    name: string;
    email: string;
    userRole: string;
    country: string;
    company: string;
    timeZone: string;
    isActive: number;
    fileUrl: string;
    preferredLLMModelID?: string;
}


export type AssetDetails = {
    project_name: string;
    campaign_name: string;
    asset_name: string;
};

export interface AllUserAssignedProps {
    assetID: string;
    assetVersionID: string;
    projectName: string;
    campaignName: string;
    versionName: string;
    assetName: string;
    approverName: string;
    assetTypeName: string;
    editorName: string;
    status: string;
    createdOn: string;
}

export interface AssetData {
    assetTypeIcon: string;
    assetName: string;
    // campaignID: string;
    campaignName: string;
    projectName: string;
    createdOn: string;
    currentStatus: string;
    assetID: string;
    approvedOn: string;
    approvedBy: string;
    [key: string]: string;
}

export { AssetType };