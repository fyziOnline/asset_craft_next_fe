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
interface TemplateSelectResponse extends ApiResponse, Template { }

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
            return { error: apiError, templates: [] }
        } finally {
            setIsLoading(false);
        }
    }

    const getTemplateById = async (templateID:string|undefined) => {
        try {
            if (!templateID) {
                throw new Error("Error : Template details missing")
            }
            const template_res = await ApiService.get<TemplateSelectResponse>(`${urls.template_select}?templateID=${templateID}`)
            if (template_res.isSuccess) {
                return template_res
            } else throw new Error("Unable to retrieve data")
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            alert(ApiService.handleError(error));
        }
    }

    return {
        isLoading,
        getTemplatesByAssetType,
        getTemplateById
    };
};