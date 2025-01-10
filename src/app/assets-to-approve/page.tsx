'use client'

import { useAssetToApprove } from '@/hooks/useAssetToApprove'
import AssetsPageLayout from '@/layout/specific_layout/AssetsPageLayout'
import React from 'react'

const AssetsToApprove: React.FC = () => {
    const { assetToApprove } = useAssetToApprove()
    console.log('assetToApprove: ', assetToApprove);

    const assetsToApprove = assetToApprove.map((data) => ({
        ProjectName: data.projectName,
        CampaignName: data.campaignName,
        AssetName: data.assetName,
        AssetType: data.assetTypeName,
        ModifiedOn: data.modifiedOn,
        CreatedOn: data.createdOn
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
