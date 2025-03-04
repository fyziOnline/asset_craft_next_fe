'use client'
import { urls } from '@/apis/urls'
import AssetsPageLayout from '@/layout/specific_layout/AssetsPageLayout'
import { ApiService } from '@/lib/axios_generic'
import { usePathname } from 'next/navigation'
import React, { FC, useEffect, useState } from 'react'

const CampaignPage:FC = () => {
    const pathname = usePathname()
    
    const campaignUrl = pathname.split('/');
    const campaign_name = campaignUrl[2]
    const campaign_id = campaignUrl[3]
    
    const [assetData, setAssetData] = useState([])

    const getAssets = async () => {
      try {
        const response = await ApiService.get<any>(`${urls.asset_select_all}?campaignID=${campaign_id}`);
  
        if (response.isSuccess) {
          setAssetData(response.assets);
        }
      } catch (error) {
        console.error('API Error:', error);
        alert(ApiService.handleError(error));
      }
    }; 

    useEffect(() => {
        getAssets()
    },[campaign_id])

    const tableHeading = ["Project Name" , "Campaign Name", "Asset Name", "Created On" , "Approved By" , "Approved On" , "Current Status"]

    const headerHavingSortingToggle = ["Project Name", "Created On", "Approved On"]

    const assetDatas = assetData.map((asset:any) => {
      return {
        ProjectName : asset.assetName, //
        CampaignName : asset.assetName, //
        assetName : asset.assetName,
        CreatedOn : asset.assetName, //
        ApprovedBy : asset.assetName, //
        ApprovedOn : asset.assetName, //
        CurrentStatus : asset.assetName, //
      }
    })
 
  return (
    <>
        <AssetsPageLayout 
            campaign_data={assetDatas}
            tableHeadings={tableHeading}
            headersHavingToggle={headerHavingSortingToggle}
            page={campaign_name}
        />
    </>
  )
}

export default CampaignPage