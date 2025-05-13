'use client'

import React, { Suspense, lazy } from 'react';
import { useSearchParams } from 'next/navigation';
import type { PageType } from '@/componentsMap/pageMap';

const ProgressSection = lazy(() => import('./components/progressSection'));

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="w-10 h-10 border-4 border-t-green-500 border-gray-300 rounded-full animate-spin"></div>
  </div>
);

export default function GenerateAssetPage() {
  const params = useSearchParams();

  const assetType = params.get('asset-type') as PageType;

  return (
    <div className="overflow-x-hidden">
      <Suspense fallback={<LoadingSpinner />}>
        <ProgressSection params={{ type_page: assetType }} />
      </Suspense>
    </div>
  )
}

