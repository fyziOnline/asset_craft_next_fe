import ProgressiveDropDownSearch from "@/components/global/ProgressiveDropDownSearch";
import { useGetTemplates } from "@/hooks/useAssetTemplate";
import { useDashboard } from "@/hooks/useDashboard";
import { useAssetCraftStoreSelector } from "@/store/assetCraftStore";
import { AssetType, isValidAssetType } from "@/types/assetTypes";
import { Template } from "@/types/templates";
import { debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
// import TemplateSelectionModal from "../blocks/TemplateSelectionModal";
// import Section from "../blocks/Section";
import FieldHeader from "@/components/global/FieldHeader";
import TextField from "@/components/global/TextField";
import { listofcampains, ListTargetAudience } from "@/data/dataGlobal";
// import MultiUrlInput from "../elements/MultiUrlInput";
import DragAndDrop from "@/components/global/MultyFileDragAndDrop";
import { useProjectFormData } from "@/hooks/useProjectFormData";
import { Blocks } from "../blocks/_index";
import { Elements } from "../elements/_index";

const CampaignDetails = () => {

  const updateAssetType = useAssetCraftStoreSelector.use.updateAssetType()
  const updateTemplate = useAssetCraftStoreSelector.use.updateTemplate()
  const assetType = useAssetCraftStoreSelector.use.assetType()
  const {getTemplateById} = useGetTemplates()
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

  
  
  const handleSelectTemplate = async (id:string,name:string) => {
    templateRef.current = {
      ...templateRef,
      template_id: id,
      template_name : name
    }
    const selectedTemplate = await getTemplateById(templateRef.current.template_id)
    
    //  const selected = templates?.find(t => t.templateID === id);
    if (selectedTemplate) {
        updateTemplate(selectedTemplate);
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
      {templateModalOpen && <Blocks.TemplateSelectionModal
        type={assetType}
        loading= {false}
        isOpen = {templateModalOpen}
        closeModal = {setTemplateModalOpen}
        templates={templates}
        handelTemplateSelection={handleSelectTemplate}
      />}

      {assetDetails.project_name && (
        <div className="transition-opacity duration-500 ease-in-out opacity-100 text-left">
          <Blocks.Section title="Campaign Information" defaultOpen  disabled={true}>
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
          </Blocks.Section>
          <Blocks.Section title='Additional Campaign References' defaultOpen disabled={true}>
              <div className='mt-5'>
                <Elements.MultiUrlInput
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
          </Blocks.Section>
        </div>
      )}
    </div>
  );
};

export default CampaignDetails