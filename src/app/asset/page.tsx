'use client'

import { useDashboard } from '@/hooks/useDashboard'
import AssetsPageLayout from '@/layout/specific_layout/AssetsPageLayout'
import { FC, Suspense, useEffect, useState } from 'react'
import processDashboardAssets from '../dashboard/utils/dashboardFilters'
import { AssetType } from '@/types/asset'
import { useRouter } from 'next/navigation'

const Page: FC = () => {
  const [type, setType] = useState<AssetType | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setType(urlParams.get('type') as AssetType);
    }
  }, []);

  const { dashboardAssets, getAssetAllAtDashboard } = useDashboard()

  useEffect(() => {
    getAssetAllAtDashboard()
  }, [])


  const { assetData } = processDashboardAssets(dashboardAssets, type)  


  const tableHeading = ["Asset Name", "Campaign Name", "Project Name", "Created On", "Current Status", "Approved On", "Approved By"]
  const arrowshowItems = ["Project Name", "Created On", "Approved On"]
  const hiddenFields = ["dataItem", "assetID"]

  const handleClick = (item: any) => {
    router.push(`/edit-html-content?assetID=${item.assetID}&status=${item.currentStatus}&projectName=${item.projectName}&campaignName=${item.campaignName}&assetTypeIcon=${item.assetTypeIcon}`)
  }

  return (
    <>
      <AssetsPageLayout
        hiddenFields={hiddenFields}
        handleClick={handleClick}
        campaign_data={assetData}
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