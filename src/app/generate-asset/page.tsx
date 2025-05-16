'use client'

import React, {
  FC,
  Suspense,
  useEffect,
  useMemo
} from 'react';
import ProgressSection from "./components/progressSection"
import { useSearchParams } from 'next/navigation';
// import { PageType } from '@/componentsMap/pageMap';
import { AssetType } from '@/types/assetTypes';
import { useGenerateAssetStoreSelector } from '@/store/generatAssetStore';


const GenerateAssetContent: FC = () => {
  const resetAssetGenerateStore = useGenerateAssetStoreSelector.use.resetAssetGenerateStore()
  useEffect(()=>{
    console.log('====================================');
    console.log('resetAssetGenerateStore ');
    console.log('====================================');
    resetAssetGenerateStore()
  },[])
  
  const params = useSearchParams()

  const assetType = useMemo(() => {
    return params.get('asset-type') || '';
  }, [params]);

  return (
    <>
      <div className="overflow-x-hidden">
        <ProgressSection params={{ type_page: assetType as AssetType }} />
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
