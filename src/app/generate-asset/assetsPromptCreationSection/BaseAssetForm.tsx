'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Accordion from '@/components/global/Accordion';
import Button from '@/components/global/Button';
import TextField from '@/components/global/TextField';
import DropDown from '@/components/global/DropDown';
import ChildrenTitle from '@/components/global/ChildrenTitle';
import RangeSlider from '@/components/global/RangeSlider';
import DragAndDrop from '@/components/global/DragAndDrop';
import { useAppData } from '@/context/AppContext';
import { useGenerateTemplate } from '@/hooks/useGenerateTemplate';
import { AIPromptAsset, CampaignSelectResponse, Template } from '@/types/templates';
import { useLoading } from '@/components/global/Loading/LoadingContext';
import { FormDataProps, SectionProps, useInputFormDataGenerate } from '@/hooks/useInputFormDataGenerate';
import { listofcampains, ListTargetAudience } from '@/data/dataGlobal';
import SectionAssetDetails from '@/components/assetGeneration/SectionAssetDetails';
import { useRouter } from 'next/navigation';
import { AssetSectionConfig } from '@/app/generate-asset/config/assetConfig';
import { AssetPromptResponse } from '@/types/apiResponses';
import { ApiService } from '@/lib/axios_generic';

export interface BaseAssetFormProps {
  params: {
    template: Template;
    assetPrompts?: AIPromptAsset;
    project_name?: string;
    campaign_name?: string;
    asset_name?: string;
    assetType?: string;
    editContextData?: {
      topic?: string;
      keyPoints?: string;
      campaignGoal?: string;
      targetAudience?: string;
      webUrl?: string;
      outputScale?: string | null;
      tone?: string;
      type?: string;
    };
  };
  assetType: string;
  assetSpecificSection: AssetSectionConfig;
  isEditMode?: boolean;
  aiPromptAssetUpsert?: (FormData: FormDataProps, assetID: string, promptID?: string) => Promise<AssetPromptResponse>;
  aiPromptCampaignUpsert?: (FormData: FormDataProps, fileID: number, campaign_id: string) => Promise<{ isSuccess: boolean; promptID?: string }>;
  existingAssetDetails?: {
    campaign_name: string;
    project_name: string;
    asset_name: string;
    campaign_id: string;
    asset_id: string;
  };
}

