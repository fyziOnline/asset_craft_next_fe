'use client';
import React, { useEffect, useState } from 'react';
import ChildrenTitle from '@/components/global/ChildrenTitle';
import TextField from '@/components/global/TextField';
import ChooseLabel from '@/components/global/ChooseLabel';
import { ListTone } from '@/data/dataGlobal';
import { AIPromptAsset } from '@/types/templates';

interface CallScriptSectionProps {
  existingData: AIPromptAsset | null;
  handleInputChange: (field: string, value: string) => void;
  onValidationChange: (isValid: boolean) => void;
}

const CallScriptSection: React.FC<CallScriptSectionProps> = ({ 
  existingData, 
  handleInputChange, 
  onValidationChange 
}) => {
  const [formData, setFormData] = useState({
    topic: existingData?.topic || '',
    keyPoints: existingData?.keyPoints || '',
    tone: existingData?.tone || ''
  });

  // Validate required fields - only topic is required
  useEffect(() => {
    const isValid = Boolean(formData.topic);
    onValidationChange(isValid);
  }, [formData, onValidationChange]);

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    handleInputChange(field, value);
  };

  return (
    <div className="max-w-[90%]">
      <ChildrenTitle 
        title="Provide details on the purpose of the call" 
        showStar={true}
      />
      <TextField
        rows={4}
        placeholder="State purpose of the call"
        customAreaClass="whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
        handleChange={(e) => {
          updateFormData('topic', e.target.value);
        }}
        defaultValue={formData.topic}
      />

      <ChildrenTitle 
        title="Describe the key messages you want to highlight" 
        customClass="mt-5"
      />
      <TextField
        rows={4}
        placeholder="Key messages"
        customAreaClass="whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
        handleChange={(e) => {
          updateFormData('keyPoints', e.target.value);
        }}
        defaultValue={formData.keyPoints}
      />

      <div className="max-w-[90%] flex mt-5">
        <div className="flex-1">
          <ChildrenTitle title="What tone should the call have?" />
          <ChooseLabel
            onSelect={(selectedOption) => {
              updateFormData('tone', selectedOption.value);
            }}
            optionLists={ListTone}
          />
        </div>
      </div>
    </div>
  );
};

export default CallScriptSection; 