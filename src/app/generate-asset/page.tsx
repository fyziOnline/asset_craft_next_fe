'use client'

import React, { Suspense, lazy } from 'react';
import { useSearchParams } from 'next/navigation';
import type { PageType } from '@/componentsMap/pageMap';
import LoadingIndicator from '@/components/global/LoadingIndicator';

const ProgressSection = lazy(() => import('./components/progressSection'));

function GenerateAssetContent() {
  const params = useSearchParams();
  const assetType = params.get('asset-type') as PageType;

  return (
    <Suspense fallback={<LoadingIndicator />}>
      <ProgressSection params={{ type_page: assetType }} />
    </Suspense>
  );
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