import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ApiService } from '@/lib/axios_generic';
import { nkey } from '@/data/keyStore';
import { urls } from '@/apis/urls';
import { Template } from '../types/templates';
import { ListTypePage } from '@/data/dataGlobal';
import { useSearchParams } from 'next/navigation';
import { useAppData } from '@/context/AppContext';

interface GetTemplatesProps {
    type_page?: string
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

    const getTemplates = async () => {
        try {
            setIsLoading(true);
            const client_ID = Cookies.get(nkey.client_ID)
            const assetTypeID = queryParams.get('assetTypeID')
            const resGetTemplates = await ApiService.get<any>(`${urls.template_select_all}?clientID=${client_ID}&assetTypeID=${assetTypeID}`);

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
    }

    const getTemplateById = async (templateID:string|undefined) => {
        try {
            if (!templateID) {
                throw new Error("Error : Template details missing")
            }
            const template_res = await ApiService.get<any>(`${urls.template_select}?templateID=${templateID}`)
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
            const aiPromptAssetRes = await ApiService.get<any>(`${urls.aiPrompt_Asset_select}?assetID=${assetID}`)
            if (aiPromptAssetRes.isSuccess) {
                return aiPromptAssetRes
            } else throw new Error("Unable to retrieve data")
        } catch (error) {
            console.error('API Error :',ApiService.handleError(error))
            alert(ApiService.handleError(error))
        }
    }

    return {
        isLoading,
        listTemplates,
        getTemplateById,
        getAiPromptAssetSelect
    };
};
