'use client'

import { FC } from "react"
import { useSearchParams } from "next/navigation"
import { useAppData } from "@/context/AppContext"
import { useRouter } from "next/navigation"
import { nkey } from '@/data/keyStore';
import { html_content } from "@/app/call-script/call-script-form/data/data"
import Breadcrumb from "@/components/global/Breadcrumb"
import Button from "@/components/global/Button"

interface ProjectAssetProp {
  params: {
    project_name: string
    campaign_name: string
  }
  handleEdit?: () => void
}

const AssetGenerationHeader: FC<ProjectAssetProp> = ({ params }) => {
  const router = useRouter();
  const queryParams = useSearchParams()
  const asset_name = queryParams.get('asset_name') ?? 'default'

  const accessParams = () => {
    return params
  }

  const handleEdit = () => {
    sessionStorage.setItem(nkey.html_content, html_content);
    router.push("/edit-html-content?type=call-script")
  }

  const { project_name, campaign_name } = accessParams()

  const { contextData } = useAppData();


  return (
    <div className="flex items-center justify-between border-grey-200 border-b-[1px] border-solid pt-[2rem] pb-5 px-[1.5rem]">
      <div>
        <Breadcrumb projectName={project_name.split('%20').join(' ')} TaskName={campaign_name.split('%20').join(' ')} TaskType={asset_name.split('%20').join(' ')} />
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