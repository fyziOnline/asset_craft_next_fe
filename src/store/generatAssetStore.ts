import { create } from "zustand"
import { GenerateAssetStore } from "./_types"
import { createSelectors } from "./createStoreSelector"


const useGenerateAssetStore = create<GenerateAssetStore>((set,get)=>({
    // Initial state 
    aiPrompt : {},
    templateData : {},
    progressionStep : 0,
    assetGenerateSteps : 0,

    // Actions
    updateProgressionStep : (flag:string) => {
        set((state)=>{
            switch (flag) {
                case 'inc' : 
                    state.progressionStep === 1 ? state : {progressionStep : state.progressionStep + 1}
                case 'dec' :
                    state.progressionStep === 0 ? state : {progressionStep : state.progressionStep - 1}
                case 'reset' : 
                    return {progressionStep : 0}
                default :
                    return state
            }
        })
    },

    updateAssetGenerateStep : (flag:string) => {
        set((state)=>{
            switch (flag) {
                case 'inc' : 
                    state.assetGenerateSteps === 1 ? state : {assetGenerateSteps : state.assetGenerateSteps + 1}
                case 'dec' :
                    state.assetGenerateSteps === 0 ? state : {assetGenerateSteps : state.assetGenerateSteps - 1}
                case 'reset' : 
                    return {assetGenerateSteps : 0}
                default :
                    return state
            }
        })
    }

}))

export const useGenerateAssetStoreSelector = createSelectors(useGenerateAssetStore)

export default useGenerateAssetStore