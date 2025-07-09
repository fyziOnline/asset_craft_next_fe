'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'

import { Check, ChevronLeft, ChevronRight, FileText, Globe, Target, Lightbulb } from 'lucide-react';
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
import GenericAssetSection from '../generate-asset/assetsPromptCreationSection/GenericAssetSection';


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


const sectionTitles = ["Task", "Asset", "Review"];

const ProgressionIndicator = ({ currentSection }: { currentSection: number }) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {sectionTitles.map((title, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center">
            <div className="relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out ${
                  index < currentSection
                    ? 'bg-green-500 text-steel-gray shadow-lg shadow-green-200'
                    : index === currentSection
                    ? 'bg-primary-black text-steel-gray shadow-lg shadow-faded-grey scale-110'
                    : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                }`}
              >
                {index < currentSection ? (
                  <Check color='#fff' className="w-6 h-6 animate-in fade-in duration-300" />
                ) : (
                  <span className="font-semibold text-base">{index + 1}</span>
                )}
              </div>
              {index === currentSection && (
                <div className="absolute -inset-1 rounded-full border-2 border-blue-300 animate-pulse"></div>
              )}
            </div>

            <span
              className={`mt-3 text-sm font-medium transition-colors duration-300 ${
                index <= currentSection ? 'text-gray-700' : 'text-gray-400'
              }`}
            >
              {title}
            </span>
          </div>

          {index < sectionTitles.length - 1 && (
            <div className="relative w-16 h-2 bg-gray-200 rounded-full mx-2 overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-in-out ${
                  index < currentSection
                    ? 'bg-gradient-to-r from-green-400 to-green-500 w-full'
                    : 'bg-gradient-to-r from-green-400 to-green-500 w-0'
                }`}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
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
    <div className="m-auto bg-white p-14 rounded-xl overflow-y-auto pb-24">
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
      <div className="w-full  flex items-center justify-center">
        <h2 className="text-xl font-bold text-gray-800">Please select an Asset Type to view details.</h2>
      </div>
    );
  }

  return (
    <div className="w-full  flex items-center justify-center text-left mt-16">
      <GenericAssetSection 
        handleInputChange={handleInputChange}
        onValidationChange={onValidationChange}
        assetType={assetType}
        existingData={existingData}
      />
      {/* <AssetSpecificComponent
        existingData={existingData}
        handleInputChange={handleInputChange}
        onValidationChange={onValidationChange}
        assetType={assetType}
        isEditMode={false} // Assuming this is for new asset creation in asset-craft
      /> */}
    </div>
  );
}

