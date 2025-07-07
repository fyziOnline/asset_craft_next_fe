import { create } from 'zustand'
import { createSelectors } from './createStoreSelector'
import { AssetCraftStore } from './_types'
import { AssetType } from '@/types/assetTypes'

  
const useAssetCraftStore = create<AssetCraftStore>((set,get) => ({
  // Initial state
  template : null,
  assetType : null,

  // Actions
  updateAssetType : (type: AssetType | null) => {
    set({
        assetType : type 
    })
  },

  updateTemplate : (template) => {
    set({
        template : template
    })
  }
//   setAssetHTMLData: (assetHTMLRecord) => {
//     const {selectedVersionID} = get()
//     const {
//       isSuccess,
//       errorOnFailure,
//       assetVersions,
//       ...filteredResponse
//     } = assetHTMLRecord;

//     const uniqueStatuses = Array.from(
//         new Set(assetVersions?.map(version => version.status).filter(Boolean))
//     ) as string[];


//     set({
//         assetHTMLData: filteredResponse,
//         versionList: assetVersions || [],
//         versionUniqueStatuses : uniqueStatuses,
//         selectedVersionID : assetVersions[0]?.assetVersionID 
//       });
//   },


}))

export const useAssetCraftStoreSelector = createSelectors(useAssetCraftStore)

export default useAssetCraftStore