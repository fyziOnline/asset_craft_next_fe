import { AssetTypeConfig } from '@/app/generate-asset/config/assetConfig';
import { ClientAssetTypeProps } from '@/types/asset';
import { useAssetTypes } from '@/hooks/useAssetTypes';
import { useState, useEffect } from 'react';

/**
 * Service that manages and synchronizes asset types between the API and our dynamic form system
 */
export const AssetTypeService = () => {
  const { clientAssetTypes, isLoading, error, getAssetTypes, registerDynamicAssetType } = useAssetTypes();
  const [availableAssetTypes, setAvailableAssetTypes] = useState<ClientAssetTypeProps[]>([]);
  const [registeredTypes, setRegisteredTypes] = useState<string[]>([]);

  // Initialize asset types
  useEffect(() => {
    if (clientAssetTypes.length > 0) {
      setAvailableAssetTypes(clientAssetTypes);
    }
  }, [clientAssetTypes]);

  /**
   * Creates a default configuration for an asset type based on its name and description
   */
  const createDefaultConfig = (assetType: ClientAssetTypeProps): AssetTypeConfig => {
    return {
      title: `${assetType.assetTypeName} - Key Messages & Content`,
      fields: [
        {
          name: 'topic',
          type: 'text',
          label: 'Topic or Main Subject',
          placeholder: `Enter the main topic for your ${assetType.assetTypeName}`,
          isRequired: true,
          rows: 4
        },
        {
          name: 'type',
          type: 'dropdown',
          label: `${assetType.assetTypeName} Type`,
          isRequired: true,
          options: [
            { label: 'Informational', value: 'informational' },
            { label: 'Promotional', value: 'promotional' },
            { label: 'Educational', value: 'educational' }
          ]
        },
        {
          name: 'keyPoints',
          type: 'text',
          label: 'Key Points to Include',
          placeholder: 'Enter the key points you want to highlight',
          isRequired: true,
          rows: 4
        }
      ],
      validationRules: ['topic', 'type', 'keyPoints']
    };
  };

  /**
   * Registers a new asset type with the system
   */
  const registerAssetType = (assetType: ClientAssetTypeProps, config?: AssetTypeConfig) => {
    // Don't register the same type twice
    if (registeredTypes.includes(assetType.assetTypeName)) {
      return true;
    }

    // Use provided config or create a default one
    const assetConfig = config || createDefaultConfig(assetType);
    const success = registerDynamicAssetType(assetType.assetTypeName, assetConfig);
    
    if (success) {
      setRegisteredTypes(prev => [...prev, assetType.assetTypeName]);
    }
    
    return success;
  };

  /**
   * Registers all available asset types with default configurations
   */
  const registerAllAssetTypes = () => {
    let allSuccess = true;
    
    availableAssetTypes.forEach(assetType => {
      const success = registerAssetType(assetType);
      if (!success) allSuccess = false;
    });
    
    return allSuccess;
  };

  return {
    availableAssetTypes,
    isLoading,
    error,
    refreshAssetTypes: getAssetTypes,
    registerAssetType,
    registerAllAssetTypes,
    registeredTypes
  };
}; 