"use client"

import { createContext, useState, useContext, ReactNode, FC } from "react";
import { AssetHtmlProps, ProjectDetails } from "@/types/templates";

export interface AppData {
    assetTemplateShow: boolean;
    assetGenerateTemplate: string;
    assetGenerateStatus: number;
    layoutType: 'main' | 'home';
    ProjectDetails: ProjectDetails
    AssetHtml: AssetHtmlProps;
    stepGenerate: number; //step 0 or 1
    isRegenerateHTML: boolean
}

export interface ErrorData {
    status: number;
    message: string;
    showError: boolean;
}

interface AppDataContextType {
    contextData: AppData;
    setContextData: (data: Partial<AppData>) => void;
    error: ErrorData;
    setError: (data: ErrorData) => void;
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
    ProjectDetails: {
        project_name: "",
        campaign_name: "",
        asset_name: "",
        campaignID: "" 
    },
    AssetHtml: {} as AssetHtmlProps,
    isRegenerateHTML: false
};

const ERROR_APP: ErrorData = {
    status: 0,
    message: "",
    showError: false
}

// Create a provider component
export const AppDataProvider: FC<AppDataProviderProps> = ({ children }) => {
    const [contextData, setContextData] = useState<AppData>(APP_DATA);
    const [error, setError] = useState<ErrorData>(ERROR_APP)

    // Update context data, ensuring all fields are available
    const updateContextData = (update: Partial<AppData>) => {
        setContextData((prevData) => ({
            ...prevData,  // Keep existing data
            ...update,    // Merge the update
        }));
    };

    const updateErrorData = (update: ErrorData) => {
        setError(update);
    };

    return (
        <AppDataContext.Provider value={{ contextData, setContextData: updateContextData, error, setError: updateErrorData }}>
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
