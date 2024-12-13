import { urls } from '@/apis/urls';
import { FormEmailDataProps } from '@/app/my-projects/[project_name]/[campaign_name]/[type_page]/asset-generate/EmailPage';
import { ApiService } from '@/lib/axios_generic';
import { convertFileToBase64 } from '@/lib/utils';
import { AssetHtmlProps } from '@/types/templates';

interface GenerateTemplateProp {
    params: {
        assetID: string,
        campaignID: string
    }
}

export const useGenerateTemplate = ({ params }: GenerateTemplateProp) => {
    const generateHTML = async (FormData: FormEmailDataProps) => {
        try {
            const resAssetInsert = await ApiService.post<any>(urls.aiPrompt_Asset_insert, {
                "assetID": params?.assetID || "",
                "topic": FormData?.topic || "",
                "type": FormData?.type || "",
                "keyPoints": FormData?.keyPoints || "",
            });
            if (resAssetInsert.isSuccess) {
                let fileID = 0
                if (FormData?.fileSelected) {

                    const resBase64 = await convertFileToBase64(FormData.fileSelected)
                    if (resBase64.isSuccess) {
                        const resImageUpdate = await ApiService.put<any>(urls.aiPrompt_image_update, {
                            "originalImageName": FormData.fileSelected.name,
                            "imageAsBase64String": resBase64.base64String
                        })
                        if (resImageUpdate.isSuccess) {
                            fileID = resImageUpdate.fileID
                        }
                    }
                }
                const resCampaignInsert = await ApiService.post<any>(urls.aiPrompt_Campaign_insert, {
                    "campaignID": params?.campaignID,
                    "product": FormData?.product || "",
                    "campaignGoal": FormData?.campaignGoal || "",
                    "targetAudience": FormData?.targetAudience || "",
                    "outputScale": FormData?.outputScale || 0,
                    "fileID": fileID,
                    "webUrl": FormData?.webUrl || ""
                });
                if (resCampaignInsert.isSuccess) {
                    const resGenerateUsingAI = await ApiService.get<any>(`${urls.asset_getAssetDataUsingAI}?assetID=${params.assetID}`);
                    if (resGenerateUsingAI.isSuccess) {
                        const resGenerate = await ApiService.get<any>(`${urls.asset_generate}?assetID=${params.assetID}`);
                        if (resGenerate.isSuccess) {
                            const resAssetSelect = await ApiService.get<any>(`${urls.asset_select}?assetID=${params.assetID}`);
                            if (resAssetSelect.isSuccess && resAssetSelect.assetVersions.length > 0) {
                                return resAssetSelect as AssetHtmlProps
                            } else {
                                return {
                                    isSuccess: false,
                                    assetVersions: [{
                                        htmlGenerated: `<div style="font-size:30px;">An error occurred please try again later.</div>`
                                    }]
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            return {
                isSuccess: false,
                assetContentVersions: [{
                    assetHTML: `<div style="font-size:30px;">${ApiService.handleError(error)}</div>`
                }]
            }
        }
    }
    return {
        generateHTML,
    };
};