import { useRef } from 'react';

export interface FormDataProps {
    product?: string,
    campaignGoal?: string,
    targetAudience?: string,
    outputScale?: number,
    topic?: string,
    type?: string,
    keyPoints?: string,
    fileSelected?: File,
    webUrl?: string
}

export interface SectionProps {
    assetVersionID?: string,
    templateBlockID: string,
    aiPrompt: string
}

export const useInputFormDataGenerate = () => {
    const refFormData = useRef<FormDataProps>()
    const refSection = useRef<SectionProps[]>([])

    const handleInputText = (e: React.ChangeEvent<HTMLTextAreaElement>, key: string) => {
        refFormData.current = {
            ...refFormData.current,
            [key]: e.target.value
        }
    }

    const handleInputSection = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
        if (refSection.current && refSection.current[index]) {
            refSection.current[index] = {
                ...refSection.current[index],
                aiPrompt: e.target.value
            }
        }
    }
    return {
        refFormData,
        refSection,
        handleInputText,
        handleInputSection
    };
};