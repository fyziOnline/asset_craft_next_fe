import { urls } from '@/apis/urls';
import { ApiService } from '@/lib/axios_generic';

interface GenerateTemplateProp {
    params: {
        assetID: string
    }
}

export const useGenerateTemplate = ({ params }: GenerateTemplateProp) => {
    const generateHTML = async () => {
        try {
            const resGenerateUsingAI = await ApiService.get<any>(`${urls.asset_getAssetDataUsingAI}?assetID=${params.assetID}`);
            if (resGenerateUsingAI.isSuccess) {
                const resGenerate = await ApiService.get<any>(`${urls.asset_generate}?assetID=${params.assetID}`);
                console.log('resGenerate: ', resGenerate);
                if (resGenerate.isSuccess) {

                }
            }
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            return `<div>${error}</div>`
        }
    }
    return {
        generateHTML,
    };
};