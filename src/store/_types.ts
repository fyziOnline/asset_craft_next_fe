import { AssetHTMLData, AssetHtmlProps, AssetVersionProps, AssetVersionPropsExtended } from "@/types/templates"
 
export type EditAssetStore = {
  // State properties
  assetHTMLData: AssetHTMLData | Record<string, any>
  versionList: AssetVersionProps[]
  selectedVersionID: string
  versionUniqueStatuses:string[]
  
  // Actions properties
  setAssetHTMLData: (assetHTMLRecord: AssetHtmlProps) => void
  setSelectedVersion : (v_id:string) => void
  updateVersionField : (v_id:string,filedToUpdate:Partial<AssetVersionProps>) => void
  updateUniqueStatusList : () => void
  deleteVersionFromTheList : (v_id:string) => void
  updateVersionList : (newVersion:AssetVersionProps) => void
  updateEntireVersionList : (newList:AssetVersionProps[]) => void
  setAssetHTMLFromSingleVersion : (assetHTMLSingleVersionRecord:AssetVersionPropsExtended) => void
}

export type GenerateAssetStore = {
    aiPrompt : Record<string, any>
    templateData : Record<string,any>
}