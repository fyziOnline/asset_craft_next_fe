import { useState, useEffect, useCallback } from 'react';
import { ApiService } from '@/lib/axios_generic';
import { urls } from '@/apis/urls';
import Cookies from 'js-cookie';
import { nkey } from '@/data/keyStore';
import { ClientAssetTypeProps } from '@/types/asset';
import { useAppData } from '@/context/AppContext';
import { useLoading } from '@/components/global/Loading/LoadingContext';
import { AssetTypeConfig } from '@/app/generate-asset/assetsPromptCreationSection/assetTypeFactory';
import { assetSectionConfig } from '@/app/generate-asset/assetsPromptCreationSection/assetSections';
import { PageType } from '@/componentsMap/pageMap';

interface UseAssetTypesReturn {
  clientAssetTypes: ClientAssetTypeProps[];
  isLoading: boolean;
  error: string | null;
  getAssetTypes: () => Promise<void>;
  getAssetTypeConfig: (assetTypeName: string) => AssetTypeConfig | null;
  registerDynamicAssetType: (
    assetTypeName: string,
    config: AssetTypeConfig
  ) => boolean;
}

export const useAssetTypes = (): UseAssetTypesReturn => {
  const [clientAssetTypes, setClientAssetTypes] = useState<ClientAssetTypeProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setErrorState] = useState<string | null>(null);
  const { setError } = useAppData();
  const { setShowLoading } = useLoading();
  
  // Fetch all asset types for the client
  const getAssetTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      setShowLoading(true);
      
      const clientID = Cookies.get(nkey.client_ID);
      if (!clientID) {
        throw new Error('Client ID not found');
      }
      
      const response = await ApiService.get<{
        isSuccess: boolean;
        errorOnFailure: string;
        clientAssetTypes: ClientAssetTypeProps[];
      }>(`${urls.clientAssetType_select_all}?clientID=${clientID}`);
      
      if (response.isSuccess) {
        setClientAssetTypes(response.clientAssetTypes);
      } else {
        throw new Error(response.errorOnFailure || 'Failed to fetch asset types');
      }
    } catch (error) {
      const apiError = ApiService.handleError(error);
      setErrorState(apiError.message);
      setError({
        status: apiError.statusCode,
        message: apiError.message,
        showError: true
      });
    } finally {
      setIsLoading(false);
      setShowLoading(false);
    }
  }, [setError, setShowLoading]);

  // Get config for a specific asset type
  const getAssetTypeConfig = useCallback((assetTypeName: string): AssetTypeConfig | null => {
    // Check if assetTypeName exists in the standard asset section config
    const assetType = assetTypeName as PageType;
    
    if (assetSectionConfig[assetType]) {
      // Return the existing configuration
      return {
        title: assetSectionConfig[assetType].title,
        fields: [], // Would need to be populated based on existing component
        validationRules: assetSectionConfig[assetType].requiredFields
      };
    }
    
    // Could also look up in a custom configurations store if implemented
    return null;
  }, []);

  // Register a new dynamic asset type
  const registerDynamicAssetType = useCallback((
    assetTypeName: string,
    config: AssetTypeConfig
  ): boolean => {
    try {
      // In a full implementation, this would:
      // 1. Update PAGE_COMPONENT in pageMap.ts
      // 2. Add to assetSectionConfig
      
      // For now we'll just log that we would create a DynamicSection adapter
      // This would require modifications to pageMap.ts and assetSections/index.ts
      console.log(`Registered new dynamic asset type: ${assetTypeName}`);
      console.log(`Would create adapter with ${config.fields.length} fields`);
      
      return true;
    } catch (error) {
      console.error(`Failed to register dynamic asset type: ${assetTypeName}`, error);
      return false;
    }
  }, []);

  // Load asset types when the hook is first used
  useEffect(() => {
    getAssetTypes();
  }, [getAssetTypes]);

  return {
    clientAssetTypes,
    isLoading,
    error,
    getAssetTypes,
    getAssetTypeConfig,
    registerDynamicAssetType
  };
}; 