'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ChildrenTitle from '@/components/global/ChildrenTitle';
import DropDown from '@/components/global/DropDown';
import TextField from '@/components/global/TextField';
import { keyPoints } from '@/data/dataGlobal';
import { AIPromptAsset } from '@/types/templates';

// Temporary landing page types
const landingPageTypes = [
  { label: 'Product Page', value: 'Product Page' },
  { label: 'Event Registration', value: 'Event Registration' },
  { label: 'Lead Generation', value: 'Lead Generation' },
  { label: 'Informational', value: 'Informational' }
];

interface LandingPageSectionProps {
  existingData: AIPromptAsset | null;
  handleInputChange: (field: string, value: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

const LandingPageSection: React.FC<LandingPageSectionProps> = ({ 
  existingData, 
  handleInputChange, 
  onValidationChange 
}) => {
  // Use memo to initialize form data
  const initialFormData = useMemo(() => ({
    topic: existingData?.topic || '',
    type: existingData?.type || '',
    keyPoints: existingData?.keyPoints || '',
    callToAction: existingData?.['callToAction' as keyof AIPromptAsset] as string || ''
  }), [existingData]);

  // Use memoized initial data
  const [formData, setFormData] = useState(initialFormData);
  const [validationState, setValidationState] = useState<boolean>(false);

  // Enhanced validation check
  useEffect(() => {
    // Check if all required fields have values
    const isValid = Boolean(
      formData.topic && formData.topic.trim() !== '' &&
      formData.type && formData.type.trim() !== '' && 
      formData.keyPoints && formData.keyPoints.trim() !== ''
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
      const isValid = Boolean(
        existingData.topic && existingData.type && existingData.keyPoints
      );
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
        title="Describe the purpose of your landing page." 
      />
      <TextField 
        handleChange={(e) => {
          updateFormData('topic', e.target.value);
        }}
        defaultValue={formData.topic}
        rows={4}
        placeholder="What is the main purpose of this landing page?" 
        customAreaClass="whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
      />

      <div className="flex items-start gap-[16%]">
        <div className="w-[260px]">
          <ChildrenTitle showStar={true} title="Landing Page Type" customClass="mt-5" />
          <DropDown 
            onSelected={(optionSelected) => {
              updateFormData('type', optionSelected.value);
            }} 
            preSelectValue={formData.type}
            isShowOther={false} 
            selectPlaceHolder="Select Landing Page Type" 
            optionLists={landingPageTypes} 
          />
        </div>

        <div className="w-[260px]">
          <ChildrenTitle showStar={true} title="Key Points" customClass="mt-5 mb-b" />
          <DropDown 
            onSelected={(optionSelected) => {
              updateFormData('keyPoints', optionSelected.value);
            }} 
            preSelectValue={formData.keyPoints}
            isShowOther={false} 
            selectPlaceHolder="Select Key Points" 
            optionLists={keyPoints} 
          />
        </div>
      </div>

      <ChildrenTitle 
        showStar={false} 
        customClass="mt-5" 
        title="Call to Action" 
      />
      <TextField 
        handleChange={(e) => {
          updateFormData('callToAction', e.target.value);
        }}
        defaultValue={formData.callToAction}
        placeholder="What action should visitors take? (e.g., Sign up, Learn more)" 
        customAreaClass="whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
      />
    </div>
  );
};

export default LandingPageSection; 