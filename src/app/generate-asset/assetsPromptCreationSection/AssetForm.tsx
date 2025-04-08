'use client';
import React, { Dispatch, SetStateAction } from 'react';
import { AIPromptAsset, Template } from '@/types/templates';
import { assetSectionConfig } from '@/app/generate-asset/config/assetConfig';
import BaseAssetForm from './BaseAssetForm';
import { PageType } from '@/componentsMap/pageMap';
import { FormDataProps } from '@/hooks/useInputFormDataGenerate';
import { AssetPromptResponse } from '@/types/apiResponses';

type AiPromptAssetUpsertFunc = (FormData: FormDataProps, assetID: string, promptID?: string) => Promise<AssetPromptResponse>;
type AiPromptCampaignUpsertFunc = (FormData: FormDataProps, fileID: number, campaign_id: string) => Promise<{ isSuccess: boolean; promptID?: string }>;

interface AssetFormProps {
  params: {
    template: Template;
    assetPrompts?: AIPromptAsset;
    project_name?: string;
    campaign_name?: string;
    asset_name?: string;
    assetType?: PageType;
    assetVersionID?: string;
    editContextData?: {
      topic?: string;
      keyPoints?: string;
      campaignGoal?: string;
      targetAudience?: string;
      webUrl?: string;
      outputScale?: string | null;
      tone?: string;
      type?: string;
    };
  };
  isEditMode?: boolean;
  aiPromptAssetUpsert?: AiPromptAssetUpsertFunc;
  aiPromptCampaignUpsert?: AiPromptCampaignUpsertFunc;
  existingAssetDetails?: {
    campaign_name: string;
    project_name: string;
    asset_name: string;
    campaign_id: string;
    asset_id: string;
  };
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

/**
 * Dynamic asset form that handles all asset types
 * Determines which configuration to use based on template.assetTypeName
 */
const AssetForm = ({ 
  params, 
  isEditMode, 
  aiPromptAssetUpsert, 
  aiPromptCampaignUpsert, 
  existingAssetDetails,
  setIsOpen
}: AssetFormProps) => {
  // Get asset type from params or from template
  const assetType = params.assetType || params.template?.assetTypeName as PageType;
  
  if (!assetType || !assetSectionConfig[assetType]) {
    return <div>Invalid asset type: {assetType}</div>;
  }

  return (
    <BaseAssetForm 
      params={params}
      assetType={assetType}
      assetSpecificSection={assetSectionConfig[assetType]}
      isEditMode={isEditMode}
      aiPromptAssetUpsert={aiPromptAssetUpsert}
      aiPromptCampaignUpsert={aiPromptCampaignUpsert}
      existingAssetDetails={existingAssetDetails}
      setIsOpen={setIsOpen}
    />
  );
};

export default AssetForm; 