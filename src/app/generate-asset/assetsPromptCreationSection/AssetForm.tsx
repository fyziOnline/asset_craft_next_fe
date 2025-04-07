'use client';
import React from 'react';
import { AIPromptAsset, Template } from '@/types/templates';
import { assetSectionConfig } from '@/app/generate-asset/config/assetConfig';
import BaseAssetForm from './BaseAssetForm';
import { PageType } from '@/componentsMap/pageMap';

interface AssetFormProps {
  params: {
    template: Template;
    assetPrompts?: AIPromptAsset;
    project_name?: string;
    campaign_name?: string;
    asset_name?: string;
    assetType?: PageType;
    editContextData?: {
      topic?: string;
      keyPoints?: string;
    };
  };
}

/**
 * Dynamic asset form that handles all asset types
 * Determines which configuration to use based on template.assetTypeName
 */
const AssetForm = ({ params }: AssetFormProps) => {
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
    />
  );
};

export default AssetForm; 