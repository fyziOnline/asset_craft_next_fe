import { create } from "zustand" 
import { AssetGenerateStepsType, GenerateAssetStore, ProgressionStepType } from "./_types" 
import { createSelectors } from "./createStoreSelector" 
 
const useGenerateAssetStore = create<GenerateAssetStore>((set, get) => ({ 
    // Initial state  
    aiPrompt: {}, 
    templateData: {}, 
    progressionStep: 0, 
    assetGenerateSteps: 1, 
 
    // Actions 
    updateProgressionStep: (flag: 'inc' | 'dec' | 'reset') => { 
        const upperBound = 1 
        set((state) => { 
            switch (flag) { 
                case 'inc': 
                    return state.progressionStep === upperBound ? state : { ...state, progressionStep: state.progressionStep + 1 as ProgressionStepType} 
                case 'dec': 
                    return state.progressionStep === 0 ? state : { ...state, progressionStep: state.progressionStep - 1 as ProgressionStepType } 
                case 'reset': 
                    return { ...state, progressionStep: 0 } 
                default: 
                    return state 
            } 
        }) 
    }, 
 
    updateAssetGenerateStep: (flag: 'inc' | 'dec' | 'reset') => { 
        const upperBound = 3 
        set((state) => { 
            switch (flag) { 
                case 'inc': 
                    return state.assetGenerateSteps === upperBound ? state : { ...state, assetGenerateSteps: state.assetGenerateSteps + 1 as AssetGenerateStepsType } 
                case 'dec': 
                    return state.assetGenerateSteps === 1 ? state : { ...state, assetGenerateSteps: state.assetGenerateSteps - 1 as AssetGenerateStepsType } 
                case 'reset': 
                    return { ...state, assetGenerateSteps: 1 } 
                default: 
                    return state 
            } 
        }) 
    },

    resetAssetGenerateStore : () => {
        set({
            aiPrompt: {}, 
            templateData: {}, 
            progressionStep: 0, 
            assetGenerateSteps: 1,
        })
    }
})) 
 
export const useGenerateAssetStoreSelector = createSelectors(useGenerateAssetStore) 
 
export default useGenerateAssetStore