import { FC, useEffect } from "react"
import DropDown from "../global/DropDown"
import InputAreaSearch from "../global/InputAreaSearch"
import TextField from "../global/TextField"
import { useAppData } from "@/context/AppContext"
import { useProjectFormData } from "@/hooks/useProjectFormData"
import { ProjectDetails } from "@/types/templates"

type SectionAssetDetailsProps = {
  validatingTheData: (step: number,status : boolean) => void; // Define the callback type
};

const SectionAssetDetails:FC<SectionAssetDetailsProps> = ({validatingTheData }) => {
  const {
    isProductNameValid,
    handleChangeAssetDetails,
    listProjects,
    listCampaigns,
    isAssetNameExists,
    assetDetails, 
    onChangeAssetDetails
    } = useProjectFormData()

  const {contextData,setContextData} = useAppData()

  useEffect(() => {
    updateContextProjectDetails(assetDetails)
  }, [assetDetails])

  const updateContextProjectDetails = (data:ProjectDetails) => {
    setContextData({ProjectDetails :{...data}})
    if (data.asset_name.length>0 && data.campaign_name.length && data.project_name.length >0) {
      validatingTheData(1,true)
    } else {
      validatingTheData(1,false)
    }
  }
  

  return (
    <>
      <div className='w-full flex flex-col gap-3 pb-7'>
          <div className='pt-[15px] flex flex-col gap-3'>
            <p className='text-[#160647] text-base tracking-wide font-semibold'>Project/Solution Name</p>
            <DropDown
              onSelected={(optionSelected) => { handleChangeAssetDetails("project_name", optionSelected.value,optionSelected.label || '') }}
              selectPlaceHolder="Select Project/Solution Name" optionLists={listProjects} otherFieldText="Specify project name"  otherFieldErrorText={!isProductNameValid ? `Product/Solution name cannot be ${assetDetails.project_name}` : '' }></DropDown>
          </div>
          <div className='flex flex-col gap-3'>
            <p className='text-[#160647] text-base tracking-wide font-semibold'>Campaign Name</p>
            <InputAreaSearch name="campaign_name" placeholder="Type the name of your Campaign here, E.g. New year campaign, Launch campaign etc" listData={listCampaigns.map((value) => value.campaignName)} onChange={(value) => { handleChangeAssetDetails("campaign_name", value) }} />
          </div>
          <div className='flex flex-col gap-3'>
            <p className='text-[#160647] text-base tracking-wide font-semibold'>Digital Marketing Asset Name</p>
            <TextField customClass='h-12' placeholder='Type the name of your Digital Marketing Assets here, E.g. Email_1, Linkedin_1 etc' name="asset_name" handleChange={onChangeAssetDetails} />
            {isAssetNameExists ? <p className='text-red-500 text-[12px] mt-[-10px]'>Asset name already exists, please enter another asset name.</p> : null}
          </div>
        </div>  
    </>
  )
}

export default SectionAssetDetails