import { UserDetailsProps } from "./asset";
import { AssetHtmlProps, ProjectDetails } from "./templates";

export interface AppData {
    assetTemplateShow: boolean;
    assetGenerateTemplate: string;
    assetGenerateStatus: number;
    layoutType: 'main' | 'home';
    ProjectDetails: ProjectDetails
    AssetHtml: AssetHtmlProps;
    stepGenerate: number;
    isRegenerateHTML: boolean
}

export interface ErrorData {
    status: number;
    message: string;
    showError: boolean;
}

export interface AppDataContextType {
    contextData: AppData;
    setContextData: (data: Partial<AppData>) => void;
    error: ErrorData;
    setError: (data: ErrorData) => void;
    userDetails: UserDetailsProps;
    setUserDetails: (data: UserDetailsProps) => void;
}

export interface editData {
    aiPrompt: {
        assetID?: string;
        topic?: string;
        type?: string;
        keyPoints?: string;
        targetAudience?: string | null;
        tone?: string | null;
        outputScale?: string | null;
    };
}

export interface EditContextType {
    editSection: editData;
    setEditSection: (data: Partial<editData>) => void;
}