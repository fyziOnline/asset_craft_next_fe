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
                if (resGenerate.isSuccess) {
                    const resAssetSelect = await ApiService.get<any>(`${urls.asset_select}?assetID=${params.assetID}`);
                    if (resAssetSelect.isSuccess && resAssetSelect.assetContentVersions.length > 0) {
                        return { isSuccess: true, html: resAssetSelect.assetContentVersions[0].assetHTML }
                    } else {
                        return { isSuccess: false, html: `<div style="font-size:30px;">An error occurred please try again later.</div>` }
                    }
                }
            }
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            return { isSuccess: false, html: `<div style="font-size:30px;">${ApiService.handleError(error)}</div>` }
        }
    }
    return {
        generateHTML,
    };
};