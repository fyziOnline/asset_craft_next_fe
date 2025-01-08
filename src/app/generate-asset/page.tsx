'use client'

import React, {
  FC,
  Suspense,
  useMemo
} from 'react';
import ProgressSection from "./components/progressSection"
import { useSearchParams } from 'next/navigation';
import { PageType } from '@/componentsMap/pageMap';


const GenerateAssetContent: FC = () => {
  const params = useSearchParams()

  const assetType = useMemo(() => {
    return params.get('asset-type') || '';
  }, [params]);

  return (
    <>
      <div className="overflow-x-hidden">
        <ProgressSection params={{ type_page: assetType as PageType }} />
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
