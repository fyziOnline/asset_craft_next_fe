import { create } from "zustand"
import { GenerateAssetStore } from "./_types"


const useGenerateAssetStore = create<GenerateAssetStore>((set,get)=>({
    // Initial state 
    aiPrompt : {},
    templateData : {}

    // Actions

}))