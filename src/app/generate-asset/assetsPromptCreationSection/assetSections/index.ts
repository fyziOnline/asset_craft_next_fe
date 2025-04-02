import { AssetType } from '@/types/assetTypes';
import CallScriptSection from './CallScriptSection';
import EmailSection from './EmailSection';
import LandingPageSection from './LandingPageSection';
import LinkedinSection from './LinkedinSection';
import DynamicSection from './DynamicSection';
import { AssetSectionConfig } from '../BaseAssetForm';

// Type that includes both AssetType and legacy strings
type AssetTypeKey = AssetType;

// Define asset section config mapping by type
export const assetSectionConfig: Record<AssetTypeKey, AssetSectionConfig> = {
  [AssetType.EMAIL]: {
    title: 'Email - Key Messages & Content',
    requiredFields: ['type', 'keyPoints'],
    component: EmailSection
  },
  [AssetType.LINKEDIN]: {
    title: 'LinkedIn - Key Messages & Content',
    requiredFields: ['topic', 'type', 'keyPoints'],
    component: LinkedinSection
  },
  [AssetType.LANDING_PAGE]: {
    title: 'Landing Page - Key Messages & Content',
    requiredFields: ['topic', 'type', 'keyPoints'],
    component: LandingPageSection
  },
  [AssetType.CALL_SCRIPT]: {
    title: 'Call Script - Tone, Style, and Objections',
    requiredFields: ['topic'],
    component: CallScriptSection
  }
};

// Export individual components
export { 
  CallScriptSection,
  EmailSection,
  LandingPageSection,
  LinkedinSection,
  DynamicSection
};

/**
 * To add a new asset type:
 * 
 * 1. Define your field configuration in assetTypeFactory.ts
 * 2. Use one of these approaches:
 *   
 *   a) Create a custom component extending your specific functionality:
 *      - Create YourAssetSection.tsx in this directory
 *      - Export it from this file
 *      - Add it to assetSectionConfig with its specific configuration
 * 
 *   b) Use the DynamicSection for simpler asset types:
 *      - Configure your fields using assetTypeFactory
 *      - Use DynamicSection with your field configuration
 */ 