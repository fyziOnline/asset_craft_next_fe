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

export interface AssetSectionConfig {
  title: string;
  requiredFields?: string[];
  component: React.ComponentType<{
    existingData: AIPromptAsset | null;
    handleInputChange: (field: string, value: string) => void;
    onValidationChange: (isValid: boolean) => void;
  }>;
}

export interface BaseAssetFormProps {
  params: {
    template: Template;
    assetPrompts?: AIPromptAsset;
    project_name?: string;
    campaign_name?: string;
    asset_name?: string;
  };
  assetType: string;
  assetSpecificSection: AssetSectionConfig;
}

const BaseAssetForm = ({ params, assetType, assetSpecificSection }: BaseAssetFormProps) => {
  const router = useRouter();
  const [generateStep, setGenerateStep] = useState(1); //1 - Normal, 2 - (Loading or disable), 3 - Regenerate
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const [isShowList, setIsShowList] = useState<number[]>([]);
  const { assetIDTemplateRef, generateHTML } = useGenerateTemplate({ params: { templateID: params.template?.templateID ?? '' } });
  const { refFormData, refSection, handleInputText, handleInputSection } = useInputFormDataGenerate();
  const { setShowLoading } = useLoading();
  const { contextData, setContextData } = useAppData();
  const [existingCampaignDetails, setExistingCampaignDetails] = useState<CampaignSelectResponse | null>(null);
  const [existingAssetPrompt] = useState<AIPromptAsset | null>(params.assetPrompts || null);
  const [assetSpecificSectionValid, setAssetSpecificSectionValid] = useState(false);

  useEffect(() => {
    refFormData.current = {
      ...refFormData.current,
      product: params.project_name
    };
  }, [params.project_name]);

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
    if (step === 1) {
      setCheckedList((prev) =>
        status
          ? prev.includes(0) ? prev : [...prev, 0]
          : prev.filter((item) => item !== 0)
      );
    }
    if (step === 2) {
      if (
        refFormData.current?.campaignGoal?.length &&
        refFormData.current?.targetAudience?.length
      ) {
        setCheckedList((prev) => (prev.includes(1) ? prev : [...prev, 1]));
      } else {
        setCheckedList((prev) => prev.filter((item) => item !== 1));
      }
    }
    if (step === 3) {
      if (status !== undefined) {
        if (status) {
          setCheckedList((prev) => (prev.includes(2) ? prev : [...prev, 2]));
        } else {
          setCheckedList((prev) => prev.filter((item) => item !== 2));
        }
      } else if (assetSpecificSectionValid) {
        setCheckedList((prev) => (prev.includes(2) ? prev : [...prev, 2]));
      } else {
        setCheckedList((prev) => prev.filter((item) => item !== 2));
      }
    }
    if (step === 4) {
      setCheckedList((prev) => (prev.includes(3) ? prev : [...prev, 3]));
    }
  }, [assetSpecificSectionValid]);

  const fetchExistingCampaignData = useCallback((data: CampaignSelectResponse | null) => {
    setExistingCampaignDetails(data);
    if (data) {
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
  }, [isShowList, checkedList, doesFormCompleted]);

  const appendExistingAssetPromptData = useCallback((data: AIPromptAsset | null) => {
    if (!data) {
      return;
    }
    refFormData.current = {
      ...refFormData.current,
      topic: params.assetPrompts?.topic,
      type: params.assetPrompts?.type,
      keyPoints: params.assetPrompts?.keyPoints,
      tone: params.assetPrompts?.tone
    };
    doesFormCompleted(3);
  }, [doesFormCompleted, params.assetPrompts]);

  useEffect(() => {
    if (existingAssetPrompt) {
      appendExistingAssetPromptData(existingAssetPrompt);
      setCheckedList([0, 1, 2, 3]); // promptResVisit
    }
  }, [existingAssetPrompt, appendExistingAssetPromptData]);

  const handleGenerate = useCallback(async () => {
    if (generateStep === 2 || checkedList.length !== 4) {
      return;
    }

    let newStep = generateStep + 1;

    if (newStep > 3) {
      // Reset after completing step 3
      newStep = 1;
      setIsShowList([]);
      setCheckedList([]);
      setContextData({ assetTemplateShow: false });
    } else {
      setContextData({ assetTemplateShow: true });

      if (newStep === 2) {
        setCheckedList([0, 1, 2, 3, 4]);
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
            `/edit-html-content?assetID=${assetIDTemplateRef.current}&projectName=${contextData.ProjectDetails.project_name}&campaignName=${contextData.ProjectDetails.campaign_name}&assetTypeIcon=${assetType}`
          );
        }

        return;
      }
    }
    setContextData({ assetGenerateStatus: newStep });
    setGenerateStep(newStep);
  }, [generateStep, checkedList, assetIDTemplateRef, assetType, contextData, generateHTML, router, setContextData, setShowLoading]);

  const handleInputChange = useCallback((field: string, value: string) => {
    refFormData.current = {
      ...refFormData.current,
      [field]: value
    };
  }, []);

  const handleValidationChange = useCallback((isValid: boolean) => {
    setAssetSpecificSectionValid(isValid);
    doesFormCompleted(3, isValid);
  }, [doesFormCompleted]);

  return (
    <div>
      {/* Section 1: Project Details */}
      <div>
        <Accordion
          isRequire={true}
          HeaderTitle="Project Details"
          checked={checkedList.includes(0)}
          handleShowContent={() => { updateShowList(0); }}
          isPreventEdit={params.asset_name ? true : false}
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

      {/* Section 2: Campaign Overview */}
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
            <div className="flex items-start gap-[16%]">
              <div className="w-[260px]">
                <ChildrenTitle title="Campaign Goal" customClass="mt-5" showStar={true} />
                <DropDown
                  onSelected={(optionSelected) => {
                    handleInputChange('campaignGoal', optionSelected.value);
                    doesFormCompleted(2);
                  }}
                  isShowOther={false}
                  preSelectValue={existingCampaignDetails ? existingCampaignDetails.aIPromptCampaign.campaignGoal : ""}
                  selectPlaceHolder="Select Campaign Goal"
                  optionLists={listofcampains}
                />
              </div>

              <div className="w-[260px]">
                <ChildrenTitle title="Target audience" customClass="mt-5" showStar={true} />
                <DropDown
                  onSelected={(optionSelected) => {
                    handleInputChange('targetAudience', optionSelected.value);
                    doesFormCompleted(2);
                  }}
                  isShowOther={false}
                  preSelectValue={existingCampaignDetails ? existingCampaignDetails.aIPromptCampaign.targetAudience : ""}
                  selectPlaceHolder="Select Target Audience"
                  optionLists={ListTargetAudience}
                />
              </div>
            </div>

            <div>
              <ChildrenTitle customClass="mt-5" title="Additional Campaign Assets" />
              <TextField
                handleChange={(e) => {
                  handleInputText(e, "webUrl");
                }}
                defaultValue={existingCampaignDetails ? existingCampaignDetails.aIPromptCampaign.webUrl : ""}
                placeholder="Enter your URL here."
                customAreaClass="whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
              />
              <DragAndDrop
                onFileSelect={(file) => {
                  handleInputChange('fileSelected', file as unknown as string);
                }}
              />
            </div>
          </div>
        </Accordion>
      </div>

      {/* Section 3: Asset-specific content */}
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
            existingData={existingAssetPrompt}
            handleInputChange={handleInputChange}
            onValidationChange={handleValidationChange}
          />
        </Accordion>
      </div>

      {/* Section 4: Content Brief */}
      <div className={`mt-[25px] ${params.asset_name ? "hidden" : ""}`}>
        <Accordion
          HeaderTitle="Content Brief"
          checked={checkedList.includes(3)}
          handleShowContent={() => {
            doesFormCompleted(4);
            updateShowList(3);
          }}
        >
          <div>
            {params.template?.templatesBlocks && params.template?.templatesBlocks.filter((item) => !item.isStatic).map((item, index) => {
              if (params.template.templatesBlocks && refSection.current.length < params.template?.templatesBlocks.filter((item) => !item.isStatic).length) {
                refSection.current = [...refSection.current as SectionProps[], {
                  templateBlockID: item.templateBlockID || "",
                  aiPrompt: ""
                }];
              }

              return (
                <div key={`${item.blockID}-${index}`}>
                  <ChildrenTitle title={`Section ${index + 1}: ${item.aiTitle || ''}`} customClass={`text-[18px] ${index === 0 ? "" : "mt-[20px]"}`} />
                  <ChildrenTitle title={item.aiDescription || ''} customClass="text-[14px]" />
                  <TextField
                    handleChange={(e) => {
                      handleInputSection(e, index);
                    }}
                    customClass="h-16"
                    placeholder={item.aiPrompt || ''}
                  />
                </div>
              );
            })}
          </div>
          <div className="w-[300px]">
            <ChildrenTitle title="How creative you want the output?" customClass="mt-5" />
            <RangeSlider
              onSelectValue={(value) => {
                handleInputChange('outputScale', value.toString());
              }}
              defaultValue={existingCampaignDetails ? existingCampaignDetails.aIPromptCampaign.outputScale : 7}
            />
          </div>
        </Accordion>
      </div>

      {/* Generate Button */}
      {!existingAssetPrompt?.assetID && (
        <div className="flex justify-end my-[30px]">
          <Button
            buttonText={[1, 2].includes(generateStep) ? 'Generate' : 'Regenerate'}
            showIcon
            textStyle="text-[1rem] font-base text-[#00A881]"
            backgroundColor={((checkedList.length === 4 && generateStep !== 2) || generateStep === 4) ? "bg-custom-gradient-green" : "bg-[#B1B1B1]"}
            handleClick={handleGenerate}
            customClass="static px-[1.4rem] py-2 group-hover:border-white"
          />
        </div>
      )}
    </div>
  );
};

export default BaseAssetForm; 