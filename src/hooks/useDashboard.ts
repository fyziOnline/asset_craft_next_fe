import moment from 'moment';
import Cookies from 'js-cookie';
import { urls } from '@/apis/urls';
import { useLoading } from '@/components/global/Loading/LoadingContext';
import { ApiService } from '@/lib/axios_generic';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { nkey } from '@/data/keyStore';
import { useRouter } from 'next/navigation';
import { ListTypePage } from '@/data/dataGlobal';
import { debounce } from 'lodash';
import { DropDownOptions } from '@/components/global/DropDown';
import { useAppData } from '@/context/AppContext';
import { AllAssetsTypeProps, AssetDetails, AssetsProps, CampaignsProps, ClientAssetTypeProps, UserDetailsProps } from '@/types/asset';

export const useDashboard = () => {
    const [clientAssetTypes, setClientAssetTypes] = useState<ClientAssetTypeProps[]>([])
    const { setShowLoading } = useLoading()
    const { setContextData, setError } = useAppData();
    const router = useRouter();
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
    const campaignIDRef = useRef("")
    const isCampaignSelect = useRef(false)

    const [assetDetails, setAssetDetails] = useState<AssetDetails>({
        project_name: '',
        campaign_name: '',
        asset_name: ''
    })

    const [dashboardAssets, setDashboardAssets] = useState<AllAssetsTypeProps[]>([])
    const [userDetails, setUserDetails] = useState<UserDetailsProps | null>(null);

    const userRole = Cookies.get(nkey.userRole)

    useEffect(() => {
        getListProjects()
        getAssetTypes()
        getUserDetails()
        getAssetAllAtDashboard()
        getPendingApproval()
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
            setShowLoading(true)

            const client_ID = Cookies.get(nkey.client_ID)
            const res = await ApiService.get<any>(`${urls.clientAssetType_select_all}?clientID=${client_ID}`);
            if (res.isSuccess) {
                setClientAssetTypes([{ assetTypeName: "All in One" }, ...res.clientAssetTypes])
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
            setContextData({ isRegenerateHTML: false, stepGenerate: 0 })

            if (selectedButton?.assetTypeName.includes("Email")) {
                router.push(`my-projects/${assetDetails.project_name}/${assetDetails.campaign_name}/${ListTypePage.Email}?asset_name=${assetDetails.asset_name}&assetTypeID=${selectedButton.assetTypeID}&campaignID=${campaignIDRef.current}&isCampaignSelect=${isCampaignSelect.current}`)
            } else if (selectedButton?.assetTypeName.includes('Landing')) {
                router.push(`my-projects/${assetDetails.project_name}/${assetDetails.campaign_name}/${ListTypePage.LandingPage}?asset_name=${assetDetails.asset_name}&assetTypeID=${selectedButton.assetTypeID}&campaignID=${campaignIDRef.current}&isCampaignSelect=${isCampaignSelect.current}`)
            } else if (selectedButton?.assetTypeName.includes('LinkedIn')) {
                router.push(`my-projects/${assetDetails.project_name}/${assetDetails.campaign_name}/${ListTypePage.LinkedIn}?asset_name=${assetDetails.asset_name}&assetTypeID=${selectedButton.assetTypeID}&campaignID=${campaignIDRef.current}&isCampaignSelect=${isCampaignSelect.current}`)
            }
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

    const getUserDetails = async () => {
        try {
            const userID = Cookies.get(nkey.userID)

            if (!userID) {
                Cookies.remove(nkey.auth_token);
                Cookies.remove(nkey.email_login);
                Cookies.remove(nkey.client_ID);
                Cookies.remove(nkey.userID);
                Cookies.remove(nkey.userRole);
                return false;
            }

            const response = await ApiService.get<any>(`${urls.getuserDetails}?userProfileId=${userID}`)
            if (response.isSuccess) {
                setUserDetails(response.userProfile)
            }
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
            return false
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
            const response = await ApiService.post<any>(`${urls.getAssetsToApprove}`, {
                assignedTo: Cookies.get('userRole') === 'Approver' ? 1 : 0
            })

            if (response.isSuccess) {
                setPendingApproval(response.assets)
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
        userDetails,
        pendingApproval,
        userRole
    };
};