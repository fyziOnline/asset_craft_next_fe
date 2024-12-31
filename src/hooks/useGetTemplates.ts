import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ApiService } from '@/lib/axios_generic';
import { nkey } from '@/data/keyStore';
import { urls } from '@/apis/urls';
import { Template } from '../types/templates';
import { ListTypePage } from '@/data/dataGlobal';
import { useSearchParams } from 'next/navigation';

interface GetTemplatesProps {
    type_page?: string
}

export const useGetTemplates = ({ type_page }: GetTemplatesProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [listTemplates, setListTemplates] = useState<Template[]>([])
    const queryParams = useSearchParams()

    useEffect(() => {
        getTemplates()
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
            console.error('API Error:', ApiService.handleError(error));
            alert(ApiService.handleError(error));
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        listTemplates
    };
};
