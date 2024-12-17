import { urls } from '@/apis/urls';
import { FormEmailDataProps, SectionProps } from '@/app/my-projects/[project_name]/[campaign_name]/[type_page]/asset-generate/EmailPage';
import { ApiService } from '@/lib/axios_generic';
import { convertFileToBase64 } from '@/lib/utils';
import { AssetHtmlProps } from '@/types/templates';
import { useRef } from 'react';

interface GenerateTemplateProp {
    params: {
        assetID: string,
        campaignID: string
    }
}

export const useGenerateTemplate = ({ params }: GenerateTemplateProp) => {
    const assetPromptIDRef = useRef("")
    const campaignPromptIDRef = useRef("")

    const returnError = (message: string) => {
        return {
            isSuccess: false,
            assetVersions: [{
                htmlGenerated: `<div style="font-size:30px;">${message}</div>`
            }]
        }
    }

    const updateSections = async (Sections: SectionProps[]) => {
        try {
            const promises = Sections.map(async (item) => {
                try {
                    const resSectionInsert = await ApiService.post<any>(urls.assetVersionBlock_aiPromptUpdateByTemplateID, item)
                    return resSectionInsert;
                } catch (innerError) {
                    console.error('API Error for item:', item, ApiService.handleError(innerError));
                    return { isSuccess: false };
                }
            });

            const results = await Promise.all(promises);
            const allSuccess = results.every((res) => res.isSuccess);
            return allSuccess
        } catch (error) {
            return false
        }
    }

    const getAssetHTML = async () => {
        try {
            const resGenerateUsingAI = await ApiService.get<any>(`${urls.asset_getAssetDataUsingAI}?assetID=${params.assetID}`);
            if (resGenerateUsingAI.isSuccess) {
                const resGenerate = await ApiService.get<any>(`${urls.asset_generate}?assetID=${params.assetID}`);
                if (resGenerate.isSuccess) {
                    const resAssetSelect = await ApiService.get<any>(`${urls.asset_select}?assetID=${params.assetID}`);
                    if (resAssetSelect.isSuccess && resAssetSelect.assetVersions.length > 0) {
                        return resAssetSelect as AssetHtmlProps
                    } else {
                        return returnError("An error occurred please try again later.")
                    }
                }
            }
        } catch (error) {
            return returnError("An error occurred please try again later.")
        }
    }

    const generateHTML = async (FormData: FormEmailDataProps, Sections: SectionProps[], isRegenerateHTML: boolean) => {
        try {
            if (isRegenerateHTML) {
                return await reGenerateHTML(FormData, Sections)
            }

            const allSuccess = await updateSections(Sections)
            if (allSuccess) {
                const resAssetInsert = await ApiService.post<any>(urls.aiPrompt_Asset_insert, {
                    "assetID": params?.assetID || "",
                    "topic": FormData?.topic || "",
                    "type": FormData?.type || "",
                    "keyPoints": FormData?.keyPoints || "",
                });
                if (resAssetInsert.isSuccess) {
                    assetPromptIDRef.current = resAssetInsert?.promptID || ""
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
                        campaignPromptIDRef.current = resCampaignInsert?.campaignPromptID || ""
                        return await getAssetHTML()
                    }
                }
            } else {
                return returnError("Add Section failed, please try again later.")
            }
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            return returnError(ApiService.handleError(error))
        }
    }

    const reGenerateHTML = async (FormData: FormEmailDataProps, Sections: SectionProps[]) => {
        try {
            const allSuccess = await updateSections(Sections)
            if (allSuccess) {
                const resAssetInsert = await ApiService.put<any>(urls.aiPrompt_Asset_update, {
                    "promptID": assetPromptIDRef.current,
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
                    const resCampaignInsert = await ApiService.put<any>(urls.aiPrompt_Campaign_update, {
                        "campaignPromptID": campaignPromptIDRef.current,
                        "campaignID": params?.campaignID,
                        "product": FormData?.product || "",
                        "campaignGoal": FormData?.campaignGoal || "",
                        "targetAudience": FormData?.targetAudience || "",
                        "outputScale": FormData?.outputScale || 0,
                        "fileID": fileID,
                        "webUrl": FormData?.webUrl || ""
                    });
                    if (resCampaignInsert.isSuccess) {
                        return await getAssetHTML()
                    }
                }
            } else {
                return returnError("Add Section failed, please try again later.")
            }
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            return returnError(ApiService.handleError(error))
        }
    }

    return {
        generateHTML
    };
};