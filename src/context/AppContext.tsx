"use client"
import { createContext, useState, useContext, ReactNode, FC } from "react";
import { AppData, AppDataContextType, ErrorData } from "@/types/appContext";
import { UserDetailsProps } from "@/types/asset";
import { AssetHtmlProps } from "@/types/templates";
interface AppDataProviderProps {
    children: ReactNode;
}

const INITIAL_APP_DATA: AppData = {
    assetTemplateShow: false,
    assetGenerateTemplate: "LANDINGPAGE",
    assetGenerateStatus: 1,
    stepGenerate: 0,
    layoutType: 'main',
    AssetHtml: {} as AssetHtmlProps,
    isRegenerateHTML: false,
    ProjectDetails: {
        project_name: "",
        campaign_name: "",
        asset_name: "",
        campaignID: ""
    },
};

const INITIAL_ERROR: ErrorData = {
    status: 0,
    message: "",
    showError: false,
}

const INITIAL_USER_DETAILS: UserDetailsProps = {
    userID: "",
    name: "",
    email: "",
    userRole: "",
    country: "",
    company: "",
    timeZone: "",
    isActive: 0,
    fileUrl: ""
}

export const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider: FC<AppDataProviderProps> = ({ children }) => {
    const [contextData, setContextData] = useState<AppData>(INITIAL_APP_DATA);
    // const [userDetails, setUserDetails] = useState<UserDetailsProps | null>(INITIAL_USER_DETAILS);
    const [userDetails, setUserDetailsState] = useState<UserDetailsProps | null>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('userDetails');
        return saved ? JSON.parse(saved) : INITIAL_USER_DETAILS;
    }
    return INITIAL_USER_DETAILS;
});
    const [error, setError] = useState<ErrorData>(INITIAL_ERROR)

    // Update context data, ensuring all fields are available
    const updateContextData = (update: Partial<AppData>) => {
        setContextData((prevData) => ({
            ...prevData,  // Keep existing data
            ...update,    // Merge the update
        }));
    };

    const updateErrorData = (update: ErrorData) => setError(update);
    // const updateUserDetails = (update: UserDetailsProps| null) => setUserDetails(update);
    const updateUserDetails = (update: UserDetailsProps | null) => {
    setUserDetailsState(update);
    if (typeof window !== 'undefined') {
        if (update) {
            localStorage.setItem('userDetails', JSON.stringify(update));
        } else {
            localStorage.removeItem('userDetails');
        }
    }
};

    return (
        <AppDataContext.Provider
            value={{
                contextData,
                setContextData: updateContextData,
                error,
                setError: updateErrorData,
                userDetails,
                setUserDetails: updateUserDetails
            }}
        >
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
