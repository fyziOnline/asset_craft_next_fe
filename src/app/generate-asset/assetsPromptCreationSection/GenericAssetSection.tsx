'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ChildrenTitle from '@/components/global/ChildrenTitle';
import TextField from '@/components/global/TextField';
import { AIPromptAsset } from '@/types/templates';
import { getAssetLabels } from '@/app/generate-asset/config/assetConfig';
import { useAppData } from '@/context/AppContext';
import Button from '@/components/global/Button';
import { ApiService } from '@/lib/axios_generic';
import { urls } from '@/apis/urls';

interface GenericAssetSectionProps {
  existingData: AIPromptAsset | null;
  handleInputChange: (field: string, value: string) => void;
  onValidationChange: (isValid: boolean) => void;
  assetType?: string; // Optional asset type to get specific labels
  // Optional editContext data directly passed from a component that has access
  editContextData?: {
    topic?: string;
    keyPoints?: string;
  };
  isEditMode?: boolean; // Add isEditMode prop
}

interface AssetSaveResponse {
  isSuccess: boolean;
  errorOnFailure: string;
}

const GenericAssetSection: React.FC<GenericAssetSectionProps> = ({ 
  existingData, 
  handleInputChange, 
  onValidationChange,
  assetType,
  editContextData,
  isEditMode
}) => {
  const { setError } = useAppData();
  const [isSaving, setIsSaving] = useState(false);
  
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
      const isValid = Boolean(existingData.topic);
      setValidationState(isValid);
      onValidationChange(isValid);
    }
  }, [existingData, onValidationChange]);

  // Update form if editContextData changes
  useEffect(() => {
    if (editContextData) {
      setFormData({
        primaryMessage: editContextData.topic || '',
        additionalInfo: editContextData.keyPoints || ''
      });
    }
  }, [editContextData]);

  // Save changes back to the server
  const saveChanges = async () => {
    if (!existingData || !existingData.assetID) return;
    
    try {
      setIsSaving(true);
      
      // Map back from our form fields to the API fields
      const payload = {
        assetID: existingData.assetID,
        topic: formData.primaryMessage,
        keyPoints: formData.additionalInfo,
        type: existingData.type || '',
        targetAudience: existingData.targetAudience || '',
        tone: existingData.tone || '',
        outputScale: existingData.outputScale || 5
      };
      
      const response = await ApiService.post<AssetSaveResponse>(urls.aiPrompt_Asset_insertupdate, payload);
      
      if (response.isSuccess) {
        // Update the local data to reflect the changes
        handleInputChange('topic', formData.primaryMessage);
        handleInputChange('keyPoints', formData.additionalInfo);
      } else {
        throw new Error(response.errorOnFailure || 'Failed to save changes');
      }
    } catch (error) {
      const apiError = ApiService.handleError(error);
      setError({
        status: apiError.statusCode,
        message: apiError.message,
        showError: true
      });
    } finally {
      setIsSaving(false);
    }
  };

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

      {/* Save button - only show in edit mode when there's an existing asset */}
      {/* Removed the save button from here, as it's handled in BaseAssetForm */}
      {/* {isEditMode && existingData && existingData.assetID && (
        <div className="mt-6 flex justify-end">
          <Button
            buttonText={isSaving ? "Saving..." : "Save Changes"}
            backgroundColor="bg-custom-gradient-green"
            handleClick={saveChanges}
            disabled={isSaving}
            customClass="px-4 py-2"
            textStyle="text-[0.875rem] font-medium text-white"
            showIcon={false}
          />
        </div>
      )} */}
    </div>
  );
};

export default GenericAssetSection; 