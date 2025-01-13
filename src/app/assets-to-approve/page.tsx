'use client'

import { useAssetToApprove } from '@/hooks/useAssetToApprove'
import AssetsPageLayout from '@/layout/specific_layout/AssetsPageLayout'
import React from 'react'
import { formatDate } from '@/utils/formatDate'
import { useRouter } from 'next/navigation'

const tableHeading = ["Asset Name", "Asset Version", "Campaign Name", "Project Name", "Created On", "Current Status"]
const headerHavingSortingToggle = ["Project Name", "Created On"]
const hiddenFields = ["assetVersionID", "layoutName"]

const AssetsToApprove: React.FC = () => {
    const router = useRouter();
    const { assetToApprove } = useAssetToApprove()

    const assetsToApprove = assetToApprove.map((data) => ({
        assetTypeIcon: data.assetTypeName,
        assetName: data.assetName,
        version: data.versionName,
        campaignName: data.campaignName,
        projectName: data.projectName,
        createdOn: formatDate(data.createdOn),
        status: data.status,
        assetVersionID: data.assetVersionID,
        layoutName: data.assetTypeName
    }))

    const handleClick = (item: any) => {
        router.push(`/edit-html-content?assetVersionID=${item.assetVersionID}&assetName=${item.assetName}&layoutName=${item.layoutName}`)
    }

    return (
        <div>
            <AssetsPageLayout
                campaign_data={assetsToApprove}
                tableHeadings={tableHeading}
                headersHavingToggle={headerHavingSortingToggle}
                page='Assets to Approve'
                columnWidthsTable={["repeat(8, 1fr)"]}
                hiddenFields={hiddenFields}
                handleClick={handleClick}
            />
        </div>
    )
}

export default AssetsToApprove
