'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import { useProjectFormData } from '@/hooks/useProjectFormData';
import { useGetTemplates } from '@/hooks/useAssetTemplate';
import { debounce, values } from 'lodash';
import { Template } from '@/types/templates';
import Section from './component/Sections';
import ProgressiveDropDownSearch from '@/components/global/ProgressiveDropDownSearch';
import TemplateSelectionModal from './component/TemplateSelectionModal';
import TextField from '@/components/global/TextField';
import { listofcampains, ListTargetAudience } from '@/data/dataGlobal';
import FieldHeader from '@/components/global/FieldHeader';
import MultiUrlInput from './component/MultiUrlInput';
import DragAndDrop from '@/components/global/MultyFileDragAndDrop';
import { useAssetCraftStoreSelector } from '@/store/assetCraftStore';
import { assetSectionConfig, getAssetSectionConfig } from '../generate-asset/config/assetConfig';
import { AIPromptAsset } from '@/types/templates';
import { AssetType, isValidAssetType } from '@/types/assetTypes';


export interface FormDataProps {
    product?: string,
    campaignGoal?: string,
    targetAudience?: string,
    outputScale?: number,
    topic?: string,
    tone ?:string
    type?: string,
    keyPoints?: string,
    fileSelected?: File,
    webUrl?: string
    fileName?:string
}

