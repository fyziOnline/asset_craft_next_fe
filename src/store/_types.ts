import { AssetHTMLData, AssetHtmlProps, AssetVersionProps, AssetVersionPropsExtended, Template } from "@/types/templates"
 
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

export type ProgressionStepType = 0 | 1
export type AssetGenerateStepsType = 1 | 2 | 3 

export type GenerateAssetStore = {
    aiPrompt : Record<string, any>
    templateData : Record<string,any>
    progressionStep : ProgressionStepType
    assetGenerateSteps: AssetGenerateStepsType // these is the step tracking the generating process mainly used as condition to show preview

    // Action Properties 
    updateProgressionStep : (flag:'inc'|'dec'|'reset') => void
    updateAssetGenerateStep : (flag:'inc'|'dec'|'reset') => void
    resetAssetGenerateStore : () => void
}

export type AssetCraftStore = {
  template : Template | null
  assetType : string
  updateAssetType : (type:string) => void
  updateTemplate : (template:Template|null) => void
}