const BaseAssetForm = ({ 
  params, 
  assetType, 
  assetSpecificSection, 
  isEditMode = false,
  aiPromptAssetUpsert, 
  aiPromptCampaignUpsert, 
  existingAssetDetails 
}: BaseAssetFormProps) => {
  const router = useRouter();
  const [generateStep, setGenerateStep] = useState(1);
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const [isShowList, setIsShowList] = useState<number[]>([]);
  const { assetIDTemplateRef, generateHTML } = useGenerateTemplate({ params: { templateID: params.template?.templateID ?? '' } });
  const { refFormData, refSection, handleInputText: originalHandleInputText, handleInputSection } = useInputFormDataGenerate();
  const handleInputText = originalHandleInputText as (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, field: string) => void;
  const { setShowLoading, showLoading } = useLoading();
  const { contextData, setContextData, setError } = useAppData();
  const [localExistingCampaignDetails, setLocalExistingCampaignDetails] = useState<CampaignSelectResponse | null>(null);
  const [existingAssetPrompt] = useState<AIPromptAsset | null>(params.assetPrompts || null);
  const [assetSpecificSectionValid, setAssetSpecificSectionValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditMode && params.editContextData) {
      refFormData.current = {
        ...refFormData.current,
        product: params.project_name,
        campaignGoal: params.editContextData.campaignGoal,
        targetAudience: params.editContextData.targetAudience,
        webUrl: params.editContextData.webUrl,
        outputScale: params.editContextData.outputScale ? parseInt(params.editContextData.outputScale, 10) : 7,
        topic: params.editContextData.topic,
        keyPoints: params.editContextData.keyPoints,
        tone: params.editContextData.tone,
        type: params.editContextData.type,
      };
      if (params.template?.templatesBlocks) {
        refSection.current = params.template.templatesBlocks
          .filter(item => !item.isStatic)
          .map(item => ({
            templateBlockID: item.templateBlockID || "",
            aiPrompt: item.aiPrompt || ""
          }));
      }
      setCheckedList([0, 1, 2]);
      setIsShowList([0, 1, 2]);
    }
  }, [isEditMode, params.editContextData, params.project_name, refFormData, params.template, refSection]);

  useEffect(() => {
    if (!isEditMode) {
      refFormData.current = {
        ...refFormData.current,
        product: params.project_name
      };
    }
  }, [params.project_name, isEditMode, refFormData]);

  const updateShowList = useCallback((value: number) => {
    setIsShowList((prev) => {
      if (prev.includes(value)) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
  }, []);

  const doesFormCompleted = useCallback((step: number, status?: boolean) => {
    const updateCheckedList = (sectionIndex: number, isValid: boolean) => {
      setCheckedList((prev) =>
        isValid
          ? prev.includes(sectionIndex) ? prev : [...prev, sectionIndex]
          : prev.filter((item) => item !== sectionIndex)
      );
    };

    if (step === 1) {
      updateCheckedList(0, status ?? false);
    }
    if (step === 2) {
      const isValid = 
        !!refFormData.current?.campaignGoal?.length &&
        !!refFormData.current?.targetAudience?.length;
      updateCheckedList(1, isValid);
    }
    if (step === 3) {
      const isValid = status !== undefined ? status : assetSpecificSectionValid;
      updateCheckedList(2, isValid);
    }
    if (!isEditMode && step === 4) {
      const section4Valid = refSection.current.every(section => section.aiPrompt && section.aiPrompt.trim().length > 0);
      updateCheckedList(3, section4Valid);
    }
  }, [assetSpecificSectionValid, isEditMode, refFormData, refSection]);

  const fetchExistingCampaignData = useCallback((data: CampaignSelectResponse | null) => {
    setLocalExistingCampaignDetails(data);
    if (data && !isEditMode) {
      refFormData.current = {
        ...refFormData.current,
        campaignGoal: data.aIPromptCampaign.campaignGoal,
        targetAudience: data.aIPromptCampaign.targetAudience,
        webUrl: data.aIPromptCampaign.webUrl,
        outputScale: data.aIPromptCampaign.outputScale
      };
      if (isShowList.includes(1) || checkedList.includes(1)) {
        doesFormCompleted(2);
      }
    }
  }, [isShowList, checkedList, doesFormCompleted, isEditMode, refFormData]);

  const appendExistingAssetPromptData = useCallback((data: AIPromptAsset | null) => {
    if (!data || isEditMode) {
      return;
    }
    refFormData.current = {
      ...refFormData.current,
      topic: data?.topic,
      type: data?.type,
      keyPoints: data?.keyPoints,
      tone: data?.tone
    };
    doesFormCompleted(3);
  }, [doesFormCompleted, isEditMode, refFormData]);

  useEffect(() => {
    if (!isEditMode && existingAssetPrompt) {
      appendExistingAssetPromptData(existingAssetPrompt);
      setCheckedList([0, 1, 2, 3]);
    }
  }, [existingAssetPrompt, appendExistingAssetPromptData, isEditMode]);

  const handleGenerate = useCallback(async () => {
    const allSectionsValid = checkedList.length >= 4;
    if (isEditMode || generateStep === 2 || !allSectionsValid) {
      if (!allSectionsValid && !isEditMode) {
        setError({ status: 400, message: "Please complete all required sections before generating.", showError: true });
      }
      return;
    }
    
    let newStep = generateStep + 1;

    if (newStep > 3) {
      newStep = 1;
      setIsShowList([]);
      setCheckedList([]);
      setContextData({ assetTemplateShow: false });
    } else {
      setContextData({ assetTemplateShow: true });

      if (newStep === 2) {
        setCheckedList((prev) => [...new Set([...prev, 0, 1, 2, 3])]);
        setContextData({ assetGenerateStatus: newStep });
        setGenerateStep(newStep);
        setShowLoading(true);
        const res = await generateHTML(
          refFormData.current as FormDataProps,
          refSection.current as SectionProps[],
          contextData.ProjectDetails,
          contextData.isRegenerateHTML
        );
        setShowLoading(false);

        if (res?.isSuccess) {
          router.replace(
            `/edit-html-content?assetID=${assetIDTemplateRef.current || ""}&projectName=${contextData.ProjectDetails.project_name || ""}&campaignName=${contextData.ProjectDetails.campaign_name || ""}&assetTypeIcon=${assetType || ""}`
          );
        }
        else {
          setGenerateStep(1);
          setContextData({ assetGenerateStatus: 1, assetTemplateShow: false });
        }

        return;
      }
    }
    setContextData({ assetGenerateStatus: newStep });
    setGenerateStep(newStep);
  }, [
    isEditMode, generateStep, checkedList, assetIDTemplateRef, assetType, contextData, 
    generateHTML, router, setContextData, setShowLoading, refFormData, refSection, setError
  ]);

  const handleInputChange = useCallback((field: string, value: string | File) => {
    refFormData.current = {
      ...refFormData.current,
      [field]: value
    };
    if (isEditMode) setIsDirty(true);
  }, [isEditMode, refFormData]);

  const handleInputTextModified = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, field: string) => {
    handleInputText(e, field);
    if (isEditMode) setIsDirty(true);
  }, [handleInputText, isEditMode]);

  const handleInputSectionModified = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    handleInputSection(e, index);
    if (isEditMode) setIsDirty(true);
    if (!isEditMode) {
      doesFormCompleted(4);
    }
  }, [handleInputSection, isEditMode, doesFormCompleted]);

  const handleValidationChange = useCallback((isValid: boolean) => {
    setAssetSpecificSectionValid(isValid);
    doesFormCompleted(3, isValid);
    if (isEditMode && isValid) {
      setIsDirty(prevDirty => prevDirty || isValid);
    }
  }, [doesFormCompleted, isEditMode]);

  const handleSaveChanges = useCallback(async () => {
    if (!isEditMode || !isDirty || isSaving || !aiPromptAssetUpsert || !aiPromptCampaignUpsert || !existingAssetDetails) {
      return;
    }
    
    if (!checkedList.includes(1) || !checkedList.includes(2)) {
      setError({ status: 400, message: "Please ensure Campaign Overview and Asset Specific sections are complete.", showError: true });
      return;
    }

    setIsSaving(true);
    setShowLoading(true);

    try {
      const campaignPayload = {
        ...refFormData.current,
        product: existingAssetDetails.project_name
      };
      const campaignRes = await aiPromptCampaignUpsert(campaignPayload as FormDataProps, 0, existingAssetDetails.campaign_id);

      if (!campaignRes.isSuccess) {
        throw new Error("Failed to save campaign details.");
      }

      const assetPayload = { 
         ...refFormData.current, 
         topic: refFormData.current?.topic ?? "", 
         keyPoints: refFormData.current?.keyPoints ?? ""
      };
      const assetRes = await aiPromptAssetUpsert(assetPayload as FormDataProps, existingAssetDetails.asset_id);

      if (!assetRes.isSuccess) {
        throw new Error("Failed to save asset prompt details.");
      }

      setIsDirty(false);
      console.log("Changes saved successfully!");
      setError({ message: "Changes saved successfully!", showError: true, status: 200 });

    } catch (error) {
       const apiError = ApiService.handleError(error);
        setError({
            status: apiError.statusCode ?? 500,
            message: apiError.message,
            showError: true
        });
    } finally {
      setIsSaving(false);
      setShowLoading(false);
    }
  }, [
    isEditMode, isDirty, isSaving, aiPromptAssetUpsert, aiPromptCampaignUpsert, 
    existingAssetDetails, refFormData, refSection, setShowLoading, setError, 
    checkedList, params.editContextData
  ]);

  const generateButtonLabel = generateStep === 1 ? "Generate" : "Regenerate";
  const isGenerateDisabled = showLoading || isEditMode || generateStep === 2 || checkedList.length < 4;
  const isSaveDisabled = showLoading || !isEditMode || !isDirty || isSaving || !checkedList.includes(1) || !checkedList.includes(2);

  return (
    <div className="pb-20">
      <div>
        <Accordion
          isRequire={true}
          HeaderTitle="Project Details"
          checked={checkedList.includes(0)}
          handleShowContent={() => { updateShowList(0); }}
          isPreventEdit={isEditMode || !!params.asset_name}
        >
          <SectionAssetDetails
            validatingTheData={doesFormCompleted}
            returnCampaignDetails={fetchExistingCampaignData}
            existingAssetMeta={{
              campaign_name: params.campaign_name || "",
              project_name: params.project_name || "",
              asset_name: params.asset_name || ""
            }}
          />
        </Accordion>
      </div>

      <div className="mt-[25px]">
        <Accordion
          isRequire={true}
          HeaderTitle="Campaign Overview"
          checked={checkedList.includes(1)}
          handleShowContent={() => {
            updateShowList(1);
            doesFormCompleted(2);
          }}
        >
          <div>
            <div className="flex flex-wrap items-start gap-x-[16%] gap-y-4">
              <div className="w-full md:w-[260px]">
                <ChildrenTitle title="Campaign Goal" customClass="mt-5" showStar={true} />
                <DropDown
                  onSelected={(optionSelected) => {
                    handleInputChange('campaignGoal', optionSelected.value);
                    doesFormCompleted(2);
                  }}
                  isShowOther={false}
                  preSelectValue={isEditMode ? refFormData.current?.campaignGoal : localExistingCampaignDetails?.aIPromptCampaign.campaignGoal}
                  selectPlaceHolder="Select Campaign Goal"
                  optionLists={listofcampains}
                />
              </div>

              <div className="w-full md:w-[260px]">
                <ChildrenTitle title="Target audience" customClass="mt-5" showStar={true} />
                <DropDown
                  onSelected={(optionSelected) => {
                    handleInputChange('targetAudience', optionSelected.value);
                    doesFormCompleted(2);
                  }}
                  isShowOther={false}
                  preSelectValue={isEditMode ? refFormData.current?.targetAudience : localExistingCampaignDetails?.aIPromptCampaign.targetAudience}
                  selectPlaceHolder="Select Target Audience"
                  optionLists={ListTargetAudience}
                />
              </div>
            </div>

            <div className="mt-4">
              <ChildrenTitle customClass="mt-5" title="Additional Campaign Assets URL" />
              <TextField
                handleChange={(e) => handleInputTextModified(e, "webUrl")}
                defaultValue={isEditMode ? refFormData.current?.webUrl : localExistingCampaignDetails?.aIPromptCampaign.webUrl}
                placeholder="Enter your URL here."
                customAreaClass="whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
              />
              {!isEditMode && (
                 <DragAndDrop
                    onFileSelect={(file) => {
                      handleInputChange('fileSelected', file as unknown as File);
                    }}
                  />
              )}
            </div>
          </div>
        </Accordion>
      </div>

      <div className="mt-[25px]">
        <Accordion
          isRequire={true}
          HeaderTitle={assetSpecificSection.title}
          checked={checkedList.includes(2)}
          handleShowContent={() => {
            updateShowList(2);
            doesFormCompleted(3);
          }}
        >
          <assetSpecificSection.component
            existingData={isEditMode ? null : existingAssetPrompt}
            handleInputChange={handleInputChange}
            onValidationChange={handleValidationChange}
            assetType={assetType}
            editContextData={isEditMode ? { 
                topic: refFormData.current?.topic ?? "", 
                keyPoints: refFormData.current?.keyPoints ?? "", 
                tone: refFormData.current?.tone ?? "",
                type: refFormData.current?.type ?? ""
            } : params.editContextData}
            isEditMode={isEditMode}
          />
        </Accordion>
      </div>

      {!isEditMode && (
        <div className="mt-[25px]">
            <Accordion
              HeaderTitle="Content Brief"
              checked={checkedList.includes(3)}
              handleShowContent={() => {
                updateShowList(3);
                doesFormCompleted(4);
              }}
            >
              <div>
                {params.template?.templatesBlocks && params.template?.templatesBlocks.filter((item) => !item.isStatic).map((item, index) => {
                  const sectionData = refSection.current.find(s => s.templateBlockID === item.templateBlockID);
                  return (
                    <div key={`${item.blockID}-${index}`}>
                      <ChildrenTitle title={`Section ${index + 1}: ${item.aiTitle || ''}`} customClass={`text-[18px] ${index === 0 ? "" : "mt-[20px]"}`} />
                      <ChildrenTitle title={item.aiDescription || ''} customClass="text-[14px]" />
                      <TextField
                        handleChange={(e) => handleInputSectionModified(e, index)}
                        customClass="h-16"
                        placeholder={item.aiPrompt || ''}
                        defaultValue={sectionData?.aiPrompt ?? ''}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="w-full md:w-[300px] mt-4">
                <ChildrenTitle title="How creative you want the output?" customClass="mt-5" />
                <RangeSlider
                  onSelectValue={(value) => {
                    handleInputChange('outputScale', value.toString());
                  }}
                  defaultValue={refFormData.current?.outputScale ?? 7}
                />
              </div>
            </Accordion>
        </div>
      )}

      <div className="flex justify-end items-center gap-4 mt-6 pr-4 sticky bottom-0 bg-gray-100 py-4 z-10">
        {isEditMode ? (
          <Button
            handleClick={handleSaveChanges}
            disabled={isSaveDisabled}
            customClass="px-6 py-2"
            buttonText={isSaving ? "Saving..." : "Save Changes"}
          />
        ) : (
          <Button
            handleClick={handleGenerate}
            disabled={isGenerateDisabled}
            customClass="px-6 py-2"
            buttonText={generateButtonLabel}
          />
        )}
      </div>
    </div>
  );
};

export default BaseAssetForm; 