// ReviewSection Component - Empty placeholder
const ReviewSection = () => {
  const typeAndCampaignData = {
    assetType: 'Landing Page',
    template: 'Solution Overview',
    productSolution: 'Private Cloud',
    campaignName: 'HPE Private Cloud Q3',
    campaignGoal: 'Lead Generation',
    targetAudience: 'Existing Customers',
    campaignUrls: [
      'https://www.hpe.com/en/us/solutions/private-cloud.html',
      'https://www.hpe.com/en/us/solutions/new-solutions/private-cloud.html',
      'https://www.hpe.com/info/pvt-cloud-brief.in'
    ],
    campaignDocs: [
      'HPE_Private_Cloud_Brief.pdf',
      'Q3_Planning_Deck.pptx'
    ]
  };

  // Example data for Asset Details section
  const assetDetailsData = {
    assetName: 'Green Cloud',
    primaryMessage: 'Green Cloud is a cloud-based platform that offers a range of services for businesses to deploy and manage their applications and data. It is designed to be flexible, scalable, and cost-effective, making it an ideal choice for organizations of all sizes.',
    additionalInformation: 'Green Cloud is a cloud-based platform that offers a range of services for businesses to deploy and manage their applications and data. It is designed to be flexible, scalable, and cost-effective, making it an ideal choice for organizations of all sizes.',
    creativityLevel: 6,
    assetUrls: [],
    assetDocs: []
  };

  const InfoCard = ({ icon: Icon, title, children, className = "" }) => (
    <div className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const DataField = ({ label, value, isList = false }) => (
    <div className="mb-4 last:mb-0 flex items-start gap-2">
      <dt className="text-base text-gray-600 font-bold min-w-[130px] text-start">{label}&nbsp;:</dt>
      <dd className="text-gray-900 text-base text-start">
        {isList ? (
          value.length > 0 ? (
            <ul className="space-y-1">
              {value.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm break-all">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-400 text-sm italic">None provided</span>
          )
        ) : (
          <span className="text-sm">{value || 'Not specified'}</span>
        )}
      </dd>
    </div>
  );

  const CreativityMeter = ({ level }) => (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-600">Creativity Level</span>
          <span className="text-sm font-semibold text-gray-900">{level}/10</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-300 to-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${level * 10}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center p-6 ">
      <div className="w-full max-w-6xl">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Type and Campaign Section */}
          <div className="space-y-6">
            <InfoCard icon={Target} title="Type and Campaign">
              <dl className="space-y-4">
                <DataField label="Asset Type" value={typeAndCampaignData.assetType} />
                <DataField label="Template" value={typeAndCampaignData.template} />
                <DataField label="Product/Solution" value={typeAndCampaignData.productSolution} />
                <DataField label="Campaign Name" value={typeAndCampaignData.campaignName} />
                <DataField label="Campaign Goal" value={typeAndCampaignData.campaignGoal} />
                <DataField label="Target Audience" value={typeAndCampaignData.targetAudience} />
              </dl>
            </InfoCard>

            <InfoCard icon={Globe} title="Campaign Resources">
              <dl className="space-y-4">
                <DataField 
                  label="Campaign URLs" 
                  value={typeAndCampaignData.campaignUrls} 
                  isList={true} 
                />
                <DataField 
                  label="Campaign Documents" 
                  value={typeAndCampaignData.campaignDocs} 
                  isList={true} 
                />
              </dl>
            </InfoCard>
          </div>

          {/* Asset Details Section */}
          <div className="space-y-6">
            <InfoCard icon={FileText} title="Asset Details">
              <dl className="space-y-4">
                <DataField label="Asset Name" value={assetDetailsData.assetName} />
                <DataField label="Primary Message" value={assetDetailsData.primaryMessage} />
                <DataField label="Additional Information" value={assetDetailsData.additionalInformation} />
              </dl>
            </InfoCard>

            <InfoCard icon={Lightbulb} title="Creative Configuration">
              <div className="mb-4">
                <CreativityMeter level={assetDetailsData.creativityLevel} />
              </div>
              <dl className="space-y-4">
                <DataField 
                  label="Asset URLs" 
                  value={assetDetailsData.assetUrls} 
                  isList={true} 
                />
                <DataField 
                  label="Asset Documents" 
                  value={assetDetailsData.assetDocs} 
                  isList={true} 
                />
              </dl>
            </InfoCard>
          </div>
        </div>

      </div>
    </div>
  );
};


const NestedSlidingSections = ({ setNestedInfoIndex,hObj}: { setNestedInfoIndex:(type:number)=>void,hObj:{hH:number,hF:number}}) => {
  const [currentSection, setCurrentSection] = React.useState(0);

  const nestedSections = [
    {
      id: 1,
      title: "Campaign Details",
      description : 'Please provide the necessary information about the campaign you are planning',
      component: <CampaignDetails />,
      // bgColor: "bg-gradient-to-br from-blue-50 to-indigo-100"
    },
    {
      id: 2,
      title: "Asset Details",
      description : 'Please provide the necessary information to generate the asset, * fields are mandatory',
      component: <AssetDetails />,
      // bgColor: "bg-gradient-to-br from-blue-50 to-indigo-100"
    },
    {
      id: 3,
      title: "Reviews",
      description : 'Please review the information you just provide, Feel free to edit them by moving to previous slide',
      component: <ReviewSection />,
      // bgColor: "bg-gradient-to-br from-green-50 to-emerald-100"
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
    <div className="relative w-full overflow-y-auto overflow-x-clip scroll-smooth rounded-lg">
      {/* Sliding Container */}
      <div 
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSection * 100}%)` }}
      >
        {nestedSections.map((section, index) => (
          //  ${section.bgColor}
          <div
            key={section.id}
            className={`w-full flex-shrink-0 flex items-baseline justify-center 
               relative`}
            style={{ height: `calc(100vh - ${hObj.hF+hObj.hH+115}px)` }}
          >
            {/* Section component */}
            <div className="w-full mx-auto px-10 text-center h-[90%]">
              <div className="text-lg text-gray-600 leading-relaxed mb-6 bg-white mt-4 rounded-3xl overflow-y-auto"
                   style={{height:'inherit'}}
              >
                {section.component}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Navigation Buttons - Outside sliding container */}
      <div className='absolute bottom-[4%] flex w-full justify-between px-12 items-center flex-row-reverse'>
        <div className="transform -translate-x-1/2 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110 z-10 flex">
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

        <ProgressionIndicator currentSection={currentSection}/>
      </div>
    </div>
  );
};

const ComponentWithSideBySide = () => {
  const [nestedInfoIndex,setNestedInfoIndex] = useState<number>(0)
  // const [offsetHeight,setOffsetHeight] = useState<number>(0)
  const [heightOfHeaderAndFooter,setHeightOfHeaderAndFooter] = useState<{hH:number,hF:number}>({
    hH:0,
    hF:0
  })

  const template = useAssetCraftStoreSelector.use.template()  


  const calculateHeight = () => {
    const div1 = document.getElementById('app_header');
    const div2 = document.getElementById('brand_lab-ftr');
    
    if (div1 && div2) {
      setHeightOfHeaderAndFooter({
        hH: div1.offsetHeight,
        hF: div2.offsetHeight
      })
    } else {
      console.warn('One or both divs not found');
      return 0;
    }
  }

   useEffect(() => {
    calculateHeight();
    
    const handleResize = () => {
      calculateHeight();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    <div className="w-full flex overflow-y-clip mt-3" style={{height:`calc(100vh - ${heightOfHeaderAndFooter.hF+heightOfHeaderAndFooter.hH}px`}}>
      {/* Left Section - 4/7 width - Contains nested sliding component */}
      <div className="w-[65%] h-full bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">{nestedSlidesInformation[nestedInfoIndex].title}</h2>
          <p className="text-gray-600 mt-2">{nestedSlidesInformation[nestedInfoIndex].description}</p>
        </div>
        <div className="flex-1 overflow-auto ">
          <NestedSlidingSections setNestedInfoIndex={setNestedInfoIndex} hObj={heightOfHeaderAndFooter}/>
        </div>
      </div>

      {/* Right Section - 3/7 width */}
      <div className="w-[35%] bg-white flex flex-col items-center justify-center p-8 overflow-y-auto">
        {template ? (
            <div className="max-w-md text-center h-full">
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