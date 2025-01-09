import { debounce } from "lodash"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import Cookies from 'js-cookie';
import { ApiService } from "@/lib/axios_generic";
import { urls } from "@/apis/urls";
import { nkey } from "@/data/keyStore";
import { DropDownOptions } from "@/components/global/DropDown";
import { useAppData } from "@/context/AppContext";

interface CampaignsProps {
    campaignID: string,
    project: string,
    campaignName: string,
    country: string,
    squad: string,
    startDate: string,
    endDate: string,
    status: string,
    isVisible: number
}

interface AssetsProps {
    assetName: string,
    language: string,
    assetAIPrompt: string,
    isVisible: number,
    layoutID: string,
    assetTypeID: string,
    assetTypeName: string,
    modifiedOn: string,
    assetID: string
}

type AssetDetails = {
    project_name: string;
    campaign_name: string;
    asset_name: string;
    campaignID : string
};
export const useProjectFormData = () => {
    const [isAssetNameExists, setIsAssetNameExists] = useState<boolean>(false);
    const [isProductNameValid,setIsProductNameValid] = useState<boolean>(true)
    const [listProjects, setListProjects] = useState<DropDownOptions[]>([]);
    const [listCampaigns, setListCampaigns] = useState<CampaignsProps[]>([]);
    const [listAssets, setListAssets] = useState<AssetsProps[]>([]);
    // const campaignIDRef = useRef("")
    const isCampaignSelect = useRef(false)
    const { setError } = useAppData()
    // const {contextData,setContextData} = useAppData()

    const [assetDetails, setAssetDetails] = useState<AssetDetails>({
        project_name: '',
        campaignID : '',
        campaign_name: '',
        asset_name: ''
    })

    useEffect(() => {
        getListProjects()
    }, [])

    const getListProjects = async () => {
        try {
            const res = await ApiService.get<any>(urls.campaign_getProjectsList);
            if (res.isSuccess) {
                const listProjects = res.projects as string[]
                const newListProjects: DropDownOptions[] = []
                listProjects.forEach(element => {
                    newListProjects.push({
                        label: element,
                        value: element
                    })
                });

                setListProjects(newListProjects)
            }
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
        }
    }

    const getListCampaign = async (projectName: string, label: string) => {
        try {
            if (projectName.trim().length === 0 || label === 'Other' ) {
                setListCampaigns([])
                return
            }
            const client_ID = Cookies.get(nkey.client_ID)
            const res = await ApiService.get<any>(`${urls.campaign_select_all}?clientId=${client_ID}&project=${projectName}`);
            if (res.isSuccess) {
                setListCampaigns(res.campaigns as CampaignsProps[])
                handleCheckCampNameExists(res.campaigns as CampaignsProps[], assetDetails.campaign_name)
            }
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
        }
    }

    const onChangeAssetDetails = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        handleChangeAssetDetails(name, value)
    }

    const handleChangeAssetDetails = debounce((key: string, value: string, label?: string) => {
        setAssetDetails(pre => ({
            ...pre,
            [key]: value
        }))

        if (key === "project_name") {
            if (['other', 'others'].includes(value.trim().toLowerCase())){
                setIsProductNameValid(false) 
                setAssetDetails(pre=>({
                    ...pre,
                    [key] : ''
                }))
            } else {
                setIsProductNameValid(true)
            }
            getListCampaign(value, label || "")
        } else if (key === "campaign_name") {
            handleCheckCampNameExists(listCampaigns, value)
        } else if (key === "asset_name") {
            const checkAssetNameExists = listAssets.filter((item) => item.assetName.toLowerCase() === value.toLowerCase())
            if (checkAssetNameExists.length > 0) {
                setAssetDetails(pre=>({
                    ...pre,
                    [key] : ''
                }))
                setIsAssetNameExists(true)
            } else {
                setIsAssetNameExists(false)
            }
        }
        
    }, 500)


    const handleCheckCampNameExists = (listCampaigns: CampaignsProps[], value: string) => {
        const checkCampNameExists = listCampaigns.filter((item) => item.campaignName.toLowerCase() === value.toLowerCase())
        if (checkCampNameExists.length > 0) {
            // campaignIDRef.current = checkCampNameExists[0].campaignID
            setAssetDetails(pre=>({...pre,campaignID:checkCampNameExists[0].campaignID}))
            isCampaignSelect.current = true
            getAssetAll(checkCampNameExists[0].campaignID)
        } else {
            setAssetDetails(pre=>({...pre,campaignID:""}))
            isCampaignSelect.current = false
            setListAssets([])
            setIsAssetNameExists(false)
        }
    }

    const getAssetAll = async (campaignID: string) => {
        try {
            const res_assets = await ApiService.get<any>(`${urls.asset_select_all}?campaignID=${campaignID}`);
            if (res_assets.isSuccess) {
                setListAssets(res_assets.assets as AssetsProps[])
            }
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
        }
    }

    return {
        isProductNameValid,
        isAssetNameExists,
        listProjects,
        listCampaigns,
        onChangeAssetDetails,
        assetDetails,
        handleChangeAssetDetails
    };
}