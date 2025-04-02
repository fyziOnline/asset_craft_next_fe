import { AssetType, isValidAssetType } from '@/types/assetTypes';
import { ListTypePage } from '@/data/dataGlobal';

/**
 * Get the asset type from the URL parameter
 * @param assetTypeParam The asset type from URL parameter
 * @returns The corresponding AssetType or null if invalid
 */
export function getAssetTypeFromParam(assetTypeParam: string | null): AssetType | null {
  if (!assetTypeParam) return null;
  
  const assetType = Object.values(AssetType).find(
    type => type.toLowerCase() === assetTypeParam.toLowerCase()
  ) as AssetType | undefined;
  
  return assetType || null;
}

/**
 * Get the URL slug for an asset type
 * @param assetType The asset type enum value
 * @returns The URL slug for the asset type
 */
export function getAssetTypeSlug(assetType: AssetType): string {
  return ListTypePage[assetType];
}

/**
 * Convert URL slug to asset type
 * @param slug The URL slug
 * @returns The corresponding asset type or null if not found
 */
export function getAssetTypeFromSlug(slug: string | null): AssetType | null {
  if (!slug) return null;
  
  const normalizedSlug = slug.toLowerCase();
  const entry = Object.entries(ListTypePage).find(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([key, value]) => value === normalizedSlug
  );
  
  return entry ? entry[0] as unknown as AssetType : null;
}

/**
 * Determines if the asset type requires special handling
 * @param assetType The asset type to check
 * @returns Whether this asset type needs custom handling
 */
export function isSpecialAssetType(assetType: AssetType | string): boolean {
  // Add any asset types that need special handling
  const specialTypes = [
    AssetType.CALL_SCRIPT
  ];
  
  return specialTypes.includes(assetType as AssetType);
}

/**
 * Get all available details about an asset type
 * @param assetType The asset type to get details for
 * @returns An object with all relevant details for that asset type
 */
export function getAssetTypeDetails(assetType: AssetType | string): {
  type: AssetType | null;
  description: string;
  slug: string;
  isValid: boolean;
  isSpecial: boolean;
} {
  const validType = typeof assetType === 'string' 
    ? (isValidAssetType(assetType) ? assetType as AssetType : null)
    : assetType;
  
  if (!validType) {
    return {
      type: null,
      description: '',
      slug: '',
      isValid: false,
      isSpecial: false
    };
  }
  
  return {
    type: validType,
    description: validType,
    slug: getAssetTypeSlug(validType),
    isValid: true,
    isSpecial: isSpecialAssetType(validType)
  };
} 