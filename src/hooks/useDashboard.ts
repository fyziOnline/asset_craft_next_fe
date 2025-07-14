import moment from 'moment';
import Cookies from 'js-cookie';
import { ChangeEvent, useRef, useState } from 'react';
import { AllAssetsTypeProps, AssetDetails, AssetsProps, CampaignsProps, ClientAssetTypeProps } from '@/types/asset';
import { useLoading } from '@/components/global/Loading/LoadingContext';
import { useRouter } from 'next/navigation';
import { nkey } from '@/data/keyStore';
import { urls } from '@/apis/urls';
import { debounce } from 'lodash';
import { useAppData } from '@/context/AppContext';
import { ApiService } from '@/lib/axios_generic';
import { ListTypePage } from '@/data/dataGlobal';
import { DropDownOptions } from '@/components/global/DropDown';
import { AssetType } from '@/types/asset';

export const useDashboard = () => {
    const router = useRouter();
    const campaignIDRef = useRef("")
    const isCampaignSelect = useRef(false)
    const { setShowLoading } = useLoading()
    const { setContextData, setError } = useAppData();

    const [clientAssetTypes, setClientAssetTypes] = useState<ClientAssetTypeProps[]>([])
    // const 
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [isAssetNameExists, setIsAssetNameExists] = useState<boolean>(false);
    const [isProductNameValid, setIsProductNameValid] = useState<boolean>(true)
    const [chooseAssetModal, setChooseAssetModal] = useState<boolean>(false);
    const [selectedButton, setSelectedButton] = useState<ClientAssetTypeProps>()
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
    const [listProjects, setListProjects] = useState<DropDownOptions[]>([]);
    const [listCampaigns, setListCampaigns] = useState<CampaignsProps[]>([]);
    const [listAssets, setListAssets] = useState<AssetsProps[]>([]);
    const [pendingApproval, setPendingApproval] = useState<any[]>([])
    const [dashboardAssets, setDashboardAssets] = useState<AllAssetsTypeProps[]>([])

    const [assetDetails, setAssetDetails] = useState<AssetDetails>({
        project_name: '',
        campaign_name: '',
        asset_name: ''
    })

    // const userRole = userDetails.userRole
    const userRole = Cookies.get(nkey.userRole)

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
            if (projectName.trim().length === 0 || label === 'Other') {
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

    const getAssetTypes = async () => {
        try {
            // setShowLoading(true)

            const client_ID = Cookies.get(nkey.client_ID)
            const res = await ApiService.get<any>(`${urls.clientAssetType_select_all}?clientID=${client_ID}`);
            if (res.isSuccess) {
                setClientAssetTypes([{ assetTypeName: "All in One" }, ...res.clientAssetTypes])
            }
            console.log('====================================');
            console.log('response fehcing asset types :',res);
            console.log('====================================');
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
        }
    }

    const handleShowPopup = (item: ClientAssetTypeProps) => {
        setModalOpen(true)
        setSelectedButton(item)
    }

    const onSelect = (index: number) => {
        // Toggle selection: if index is already selected, deselect it; otherwise, select it
        setSelectedIndexes(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    }

    const closeModal = () => {
        setAssetDetails({
            project_name: '',
            campaign_name: '',
            asset_name: ''
        })
        setIsAssetNameExists(false)
        setModalOpen(false)
    };

    const closeAssetModal = () => setChooseAssetModal(false)

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
            ['other', 'others'].includes(value.trim().toLowerCase()) ? setIsProductNameValid(false) : setIsProductNameValid(true)
            getListCampaign(value, label || "")
        } else if (key === "campaign_name") {
            handleCheckCampNameExists(listCampaigns, value)
        } else if (key === "asset_name") {
            const checkAssetNameExists = listAssets.filter((item) => item.assetName.toLowerCase() === value.toLowerCase())
            if (checkAssetNameExists.length > 0) {
                setIsAssetNameExists(true)
            } else {
                setIsAssetNameExists(false)
            }
        }

    }, 500)

    const handleCheckCampNameExists = (listCampaigns: CampaignsProps[], value: string) => {
        const checkCampNameExists = listCampaigns.filter((item) => item.campaignName.toLowerCase() === value.toLowerCase())
        if (checkCampNameExists.length > 0) {
            campaignIDRef.current = checkCampNameExists[0].campaignID
            isCampaignSelect.current = true
            getAssetAll(checkCampNameExists[0].campaignID)
        } else {
            campaignIDRef.current = ""
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

    const selectAssetType = async (item: ClientAssetTypeProps) => {
        setSelectedButton(item)
        router.push(`generate-asset?asset-type=${item?.assetTypeName}&assetTypeID=${item.assetTypeID}`)
    }

    const handleNext = async () => {
        if (isAssetNameExists ||
            !isProductNameValid ||
            assetDetails.asset_name.trim().length === 0 ||
            assetDetails.campaign_name.trim().length === 0 ||
            assetDetails.project_name.trim().length === 0
        ) {
            return
        }

        if (selectedButton?.assetTypeName === "All in One") {
            setChooseAssetModal(true)
            setModalOpen(false)
        } else {
            if (campaignIDRef.current.length === 0) {
                const resAddCampaign = await addCampaign()
                if (!resAddCampaign) { return }
            }
            // setContextData({ isRegenerateHTML: false, stepGenerate: 0 })

            // Compare with AssetType enum values where possible
            const assetTypeName = selectedButton?.assetTypeName || '';
            
            if (assetTypeName === AssetType.EMAIL) {
                router.push(`my-projects/${assetDetails.project_name}/${assetDetails.campaign_name}/${ListTypePage[AssetType.EMAIL]}?asset_name=${assetDetails.asset_name}&assetTypeID=${selectedButton?.assetTypeID || ''}&campaignID=${campaignIDRef.current}&isCampaignSelect=${isCampaignSelect.current}`)
            } else if (assetTypeName === AssetType.LANDING_PAGE) {
                router.push(`my-projects/${assetDetails.project_name}/${assetDetails.campaign_name}/${ListTypePage[AssetType.LANDING_PAGE]}?asset_name=${assetDetails.asset_name}&assetTypeID=${selectedButton?.assetTypeID || ''}&campaignID=${campaignIDRef.current}&isCampaignSelect=${isCampaignSelect.current}`)
            } else if (assetTypeName === AssetType.LINKEDIN) {
                router.push(`my-projects/${assetDetails.project_name}/${assetDetails.campaign_name}/${ListTypePage[AssetType.LINKEDIN]}?asset_name=${assetDetails.asset_name}&assetTypeID=${selectedButton?.assetTypeID || ''}&campaignID=${campaignIDRef.current}&isCampaignSelect=${isCampaignSelect.current}`)
            }
            // Removed CallScript handling as requested
        }
    }

    const addCampaign = async () => {
        try {
            setShowLoading(true)
            const client_ID = Cookies.get(nkey.client_ID);
            const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
            const res_campaign_add = await ApiService.post<any>(urls.campaign_add, {
                "clientID": client_ID,
                "project": assetDetails.project_name,
                "campaignName": assetDetails.campaign_name,
                "country": "",
                "squad": "",
                "startDate": currentDate,
                "endDate": "",
                "status": ""
            });
            if (res_campaign_add.isSuccess) {
                campaignIDRef.current = res_campaign_add.campaignID || ""
                isCampaignSelect.current = false
            }
            return res_campaign_add.isSuccess
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
            return false
        }
        finally {
            setShowLoading(false)
        }
    }

    const getAssetAllAtDashboard = async () => {
        setShowLoading(true)
        try {
            const respone = await ApiService.get<any>(`${urls.getAssetsAllDashboard}?timePeriod=${90}`)
            if (respone.isSuccess) {
                setDashboardAssets(respone.assets)
            }

        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
            return false
        } finally {
            setShowLoading(false)
        }
    }

    const getPendingApproval = async () => {
        setShowLoading(true)
        try {
            if (userRole) {                
                const response = await ApiService.post<any>(`${urls.getAssetsToApprove}`, {
                    assignedTo: userRole === 'Approver' ? 1 : 0
                })

                if (response.isSuccess) {
                    setPendingApproval(response.assets)
                }
            }
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
        }
        finally {
            setShowLoading(false)
        }
    }

    return {
        isProductNameValid,
        isAssetNameExists,
        listProjects,
        listCampaigns,
        clientAssetTypes,
        isModalOpen,
        chooseAssetModal,
        selectedIndexes,
        selectedButton,
        handleNext,
        selectAssetType,
        closeModal,
        closeAssetModal,
        onChangeAssetDetails,
        handleShowPopup,
        onSelect,
        assetDetails,
        dashboardAssets,
        projectName: assetDetails.project_name,
        handleChangeAssetDetails,
        pendingApproval,
        userRole,
        getListProjects,
        getAssetTypes,
        getAssetAllAtDashboard,
        getPendingApproval,
    };
};