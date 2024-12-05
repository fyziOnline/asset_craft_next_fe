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
        if (type_page === ListTypePage.Email) {
            getTemplates()
        } else {
            if (type_page === ListTypePage.LandingPage) {
                setListTemplates([{
                    templateImageURL: '/images/landing_templates/landing1.png',
                    templateName: 'Option 1',
                    templateID: '1',
                    description: "description"
                },
                {
                    templateImageURL: '/images/landing_templates/landing2.png',
                    templateName: 'Option 2',
                    templateID: '2',
                    description: "description"
                },
                {
                    templateImageURL: '/images/landing_templates/landing3.png',
                    templateName: 'Option 3',
                    templateID: '3',
                    description: "description"
                }])
            } else if (type_page === ListTypePage.CallScript) {
                setListTemplates([{
                    templateImageURL: '/images/event_invite_call_script.png',
                    templateName: 'Event Invite Call Script',
                    templateID: '1',
                    description: "description"
                },
                {
                    templateImageURL: '/images/sales_call_script.png',
                    templateName: 'Sales Call Script',
                    templateID: '2',
                    description: "description"
                },
                {
                    templateImageURL: '/images/demo_call_script.png',
                    templateName: 'Demo Call Script',
                    templateID: '3',
                    description: "description"
                }])
            } else if (type_page === ListTypePage.LinkedIn) {
                setListTemplates([{
                    templateImageURL: '/images/linkedin_templates/template_1.png',
                    templateName: 'Text Post',
                    templateID: '1',
                    description: "description"
                },
                {
                    templateImageURL: '/images/linkedin_templates/template_2.png',
                    templateName: 'Media Post',
                    templateID: '2',
                    description: "description"
                },
                {
                    templateImageURL: '/images/linkedin_templates/template_3.png',
                    templateName: 'Multiple Media Post',
                    templateID: '3',
                    description: "description"
                }])
            }
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
