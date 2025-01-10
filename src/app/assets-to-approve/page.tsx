'use client'

import { useAssetToApprove } from '@/hooks/useAssetToApprove'
import AssetsPageLayout from '@/layout/specific_layout/AssetsPageLayout'
import React from 'react'

const AssetsToApprove: React.FC = () => {
    const { assetToApprove } = useAssetToApprove()
    console.log('assetToApprove: ', assetToApprove);

    const assetsToApprove = assetToApprove.map((data) => ({
        projectName: data.projectName,
        campaignName: data.campaignName,
        assetTypeIcon: data.assetTypeName,
        assetName: data.assetName,
        modifiedOn: data.modifiedOn,
        createdOn: data.createdOn
    }))

    const tableHeading = ["Project Name", "Campaign Name", "Asset Name", "Created On", "Current Status"]
    const headerHavingSortingToggle = ["Project Name", "Created On"]
    return (
        <div>
            <AssetsPageLayout
                campaign_data={assetsToApprove}
                tableHeadings={tableHeading}
                headersHavingToggle={headerHavingSortingToggle}
                page='Assets to Approve'
                columnWidthsTable={["repeat(7, 1fr)"]}
            />
        </div>
    )
}

export default AssetsToApprove
