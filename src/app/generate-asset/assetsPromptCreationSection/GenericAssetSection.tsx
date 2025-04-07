'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ChildrenTitle from '@/components/global/ChildrenTitle';
import TextField from '@/components/global/TextField';
import { AIPromptAsset } from '@/types/templates';
import { getAssetLabels } from '@/app/generate-asset/config/assetConfig';

interface GenericAssetSectionProps {
  existingData: AIPromptAsset | null;
  handleInputChange: (field: string, value: string) => void;
  onValidationChange: (isValid: boolean) => void;
  assetType?: string; // Optional asset type to get specific labels
}

const GenericAssetSection: React.FC<GenericAssetSectionProps> = ({ 
  existingData, 
  handleInputChange, 
  onValidationChange,
  assetType
}) => {
  // Get labels for this asset type or use default
  const labels = useMemo(() => {
    return getAssetLabels(assetType);
  }, [assetType]);

  // Use memo to initialize form data
  const initialFormData = useMemo(() => ({
    primaryMessage: existingData?.primaryMessage || '',
    additionalInfo: existingData?.additionalInfo || ''
  }), [existingData]);

  // Use memoized initial data
  const [formData, setFormData] = useState(initialFormData);
  const [validationState, setValidationState] = useState<boolean>(false);

  // Enhanced validation check
  useEffect(() => {
    // Only primary message is required
    const isValid = Boolean(
      formData.primaryMessage && formData.primaryMessage.trim() !== ''
    );
    
    // Only update validation state if it has changed
    if (isValid !== validationState) {
      setValidationState(isValid);
      onValidationChange(isValid);
    }
  }, [formData, onValidationChange, validationState]);

  // Ensure validation runs once on mount for existing data
  useEffect(() => {
    if (existingData) {
      const isValid = Boolean(existingData.primaryMessage);
      setValidationState(isValid);
      onValidationChange(isValid);
    }
  }, [existingData, onValidationChange]);

  // Memoize update function
  const updateFormData = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    handleInputChange(field, value);
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
        customAreaClass="whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
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
        customAreaClass="whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
      />
    </div>
  );
};

export default GenericAssetSection; 