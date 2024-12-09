"use client"

import { createContext, useState, useContext, ReactNode, FC } from "react";
import { AssetHtmlProps } from "@/types/templates";

interface AppData {
    assetTemplateShow: boolean;
    assetGenerateTemplate: string;
    assetGenerateStatus: number;
    layoutType: 'main' | 'home';
    isShowEdit_Save_Button: boolean;
    AssetHtml: AssetHtmlProps;
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
    layoutType: 'main',
    AssetHtml: {},
    isShowEdit_Save_Button: false,
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
