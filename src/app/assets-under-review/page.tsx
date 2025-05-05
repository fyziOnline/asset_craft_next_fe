"use client"

import React, { FC, useEffect } from 'react'
import AssetsPageLayout from '@/layout/specific_layout/AssetsPageLayout'
import { formatDate } from '@/utils/formatDate'
import { useRouter } from 'next/navigation'
import { useDashboard } from '@/hooks/useDashboard'
import { STATUS } from '@/constants'

const AssetOnReviw: FC = () => {
    const router = useRouter()
    const { getAssetAllAtDashboard, dashboardAssets } = useDashboard()

    useEffect(() => {
        getAssetAllAtDashboard()
    },[])

    const filteredAssets = dashboardAssets.filter((data) => data.status === STATUS.ON_REVIEW)

    const assetsDisplayTable = filteredAssets.map((data) => ({
        assetTypeIcon: data.assetTypeName,
        assetName: data.assetName,
        campaignName: data.campaignName,
        projectName: data.project,
        createdOn: formatDate(data.createdOn),
        currentStatus: data.status,
        assetID: data.assetID,
    }))

    const tableHeading = ["Asset Name", "Campaign Name", "Project Name", "Created On", "Current Status"]
    const headerHavingSortingToggle = ["Project Name", "Created On"]
    const hiddenFields = ["assetID"]

    const handleClick = (item: any) => {
        router.push(`/edit-html-content?assetID=${item.assetID}`)
        router.push(`/edit-html-content?assetID=${item.assetID}&campaignName=${item.campaignName}&projectName=${item.projectName}&assetTypeIcon=${item.assetTypeIcon}&assetName=${item.assetName}`)
    }    

    return (
        <div>
            <AssetsPageLayout
                hiddenFields={hiddenFields}
                campaign_data={assetsDisplayTable}
                tableHeadings={tableHeading}
                headersHavingToggle={headerHavingSortingToggle}
                columnWidthsTable={["repeat(5, 1fr)"]}
                handleClick={handleClick}
                page=""
            />
        </div>
    )
}

export default AssetOnReviw