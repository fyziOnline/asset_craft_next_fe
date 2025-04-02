'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ChildrenTitle from '@/components/global/ChildrenTitle';
import DropDown from '@/components/global/DropDown';
import TextField from '@/components/global/TextField';
import { emailType, keyPoints } from '@/data/dataGlobal';
import { AIPromptAsset } from '@/types/templates';

interface EmailSectionProps {
  existingData: AIPromptAsset | null;
  handleInputChange: (field: string, value: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

const EmailSection: React.FC<EmailSectionProps> = ({ 
  existingData, 
  handleInputChange, 
  onValidationChange 
}) => {
  // Memoize initial form data
  const initialFormData = useMemo(() => ({
    topic: existingData?.topic || '',
    type: existingData?.type || '',
    keyPoints: existingData?.keyPoints || ''
  }), [existingData]);

  // Use the memoized initial data
  const [formData, setFormData] = useState(initialFormData);
  const [validationState, setValidationState] = useState<boolean>(false);

  // Validate required fields - enhanced validation check
  useEffect(() => {
    // Check if all required fields have values
    const isValid = Boolean(
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
        existingData.type && existingData.keyPoints
      );
      setValidationState(isValid);
      onValidationChange(isValid);
    }
  }, [existingData, onValidationChange]);

  // Memoize the update function to avoid recreation on each render
  const updateFormData = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    handleInputChange(field, value);
  }, [handleInputChange]);

  return (
    <div className="max-w-[90%]">
      <ChildrenTitle 
        showStar={false} 
        customClass="mt-5" 
        title="Specify the topic, occasion, event or context for your post." 
      />
      <TextField 
        handleChange={(e) => {
          updateFormData('topic', e.target.value);
        }}
        defaultValue={formData.topic}
        rows={4}
        placeholder="" 
        customAreaClass="whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
      />

      <div className="flex items-start gap-[16%]">
        <div className="w-[260px]">
          <ChildrenTitle showStar={true} title="Email Type" customClass="mt-5" />
          <DropDown 
            onSelected={(optionSelected) => {
              updateFormData('type', optionSelected.value);
            }} 
            preSelectValue={formData.type}
            isShowOther={false} 
            selectPlaceHolder="Select Email Type" 
            optionLists={emailType} 
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
    </div>
  );
};

export default EmailSection; 