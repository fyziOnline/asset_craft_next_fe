import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ApiService } from '@/lib/axios_generic';
import { nkey } from '@/data/keyStore';
import { urls } from '@/apis/urls';
import { Template, AIPromptAsset } from '../types/templates';
import { useSearchParams } from 'next/navigation';
import { useAppData } from '@/context/AppContext';
import { ApiResponse } from '@/types/apiResponses';

interface GetTemplatesProps {
    type_page?: string
}

// Define response types inline
interface TemplateSelectAllResponse extends ApiResponse {
    templates: Template[];
}

interface TemplateSelectResponse extends ApiResponse, Template { }

interface AIPromptAssetSelectResponse extends ApiResponse {
    aIPromptAsset: AIPromptAsset;
}

// Define response type for Campaign select
interface AIPromptCampaignSelectResponse extends ApiResponse {
    aIPromptCampaign: {
        campaignID: string;
        clientID: string;
        userID: string;
        campaignGoal: string;
        targetAudience: string;
        webUrl: string;
        createdOn: string;
        updatedOn: string;
        fileName:string
    };
}

export const useGetTemplates = ({ type_page }: GetTemplatesProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [listTemplates, setListTemplates] = useState<Template[]>([])
    const queryParams = useSearchParams()
    const  { setError } = useAppData()

    useEffect(() => {
        if (type_page?.length) {
            getTemplates()
        }
    }, [])

    const getTemplates = async (assetType_id?:string) => {
        try {
            setIsLoading(true);
            const client_ID = Cookies.get(nkey.client_ID)
            const assetTypeID = queryParams.get('assetTypeID')
            const resGetTemplates = await ApiService.get<TemplateSelectAllResponse>(`${urls.template_select_all}?clientID=${client_ID}&assetTypeID=${assetTypeID}`);

            if (resGetTemplates.isSuccess) {
                setListTemplates(resGetTemplates.templates)
            }
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
        } finally {
            setIsLoading(false);
        }
    } // used with old asset generation page and also in aside section in edit content html 

    const getTemplatesByAssetType = async (assetType_id?:string) => {
        try {
            setIsLoading(true);
            const client_ID = Cookies.get(nkey.client_ID)
            const assetTypeID = queryParams.get('assetTypeID')
            const resGetTemplates = await ApiService.get<TemplateSelectAllResponse>(`${urls.template_select_all}?clientID=${client_ID}&assetTypeID=${assetTypeID}`);

            if (resGetTemplates.isSuccess) {
                return resGetTemplates.templates
            }
            return []
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
            return []
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

    const getAiPromptAssetSelect = async (assetID:string|undefined) => {
        try {
            if (!assetID) {
                throw new Error('Error : Asset details missing')
            }
            const aiPromptAssetRes = await ApiService.get<AIPromptAssetSelectResponse>(`${urls.aiPrompt_Asset_select}?assetID=${assetID}`)
            if (aiPromptAssetRes.isSuccess) {
                return aiPromptAssetRes
            } else throw new Error("Unable to retrieve data")
        } catch (error) {
            console.error('API Error :',ApiService.handleError(error))
            alert(ApiService.handleError(error))
        }
    }

    // Add function to fetch AI Prompt Campaign data
    const getAiPromptCampaignSelect = async (campaignID: string | undefined) => {
        try {
            if (!campaignID) {
                throw new Error('Error: Campaign details missing');
            }
            const aiPromptCampaignRes = await ApiService.get<AIPromptCampaignSelectResponse>(`${urls.aiPrompt_Campaign_select}?campaignID=${campaignID}`);
            if (aiPromptCampaignRes.isSuccess) {
                return aiPromptCampaignRes;
            } else {
                throw new Error("Unable to retrieve campaign prompt data");
            }
        } catch (error) {
            // Use the existing error handling
            const apiError = ApiService.handleError(error);
            setError({ 
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            });
            // Optionally re-throw or return null/undefined
            return null;
        }
    };

    return {
        isLoading,
        listTemplates,
        getTemplateById,
        getAiPromptAssetSelect,
        getTemplatesByAssetType,
        getAiPromptCampaignSelect // Expose the new function
    };
};