const CampaignDetails = () => {

  const updateAssetType = useAssetCraftStoreSelector.use.updateAssetType()
  const updateTemplate = useAssetCraftStoreSelector.use.updateTemplate()
  const assetType = useAssetCraftStoreSelector.use.assetType()
  // const selectedTemplate = useAssetCraftStoreSelector.use.template()
  

 const {clientAssetTypes,getAssetTypes} = useDashboard()
  const {listProjects,listCampaigns,assetDetails,handleChangeAssetDetails,onChangeAssetDetails,isAssetNameExists} = useProjectFormData()
  const {getTemplatesByAssetType} = useGetTemplates()
  const [templates,setTemplates] = useState<Template[]|null>([])
  const [fetchErrors,setFetchErrors] = 
              useState<Record<string,unknown>>(
                      {
                        fetchErrors : null
                      }
                    )
  // const [selectedAssetType,setSelectedAssetType] = useState<string>("")
  const [templateModalOpen,setTemplateModalOpen] = useState<boolean>(false)
  const templateRef = useRef({
    template_id : "",
    template_name : ""
  })
  const campaignRef = useRef<{campaign_goal:string,target_audience:string}>({
    campaign_goal:"",
    target_audience : ""
  })

  const [urls,setUrls] = useState<string[]>([])

  
  
  const handleSelectTemplate = (id:string,name:string) => {
    templateRef.current = {
      ...templateRef,
      template_id: id,
      template_name : name
    }
    const selected = templates?.find(t => t.templateID === id);
    if (selected) {
        updateTemplate(selected);
    }
  }

  const getTemplates = debounce(async (value: string) => {
    const templateData = await getTemplatesByAssetType(value)
    if (templateData.error) {
      setFetchErrors(preErr => ({
        ...preErr,
        fetchTemplateError : templateData.error
      }))
    } 
    setTemplates(templateData.templates)
  }, 500)

  useEffect(()=>{
    const fetchData = async () => {
      getAssetTypes()
    }
    fetchData()
  },[])

  const listofcampaigns = listCampaigns.map((item: { campaignID: string; campaignName: string; }) => ({
    label: item.campaignName,
    value: item.campaignName,
  }
  ))

  return (
    <div className="m-auto mt-14 bg-white p-14 rounded-xl h-full overflow-y-auto pb-14">
      <h2 className="text-2xl font-bold text-gray-800 text-left">1. Select Your Asset</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
        <div className="space-y-1">
          <label
            htmlFor="assetType"
            className="block text-sm font-medium text-gray-700 text-left"
          >
            Asset Type
          </label>
          <ProgressiveDropDownSearch 
            data={clientAssetTypes.map(type => ({
              label: String(type.assetTypeName),
              value: String(type.assetTypeID)
            }))}
            placeholder="Search product name"
            messageForNewData="Create new campaign : "
            onSelect={(asset_id) => {
              getTemplates(asset_id);
              updateAssetType(isValidAssetType(clientAssetTypes.find(type=>type.assetTypeID === asset_id)?.assetTypeName || "") ? clientAssetTypes.find(type=>type.assetTypeID === asset_id)?.assetTypeName as AssetType : null)
            }}
            showCreateOption = {false}
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="product"
            className="block text-sm font-medium text-gray-700 text-left "
          >
            Product / Solution
          </label>
          <ProgressiveDropDownSearch 
              data={listProjects}
              placeholder="Search product name"
              messageForNewData = "Create new campaign : "
              // preSelectedValue={existingAssetMeta?.campaign_name}
              onSelect={(name)=>{handleChangeAssetDetails("project_name",name,name)}}
            />
        </div>
      </div>
      <div className='mt-3'>
        <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
          Template
        </label>
        {/* {selectedTemplateDetails ? ( */}
        {templates && templates.length ? (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-3">
              {/* <CheckCircle className="h-6 w-6 text-[#01A982]" /> */}
              <span className="font-semibold">
                {templateRef.current.template_name} 
              </span>
            </div>
            <button
              onClick={() => setTemplateModalOpen(true)}
              className="text-sm font-medium text-[#01A982] hover:underline"
            >
              Change
            </button>
          </div>
        ) : (
          <button
            onClick={() => setTemplateModalOpen(true)}
            // disabled={!assetType}
            className="w-full text-center p-3 bg-white rounded-lg border-2 border-dashed hover:border-[#01A982] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Choose a Template
          </button>
        )}
        
      </div>
      {templateModalOpen && <TemplateSelectionModal 
        type={assetType}
        loading= {false}
        isOpen = {templateModalOpen}
        closeModal = {setTemplateModalOpen}
        templates={templates}
        handelTemplateSelection={handleSelectTemplate}
      />}

      {assetDetails.project_name && (
        <div className="transition-opacity duration-500 ease-in-out opacity-100 text-left">
          <Section title="Campaign Information">
            <ProgressiveDropDownSearch
              data={listofcampaigns}
              placeholder="Search campaign name"
              messageForNewData = "Create new campaign : "
              // preSelectedValue={existingAssetMeta?.campaign_name}
              onSelect={(name)=>{handleChangeAssetDetails("campaign_name",name,name)}}
            />
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
            <div className="gap-6">
              {/* Asset Name  */}
              <div className='mt-5'>
                <FieldHeader 
                  header='Digital Marketing Asset Name'
                  isMandatory
                />
                <TextField
                  customClass='h-12' 
                  placeholder='Type the name of your Digital Marketing Assets here, E.g. Email_1, Linkedin_1 etc' 
                  name="asset_name" 
                  handleChange={onChangeAssetDetails} 
                  // defaultValue={existingAssetMeta?.asset_name}  
                />
                {isAssetNameExists ? <p className='text-red-500 text-[12px] mt-[-10px]'>Asset name already exists, please enter another asset name.</p> : null}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-5'>
                <div>
                  <FieldHeader 
                    header='Campaign Goal'
                    isMandatory
                  />
                  <ProgressiveDropDownSearch 
                    data={listofcampains}
                    placeholder="Select Campaign Goal"
                    onSelect={(name)=>{
                      campaignRef.current = {
                        ...campaignRef.current,
                        campaign_goal : name
                      }
                    }}
                    showCreateOption = {false}
                  />
                </div>
                <div>
                  <FieldHeader 
                    header='Target Audience'
                    isMandatory
                  />
                  <ProgressiveDropDownSearch 
                    data={ListTargetAudience}
                    placeholder="Select Target Audience"
                    onSelect={(name)=>{
                      campaignRef.current = {
                        ...campaignRef.current,
                        target_audience : name
                      }
                    }}
                    showCreateOption = {false}
                  />
                </div>
              </div>

            </div>
          </Section>
          <Section title='Additional Campaign References'>
              <div className='mt-5'>
                <MultiUrlInput
                  label="Campaign URLs"
                  urls={urls}
                  setUrls={(urls:string[])=>{
                    setUrls(urls)
                  }}
                />
              </div>
              <div className="overflow-y-auto">
                <DragAndDrop />
              </div>
          </Section>
        </div>
      )}
    </div>
  );
};

const AssetDetails = () => {
  const assetType = useAssetCraftStoreSelector.use.assetType();
  const [existingData, setExistingData] = useState<AIPromptAsset | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);

  const handleInputChange = useCallback((field: string, value: string | number | null) => {
    // This function will handle changes from the dynamically rendered component
    // For now, it's a placeholder. You'll need to implement the actual logic
    // to update your form data or state here.
    console.log(`Field: ${field}, Value: ${value}`);
  }, []);

  const onValidationChange = useCallback((valid: boolean) => {
    setIsValid(valid);
  }, []);

  const assetSection = assetType ? getAssetSectionConfig(assetType) : null;
  const AssetSpecificComponent = assetSection?.component;

  if (!AssetSpecificComponent) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <h2 className="text-xl font-bold text-gray-800">Please select an Asset Type to view details.</h2>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <AssetSpecificComponent
        existingData={existingData}
        handleInputChange={handleInputChange}
        onValidationChange={onValidationChange}
        assetType={assetType}
        isEditMode={false} // Assuming this is for new asset creation in asset-craft
      />
    </div>
  );
}

