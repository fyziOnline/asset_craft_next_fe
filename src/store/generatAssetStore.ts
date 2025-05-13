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
        const upperBound = 1
        set((state)=>{
            switch (flag) {
                case 'inc' : 
                    state.progressionStep === upperBound ? state : {progressionStep : state.progressionStep + 1}
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
        const upperBound = 3
        set((state)=>{
            switch (flag) {
                case 'inc' : 
                    state.assetGenerateSteps === upperBound ? state : {assetGenerateSteps : state.assetGenerateSteps + 1}
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