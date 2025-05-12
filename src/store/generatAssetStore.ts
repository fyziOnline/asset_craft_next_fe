import { create } from "zustand"
import { GenerateAssetStore } from "./_types"


const useGenerateAssetStore = create<GenerateAssetStore>((set,get)=>({
    // Initial state 
    aiPrompt : {},
    templateData : {},
    progressionStep : 0,

    // Actions
    updateProgressionStep : (flag) => {
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
    }

}))