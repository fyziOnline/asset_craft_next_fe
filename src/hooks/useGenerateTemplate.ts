import { urls } from '@/apis/urls';
import { useLoading } from '@/components/global/Loading/LoadingContext';
import { ApiService } from '@/lib/axios_generic';

interface GenerateTemplateProp {
    params?: {
        campaignID?: string
        templateID?: string
        asset_name?: string
    }
}

export const useGenerateTemplate = ({ params }: GenerateTemplateProp) => {
    const { setShowLoading } = useLoading()

    const generateHTML = async () => {
        try {
            setShowLoading(true)

            // const resAddWithTemplate = await ApiService.post<any>(urls.asset_addWithTemplate, {
            //     "campaignID": params.campaignID,
            //     "assetName": params.asset_name,
            //     "templateID": params.templateID,
            //     "language": "",
            //     "assetAIPrompt": ""
            // });
            const resAddWithTemplate = { isSuccess: true, assetID: "" }

            if (resAddWithTemplate.isSuccess) {
                // const resGenerate = await ApiService.get<any>(`${urls.asset_generate}?assetID=${resAddWithTemplate.assetID}`);
                const resGenerate = { isSuccess: true, assetID: "" }

            }
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            alert(ApiService.handleError(error));
        } finally {
            setShowLoading(false)
        }
    }
    return {
        generateHTML
    };
};