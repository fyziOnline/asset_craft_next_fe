import { AssetType } from '../../../types/assetTypes';
import GenericAssetSection from '@/app/generate-asset/assetsPromptCreationSection/GenericAssetSection';
import { AIPromptAsset } from '../../../types/templates';
import { FC } from 'react';

// GenericAssetSection Props Interface
export interface AssetSectionProps {
  existingData: AIPromptAsset | null;
  handleInputChange: (field: string, value: string) => void;
  onValidationChange: (isValid: boolean) => void;
  assetType?: string;
}

// Field label structure
export interface FieldLabel {
  title: string;
  placeholder: string;
}

// Section labels structure
export interface AssetSectionLabels {
  primaryMessage: FieldLabel;
  additionalInfo: FieldLabel;
}

// Component configuration
export interface AssetSectionConfig {
  title: string;
  requiredFields: string[];
  component: FC<AssetSectionProps>;
}

// Complete asset configuration in one place
export interface AssetConfig {
  sectionConfig: AssetSectionConfig;
  labels: AssetSectionLabels;
}

// Default labels for when an asset type doesn't have specific labels
const defaultLabels: AssetSectionLabels = {
  primaryMessage: {
    title: "What is the primary message of this content?",
    placeholder: "Enter the primary message"
  },
  additionalInfo: {
    title: "Provide additional information that supports the main message.",
    placeholder: "Enter details of the asset you want to create"
  }
};

// Unified asset configuration - single source of truth
export const assetConfig: Record<AssetType, AssetConfig> = {
  [AssetType.EMAIL]: {
    sectionConfig: {
      title: 'Email - Key Messages & Content',
      requiredFields: ['primaryMessage'],
      component: GenericAssetSection
    },
    labels: {
      primaryMessage: {
        title: "What is the primary message of your email?",
        placeholder: "Enter the main email message"
      },
      additionalInfo: {
        title: "Provide additional information that supports the main message.",
        placeholder: "Enter supporting information, features, or call-to-action details"
      }
    }
  },
  [AssetType.LINKEDIN]: {
    sectionConfig: {
      title: 'LinkedIn - Key Messages & Content',
      requiredFields: ['primaryMessage'],
      component: GenericAssetSection
    },
    labels: {
      primaryMessage: {
        title: "What is the primary message of your LinkedIn post?",
        placeholder: "Enter the main message for your LinkedIn post"
      },
      additionalInfo: {
        title: "Provide additional information that supports the main message.",
        placeholder: "Enter supporting information, relevant hashtags, or call-to-action details"
      }
    }
  },
  [AssetType.LANDING_PAGE]: {
    sectionConfig: {
      title: 'Landing Page - Key Messages & Content',
      requiredFields: ['primaryMessage'],
      component: GenericAssetSection
    },
    labels: {
      primaryMessage: {
        title: "What is the primary message of the landing page?",
        placeholder: "Primary message"
      },
      additionalInfo: {
        title: "Provide additional information that supports the main message.",
        placeholder: "Enter details of the asset you want to create"
      }
    }
  },
  [AssetType.CALL_SCRIPT]: {
    sectionConfig: {
      title: 'Call Script - Tone, Style, and Objections',
      requiredFields: ['primaryMessage'],
      component: GenericAssetSection
    },
    labels: {
      primaryMessage: {
        title: "What is the primary goal of this call script?",
        placeholder: "Enter the main purpose of the call script"
      },
      additionalInfo: {
        title: "Provide additional talking points or objection handling.",
        placeholder: "Enter key talking points, objection responses, or specific information to mention"
      }
    }
  }
};

/**
 * Helper function to get section config for an asset type
 */
export function getAssetSectionConfig(assetType: string): AssetSectionConfig {
  if (!assetType || !assetConfig[assetType as AssetType]) {
    // Return a default config if asset type not found
    return {
      title: 'Asset Content',
      requiredFields: ['primaryMessage'],
      component: GenericAssetSection
    };
  }
  
  return assetConfig[assetType as AssetType].sectionConfig;
}

/**
 * Helper function to get labels for an asset type
 */
export function getAssetLabels(assetType?: string): AssetSectionLabels {
  if (!assetType || !assetConfig[assetType as AssetType]) {
    return defaultLabels;
  }
  
  return assetConfig[assetType as AssetType].labels;
}

/**
 * For backward compatibility - get just the section config mapping
 */
export const assetSectionConfig: Record<AssetType, AssetSectionConfig> = Object.entries(assetConfig).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [key]: value.sectionConfig
  }),
  {} as Record<AssetType, AssetSectionConfig>
);

// Compatibility with old AssetTypeConfig interface
export interface AssetTypeConfig {
  title: string;
  fields: FieldConfig[];
  validationRules?: string[];
}

// For backward compatibility with field config
export interface FieldConfig {
  name: string;
  type: 'text' | 'dropdown' | 'chooselabel';
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  options?: { label: string; value: string }[];
  rows?: number;
} 