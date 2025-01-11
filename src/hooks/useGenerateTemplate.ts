import { urls } from "@/apis/urls";
import { ApiService } from "@/lib/axios_generic";
import { convertFileToBase64 } from "@/lib/utils";
import { AssetHtmlProps, ProjectDetails } from "@/types/templates";
import { useMemo, useRef } from "react";
import Cookies from "js-cookie";
import { FormDataProps, SectionProps } from "./useInputFormDataGenerate";
import { nkey } from "@/data/keyStore";
import moment from "moment";
import { useAppData } from "@/context/AppContext";

interface GenerateTemplateProp {
  params?: {
    templateID?: string;
  };
}

export const useGenerateTemplate = ({ params }: GenerateTemplateProp) => {
  const campaignID = useMemo(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("campaignID") as string
    }
  }, [])
  const assetPromptIDRef = useRef("");
  const assetIDTemplateRef = useRef("");
  const assetSelect = useRef<AssetHtmlProps>({} as AssetHtmlProps);
  const isCampaignSelect = useRef(false)
  const { setError } = useAppData()

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
              const resSectionInsert = await ApiService.post<any>(
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
              setError({
                  status: apiError.statusCode,
                  message: apiError.message,
                  showError: true
              })
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
            const apiError = ApiService.handleError(innerError)
            console.error( "API Error for item:", apiError);
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
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
        // return await getAssetHTML();
        return { isSuccess: true };
      } else {
        return returnError("An error occurred please try again later.");
      }
    } catch (error) {
      return returnError("An error occurred please try again later.");
    }
  };

  //   Check if the campaign exist and return true or false
  // const aiPromptCampaignExist = async (id: string = "") => {
  //   try {
  //     const resAIPromptCampaign = await ApiService.get<any>(
  //       `${urls.aiPrompt_Campaign_select}?CampaignID=${id ?? campaignID}`
  //     );
  //     return resAIPromptCampaign.isSuccess;
  //   } catch (error) {
  //     return false;
  //   }
  // };

  const aiPromptCampaignInsert = async (
    FormData: FormDataProps,
    fileID: number,
    campaign_id: string
  ) => {
    try {
      if (isCampaignSelect.current) {
        return await aiPromptCampaignUpdate(FormData, fileID, campaign_id);
      } else {
        const resCampaignInsert = await ApiService.post<any>(
          urls.aiPrompt_Campaign_insert,
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

        if (resCampaignInsert.isSuccess) {
          return resCampaignInsert;
        }
      }
      return { isSuccess: false };
    } catch (error) {
      console.log(' campaign error :', error);
      return { isSuccess: false };
    }
  };

  const aiPromptCampaignUpdate = async (
    FormData: FormDataProps,
    fileID: number,
    campaign_id: string
  ) => {
    try {
      const resCampaignInsert = await ApiService.put<any>(
        urls.aiPrompt_Campaign_update,
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
      console.log('update campaign :', resCampaignInsert);

      return resCampaignInsert;
    } catch (error) {
      console.log('update campaign error :', error);

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


  const addCampaign = async (details: ProjectDetails) => {
    try {
      const client_ID = Cookies.get(nkey.client_ID);
      const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
      const res_campaign_add = await ApiService.post<any>(urls.campaign_add, {
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
      setError({
          status: apiError.statusCode,
          message: apiError.message,
          showError: true
      })
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
    let campaign_id = ProjectDetails.campaignID
    campaign_id.length === 0 ?
      isCampaignSelect.current = false : isCampaignSelect.current = true
    try {
      if (isRegenerateHTML) {
        return await reGenerateHTML(FormData, Sections, campaign_id);
      }
      if (campaign_id.length === 0) {
        const resAddCampaign = await addCampaign(ProjectDetails)
        campaign_id = resAddCampaign.campaignID
        if (!resAddCampaign.status) {
          return returnError("Add Campaign failed, please try again later.")
        }
      }
      const resAddWithTemplate = await ApiService.post<any>(
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
          // return
          const allSuccess = await updateSections(Sections);

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

            if (resAssetInsert.isSuccess) {
              assetPromptIDRef.current = resAssetInsert?.promptID || "";
              let fileID = await uploadImage(FormData);
              const resCampaignInsert = await aiPromptCampaignInsert(
                FormData,
                fileID,
                campaign_id
              );


              if (resCampaignInsert.isSuccess) {
                let resGenerate = await aiPromptGenerateForAsset();
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
      setError({
          status: apiError.statusCode,
          message: apiError.message,
          showError: true
      })
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
            fileID,
            campaign_id
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
      const apiError = ApiService.handleError(error)
      setError({
          status: apiError.statusCode,
          message: apiError.message,
          showError: true
      })
    }
  };

  return {
    generateHTML,
    assetIDTemplateRef,
    getAssetHTML
  };
};
