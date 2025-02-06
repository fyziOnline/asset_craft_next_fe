"use client"

import React, { FC } from 'react'
import AssetsPageLayout from '@/layout/specific_layout/AssetsPageLayout'
import { useGetAsset } from '@/hooks/useGetAsset'
import { formatDate } from '@/utils/formatDate'
import { useRouter } from 'next/navigation'

const AssetOnReviw: FC = () => {
    const router = useRouter()
    const { listAssets } = useGetAsset({ assignedTo: 0 })

    const filteredAssets = listAssets.filter((data) => data.status === "On Review")

    const assetsDisplayTable = filteredAssets.map((data) => ({
        assetTypeIcon: data.assetTypeName,
        assetName: data.assetName,
        version: data.versionName,
        campaignName: data.campaignName,
        projectName: data.projectName,
        assignedTo: data.approverName || "",
        createdOn: formatDate(data.createdOn),
        currentStatus: data.status,
        assetID: data.assetID,
    }))

    const tableHeading = ["Asset Name", "Asset Version", "Campaign Name", "Project Name", "Approver", "Created On", "Current Status"]
    const headerHavingSortingToggle = ["Project Name", "Created On"]
    const hiddenFields = ["assetID"]

    const handleClick = (item: any) => {
        router.push(`/edit-html-content?assetID=${item.assetID}`)
        router.push(`/edit-html-content?assetID=${item.assetID}&campaignName=${item.campaignName}&projectName=${item.projectName}&assetTypeIcon=${item.assetTypeIcon}`)
    }


    return (
        <div>
            <AssetsPageLayout 
                hiddenFields={hiddenFields}
                campaign_data={assetsDisplayTable}
                tableHeadings={tableHeading}
                headersHavingToggle={headerHavingSortingToggle}
                columnWidthsTable={["repeat(7, 1fr)"]}
                handleClick={handleClick}
                page=""
            />
        </div>
    )
}

export default AssetOnReviw