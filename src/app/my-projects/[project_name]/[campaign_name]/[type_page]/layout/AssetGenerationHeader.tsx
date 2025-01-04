'use client'

import { FC } from "react"
import { useSearchParams } from "next/navigation"
import { useAppData } from "@/context/AppContext"
import { useRouter } from "next/navigation"
// import Breadcrumb from "@/components/global/Breadcrumb"
import Button from "@/components/global/Button"

interface ProjectAssetProp {
  params: {
    project_name: string
    campaign_name: string
  }
}

const AssetGenerationHeader: FC<ProjectAssetProp> = ({ params }) => {
  const router = useRouter();
  const { contextData, setContextData } = useAppData();
  const { project_name, campaign_name } = params
  const queryParams = useSearchParams()
  const asset_name = queryParams.get('asset_name') ?? 'default'

  const assetTypeID = queryParams.get('assetTypeID')
  
  const handleEdit = () => {
    router.replace(`/edit-html-content?project_name=${project_name}&campaign_name=${campaign_name}&asset_name=${asset_name}`)

    setTimeout(() => {
      //reset state
      setContextData({ isShowEdit_Save_Button: false, isRegenerateHTML: false, stepGenerate: 0 })
    }, 5000);
  }

  const handleBack = () => {
    if (contextData.stepGenerate === 1) {
      if (contextData.isRegenerateHTML) { return }
      setContextData({ stepGenerate: 0 })
    } else {
      router.back()
    }
  }
  
  return (
    <div className="flex items-center justify-between border-grey-200 border-b-[1px] border-solid pt-[2rem] pb-5 px-[1.5rem]">
      <div>
        {/* <Breadcrumb onClickBack={handleBack} ProjectNameUrl={`/my-projects/${project_name}`} TaskNameUrl={`/my-projects/${project_name}/${assetTypeID}`} projectName={project_name.split('%20').join(' ')} TaskName={campaign_name.split('%20').join(' ')} TaskType={asset_name.split('%20').join(' ')} /> */}
      </div>
      {contextData.assetGenerateStatus === 3 && contextData.isShowEdit_Save_Button &&
        <div className="flex">
          <Button
            buttonText='View & Edit'
            showIcon
            textStyle='text-[1rem] font-base text-[#00A881]'
            textColor="text-[#00A881]"
            iconColor="#00A881"
            backgroundColor='bg-[#fff]'
            handleClick={handleEdit}
            customClass='min-w-[180px] static border-[3px] border-[#00A881] px-[1.4rem] py-2 group-hover:border-white mr-[70px]' />
          <Button
            buttonText='Save'
            handleClick={() => { router.replace("/dashboard") }}
            showIcon
            textStyle='text-[1rem] font-base text-[#00A881]'
            textColor="text-[#00A881]"
            iconColor="#00A881"
            backgroundColor='bg-[#fff]'
            customClass='min-w-[180px] static border-[3px] border-[#00A881] px-[1.4rem] py-2 group-hover:border-white' />
        </div>
      }
    </div>
  )
}

export default AssetGenerationHeader