import { useState } from "react";
import Cookies from 'js-cookie';
import { nkey } from '@/data/keyStore';
import { ApiService } from "@/lib/axios_generic";
import { ApiResponse } from "@/types/apiResponses";
import { Template } from "@/types/templates";
import { urls } from "@/apis/urls";

interface TemplateSelectAllResponse extends ApiResponse {
    templates: Template[];
}

export const useGetTemplates = () => {
    const [isLoading, setIsLoading] = useState(false)
    
    const getTemplatesByAssetType = async (
    assetTypeID?: string
    ): Promise<{ error?: {}; templates: Template[] }> => {
        try {
            setIsLoading(true);
            const client_ID = Cookies.get(nkey.client_ID);
            const resGetTemplates = await ApiService.get<TemplateSelectAllResponse>(`${urls.template_select_all}?clientID=${client_ID}&assetTypeID=${assetTypeID}`);

            if (resGetTemplates.isSuccess) {
                return { templates: resGetTemplates.templates };
            }

            return { templates: [] };
        } catch (error) {
            const apiError = ApiService.handleError(error);
            return { error: apiError, templates: [] }; // <-- fix: consistent structure
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        getTemplatesByAssetType,
    };
};