import { urls } from "@/apis/urls";
import { ApiService } from "@/lib/axios_generic";
import { convertFileToBase64 } from "@/lib/utils";
import { AssetHtmlProps, ProjectDetails } from "@/types/templates";
import { useRef } from "react";
import Cookies from "js-cookie";
import { FormDataProps, SectionProps } from "./useInputFormDataGenerate";
import { nkey } from "@/data/keyStore";
import moment from "moment";
import { ApiResponse, AssetAddResponse, AssetGenerateResponse, AssetPromptResponse, AssetSelectResponse, AssetVersionResponse, CampaignAddResponse, ImageUpdateResponse, SectionResponse } from "@/types/apiResponses";

interface GenerateTemplateProp {
  params?: {
    templateID?: string;
  };
}

export const useGenerateTemplate = ({ params }: GenerateTemplateProp) => {
  // Commenting out unused variable but keeping for future reference
  // const urlCampaignID = useMemo(() => {
  //   if (typeof window !== "undefined") {
  //     const params = new URLSearchParams(window.location.search);
  //     return params.get("campaignID") as string
  //   }
  //   return null;
  // }, [])
  const assetPromptIDRef = useRef("");
  const assetIDTemplateRef = useRef("");
  const assetSelect = useRef<AssetHtmlProps>({} as AssetHtmlProps);
  const isCampaignSelect = useRef(false)

  const returnError = (message: string) => {
    return {
      isSuccess: false,
      assetVersions: [
        {
          htmlGenerated: `<div style="font-size:24px;">${message}</div>`,
        },
      ],
    };
  };

  const updateSections = async (Sections: SectionProps[]) => {
    try {
      const promises = assetSelect.current.assetVersions.flatMap(
        (assetVersion) => {
          return Sections.map(async (item) => {
            try {
              const resSectionInsert = await ApiService.post<SectionResponse>(
                urls.assetVersionBlock_aiPromptUpdateByTemplateID,
                {
                  ...item,
                  assetVersionID: assetVersion.assetVersionID,
                }
              );
              return resSectionInsert;
            } catch (innerError) {
              const apiError = ApiService.handleError(innerError)
              console.error("API Error for item:", item, apiError);
              return { isSuccess: false };
            }
          });
        }
      );

      const results = await Promise.all(promises);
      const allSuccess = results.every((res) => res.isSuccess);
      return allSuccess;
    } catch (error) {
      console.error("Unexpected error in updateSections:", error);
      return false;
    }
  };

  const generateHTMLWithAI = async () => {
    try {
      const resGenerateUsingAI = await ApiService.post<AssetGenerateResponse>(`${urls.asset_generateMultipleVersionUsingAI}`, {
        assetID: assetSelect.current.assetID
      })

      if (resGenerateUsingAI.isSuccess) {
        const generatePromises = resGenerateUsingAI.assetVersions.map(
          async (assetVersion: AssetVersionResponse) => {
            const resGenerate = await ApiService.get<ApiResponse>(
              `${urls.asset_generate}?assetID=${assetIDTemplateRef.current}&assetVersionID=${assetVersion.assetVersionID}`
            );
            return resGenerate;
          }
        );

        await Promise.all(generatePromises);
        return { isSuccess: true };
      } else {
        return { isSuccess: false };
      }
    } catch (error) {
      console.error("asset generate error:", error)
      // TODO: forced true. Remove this once the error is fixed
      return { isSuccess: true };
    }
  }


  const getAssetHTML = async () => {
    try {
      const resAssetSelect = await ApiService.get<AssetSelectResponse>(
        `${urls.asset_select}?assetID=${assetIDTemplateRef.current}`
      );
      if (resAssetSelect.isSuccess && resAssetSelect.assetVersions.length > 0) {
        return resAssetSelect as unknown as AssetHtmlProps;
      } else {
        return returnError("An error occurred please try again later.");
      }
    } catch (err) {
      console.error("getAssetHTML error:", err);
      return returnError("An error occurred please try again later.");
    }
  };

  const generateAssetHTML = async () => {
    try {
      const resGenerateUsingAI = await generateHTMLWithAI();

      if (resGenerateUsingAI.isSuccess) {
        return { isSuccess: true };
      } else {
        return returnError("An error occurred please try again later.");
      }
    } catch (err) {
      console.error("generateAssetHTML error:", err);
      return returnError("An error occurred please try again later.");
    }
  };


  const aiPromptCampaignUpsert = async (
    FormData: FormDataProps,
    fileID: number,
    campaign_id: string
  ) => {
    try {
      const response = await ApiService.post<{isSuccess: boolean; promptID?: string}>(
        urls.aiPrompt_Campaign_insertupdate,
        {
          campaignID: campaign_id,
          product: FormData?.product || "",
          campaignGoal: FormData?.campaignGoal || "",
          targetAudience: FormData?.targetAudience || "",
          outputScale: FormData?.outputScale || 0,
          fileID: fileID,
          webUrl: FormData?.webUrl || "",
        }
      );

      return response;
    } catch (error) {
      console.error('campaign error:', error);
      return { isSuccess: false };
    }
  };

  const aiPromptAssetUpsert = async (
    FormData: FormDataProps,
    assetID: string,
    promptID?: string
  ) => {
    const postData = {
      promptID: promptID || undefined,
      AssetID: assetID,
      Topic: FormData?.topic || "",
      Type: FormData?.type || "",
      KeyPoints: FormData?.keyPoints || "",
      TargetAudience: FormData?.targetAudience || "",
      Tone: FormData?.tone || "",
      OutputScale: FormData?.outputScale || 5
    }
    console.log("postData", postData);

    try {
      const response = await ApiService.post<AssetPromptResponse>(
        urls.aiPrompt_Asset_insertupdate,
        postData
      );

      return response;
    } catch (error) {
      console.error('asset prompt error:', error);
      return { isSuccess: false };
    }
  };

  const aiPromptGenerateForAsset = async () => {
    try {
      const resGenerate = await ApiService.get<ApiResponse>(
        `${urls.aiPrompt_GenerateAssetPrompt}?assetID=${assetIDTemplateRef.current}`
      );
      return resGenerate;
    } catch (error) {
      console.error('asset generate error:', error)
      return { isSuccess: false };
    }
  };

  const uploadImage = async (FormData: FormDataProps) => {
    try {
      if (FormData?.fileSelected) {
        const resBase64 = await convertFileToBase64(FormData.fileSelected);
        if (resBase64.isSuccess) {
          const resImageUpdate = await ApiService.put<ImageUpdateResponse>(
            urls.aiPrompt_image_update,
            {
              originalImageName: FormData.fileSelected.name,
              imageAsBase64String: resBase64.base64String,
            }
          );
          if (resImageUpdate.isSuccess) {
            return resImageUpdate.fileID;
          }
        }
      }
      return 0;
    } catch (error) {
      console.error('upload image error:', error)
      return 0;
    }
  };


  const addCampaign = async (details: ProjectDetails) => {
    try {
      const client_ID = Cookies.get(nkey.client_ID);
      const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
      const res_campaign_add = await ApiService.post<CampaignAddResponse>(urls.campaign_add, {
        "clientID": client_ID,
        "project": details.project_name,
        "campaignName": details.campaign_name,
        "country": "",
        "squad": "",
        "startDate": currentDate,
        "endDate": "",
        "status": ""
      });
      return {
        campaignID: res_campaign_add.campaignID,
        status: true
      }
    } catch (error) {
      const apiError = ApiService.handleError(error)
      console.error("Campaign add error:", apiError);
      return {
        campaignID: "",
        status: false
      }
    }
  }

  const generateHTML = async (
    FormData: FormDataProps,
    Sections: SectionProps[],
    ProjectDetails: ProjectDetails,
    isRegenerateHTML: boolean
  ) => {
    let campaign_id = ProjectDetails.campaignID;
    isCampaignSelect.current = campaign_id.length !== 0;
    
    try {
      // Handle HTML regeneration path
      if (isRegenerateHTML) {
        const result = await reGenerateHTML(FormData, Sections, campaign_id);
        return result;
      }

      if (campaign_id.length === 0) {
        const resAddCampaign = await addCampaign(ProjectDetails)
        campaign_id = resAddCampaign.campaignID

        if (!resAddCampaign.status) {
          return returnError("Add Campaign failed, please try again later.")
        }
      }

      const resAddWithTemplate = await ApiService.post<AssetAddResponse>(
        urls.asset_addWithTemplate,
        {
          campaignID: campaign_id,
          assetName: ProjectDetails.asset_name,
          templateID: params?.templateID,
          language: "",
          assetAIPrompt: "",
        }
      );

      if (resAddWithTemplate.isSuccess) {
        assetIDTemplateRef.current = resAddWithTemplate.assetID;

        const resAssetSelect = await getAssetHTML();

        if (resAssetSelect.isSuccess) {
          assetSelect.current = resAssetSelect as AssetHtmlProps;

          // Update sections
          const allSuccess = await updateSections(Sections);

          if (allSuccess) {
            const resAssetInsert = await aiPromptAssetUpsert(
              FormData,
              assetIDTemplateRef.current,
              assetPromptIDRef.current
            );

            if (resAssetInsert.isSuccess) {
              assetPromptIDRef.current = resAssetInsert?.promptID || "";
              const fileID = await uploadImage(FormData);
              const resCampaignInsert = await aiPromptCampaignUpsert(
                FormData,
                fileID,
                campaign_id
              );

              if (resCampaignInsert.isSuccess) {
                const resGenerate = await aiPromptGenerateForAsset();
                if (resGenerate.isSuccess) {
                  const res = await generateAssetHTML();
                  return res
                }
              }
            }
          } else {
            return returnError("Add Section failed, please try again later.");
          }
        }
      }
    } catch (error) {
      const apiError = ApiService.handleError(error)
      return returnError(apiError.message);
    }
  };

  const reGenerateHTML = async (
    FormData: FormDataProps,
    Sections: SectionProps[],
    campaign_id: string
  ) => {
    try {
      const allSuccess = await updateSections(Sections);
      if (allSuccess) {
        const resAssetInsert = await aiPromptAssetUpsert(
          FormData,
          assetIDTemplateRef.current,
          assetPromptIDRef.current
        );
        if (resAssetInsert.isSuccess) {
          const fileID = await uploadImage(FormData);
          const resCampaignInsert = await aiPromptCampaignUpsert(
            FormData,
            fileID,
            campaign_id
          );
          if (resCampaignInsert.isSuccess) {
            const resGenerate = await aiPromptGenerateForAsset();
            if (resGenerate.isSuccess) {
              return await generateAssetHTML();
            }
          }
        }
      } else {
        return returnError("Add Section failed, please try again later.");
      }
    } catch (error) {
      const apiError = ApiService.handleError(error)
      return returnError(apiError.message);
    }
  };

  // Add function to get data using AI for a specific version
  const getVersionDataUsingAI = async (assetVersionID: string | undefined) => {
    if (!assetVersionID) {
      console.error("getVersionDataUsingAI: assetVersionID is missing");
      return { isSuccess: false };
    }
    try {
      const response = await ApiService.get<ApiResponse>( // Assuming ApiResponse is suitable, adjust if needed
        `${urls.asset_version_getDataUsingAI}?assetVersionID=${assetVersionID}`
      );
      return response;
    } catch (error) {
      console.error("Error in getVersionDataUsingAI:", error);
      // const apiError = ApiService.handleError(error); // Remove unused
      // Optionally set global error state here if needed
      return { isSuccess: false };
    }
  };

  // Add function to generate HTML for a specific version
  const generateVersionHTML = async (assetVersionID: string | undefined) => {
    if (!assetVersionID) {
      console.error("generateVersionHTML: assetVersionID is missing");
      return { isSuccess: false };
    }
    try {
       const response = await ApiService.get<ApiResponse>( // Assuming ApiResponse is suitable, adjust if needed
         `${urls.asset_version_generate}?assetVersionID=${assetVersionID}`
       );
       return response;
    } catch (error) {
       console.error("Error in generateVersionHTML:", error);
       // const apiError = ApiService.handleError(error); // Remove unused
       // Optionally set global error state here if needed
       return { isSuccess: false };
    }
  };

  return {
    generateHTML,
    assetIDTemplateRef,
    getAssetHTML,
    aiPromptAssetUpsert,
    aiPromptCampaignUpsert,
    aiPromptGenerateForAsset,
    getVersionDataUsingAI,
    generateVersionHTML
  };
};
