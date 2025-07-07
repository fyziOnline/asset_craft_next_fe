'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ChildrenTitle from '@/components/global/ChildrenTitle';
import TextField from '@/components/global/TextField';
import RangeSlider from '@/components/global/RangeSlider';
import { AIPromptAsset } from '@/types/templates';
import { getAssetLabels } from '@/app/generate-asset/config/assetConfig';
// import { useAppData } from '@/context/AppContext'; // Remove unused
// import { ApiService } from '@/lib/axios_generic'; // Remove unused
// import { urls } from '@/apis/urls'; // Remove unused

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

// Remove unused interface
// interface AssetSaveResponse {
//   isSuccess: boolean;
//   errorOnFailure: string;
// }

const GenericAssetSection: React.FC<GenericAssetSectionProps> = ({
  existingData,
  handleInputChange,
  onValidationChange,
  assetType,
  editContextData,
  // isEditMode // Remove isEditMode from destructuring if unused
}) => {
  // const { setError } = useAppData(); // Remove unused

  // Get labels for this asset type or use default
  const labels = useMemo(() => {
    return getAssetLabels(assetType);
  }, [assetType]);

  // Use memo to initialize form data, mapping topic -> primaryMessage and keyPoints -> additionalInfo
  const initialFormData = useMemo(() => ({
    primaryMessage: existingData?.topic || '',
    additionalInfo: existingData?.keyPoints || ''
  }), [existingData]);

  // Use memoized initial data
  const [formData, setFormData] = useState(initialFormData);
  const [validationState, setValidationState] = useState<boolean>(false);

  // Read initial outputScale from props (prefer editContextData, fallback to existingData, default 5)
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
    // Run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []); // Remove existingData/onValidationChange, add editContextData if needed? No, run once.

  // Update form data based on props (existingData or editContextData)
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

  return (
    <div className="max-w-[90%]">
      <ChildrenTitle
        showStar={true}
        customClass="mt-5"
        title={labels.primaryMessage.title}
      />
      <TextField
        handleChange={(e) => {
          updateFormData('primaryMessage', e.target.value);
        }}
        defaultValue={formData.primaryMessage}
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
          updateFormData('additionalInfo', e.target.value);
        }}
        defaultValue={formData.additionalInfo}
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
          }}
          // Use the determined initial value
          defaultValue={initialOutputScale}
        />
      </div>
    </div>
  );
};

export default GenericAssetSection; 