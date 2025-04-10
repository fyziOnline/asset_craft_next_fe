/**
 * Common API response types
 * These types are used for API responses throughout the application
 */

export interface ApiResponse {
  isSuccess: boolean;
  message?: string;
}

export interface SectionResponse extends ApiResponse {
  blockID?: string;
  success?: boolean;
}

export interface AssetVersionResponse extends ApiResponse {
  assetVersionID: string;
  htmlGenerated?: string;
}

export interface AssetGenerateResponse extends ApiResponse {
  assetVersions: AssetVersionResponse[];
}

export interface AssetSelectResponse extends ApiResponse {
  assetID: string;
  assetVersions: AssetVersionResponse[];
  // Properties from AssetHtmlProps
  errorOnFailure?: boolean;
  clientID?: string;
  campaignID?: string;
  assetVersionID?: string;
  templateID?: string;
  assetName?: string;
  assetStatus?: string;
  assetAIPrompt?: string;
  language?: string;
  dateCreated?: string;
}

export interface AssetPromptResponse extends ApiResponse {
  promptID?: string;
}

export interface ImageUpdateResponse extends ApiResponse {
  fileID: number;
}

export interface CampaignAddResponse extends ApiResponse {
  campaignID: string;
}

export interface AssetAddResponse extends ApiResponse {
  assetID: string;
} 