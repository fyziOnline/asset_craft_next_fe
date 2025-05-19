'use client'

import React, {
  FC,
  lazy,
  Suspense,
  useEffect,
  useMemo
} from 'react';
import { useSearchParams } from 'next/navigation';
import LoadingIndicator from '@/components/global/LoadingIndicator';
import { AssetType } from '@/types/assetTypes';
import { useGenerateAssetStoreSelector } from '@/store/generatAssetStore';

const ProgressSection = lazy(() => import('./components/progressSection'));

const GenerateAssetContent: FC = () => {
  const resetAssetGenerateStore = useGenerateAssetStoreSelector.use.resetAssetGenerateStore()
  useEffect(()=>{
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

export default function GenerateAssetPage() {
  return (
    <div className="overflow-x-hidden">
      <Suspense fallback={<LoadingIndicator />}>
        <GenerateAssetContent />
      </Suspense>
    </div>
  );
}