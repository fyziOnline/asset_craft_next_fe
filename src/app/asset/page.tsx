'use client'

import { useDashboard } from '@/hooks/useDashboard'
import AssetsPageLayout from '@/layout/specific_layout/AssetsPageLayout'
import { FC, useEffect, useState } from 'react'
import processDashboardAssets from '../dashboard/utils/dashboardFilters'
import { AssetType } from '@/types/asset'
import { useRouter } from 'next/navigation'
import { getAssetTypeFromParam } from '@/utils/assetTypeUtils'

// Define a more specific type for item in handleClick 
interface AssetClickItem {
  assetID: string;
  currentStatus: string;
  projectName: string;
  campaignName: string;
  campaignID?: string;
  assetTypeIcon: string;
}

// The Asset type expected by AssetsPageLayout
interface Asset {
  [key: string]: string;
}

const Page: FC = () => {
  const [type, setType] = useState<AssetType | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      // Use the utility function to safely convert string to AssetType enum
      const typeParam = urlParams.get('type');
      const assetType = getAssetTypeFromParam(typeParam);
      setType(assetType);
    }
  }, []);

  const { dashboardAssets, getAssetAllAtDashboard } = useDashboard()

  useEffect(() => {
    getAssetAllAtDashboard()
  }, [])

  // Pass the type safely to processDashboardAssets, which now handles null/undefined properly
  const { assetData } = processDashboardAssets(dashboardAssets, type)  

  // Convert AssetData[] to Asset[] for compatibility with AssetsPageLayout
  const adaptedAssetData: Asset[] = assetData.map(item => {
    const result: Asset = {};
    // Convert each property to string
    Object.entries(item).forEach(([key, value]) => {
      result[key] = value === null || value === undefined ? '' : String(value);
    });
    return result;
  });

  const tableHeading = ["Asset Name", "Campaign Name", "Project Name", "Created On", "Current Status", "Approved On", "Approved By"]
  const arrowshowItems = ["Project Name", "Created On", "Approved On"]
  const hiddenFields = ["dataItem", "assetID"]

  const handleClick = (item: AssetClickItem) => {
    router.push(`/edit-html-content?assetID=${item.assetID}&status=${item.currentStatus}&projectName=${item.projectName}&campaignName=${item.campaignName}&campaignID=${item.campaignID || ''}&assetTypeIcon=${item.assetTypeIcon}`)
  }

  return (
    <>
      <AssetsPageLayout
        hiddenFields={hiddenFields}
        handleClick={handleClick}
        campaign_data={adaptedAssetData}
        tableHeadings={tableHeading}
        headersHavingToggle={arrowshowItems}
        columnWidthsTable={["repeat(7, 1fr)"]}
        page=""
        isIconRequired={false}
      />
    </>
  )
}

export default Page