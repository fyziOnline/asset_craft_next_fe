'use client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import ChildrenTitle from '@/components/global/ChildrenTitle';
import DropDown from '@/components/global/DropDown';
import TextField from '@/components/global/TextField';
import ChooseLabel from '@/components/global/ChooseLabel';
import { AIPromptAsset } from '@/types/templates';
import { FieldConfig } from '../assetTypeFactory';

interface DynamicSectionProps {
  existingData: AIPromptAsset | null;
  handleInputChange: (field: string, value: string) => void;
  onValidationChange: (isValid: boolean) => void;
  fields: FieldConfig[];
  validationRules?: string[];
}

/**
 * A dynamic section component that can be used to render any asset type
 * based on configuration without creating custom components
 */
const DynamicSection: React.FC<DynamicSectionProps> = ({
  existingData,
  handleInputChange,
  onValidationChange,
  fields,
  validationRules = []
}) => {
  // Initialize form data from existing data
  const initialData = useMemo(() => {
    const data: Record<string, string> = {};
    fields.forEach(field => {
      data[field.name] = existingData?.[field.name as keyof AIPromptAsset] as string || '';
    });
    return data;
  }, [existingData, fields]);

  const [formData, setFormData] = useState<Record<string, string>>(initialData);
  const [validationState, setValidationState] = useState<boolean>(false);

  // Update validation status when formData changes
  useEffect(() => {
    // If no validation rules, consider it valid
    if (validationRules.length === 0) {
      if (!validationState) {
        setValidationState(true);
        onValidationChange(true);
      }
      return;
    }
    
    // Check if all required fields have values
    const isValid = validationRules.every(field => {
      const value = formData[field];
      return value && value.trim() !== '';
    });
    
    // Only update if validation state has changed
    if (isValid !== validationState) {
      setValidationState(isValid);
      onValidationChange(isValid);
    }
  }, [formData, validationRules, onValidationChange, validationState]);

  // Memoize the update function to avoid recreation on each render
  const updateFormData = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    handleInputChange(field, value);
  }, [handleInputChange]);

  // Ensure validation runs once on mount for existing data
  useEffect(() => {
    if (existingData && validationRules.length > 0) {
      const isValid = validationRules.every(field => {
        const value = existingData[field as keyof AIPromptAsset] as string;
        return value && value.trim() !== '';
      });
      
      setValidationState(isValid);
      onValidationChange(isValid);
    }
  }, [existingData, validationRules, onValidationChange]);

  return (
    <div className="max-w-[90%]">
      {fields.map((field, index) => {
        const isRequired = field.isRequired || validationRules.includes(field.name);
        return (
          <div key={field.name} className={index > 0 ? 'mt-5' : ''}>
            {/* Field label/title */}
            <ChildrenTitle
              title={field.label}
              showStar={isRequired}
              customClass={index > 0 ? 'mt-5' : ''}
            />

            {/* Render appropriate input based on field type */}
            {field.type === 'text' && (
              <TextField
                handleChange={(e) => {
                  updateFormData(field.name, e.target.value);
                }}
                defaultValue={formData[field.name] || ''}
                rows={field.rows}
                placeholder={field.placeholder || ''}
                customAreaClass="whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide"
              />
            )}

            {field.type === 'dropdown' && field.options && (
              <DropDown
                onSelected={(optionSelected) => {
                  updateFormData(field.name, optionSelected.value);
                }}
                preSelectValue={formData[field.name]}
                isShowOther={false}
                selectPlaceHolder={`Select ${field.label}`}
                optionLists={field.options}
              />
            )}

            {field.type === 'chooselabel' && field.options && (
              <ChooseLabel
                onSelect={(selectedOption) => {
                  updateFormData(field.name, selectedOption.value);
                }}
                optionLists={field.options}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicSection; 