import { AssetHTMLData, AssetHtmlProps, AssetVersionProps } from '@/types/templates'
import { create } from 'zustand'
import { createSelectors } from './createStoreSelector'

type EditAssetStore = {
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
}
  
const useEditAssetStore = create<EditAssetStore>((set,get) => ({
  // Initial state
  assetHTMLData: {},
  versionList: [],
  selectedVersionID: "",
  versionUniqueStatuses:[],
  
  // Actions
  setAssetHTMLData: (assetHTMLRecord) => {
    const {selectedVersionID} = get()
    const {
      isSuccess,
      errorOnFailure,
      assetVersions,
      ...filteredResponse
    } = assetHTMLRecord;

    const uniqueStatuses = Array.from(
        new Set(assetVersions.map(version => version.status).filter(Boolean))
    ) as string[];

    set({
        assetHTMLData: filteredResponse,
        versionList: assetVersions || [],
        versionUniqueStatuses : uniqueStatuses,
        selectedVersionID : selectedVersionID.length ? selectedVersionID : assetVersions[0]?.assetVersionID
      });
  },

  setSelectedVersion : (v_id)=>{
    set({
        selectedVersionID : v_id
    })
  },

  updateVersionField : (v_id,filedToUpdate) => {
    const {versionList} = get()
    const updateVersionList = versionList.map((version)=>
        version.assetVersionID === v_id 
            ? {...version,...filedToUpdate}
            : version
    )
    set({
        versionList : updateVersionList
    })
  },

  updateUniqueStatusList : ()=>{
    const {versionList} = get()
    const uniqueStatuses = Array.from(
      new Set(versionList.map(version => version.status).filter(Boolean))
    ) as string[];
    set({
      versionUniqueStatuses : uniqueStatuses
    })
  },

  deleteVersionFromTheList : (v_id) =>{
    const {versionList,selectedVersionID} = get()
    set({
        versionList : versionList.filter(version=>version.assetVersionID!==v_id),
        selectedVersionID :selectedVersionID === v_id ? versionList[0].assetVersionID : selectedVersionID
    })
  },

  updateVersionList : (newVersion) => {
    const {versionList} = get()
    set({
        versionList : [...versionList,newVersion],
        selectedVersionID : newVersion.assetVersionID
    })
  },

  updateEntireVersionList : (newList) => {
    const uniqueStatuses = Array.from(
      new Set(newList.map(version => version.status).filter(Boolean))
    ) as string[];

    set({
      versionList : newList,
      versionUniqueStatuses : uniqueStatuses,
    })
  }

}))

export const useEditAssetStoreSelector = createSelectors(useEditAssetStore)

export default useEditAssetStore