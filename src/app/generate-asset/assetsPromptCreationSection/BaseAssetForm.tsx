'use client';
import React, { useEffect, useState, useCallback, Dispatch, SetStateAction } from 'react';
import Accordion from '@/components/global/Accordion';
import Button from '@/components/global/Button';
import TextField from '@/components/global/TextField';
import DropDown from '@/components/global/DropDown';
import ChildrenTitle from '@/components/global/ChildrenTitle';
import DragAndDrop from '@/components/global/DragAndDrop';
import { useAppData } from '@/context/AppContext';
import { useGenerateTemplate } from '@/hooks/useGenerateTemplate';
import { AIPromptAsset, AssetVersionProps, CampaignSelectResponse, Template } from '@/types/templates';
import { useLoading } from '@/components/global/Loading/LoadingContext';
import { FormDataProps, SectionProps } from '@/hooks/useInputFormDataGenerate';
import { listofcampains, ListTargetAudience } from '@/data/dataGlobal';
import SectionAssetDetails from '@/components/assetGeneration/SectionAssetDetails';
import { usePathname, useRouter } from 'next/navigation';
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
    assetVersionID?: string;
    editContextData?: {
      topic?: string;
      keyPoints?: string;
      campaignGoal?: string;
      targetAudience?: string;
      webUrl?: string;
      outputScale?: string | null;
      tone?: string;
      type?: string;
      fileName?:string;
      fileSelected?:File
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
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

const initialFormData: Partial<FormDataProps> = {
  product: '',
  campaignGoal: '',
  targetAudience: '',
  webUrl: '',
  outputScale: 5, // Default value changed to 5
  topic: '',
  keyPoints: '',
  tone: '',
  type: '',
  fileSelected: undefined,
  fileName:''
};

const BaseAssetForm = ({
  params,
  assetType,
  assetSpecificSection,
  isEditMode = false,
  aiPromptAssetUpsert,
  aiPromptCampaignUpsert,
  existingAssetDetails,
  setIsOpen
}: BaseAssetFormProps) => {
  const router = useRouter();
  const [generateStep, setGenerateStep] = useState(1);
  const { assetIDTemplateRef, generateHTML, aiPromptGenerateForAsset, getVersionDataUsingAI, generateVersionHTML, getAssetByVersionId,uploadImage } = useGenerateTemplate({ params: { templateID: params.template?.templateID ?? '' } });
  const [formData, setFormData] = useState<Partial<FormDataProps>>(initialFormData);
  const [sectionsData, setSectionsData] = useState<SectionProps[]>([]);
  const { setShowLoading, showLoading } = useLoading();
  const { contextData, setContextData, setError } = useAppData();
  const [existingAssetPrompt] = useState<AIPromptAsset | null>(params.assetPrompts || null);
  const [assetSpecificSectionValid, setAssetSpecificSectionValid] = useState(false);
  const [isProjectDetailsValid, setIsProjectDetailsValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [section4Interacted, setSection4Interacted] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);


  useEffect(() => {
    if (isEditMode && params.editContextData) {      
      setFormData(prev => ({
        ...prev,
        product: params.project_name ?? '',
        campaignGoal: params.editContextData?.campaignGoal ?? '',
        targetAudience: params.editContextData?.targetAudience ?? '',
        webUrl: params.editContextData?.webUrl ?? '',
        outputScale: params.editContextData?.outputScale ? parseInt(params.editContextData.outputScale, 10) : 5,
        topic: params.editContextData?.topic ?? '',
        keyPoints: params.editContextData?.keyPoints ?? '',
        tone: params.editContextData?.tone ?? '',
        type: params.editContextData?.type ?? '',
        fileName:params.editContextData?.fileName ?? ''
      }));
      if (params.template?.templatesBlocks) {
        const initialSections = params.template.templatesBlocks
          .filter(item => !item.isStatic)
          .map(item => ({
            templateBlockID: item.templateBlockID || "",
            aiPrompt: item.aiPrompt || ""
          }));
        setSectionsData(initialSections);
      }
      setIsProjectDetailsValid(!!(params.project_name && params.campaign_name && params.asset_name));
    }
  }, [isEditMode, params.editContextData, params.project_name, params.campaign_name, params.asset_name, params.template, setSectionsData]);

  useEffect(() => {
    if (!isEditMode) {
      setFormData(prev => ({
        ...prev,
        product: params.project_name ?? ''
      }));
    }
  }, [params.project_name, isEditMode]);

  // Calculate section validities directly
  // const isCampaignOverviewValid = !!formData.campaignGoal && !!formData.targetAudience;
  const isCampaignOverviewValid = !!formData.campaignGoal && !!formData.targetAudience && (
    formData.webUrl?.trim() === '' || !isValidUrl
  );
  // Section 4: Valid if in edit mode OR if in create mode and user has interacted.
  const isContentBriefValid = isEditMode || section4Interacted;

  // Combined validity checks for enabling buttons
  const allSectionsValidForCreate = isProjectDetailsValid && isCampaignOverviewValid && assetSpecificSectionValid;
  const allSectionsValidForEdit = isProjectDetailsValid && isCampaignOverviewValid && assetSpecificSectionValid; // Content brief not edited/validated in edit mode

  // Validity check specifically for enabling Generate/Regenerate in Edit mode
  const canRegenerateInEditMode = isProjectDetailsValid && isCampaignOverviewValid && assetSpecificSectionValid;

  const fetchExistingCampaignData = useCallback((data: CampaignSelectResponse | null) => {
    if (data && !isEditMode) {
      setFormData(prev => ({
        ...prev,
        campaignGoal: data.aIPromptCampaign.campaignGoal,
        targetAudience: data.aIPromptCampaign.targetAudience,
        webUrl: data.aIPromptCampaign.webUrl,
        outputScale: data.aIPromptCampaign.outputScale ?? 5
      }));
    }
  }, [isEditMode]);

  const appendExistingAssetPromptData = useCallback((data: AIPromptAsset | null) => {
    if (!data || isEditMode) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      topic: data?.topic,
      type: data?.type,
      keyPoints: data?.keyPoints,
      tone: data?.tone
    }));
  }, [isEditMode]);

  useEffect(() => {
    if (!isEditMode && existingAssetPrompt) {
      appendExistingAssetPromptData(existingAssetPrompt);
    }
  }, [existingAssetPrompt, appendExistingAssetPromptData, isEditMode]);

  const handleGenerate = useCallback(async () => {
    if (isEditMode) {
      if (showLoading || generateStep !== 1 || !canRegenerateInEditMode || !existingAssetDetails?.asset_id) {
        if (!existingAssetDetails?.asset_id) {
          console.error("Regenerate clicked but existingAssetDetails.asset_id is missing");
          setError({ status: 400, message: "Cannot regenerate, asset details missing.", showError: true });
        }
        return;
      }

      setShowLoading(true);
      setGenerateStep(2);

      try {
        const assetVersionID = params.assetVersionID;
        if (!assetVersionID) {
          throw new Error("Asset Version ID is missing, cannot regenerate.");
        }

        const getDataRes = await getVersionDataUsingAI(assetVersionID);

        if (!getDataRes?.isSuccess) {
          throw new Error("Failed to get latest AI data for version.");
        }

        console.log("Successfully fetched latest AI data for version.");

        const generateHtmlRes = await generateVersionHTML(assetVersionID) as any;
        // console.log("generateHtmlRes ",generateHtmlRes);
        // console.log("contextData :",contextData.AssetHtml.assetVersions);
        // console.log("contextData :",contextData);
        // console.log("assetVersionID :",assetVersionID);
        const updatedVersion = await getAssetByVersionId(assetVersionID)
        const updatedVersionList: AssetVersionProps[] | any = contextData.AssetHtml.assetVersions.map(version =>
          version.assetVersionID === assetVersionID ? updatedVersion : version
        )
        setContextData({ AssetHtml: { ...contextData.AssetHtml, assetVersions: updatedVersionList } })

        if (!generateHtmlRes?.isSuccess) {
          throw new Error("Failed to generate HTML for version.");
        }

        // console.log("Successfully generated HTML for version.");

        if (setIsOpen) {
          setIsOpen(false);
        }
        setGenerateStep(1);

      } catch (error) {
        console.error("Error during edit mode regeneration:", error);
        const apiError = ApiService.handleError(error);
        setError({
          status: apiError.statusCode ?? 500,
          message: apiError.message || "Failed to regenerate asset version.",
          showError: true
        });
        setGenerateStep(1);
      } finally {
        setShowLoading(false);
      }

      return;
    }

    if (generateStep === 2 || !allSectionsValidForCreate) {
      if (!allSectionsValidForCreate && !isEditMode) {
        setError({ status: 400, message: "Please complete all required sections before generating.", showError: true });
      }
      return;
    }

    let newStep = generateStep + 1;

    if (newStep > 3) {
      newStep = 1;
      setContextData({ assetTemplateShow: false });
    } else {
      setContextData({ assetTemplateShow: true });

      if (newStep === 2) {
        setContextData({ assetGenerateStatus: newStep });
        setGenerateStep(newStep);
        setShowLoading(true);
        const res = await generateHTML(
          formData as FormDataProps,
          sectionsData as SectionProps[],
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
    isEditMode, generateStep, assetIDTemplateRef, assetType, contextData,
    generateHTML, router, setContextData, setShowLoading, formData, sectionsData, setError,
    allSectionsValidForCreate, canRegenerateInEditMode, existingAssetDetails,
    getVersionDataUsingAI, generateVersionHTML, setIsOpen, showLoading
  ]);

  const handleInputChange = useCallback((field: string, value: string | number | File | null) => {
    const trimmedValue = typeof value === 'string' ? value.trim() : value;
    setFormData(prev => ({
      ...prev,
      [field]: trimmedValue
    }));
    if (isEditMode) setIsDirty(true);
  }, [isEditMode]);

  const handleInputTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, field: string) => {
    const value = e.target.value;
    // console.log("value :",value);
    setIsValidUrl(false)

    if (field === "webUrl" && value.trim() !== '') {
      if (!validateUrl(value)) {
        setIsValidUrl(true)
      }
    }

    handleInputChange(field, e.target.value);
  }, [handleInputChange]);

  // url validationn function
  const validateUrl = (url: string): boolean => {
    const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
    return regex.test(url);
  };


  const handleInputSectionModified = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>, index: number, trimOnBlur = false) => {
    let newValue = e.target.value;
    if (trimOnBlur) newValue = newValue.trim(); // only trims when user leaves the field
    //console.log(newValue);
    setSectionsData(prevSections => {
      const newSections = [...prevSections];
      if (newSections[index]) {
        newSections[index] = { ...newSections[index], aiPrompt: newValue };
      }
      return newSections;
    });
    if (isEditMode) setIsDirty(true);
  }, [isEditMode, setSectionsData]);

  const handleValidationChange = useCallback((isValid: boolean) => {
    setAssetSpecificSectionValid(isValid);
    if (isEditMode && isValid) {
      setIsDirty(prevDirty => prevDirty || isValid);
    }
  }, [isEditMode]);

  const handleProjectDetailsValidation = useCallback((_step: number, isValid: boolean) => {
    setIsProjectDetailsValid(isValid);
  }, []);

  // Function to mark section 4 as interacted
  const handleSection4Interaction = useCallback(() => {
    if (!section4Interacted) { // Only set once
      setSection4Interacted(true);
    }
  }, [section4Interacted]); // Add dependency

  const handleSaveChanges = useCallback(async () => {
    if (!isEditMode || !isDirty || isSaving || !aiPromptAssetUpsert || !aiPromptCampaignUpsert || !existingAssetDetails) {
      return;
    }

    if (!isCampaignOverviewValid || !assetSpecificSectionValid) {
      setError({ status: 400, message: "Please ensure Campaign Overview and Asset Specific sections are complete and valid.", showError: true });
      return;
    }

    setIsSaving(true);
    setShowLoading(true);
    try {      
      const campaignPayload: Partial<FormDataProps> = {
        product: existingAssetDetails.project_name,
        campaignGoal: formData.campaignGoal,
        targetAudience: formData.targetAudience,
        webUrl: formData.webUrl
      };

      const getFileId = await uploadImage(formData);
      // console.log("getFileId :",getFileId);
      
      const campaignRes = await aiPromptCampaignUpsert!(campaignPayload as FormDataProps, getFileId, existingAssetDetails.campaign_id);

      if (!campaignRes.isSuccess) {
        throw new Error("Failed to save campaign details.");
      }

      const assetPayload: Partial<FormDataProps> = {
        topic: formData.topic ?? "",
        keyPoints: formData.keyPoints ?? "",
        tone: formData.tone,
        type: formData.type,
        outputScale: formData.outputScale
      };
      const assetRes = await aiPromptAssetUpsert!(assetPayload as FormDataProps, existingAssetDetails.asset_id);

      if (!assetRes.isSuccess) {
        throw new Error("Failed to save asset prompt details.");
      }

      setIsDirty(false);

      // --- Call aiPromptGenerateForAsset after successful save --- 
      if (aiPromptGenerateForAsset) {
        try {
          // Assuming assetID is available in existingAssetDetails
          assetIDTemplateRef.current = existingAssetDetails.asset_id; // Ensure ref is set
          const generateRes = await aiPromptGenerateForAsset();
          if (!generateRes?.isSuccess) {
            // Handle potential error during prompt generation if needed
            console.error("Failed to generate AI prompt after save.");
            setError({
              status: 500,
              message: "Saved successfully, but failed to regenerate AI prompt.",
              showError: true
            });
          } else {
            console.log("AI prompt regenerated successfully after save.");
          }
        } catch (genError) {
          console.error("Error during aiPromptGenerateForAsset call:", genError);
          const apiGenError = ApiService.handleError(genError);
          setError({
            status: apiGenError.statusCode ?? 500,
            message: "Saved successfully, but failed to regenerate AI prompt: " + apiGenError.message,
            showError: true
          });
        }
      } else {
        // Fallback success message if aiPromptGenerateForAsset is somehow undefined
        setError({ message: "Changes saved successfully!", showError: true, status: 200 });
      }
      // --- End of new call --- 

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
    existingAssetDetails, formData, sectionsData, setShowLoading, setError,
    isCampaignOverviewValid, assetSpecificSectionValid,
    aiPromptGenerateForAsset, assetIDTemplateRef
  ]);

  const generateButtonLabel = generateStep === 1 ? "Generate" : "Regenerate";
  // Button disabled logic based on mode and validity
  const isGenerateDisabled = showLoading || isEditMode || generateStep === 2 || !allSectionsValidForCreate;
  const isSaveDisabled = showLoading || !isEditMode || !isDirty || isSaving || !allSectionsValidForEdit;
  // Disable Regenerate in Edit mode if sections aren't valid or already generating
  const isRegenerateDisabledInEdit = showLoading || generateStep === 2 || !canRegenerateInEditMode;

  // Effect to initialize sectionsData in CREATE mode
  useEffect(() => {
    if (!isEditMode && params.template?.templatesBlocks) {
      const initialSections = params.template.templatesBlocks
        .filter(item => !item.isStatic)
        .map(item => ({ // Initialize with empty prompts for create mode
          templateBlockID: item.templateBlockID || "",
          aiPrompt: ""
        }));
      setSectionsData(initialSections);
    }
    // Reset if template disappears or mode changes to edit?
    // else if (isEditMode || !params.template?.templatesBlocks) { 
    //   setSectionsData([]);
    // }
  }, [isEditMode, params.template?.templatesBlocks, setSectionsData]);

  // Effect to set product name in create mode
  useEffect(() => {
    if (!isEditMode) {
      setFormData(prev => ({
        ...prev,
        product: params.project_name ?? ''
      }));
    }
  }, [params.project_name, isEditMode]);

  const getCurrentPath = usePathname()

  return (
    <div className="pb-20">
      <div>
        <Accordion
          isRequire={true}
          HeaderTitle="Project Details"
          checked={isProjectDetailsValid}
          isPreventEdit={isEditMode || !!params.asset_name}
        >
          <SectionAssetDetails
            validatingTheData={handleProjectDetailsValidation}
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
          checked={isCampaignOverviewValid}
        >
          <div>
            <div className="flex flex-wrap items-start gap-x-[16%] gap-y-4">
              <div className="w-full md:w-[260px]">
                <ChildrenTitle title="Campaign Goal" customClass="mt-5" showStar={true} />
                <DropDown
                  onSelected={(optionSelected) => {
                    handleInputChange('campaignGoal', optionSelected.value);
                  }}
                  isShowOther={false}
                  preSelectValue={formData?.campaignGoal}
                  selectPlaceHolder="Select Campaign Goal"
                  optionLists={listofcampains}
                />
              </div>

              <div className="w-full md:w-[260px]">
                <ChildrenTitle title="Target audience" customClass="mt-5" showStar={true} />
                <DropDown
                  onSelected={(optionSelected) => {
                    handleInputChange('targetAudience', optionSelected.value);
                  }}
                  isShowOther={false}
                  preSelectValue={formData?.targetAudience}
                  selectPlaceHolder="Select Target Audience"
                  optionLists={ListTargetAudience}
                />
              </div>
            </div>

            <div className="mt-4">
              <ChildrenTitle customClass="mt-5" title="Additional Campaign Assets URL" />
              <TextField
                handleChange={(e) => handleInputTextChange(e, "webUrl")}
                value={formData?.webUrl ?? ''}
                placeholder="Enter your URL here."
                customAreaClass="whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
              />
              {
                isValidUrl && <p className='text-red-500 -mt-2'>Invalid URL</p>
              }
              {/* {isEditMode && ( */}
                <DragAndDrop
                  onFileSelect={(file) => {
                    handleInputChange('fileSelected', file as File);
                  }}
                  {...(getCurrentPath === "/edit-html-content" && { uploadedFile:formData.fileName })}
                />
              {/* )} */}
            </div>
          </div>
        </Accordion>
      </div>

      <div className="mt-[25px]">
        <Accordion
          isRequire={true}
          HeaderTitle={assetSpecificSection.title}
          checked={assetSpecificSectionValid}
          {...(getCurrentPath === "/edit-html-content" && { isShowContent: true })}
        >
          <assetSpecificSection.component
            existingData={null}
            editContextData={isEditMode ? {
              topic: formData?.topic ?? "",
              keyPoints: formData?.keyPoints ?? "",
              tone: formData?.tone ?? "",
              type: formData?.type ?? "",
              outputScale: formData?.outputScale?.toString() ?? null
            } : undefined}
            handleInputChange={handleInputChange}
            onValidationChange={handleValidationChange}
            assetType={assetType}
            isEditMode={isEditMode}
          />
        </Accordion>
      </div>

      {!isEditMode && (
        <div className="mt-[25px]">
          <Accordion
            HeaderTitle="Content Brief"
            checked={isContentBriefValid}
            handleShowContent={handleSection4Interaction}
          >
            <div>
              {params.template?.templatesBlocks && params.template?.templatesBlocks.filter((item) => !item.isStatic).map((item, index) => {
                const sectionData = sectionsData[index];
                return (
                  <div key={`${item.blockID}-${index}`}>
                    <ChildrenTitle title={`Section ${index + 1}: ${item.aiTitle || ''}`} customClass={`text-[18px] ${index === 0 ? "" : "mt-[20px]"}`} />
                    <ChildrenTitle title={item.aiDescription || ''} customClass="text-[14px]" />
                    <TextField
                      handleChange={(e) => handleInputSectionModified(e, index)}
                      onBlur={(e) => handleInputSectionModified(e, index, true)} // Call trim function on blur
                      value={sectionData?.aiPrompt ?? ''}
                      customClass="h-16"
                      placeholder={item.aiPrompt || ''}
                    />
                  </div>
                );
              })}
            </div>
          </Accordion>
        </div>
      )}

      <div className="flex justify-end items-center gap-4 mt-5 pr-4 bottom-0 py-4">
        {isEditMode ? (
          <>
            <Button
              handleClick={handleSaveChanges}
              disabled={isSaveDisabled && isDirty}
              customClass="px-6 py-2"
              buttonText={isSaving ? "Saving..." : "Save Changes"}
            />
            {/* Add Generate/Regenerate button for edit mode */}
            <Button
              handleClick={handleGenerate}
              disabled={isRegenerateDisabledInEdit && isDirty} // Use specific disable logic for edit mode regeneration
              customClass="px-6 py-2"
              buttonText={"Regenerate"} // Always show Regenerate in edit mode
            />
          </>
        ) : (
          // Create mode only shows Generate
          <Button
            handleClick={handleGenerate}
            disabled={isGenerateDisabled} // Use original create mode disable logic
            customClass="px-6 py-2"
            buttonText={generateButtonLabel}
          />
        )}
      </div>
    </div>
  );
};

export default BaseAssetForm; 