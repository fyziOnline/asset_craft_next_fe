import { create } from 'zustand'
import { createSelectors } from './createStoreSelector'
import { AssetCraftStore } from './_types'
import { AssetType } from '@/types/assetTypes'

  
const useAssetCraftStore = create<AssetCraftStore>((set,get) => ({
  // Initial state
  template : null,
  assetType : null,
  campaignInformation:{
    product : "", 
    campaignName:"",
    campaignGoal : "", 
    targetAudience : "", 
    webUrl :[],
    outputScale : 0,
    keyPoints :"",
    tone :"", 
    type :"",
    fileName :[]
  },
  assetInformation : {
    assetName : "",
    assetSpecificUrls :[],
    assetSpecificFiles : [],
    primaryMessage:"",
    additionalInfo : ""
  },

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
  },

  updateCampaignInformation : (update) => {
    set((state)=>({
      campaignInformation:{
        ...state.campaignInformation,
        ...update
      }
    }))
  },

  updateAssetInformation : (update) => {
    set((state)=>({
      assetInformation :{
        ...state.assetInformation,
        ...update
      }
    }))
  }


}))

export const useAssetCraftStoreSelector = createSelectors(useAssetCraftStore)

export default useAssetCraftStore