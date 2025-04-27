import { UserDetailsProps } from "./asset";
import { AssetHtmlProps, AssetVersionProps, ProjectDetails } from "./templates";

interface TemplateBlock {
    templateBlockID?: string;
    templateID?: string;
    blockID?: string;
    order?: number;
    aiTitle?: string;
    aiPrompt?: string | null | undefined;
    aiDescription?: string;
    isStatic?: boolean;
    fileURL?: string;
}

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


export interface EditData {
    aiPrompt: {
        assetID?: string;
        keyPoints?: string;
        outputScale?: string | null;
        targetAudience?: string | null;
        tone?: string | null;
        topic?: string;
        type?: string;
    };
    templateData: {
        templateID?: string;
        layoutID?: string;
        templateName?: string;
        description?: string;
        templateImageURL?: string;
        assetTypeID?: string;
        assetTypeName?: string;
        templatesBlocks?: TemplateBlock[];
    };
    // versionsList :AssetVersionProps[] | [];
    // selectedAssetVersion:AssetVersionProps | {}
}

export interface EditContextType {
    editSection: EditData;
    setEditSection: (data: Partial<EditData>) => void;
}