import { SectionProps } from "@/hooks/useInputFormDataGenerate";
import { useAssetCraftStoreSelector } from "@/store/assetCraftStore";
import { AIPromptAsset } from "@/types/templates";
import { useCallback, useEffect, useState } from "react";
import Section from "../blocks/Section";
import GenericAssetSection from "@/app/generate-asset/assetsPromptCreationSection/GenericAssetSection";
import ChildrenTitle from "@/components/global/ChildrenTitle";
import TextField from "@/components/global/TextField";

const AssetDetails = () => {
  const assetType = useAssetCraftStoreSelector.use.assetType();
  const template = useAssetCraftStoreSelector.use.template();
  console.log('template :',template);
  
  const [existingData, setExistingData] = useState<AIPromptAsset | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [sectionsData, setSectionsData] = useState<SectionProps[]>([]);


  const handleInputChange = useCallback((field: string, value: string | number | null) => {
    console.log(`Field: ${field}, Value: ${value}`);
  }, []);

  const onValidationChange = useCallback((valid: boolean) => {
    setIsValid(valid);
  }, []);

  useEffect(()=>{
    const initialSections = template?.templatesBlocks && template?.templatesBlocks
            .filter(item => !item.isStatic)
            .map(item => ({
              templateBlockID: item.templateBlockID || "",
              aiPrompt: item.aiPrompt || ""
            }));
    initialSections && setSectionsData(initialSections);
  },[])

  if (!assetType) {
    return (
      <div className="w-full  flex items-center justify-center">
        <h2 className="text-xl font-bold text-gray-800">Please select an Asset Type to view details.</h2>
      </div>
    );
  }

  return (
    <div className="w-full  block items-center justify-center text-left px-12 pt-4 pb-16">
      <Section title='General Asset Details'>
        <GenericAssetSection 
          handleInputChange={handleInputChange}
          onValidationChange={onValidationChange}
          assetType={assetType}
          existingData={existingData}
        />
      </Section>
      {/* <Section title='Specific template Block Information' componentStyle={{paddingTop:'3rem'}}  >
          <div>
              {template?.templatesBlocks && template?.templatesBlocks.filter((item) => !item.isStatic).map((item, index) => {
                const sectionData = sectionsData[index];
                return (
                  <div key={`${item.blockID}-${index}`}>
                    <ChildrenTitle title={`Section ${index + 1}: ${item.aiTitle || ''}`} customClass={`text-[18px] ${index === 0 ? "" : "mt-[20px]"}`} />
                    <ChildrenTitle title={item.aiDescription || ''} customClass="text-[14px]" />
                    <TextField
                      handleChange={(e) => {}}
                      // handleChange={(e) => handleInputSectionModified(e, index)}
                      onBlur={(e) => {}} // Call trim function on blur
                      // onBlur={(e) => handleInputSectionModified(e, index, true)} // Call trim function on blur
                      value={sectionData?.aiPrompt ?? ''}
                      customClass="h-16"
                      placeholder={item.aiPrompt || ''}
                    />
                  </div>
                );
              })}
            </div>
      </Section> */}
    </div>
  );
}

export default AssetDetails
