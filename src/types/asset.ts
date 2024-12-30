import { AssetVersionProps } from "./templates";

export interface AssetInProgressProps {
    assetVersionId?: string,
    projectName: string,
    campaignName: string,
    assetName: string,
    versionName: string,
    assetType?: string,
    createdOn: string,
    approvedBy: string,
    approvedOn: string,
    currentStatus: string,
    assetVersion: AssetVersionProps
}