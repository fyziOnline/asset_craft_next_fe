import { FC, useEffect } from "react"
import DropDown from "../global/DropDown"
// import InputAreaSearch from "../global/InputAreaSearch"
import TextField from "../global/TextField"
import { useAppData } from "@/context/AppContext"
import { useProjectFormData } from "@/hooks/useProjectFormData"
import { CampaignSelectResponse, ProjectDetails } from "@/types/templates"
// import Search from "../global/Search"
import ProgressiveDropDownSearch from "../global/ProgressiveDropDownSearch"

type SectionAssetDetailsProps = {
  validatingTheData: (step: number,status : boolean) => void
  returnCampaignDetails: (data:CampaignSelectResponse|null) => void
  existingAssetMeta ?: {campaign_name:string,project_name:string,asset_name:string}
};

const SectionAssetDetails:FC<SectionAssetDetailsProps> = ({validatingTheData,returnCampaignDetails,existingAssetMeta }) => {
  const {
    isProductNameValid,
    handleChangeAssetDetails,
    listProjects,
    listCampaigns,
    isAssetNameExists,
    assetDetails, 
    existingCampaignDetails,
    onChangeAssetDetails
  } = useProjectFormData()

  const { setContextData } = useAppData()

  useEffect(()=>{
    if (existingAssetMeta?.project_name.length) {
      handleChangeAssetDetails("project_name", existingAssetMeta.project_name, existingAssetMeta.project_name || '')
    }
  },[existingAssetMeta?.project_name])

  useEffect(()=>{
    if (existingAssetMeta?.asset_name) {
      validatingTheData(1,true)
    }
  },[existingAssetMeta?.asset_name])


  useEffect(() => {
    const updatedAssetDetails = existingAssetMeta?.asset_name ? {...assetDetails,asset_name:existingAssetMeta?.asset_name} : assetDetails
    updateContextProjectDetails(updatedAssetDetails)
  }, [assetDetails])

  useEffect(()=>{
    returnCampaignDetails(existingCampaignDetails)
  },[existingCampaignDetails])

  const updateContextProjectDetails = (data:ProjectDetails) => {
    setContextData({ProjectDetails :{...data}})
    if ( data.asset_name.length>0 && data.campaign_name.length && data.project_name.length >0 && !isAssetNameExists) {
      validatingTheData(1,true)
    } else {
      validatingTheData(1, false)
    }
  }

  const listofcampains = listCampaigns.map((item: { campaignID: string; campaignName: string; }) => ({
    label: item.campaignName,
    value: item.campaignName,
  }
  ))

  return (
    <>
      <div className='w-full flex flex-col gap-3 pb-7'>
        <div className='pt-[15px] flex flex-col gap-3'>
          <p className='text-[#160647] text-base tracking-[0] leading-5 text-wrap whitespace-nowrap font-semibold'>Project/Solution Name <span className="text-red-500">*</span></p>
          <DropDown
            onSelected={(optionSelected) => { handleChangeAssetDetails("project_name", optionSelected.value, optionSelected.label || '') }}
            preSelectValue={existingAssetMeta?.project_name}
            selectPlaceHolder="Select Project/Solution Name" optionLists={listProjects} otherFieldText="Specify project name" otherFieldErrorText={!isProductNameValid ? `Product/Solution name cannot be ${assetDetails.project_name}` : ''}></DropDown>
        </div>

        <div className='flex flex-col gap-3'>
          <p className='text-[#160647] text-base tracking-[0] leading-5 text-wrap whitespace-nowrap font-semibold'>Campaign Name <span className="text-red-500">*</span></p>
          <ProgressiveDropDownSearch 
            data={listofcampains}
            placeholder="Search campaign name"
            messageForNewData = "Create new campaign : "
            preSelectedValue={existingAssetMeta?.campaign_name}
            onSelect={(name)=>{handleChangeAssetDetails("campaign_name",name,name)}}
          />
          {/* <DropDown
            onSelected={(optionSelected) => { handleChangeAssetDetails("campaign_name", optionSelected.value, optionSelected.label || '') }}
            selectPlaceHolder="Select Campaign Name" optionLists={listofcampains} otherFieldText="Specify campaign name" /> */}
          {/* <InputAreaSearch name="campaign_name" placeholder="Type the name of your Campaign here, E.g. New year campaign, Launch campaign etc" listData={listCampaigns.map((value) => value.campaignName)} onChange={(value) => { handleChangeAssetDetails("campaign_name", value) }} /> */}
        </div>
        <div className='flex flex-col gap-3'>
          <p className='text-[#160647] text-base tracking-[0] leading-5 text-wrap whitespace-nowrap font-semibold'>Digital Marketing Asset Name <span className="text-red-500">*</span></p>
          <TextField 
            customClass='h-12' 
            placeholder='Type the name of your Digital Marketing Assets here, E.g. Email_1, Linkedin_1 etc' 
            name="asset_name" 
            handleChange={onChangeAssetDetails} 
            defaultValue={existingAssetMeta?.asset_name}  
          />
          {isAssetNameExists ? <p className='text-red-500 text-[12px] mt-[-10px]'>Asset name already exists, please enter another asset name.</p> : null}
        </div>
      </div>
    </>
  )
}

export default SectionAssetDetails