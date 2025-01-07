"use client"

import { createContext, useState, useContext, ReactNode, FC } from "react";
import { AssetHtmlProps, ProjectDetails } from "@/types/templates";

export interface AppData {
    assetTemplateShow: boolean;
    assetGenerateTemplate: string;
    assetGenerateStatus: number;
    layoutType: 'main' | 'home';
    isShowEdit_Save_Button: boolean;
    ProjectDetails : ProjectDetails
    AssetHtml: AssetHtmlProps;
    stepGenerate: number; //step 0 or 1
    isRegenerateHTML: boolean
}

interface AppDataContextType {
    contextData: AppData;
    setContextData: (data: Partial<AppData>) => void;
}

export const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

interface AppDataProviderProps {
    children: ReactNode;
}

const APP_DATA: AppData = {
    assetTemplateShow: false,
    assetGenerateTemplate: "LANDINGPAGE",
    assetGenerateStatus: 1,
    stepGenerate: 0,
    layoutType: 'main',
    ProjectDetails : {
        project_name: "", 
        campaign_name: "", 
        asset_name: "", 
        campaignID : ""
    },
    AssetHtml: {} as AssetHtmlProps,
    isShowEdit_Save_Button: false,
    isRegenerateHTML: false
};

// Create a provider component
export const AppDataProvider: FC<AppDataProviderProps> = ({ children }) => {
    const [contextData, setContextData] = useState<AppData>(APP_DATA);

    // Update context data, ensuring all fields are available
    const updateContextData = (update: Partial<AppData>) => {
        setContextData((prevData) => ({
            ...prevData,  // Keep existing data
            ...update,    // Merge the update
        }));
    };

    return (
        <AppDataContext.Provider value={{ contextData, setContextData: updateContextData }}>
            {children}
        </AppDataContext.Provider>
    );
};

export const useAppData = () => {
    const context = useContext(AppDataContext);
    if (!context) {
        throw new Error("useAppData must be used within an AppDataProvider");
    }
    return context;
};
