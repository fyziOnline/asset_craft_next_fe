'use client'

import { useAssetToApprove } from '@/hooks/useAssetToApprove'
import AssetsPageLayout from '@/layout/specific_layout/AssetsPageLayout'
import React from 'react'
import { formatDate } from '@/utils/formatDate'

const AssetsToApprove: React.FC = () => {
    const { assetToApprove } = useAssetToApprove()

    const assetsToApprove = assetToApprove.map((data) => ({
        assetTypeIcon: data.assetTypeName,
        assetName: data.assetName,
        version: data.versionName,
        campaignName: data.campaignName,
        projectName: data.projectName,
        createdOn: formatDate(data.createdOn),
        status: data.status
    }))

    const tableHeading = ["Asset Name", "Asset Version", "Campaign Name", "Project Name", "Created On", "Current Status"]
    const headerHavingSortingToggle = ["Project Name", "Created On"]
    return (
        <div>
            <AssetsPageLayout
                campaign_data={assetsToApprove}
                tableHeadings={tableHeading}
                headersHavingToggle={headerHavingSortingToggle}
                page='Assets to Approve'
                columnWidthsTable={["repeat(8, 1fr)"]}
            />
        </div>
    )
}

export default AssetsToApprove
