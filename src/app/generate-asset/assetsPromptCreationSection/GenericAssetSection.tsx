'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ChildrenTitle from '@/components/global/ChildrenTitle';
import TextField from '@/components/global/TextField';
import RangeSlider from '@/components/global/RangeSlider';
import { AIPromptAsset } from '@/types/templates';
import { getAssetLabels } from '@/app/generate-asset/config/assetConfig';
import { useAssetCraftStoreSelector } from '@/store/assetCraftStore';
import FieldHeader from '@/components/global/FieldHeader';
import { useProjectFormData } from '@/hooks/useProjectFormData';
import { Blocks } from '@/app/asset-craft/component/blocks/_index';
import { Elements } from '@/app/asset-craft/component/elements/_index';
import DragAndDrop from '@/components/global/MultyFileDragAndDrop';
interface GenericAssetSectionProps {
  existingData?: AIPromptAsset | null;
  handleInputChange: (field: string, value: string | number | null) => void;
  onValidationChange: (isValid: boolean) => void;
  assetType?: string | null; // Optional asset type to get specific labels
  // Optional editContext data directly passed from a component that has access
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
  isEditMode?: boolean; // Keep in props for type checking with parent, but remove from destructuring if unused
}


const GenericAssetSection: React.FC<GenericAssetSectionProps> = ({
  existingData,
  handleInputChange,
  onValidationChange,
  assetType,
  editContextData,
  // isEditMode // Remove isEditMode from destructuring if unused
}) => {
  const labels = useMemo(() => {
    return getAssetLabels(assetType);
  }, [assetType]);

  const initialFormData = useMemo(() => ({
    primaryMessage: existingData?.topic || '',
    additionalInfo: existingData?.keyPoints || ''
  }), [existingData]);

  const [formData, setFormData] = useState(initialFormData);
  const [validationState, setValidationState] = useState<boolean>(false);
  const assetInformation = useAssetCraftStoreSelector.use.assetInformation()
  const campaignInformation = useAssetCraftStoreSelector.use.campaignInformation()
  const updateCampaignInformation = useAssetCraftStoreSelector.use.updateCampaignInformation()
  const updateAssetInformation = useAssetCraftStoreSelector.use.updateAssetInformation()
  const {onChangeAssetDetails,isAssetNameExists} = useProjectFormData()

  const initialOutputScale = useMemo(() => {
    let scaleValue = 5; // Default
    if (editContextData?.outputScale) {
      scaleValue = parseInt(editContextData.outputScale, 10);
    } else if (existingData?.outputScale) { // Fallback to existingData if editContextData doesn't have it
      scaleValue = existingData.outputScale;
    }
    return scaleValue;
  }, [editContextData, existingData]);

  // Enhanced validation check based on formData changes
  useEffect(() => {
    // Only primary message (topic) is required
    const isValid = Boolean(
      formData.primaryMessage && formData.primaryMessage.trim() !== ''
    );

    // Only update validation state if it has changed
    if (isValid !== validationState) {
      setValidationState(isValid);
      onValidationChange(isValid);
    }
  }, [formData, onValidationChange, validationState]);

  // Ensure validation runs once on mount based on initial data (existing or edit context)
  useEffect(() => {
    const initialTopic = editContextData?.topic || existingData?.topic || '';
    const isValid = Boolean(initialTopic && initialTopic.trim() !== '');
    setValidationState(isValid);
    onValidationChange(isValid);
  }, []); // Remove existingData/onValidationChange, add editContextData if needed? No, run once.

  useEffect(() => {
    if (editContextData) {
      setFormData({
        primaryMessage: editContextData.topic || '',
        additionalInfo: editContextData.keyPoints || ''
      });
    } else if (existingData) { // Fallback to existingData if editContextData is not present
      setFormData({
        primaryMessage: existingData.topic || '',
        additionalInfo: existingData.keyPoints || ''
      });
    }
  }, [editContextData, existingData]);

  // Memoize update function
  const updateFormData = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Map the form fields to the API fields when sending to parent
    if (field === 'primaryMessage') {
      handleInputChange('topic', value);
    } else if (field === 'additionalInfo') {
      handleInputChange('keyPoints', value);
    }
  }, [handleInputChange]);

  // <div className='mt-5'>
  //               <FieldHeader 
  //                 header='Digital Marketing Asset Name'
  //                 isMandatory
  //               />
  //               <TextField
  //                 customClass='h-12' 
  //                 placeholder='Type the name of your Digital Marketing Assets here, E.g. Email_1, Linkedin_1 etc' 
  //                 name="asset_name" 
  //                 handleChange={(e)=>{
  //                   onChangeAssetDetails(e)
  //                 }} 
  //                 // defaultValue={existingAssetMeta?.asset_name}  
  //               />
  //               {isAssetNameExists ? <p className='text-red-500 text-[12px] mt-[-10px]'>Asset name already exists, please enter another asset name.</p> : null}
  //             </div>

  return (
    <div className="max-w-[90%]">
      <FieldHeader
        header='Digital Marketing Asset Name'
        isMandatory
      />
      <TextField
        placeholder='Type the name of your Digital Marketing Assets here, E.g. Email_1, Linkedin_1 etc' 
        name="asset_name" 
        handleChange={(e)=>{
          onChangeAssetDetails(e)
        }} 
      />
     {isAssetNameExists ? <p className='text-red-500 text-[12px] mt-[-10px]'>Asset name already exists, please enter another asset name.</p> : null}

      <ChildrenTitle
        showStar={true}
        customClass="mt-5"
        title={labels.primaryMessage.title}
      />
      <TextField
        handleChange={(e) => {
          // updateFormData('primaryMessage', e.target.value);
          updateCampaignInformation({topic:e.target.value})
        }}
        defaultValue={campaignInformation.topic}
        rows={4}
        placeholder={labels.primaryMessage.placeholder}
        customAreaClass=" overflow-x-auto overflow-y-auto"
      />

      <ChildrenTitle
        showStar={false}
        customClass="mt-5"
        title={labels.additionalInfo.title}
      />
      <TextField
        handleChange={(e) => {
          // updateFormData('additionalInfo', e.target.value);
          updateCampaignInformation({keyPoints : e.target.value})
        }}
        defaultValue={campaignInformation.keyPoints}
        rows={4}
        placeholder={labels.additionalInfo.placeholder}
        customAreaClass=" overflow-x-auto overflow-y-auto"
      />

      {/* Add Range Slider for Output Scale */}
      <div className="w-full md:w-[300px] mt-4">
        <ChildrenTitle title="How creative you want the output?" customClass="mt-5" />
        <RangeSlider
          onSelectValue={(value) => {
            // Ensure value is passed correctly (as number)
            handleInputChange('outputScale', value);
            updateCampaignInformation({outputScale:value})
          }}
          // Use the determined initial value
          defaultValue={initialOutputScale}
        />
      </div>
      <Blocks.Section title='Additional Asset References' defaultOpen >
        <div className='mt-5'>
          <Elements.MultiUrlInput
            label="Campaign URLs"
            urls={assetInformation.assetSpecificUrls}
            setUrls={(urls:string[])=>{
              // setUrls(urls)
              updateAssetInformation({assetSpecificUrls:urls})
            }}
          />
        </div>
        <div className="overflow-y-auto">
          <DragAndDrop 
            
          />
        </div>
      </Blocks.Section>
    </div>
  );
};

export default GenericAssetSection; 