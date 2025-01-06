import { urls } from "@/apis/urls";
import { ApiService } from "@/lib/axios_generic";
import { convertFileToBase64 } from "@/lib/utils";
import { AssetHtmlProps } from "@/types/templates";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";
import { FormDataProps, SectionProps } from "./useInputFormDataGenerate";

interface GenerateTemplateProp {
  params: {
    templateID: string;
  };
}

export const useGenerateTemplate = ({ params }: GenerateTemplateProp) => {
  const queryParams = useSearchParams();
  const campaignID = queryParams.get("campaignID") as string;
  const asset_name = queryParams.get("asset_name") as string;
  const isCampaignSelect = queryParams.get("isCampaignSelect") as string;
  const assetPromptIDRef = useRef("");
  const assetIDTemplateRef = useRef("");
  const assetSelect = useRef<AssetHtmlProps>({} as AssetHtmlProps);

  const returnError = (message: string) => {
    return {
      isSuccess: false,
      assetVersions: [
        {
          htmlGenerated: `<div style="font-size:30px;">${message}</div>`,
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
              const resSectionInsert = await ApiService.post<any>(
                urls.assetVersionBlock_aiPromptUpdateByTemplateID,
                {
                  ...item,
                  assetVersionID: assetVersion.assetVersionID,
                }
              );
              return resSectionInsert;
            } catch (innerError) {
              console.error(
                "API Error for item:",
                item,
                ApiService.handleError(innerError)
              );
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
      const promises = assetSelect.current.assetVersions.map(
        async (assetVersion) => {
          try {
            const resGenerateUsingAI = await ApiService.get<any>(
              `${urls.asset_getAssetDataUsingAI}?assetID=${assetIDTemplateRef.current}&assetVersionID=${assetVersion.assetVersionID}`
            );

            if (resGenerateUsingAI.isSuccess) {
              const resGenerate = await ApiService.get<any>(
                `${urls.asset_generate}?assetID=${assetIDTemplateRef.current}&assetVersionID=${assetVersion.assetVersionID}`
              );

              return resGenerate;
            }
            return { isSuccess: false };
          } catch (innerError) {
            console.error(
              "API Error for item:",
              ApiService.handleError(innerError)
            );
            return { isSuccess: false };
          }
        }
      );

      const results = await Promise.all(promises);
      const allSuccess = results.every((res) => res.isSuccess);
      return allSuccess;
    } catch (error) {
      console.error("Unexpected error in generateHTMLWithAI:", error);
      return false;
    }
  };

  const getAssetHTML = async () => {
    try {
      const resAssetSelect = await ApiService.get<any>(
        `${urls.asset_select}?assetID=${assetIDTemplateRef.current}`
      );
      if (resAssetSelect.isSuccess && resAssetSelect.assetVersions.length > 0) {
        return resAssetSelect as AssetHtmlProps;
      } else {
        return returnError("An error occurred please try again later.");
      }
    } catch (error) {
      return returnError("An error occurred please try again later.");
    }
  };

  const generateAssetHTML = async () => {
    try {
      const resGenerateUsingAI = await generateHTMLWithAI();
      if (resGenerateUsingAI) {
        return await getAssetHTML();
      }
    } catch (error) {
      return returnError("An error occurred please try again later.");
    }
  };

  //   Check if the campaign exist and return true or false
  const aiPromptCampaignExist = async (id: string = "") => {
    try {
      const resAIPromptCampaign = await ApiService.get<any>(
        `${urls.aiPrompt_Campaign_select}?CampaignID=${id ?? campaignID}`
      );
      return resAIPromptCampaign.isSuccess;
    } catch (error) {
      return false;
    }
  };

  const aiPromptCampaignInsert = async (
    FormData: FormDataProps,
    fileID: number
  ) => {
    try {
      if (isCampaignSelect == "true") {
        return await aiPromptCampaignUpdate(FormData, fileID);
      } else {
        const resCampaignInsert = await ApiService.post<any>(
          urls.aiPrompt_Campaign_insert,
          {
            campaignID: campaignID,
            product: FormData?.product || "",
            campaignGoal: FormData?.campaignGoal || "",
            targetAudience: FormData?.targetAudience || "",
            outputScale: FormData?.outputScale || 0,
            fileID: fileID,
            webUrl: FormData?.webUrl || "",
          }
        );
        if (resCampaignInsert.isSuccess) {
          return resCampaignInsert;
        }
      }
      return { isSuccess: false };
    } catch (error) {
      return { isSuccess: false };
    }
  };

  const aiPromptCampaignUpdate = async (
    FormData: FormDataProps,
    fileID: number
  ) => {
    try {
      const resCampaignInsert = await ApiService.put<any>(
        urls.aiPrompt_Campaign_update,
        {
          campaignID: campaignID,
          product: FormData?.product || "",
          campaignGoal: FormData?.campaignGoal || "",
          targetAudience: FormData?.targetAudience || "",
          outputScale: FormData?.outputScale || 0,
          fileID: fileID,
          webUrl: FormData?.webUrl || "",
        }
      );
      return resCampaignInsert;
    } catch (error) {
      return { isSuccess: false };
    }
  };

  const aiPromptGenerateForAsset = async () => {
    try {
      const resGenerate = await ApiService.get<any>(
        `${urls.aiPrompt_GenerateAssetPrompt}?assetID=${assetIDTemplateRef.current}`
      );
      return resGenerate;
    } catch (error) {
      return { isSuccess: false };
    }
  };

  const uploadImage = async (FormData: FormDataProps) => {
    try {
      if (FormData?.fileSelected) {
        const resBase64 = await convertFileToBase64(FormData.fileSelected);
        if (resBase64.isSuccess) {
          const resImageUpdate = await ApiService.put<any>(
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
      return 0;
    }
  };

  const generateHTML = async (
    FormData: FormDataProps,
    Sections: SectionProps[],
    isRegenerateHTML: boolean
  ) => {
    try {
      if (isRegenerateHTML) {
        return await reGenerateHTML(FormData, Sections);
      }

      const resAddWithTemplate = await ApiService.post<any>(
        urls.asset_addWithTemplate,
        {
          campaignID: campaignID,
          assetName: asset_name,
          templateID: params.templateID,
          language: "",
          assetAIPrompt: "",
        }
      );

      console.log("--------------------------------------");
      console.log("resAddWithTemplate", resAddWithTemplate);
      console.log("--------------------------------------");
      

      if (resAddWithTemplate.isSuccess) {
        assetIDTemplateRef.current = resAddWithTemplate.assetID;
        const resAssetSelect = await getAssetHTML();

        console.log("--------------------------------------");
        console.log("resAssetSelect", resAssetSelect);
        console.log("--------------------------------------");

        if (resAssetSelect.isSuccess) {
          assetSelect.current = resAssetSelect as AssetHtmlProps;
          const allSuccess = await updateSections(Sections);

          console.log("--------------------------------------");
          console.log("allSuccess", allSuccess);
          console.log("--------------------------------------");

          if (allSuccess) {
            const resAssetInsert = await ApiService.post<any>(
              urls.aiPrompt_Asset_insert,
              {
                assetID: assetIDTemplateRef.current || "",
                topic: FormData?.topic || "",
                type: FormData?.type || "",
                keyPoints: FormData?.keyPoints || "",
              }
            );

            console.log("--------------------------------------");
            console.log("resAssetInsert", resAssetInsert);
            console.log("--------------------------------------");

            if (resAssetInsert.isSuccess) {
              assetPromptIDRef.current = resAssetInsert?.promptID || "";
              let fileID = await uploadImage(FormData);
              const resCampaignInsert = await aiPromptCampaignInsert(
                FormData,
                fileID
              );

              console.log("--------------------------------------");
              console.log("resCampaignInsert", resCampaignInsert);
              console.log("--------------------------------------");

              
              if (resCampaignInsert.isSuccess) {
                let resGenerate = await aiPromptGenerateForAsset();
                console.log("--------------------------------------");
                console.log("resGenerate", resGenerate);
                console.log("--------------------------------------");
  
                if (resGenerate.isSuccess) {
                  const res = await generateAssetHTML();
                  console.log("--------------------------------------");
                  console.log("res", res);
                  console.log("--------------------------------------");
    
                  return res;
                }
              }
            }
          } else {
            return returnError("Add Section failed, please try again later.");
          }
        }
      }
    } catch (error) {
      console.error("API Error:", ApiService.handleError(error));
      return returnError(ApiService.handleError(error));
    }
  };

  const reGenerateHTML = async (
    FormData: FormDataProps,
    Sections: SectionProps[]
  ) => {
    try {
      const allSuccess = await updateSections(Sections);
      if (allSuccess) {
        const resAssetInsert = await ApiService.put<any>(
          urls.aiPrompt_Asset_update,
          {
            promptID: assetPromptIDRef.current,
            assetID: assetIDTemplateRef.current || "",
            topic: FormData?.topic || "",
            type: FormData?.type || "",
            keyPoints: FormData?.keyPoints || "",
          }
        );
        if (resAssetInsert.isSuccess) {
          let fileID = await uploadImage(FormData);
          const resCampaignInsert = await aiPromptCampaignUpdate(
            FormData,
            fileID
          );
          if (resCampaignInsert.isSuccess) {
            let resGenerate = await aiPromptGenerateForAsset();
            if (resGenerate.isSuccess) {
              return await generateAssetHTML();
            }
          }
        }
      } else {
        return returnError("Add Section failed, please try again later.");
      }
    } catch (error) {
      console.error("API Error:", ApiService.handleError(error));
      return returnError(ApiService.handleError(error));
    }
  };

  return {
    generateHTML,
  };
};
