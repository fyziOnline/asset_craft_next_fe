import { AssetType } from '@/types/assetTypes';
import GenericAssetSection from '@/app/generate-asset/assetsPromptCreationSection/GenericAssetSection';
import { FC } from 'react';
import { AIPromptAsset } from '@/types/templates';

// GenericAssetSection Props Interface
export interface AssetSectionProps {
  existingData: AIPromptAsset | null;
  handleInputChange: (field: string, value: string | number | null) => void;
  onValidationChange: (isValid: boolean) => void;
  assetType?: string | null;
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
  isEditMode?: boolean;
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

// AssetTypeConfig for compatibility with existing code
export interface AssetTypeConfig {
  title: string;
  fields: FieldConfig[];
  validationRules?: string[];
}

// FieldConfig for compatibility with existing code
export interface FieldConfig {
  name: string;
  type: 'text' | 'dropdown' | 'chooselabel';
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  options?: { label: string; value: string }[];
  rows?: number;
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

// Asset-specific labels
export const assetLabelsConfig: Record<string, AssetSectionLabels> = {
  [AssetType.LANDING_PAGE]: {
    primaryMessage: {
      title: "What is the primary message of the landing page?",
      placeholder: "Primary message"
    },
    additionalInfo: {
      title: "Provide additional information that supports the main message.",
      placeholder: "Enter details of the asset you want to create"
    }
  },
  [AssetType.EMAIL]: {
    primaryMessage: {
      title: "What is the primary message of your email?",
      placeholder: "Enter the main email message"
    },
    additionalInfo: {
      title: "Provide additional information that supports the main message.",
      placeholder: "Enter supporting information, features, or call-to-action details"
    }
  },
  [AssetType.LINKEDIN]: {
    primaryMessage: {
      title: "What is the primary message of your LinkedIn post?",
      placeholder: "Enter the main message for your LinkedIn post"
    },
    additionalInfo: {
      title: "Provide additional information that supports the main message.",
      placeholder: "Enter supporting information, relevant hashtags, or call-to-action details"
    }
  },
  [AssetType.CALL_SCRIPT]: {
    primaryMessage: {
      title: "What is the primary goal of this call script?",
      placeholder: "Enter the main purpose of the call script"
    },
    additionalInfo: {
      title: "Provide additional talking points or objection handling.",
      placeholder: "Enter key talking points, objection responses, or specific information to mention"
    }
  },
  [AssetType.PDF_SUMMARY]: {
    primaryMessage: {
      title: "What is the primary message of your PDF summary?",
      placeholder: "Enter the main message for your PDF summary"
    },
    additionalInfo: {
      title: "Provide additional information that supports the main message.",
      placeholder: "Enter details of the asset you want to create"
    }
  }
};

// Define asset section config mapping by type
export const assetSectionConfig: Record<AssetType, AssetSectionConfig> = {
  [AssetType.EMAIL]: {
    title: 'Email - Key Messages & Content',
    requiredFields: ['topic'],
    component: GenericAssetSection
  },
  [AssetType.LINKEDIN]: {
    title: 'LinkedIn - Key Messages & Content',
    requiredFields: ['topic'],
    component: GenericAssetSection
  },
  [AssetType.LANDING_PAGE]: {
    title: 'Landing Page - Key Messages & Content',
    requiredFields: ['topic'],
    component: GenericAssetSection
  },
  [AssetType.CALL_SCRIPT]: {
    title: 'Call Script - Tone, Style, and Objections',
    requiredFields: ['topic'],
    component: GenericAssetSection
  },
  [AssetType.PDF_SUMMARY]: {
    title: 'PDF Summary - Key Messages & Content',
    requiredFields: ['topic'],
    component: GenericAssetSection
  }
};

/**
 * Helper function to get section config for an asset type
 */
export function getAssetSectionConfig(assetType: string): AssetSectionConfig {
  if (!assetType || !assetSectionConfig[assetType as AssetType]) {
    // Return a default config if asset type not found
    return {
      title: 'Asset Content',
      requiredFields: ['topic'],
      component: GenericAssetSection
    };
  }
  
  return assetSectionConfig[assetType as AssetType];
}

/**
 * Helper function to get labels for an asset type
 */
export function getAssetLabels(assetType?: string | null): AssetSectionLabels {
  if (!assetType || !assetLabelsConfig[assetType]) {
    return defaultLabels;
  }
  
  return assetLabelsConfig[assetType];
} 