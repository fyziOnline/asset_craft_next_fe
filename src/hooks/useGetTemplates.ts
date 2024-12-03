import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { ApiService } from '@/lib/axios_generic';
import { nkey } from '@/data/keyStore';
import { urls } from '@/apis/urls';

export const useGetTemplates = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [listTemplates, setListTemplates] = useState([])

    useEffect(() => {
        getTemplates()
    }, [])

    const getTemplates = async () => {
        try {
            setIsLoading(true);
            const client_ID = Cookies.get(nkey.client_ID)
            const resGetTemplates = await ApiService.get<any>(`${urls.template_select_all}?clientID=${client_ID}`);
            console.log('resGetTemplates: ', resGetTemplates);

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
