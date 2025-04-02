import { useEffect, useState } from 'react';
import { AssetTypeService } from '@/services/AssetTypeService';
import { ClientAssetTypeProps } from '@/types/asset';
import { AssetTypeConfig } from '@/app/generate-asset/assetsPromptCreationSection/assetTypeFactory';

/**
 * Hook to access the AssetTypeService functionality
 * This adds component lifecycle management and handles initialization
 */
export const useAssetTypeService = (autoRegister = false) => {
  const service = AssetTypeService();
  const [initialized, setInitialized] = useState(false);

  // Auto-register all asset types if requested
  useEffect(() => {
    if (autoRegister && service.availableAssetTypes.length > 0 && !initialized) {
      service.registerAllAssetTypes();
      setInitialized(true);
    }
  }, [autoRegister, service, initialized, service.availableAssetTypes]);

  /**
   * Get an asset type by name
   */
  const getAssetTypeByName = (name: string): ClientAssetTypeProps | undefined => {
    return service.availableAssetTypes.find(
      type => type.assetTypeName.toLowerCase() === name.toLowerCase()
    );
  };

  /**
   * Register an asset type with a custom configuration
   */
  const registerCustomAssetType = (
    assetType: ClientAssetTypeProps | string,
    config: AssetTypeConfig
  ): boolean => {
    // If we receive a string, try to find the asset type object
    if (typeof assetType === 'string') {
      const foundType = getAssetTypeByName(assetType);
      if (!foundType) return false;
      return service.registerAssetType(foundType, config);
    }
    
    // Otherwise use the provided asset type object
    return service.registerAssetType(assetType, config);
  };

  return {
    ...service,
    initialized,
    getAssetTypeByName,
    registerCustomAssetType
  };
}; 