// ReviewSection Component - Empty placeholder
const ReviewSection = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <h2 className="text-3xl font-bold text-gray-800">Review Section Component</h2>
    </div>
  );
};


const NestedSlidingSections = ({ setNestedInfoIndex}: { setNestedInfoIndex:(type:number)=>void}) => {
  const [currentSection, setCurrentSection] = React.useState(0);

  const nestedSections = [
    {
      id: 1,
      title: "Campaign Details",
      description : 'Please provide the necessary information about the campaign you are planning',
      component: <CampaignDetails />,
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-100"
    },
    {
      id: 2,
      title: "Asset Details",
      description : 'Please provide the necessary information to generate the asset, * fields are mandatory',
      component: <AssetDetails />,
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-100"
    },
    {
      id: 3,
      title: "Reviews",
      description : 'Please review the information you just provide, Feel free to edit them by moving to previous slide',
      component: <ReviewSection />,
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-100"
    }
  ];

  const goToNext = () => {
    if (currentSection < nestedSections.length - 1) {
      setCurrentSection(currentSection + 1);
      setNestedInfoIndex(currentSection + 1)
    }
  };

  const goToPrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setNestedInfoIndex(currentSection - 1)
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {/* Sliding Container */}
      <div 
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSection * 100}%)` }}
      >
        {nestedSections.map((section, index) => (
          <div
            key={section.id}
            className={`w-full h-full flex-shrink-0 flex items-center justify-center ${section.bgColor} relative`}
          >
            {/* Section component */}
            <div className="w-full mx-auto px-10 text-center">
              <div className="text-lg text-gray-600 leading-relaxed mb-6">
                {section.component}
              </div>
              
              {/* Progress Dots */}
              <div className="flex justify-center space-x-2">
                {nestedSections.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      i === currentSection ? 'bg-gray-700' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Fixed Navigation Buttons - Outside sliding container */}
      <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110 z-10 flex">
        <button 
          onClick={goToPrevious}
          disabled={currentSection === 0}
          className={`p-1 rounded-full transition-colors duration-200 ${
            currentSection === 0 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={goToNext}
          disabled={currentSection === nestedSections.length - 1}
          className={`p-1 rounded-full transition-colors duration-200 ${
            currentSection === nestedSections.length - 1 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const ComponentWithSideBySide = () => {
  const [nestedInfoIndex,setNestedInfoIndex] = useState<number>(0)

  const template = useAssetCraftStoreSelector.use.template()  
  // const assetType = useAssetCraftStoreSelector.use.assetType()  
  const nestedSlidesInformation = [
    {
      id:1,
      title: "Campaign Details",
      description : 'Please provide the necessary information about the campaign you are planning'},
    {
      id: 2,
      title: "Asset Details",
      description : 'Please provide the necessary information to generate the asset, * fields are mandatory',
    },
    {
      id: 3,
      title: "Reviews",
      description : 'Please review the information you just provide, Feel free to edit them by moving to previous slide',
    }
  ]

  return (
    <div className="w-full h-full flex overflow-y-auto">
      {/* Left Section - 4/7 width - Contains nested sliding component */}
      <div className="w-[60%] h-full bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">{nestedSlidesInformation[nestedInfoIndex].title}</h2>
          <p className="text-gray-600 mt-2">{nestedSlidesInformation[nestedInfoIndex].description}</p>
        </div>
        <div className="flex-1 ">
          <NestedSlidingSections setNestedInfoIndex={setNestedInfoIndex}/>
        </div>
      </div>

      {/* Right Section - 3/7 width */}
      <div className="w-[40%] h-full bg-white flex flex-col items-center justify-center p-8">
        {template ? (
            <div className="max-w-md text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {template.templateName}
                </h3>
                {template.templateImageURL && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={template.templateImageURL} alt={template.templateName || 'Template Image'} className="rounded-lg shadow-lg mb-6" />
                )}
                <p className="text-gray-600 leading-relaxed mb-6">
                    {template.description}
                </p>
            </div>
        ) : (
            <div className="max-w-md text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-3 drop-shadow-sm">
                    Please Select Template
                </h3>
                <p className="text-gray-400 text-sm tracking-wide">
                    Select a template to preview
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

function page() {
  return (
    <div>
      <ComponentWithSideBySide
      
      />
    </div>
  )
}

export default page