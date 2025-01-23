'use client'
// import { useAppData } from '@/context/AppContext'
import { useDashboard } from '@/hooks/useDashboard'
import AssetsPageLayout from '@/layout/specific_layout/AssetsPageLayout'
// import { formatDate } from '@/utils/formatDate'
import { FC, Suspense, useEffect, useState } from 'react'
import processDashboardAssets from '../dashboard/utils/dashboardFilters'
import { AssetType } from '@/types/asset'

const Page:FC = () => {
  const [type, setType] = useState<AssetType | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setType(urlParams.get('type') as AssetType);
  }, []);

  const {dashboardAssets} = useDashboard()
  const {assetData} = processDashboardAssets(dashboardAssets, type)

  const tableHeading = ["Project Name", "Campaign Name", "Asset Name", "Created On","Current Status", "Approved By", "Approved On"]
  const arrowshowItems = ["Project Name", "Created On", "Approved On"]
  const hiddenFields = ["dataItem","assetID"]

  return (
    <>
      <AssetsPageLayout 
        hiddenFields={hiddenFields} 
        handleClick={()=>{}} 
        campaign_data={assetData} 
        tableHeadings={tableHeading} 
        headersHavingToggle={arrowshowItems} 
        columnWidthsTable={["repeat(7, 1fr)"]} 
        page="" 
        isIconRequired = {false}
      />
    </>
  )
}

export default Page