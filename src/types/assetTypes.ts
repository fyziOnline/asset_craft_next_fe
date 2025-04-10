/**
 * Enum representing the available asset types in the system.
 * These values match those received from the API.
 */
export enum AssetType {
  EMAIL = 'Email',
  LINKEDIN = 'LinkedIn',
  LANDING_PAGE = 'Landing Page',
  CALL_SCRIPT = 'Call Script'
}

/**
 * Convert an asset type to a URL-friendly slug
 */
export function assetTypeToSlug(assetType: AssetType | string): string {
  const type = typeof assetType === 'string' ? assetType : assetType;
  return type.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Convert a URL-friendly slug back to an asset type
 */
export function slugToAssetType(slug: string): AssetType | null {
  const slugMap: Record<string, AssetType> = {
    'email': AssetType.EMAIL,
    'linkedin': AssetType.LINKEDIN,
    'landing-page': AssetType.LANDING_PAGE,
    'call-script': AssetType.CALL_SCRIPT
  };
  
  return slugMap[slug] || null;
}

/**
 * Check if a string is a valid asset type
 */
export function isValidAssetType(type: string): boolean {
  return Object.values(AssetType).includes(type as AssetType);
}

/**
 * Get all available asset types
 */
export function getAllAssetTypes(): AssetType[] {
  return Object.values(AssetType);
} 