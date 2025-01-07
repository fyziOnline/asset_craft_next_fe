'use client'

import React, { 
    FC, 
    useEffect, 
     useState 
    } from 'react';
import ProgressSection from "./components/progressSection"
import AssetGenerationHeader from "./layout/AssetGenerationHeader"
import { useSearchParams } from 'next/navigation';
import { PageType } from '@/componentsMap/pageMap';


const GenerateAssetPage: FC = () => {
  const params = useSearchParams() 
  const [projectName,setProjectName]= useState<string>('')
  const [CampaignName,setCampaignName]= useState<string>('')
  const [assetType,setAssetType]= useState<string>('')

  useEffect(() => {
    const assetTypeFromUrl = params.get('asset-type')
    if (assetTypeFromUrl) {
      setAssetType(assetTypeFromUrl);
    }
  }, [params]);

  return (
    <>
      <AssetGenerationHeader params={{ project_name : projectName, campaign_name:CampaignName }} />
      <div className="overflow-x-hidden">
        <ProgressSection params={{ project_name:projectName, campaign_name:CampaignName, type_page: assetType as PageType}} />
      </div>
    </>
  )
}

export default GenerateAssetPage
