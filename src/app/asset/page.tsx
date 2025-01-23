'use client'
// import { useAppData } from '@/context/AppContext'
import { useDashboard } from '@/hooks/useDashboard'
import AssetsPageLayout from '@/layout/specific_layout/AssetsPageLayout'
// import { formatDate } from '@/utils/formatDate'
import { useSearchParams } from 'next/navigation'
import { FC, Suspense } from 'react'
import processDashboardAssets from '../dashboard/utils/dashboardFilters'
import { AssetType } from '@/types/asset'

const Page:FC = () => {
    const params = useSearchParams()
    let type = params.get('type') 
    
    const {dashboardAssets} = useDashboard()
    const {assetData} = processDashboardAssets(dashboardAssets,type as AssetType)

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