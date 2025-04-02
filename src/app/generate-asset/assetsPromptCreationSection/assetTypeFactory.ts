import { FC } from 'react';

// Export FieldConfig interface so it can be used by DynamicSection
export interface FieldConfig {
  name: string;
  type: 'text' | 'dropdown' | 'chooselabel';
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  options?: { label: string; value: string }[];
  rows?: number;
}

export interface AssetTypeConfig {
  title: string;
  fields: FieldConfig[];
  validationRules?: string[];
}

/**
 * Factory function to create a new asset type configuration
 * @param config The asset type configuration
 * @returns An object that can be used to register the new asset type
 */
export function createAssetType(assetTypeName: string, config: AssetTypeConfig) {
  // Implementation will be used in the future to dynamically 
  // create asset types without creating individual files
  return {
    assetTypeName,
    config
  };
}

/**
 * Register a new asset type in the system
 * This would update the necessary configurations in a real implementation
 * @param assetTypeName The name of the asset type to register
 * @param config The configuration for the asset type
 * @param component The React component to use for rendering the asset type
 * @returns True if the registration was successful
 */
export function registerAssetType(
  assetTypeName: string, 
  config: AssetTypeConfig,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: FC<any>
): boolean {
  // This is a stub for future implementation
  // In a real implementation, this would:
  // 1. Add the asset type to PAGE_COMPONENT in pageMap.ts
  // 2. Add the configuration to assetSectionConfig in assetSections/index.ts
  // 3. Register the component for rendering the asset type
  
  console.log(`Registered new asset type: ${assetTypeName} with ${config.fields.length} fields`);
  return true;
}

/**
 * Example of how to use this factory:
 * 
 * // Define a new asset type
 * const newsletterAssetType = createAssetType('Newsletter', {
 *   title: 'Newsletter Content',
 *   fields: [
 *     {
 *       name: 'topic',
 *       type: 'text',
 *       label: 'Newsletter Topic',
 *       placeholder: 'Enter the main topic of your newsletter',
 *       isRequired: true,
 *       rows: 4
 *     },
 *     {
 *       name: 'audience',
 *       type: 'dropdown',
 *       label: 'Target Audience',
 *       isRequired: true,
 *       options: [
 *         { label: 'Customers', value: 'customers' },
 *         { label: 'Partners', value: 'partners' },
 *         { label: 'Employees', value: 'employees' }
 *       ]
 *     }
 *   ],
 *   validationRules: ['topic', 'audience']
 * });
 * 
 * // Register it with a custom component (or use a dynamic one)
 * registerAssetType('Newsletter', newsletterAssetType.config, NewsletterSection);
 */ 