'use client'

import React, { 
    FC, 
    Suspense, 
    useEffect, 
     useMemo, 
     useState 
    } from 'react';
import ProgressSection from "./components/progressSection"
import AssetGenerationHeader from "./layout/AssetGenerationHeader"
import { useSearchParams } from 'next/navigation';
import { PageType } from '@/componentsMap/pageMap';


const GenerateAssetContent: FC = () => {
  const params = useSearchParams() 
  const [projectName,setProjectName]= useState<string>('')
  const [CampaignName,setCampaignName]= useState<string>('')
  // const [assetType,setAssetType]= useState<string>('')

  const assetType = useMemo(() => {
    return params.get('asset-type') || '';
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

const GenerateAssetPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GenerateAssetContent />
    </Suspense>
  );
};

export default GenerateAssetPage
