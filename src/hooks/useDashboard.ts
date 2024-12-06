import { urls } from '@/apis/urls';
import { useLoading } from '@/components/global/Loading/LoadingContext';
import { ApiService } from '@/lib/axios_generic';
import { ChangeEvent, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { nkey } from '@/data/keyStore';
import { useRouter } from 'next/navigation';
import { ListTypePage } from '@/data/dataGlobal';

interface ClientAssetTypeProps {
    clientAssetTypeID?: string,
    clientID?: string,
    assetTypeID?: string,
    isEnabled?: boolean,
    assetTypeName: string,
    description?: string
}


type AssetDetails = {
    project_name: string;
    campaign_name: string;
    asset_name: string;
};

export const useDashboard = () => {
    const [clientAssetTypes, setClientAssetTypes] = useState<ClientAssetTypeProps[]>([])
    const { setShowLoading } = useLoading()
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [chooseAssetModal, setChooseAssetModal] = useState<boolean>(false);
    const [selectedButton, setSelectedButton] = useState<ClientAssetTypeProps>()
    const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
    const [assetDetails, setAssetDetails] = useState<AssetDetails>({
        project_name: '',
        campaign_name: '',
        asset_name: ''
    })

    useEffect(() => {
        getAssetTypes()
    }, [])

    const getAssetTypes = async () => {
        try {
            setShowLoading(true)

            const client_ID = Cookies.get(nkey.client_ID)
            const res = await ApiService.get<any>(`${urls.clientAssetType_select_all}?clientID=${client_ID}`);
            // const res = {
            //     isSuccess: true,
            //     clientAssetTypes: [
            //         {
            //             "clientAssetTypeID": "b743c23c-a4ac-ef11-ac7b-0a9328dfcacd",
            //             "clientID": "a643c23c-a4ac-ef11-ac7b-0a9328dfcacd",
            //             "assetTypeID": "ab43c23c-a4ac-ef11-ac7b-0a9328dfcacd",
            //             "isEnabled": true,
            //             "assetTypeName": "Email",
            //             "description": "Email"
            //         },
            //         {
            //             "clientAssetTypeID": "b843c23c-a4ac-ef11-ac7b-0a9328dfcacd",
            //             "clientID": "a643c23c-a4ac-ef11-ac7b-0a9328dfcacd",
            //             "assetTypeID": "ac43c23c-a4ac-ef11-ac7b-0a9328dfcacd",
            //             "isEnabled": true,
            //             "assetTypeName": "Landing Page",
            //             "description": "Landing Page"
            //         },
            //         {
            //             "clientAssetTypeID": "b943c23c-a4ac-ef11-ac7b-0a9328dfcacd",
            //             "clientID": "a643c23c-a4ac-ef11-ac7b-0a9328dfcacd",
            //             "assetTypeID": "ad43c23c-a4ac-ef11-ac7b-0a9328dfcacd",
            //             "isEnabled": true,
            //             "assetTypeName": "LinkedIn Post",
            //             "description": "LinkedIn Post"
            //         }
            //     ]
            // }

            if (res.isSuccess) {
                setClientAssetTypes([{ assetTypeName: "All in One" }, ...res.clientAssetTypes])
            }
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            alert(ApiService.handleError(error));
        } finally {
            setShowLoading(false)
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

    const closeModal = () => setModalOpen(false);
    const closeAssetModal = () => setChooseAssetModal(false)

    const onChangeAssetDetails = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setAssetDetails(pre => ({
            ...pre,
            [name]: value
        }))

    }

    const handleNext = () => {
        if (selectedButton?.assetTypeName === "All in One") {
            setChooseAssetModal(true)
            setModalOpen(false)
        } else if (selectedButton?.assetTypeName.includes("Email")) {
            router.push(`my-projects/${assetDetails.project_name}/${assetDetails.campaign_name}/${ListTypePage.Email}?asset_name=${assetDetails.asset_name}&assetTypeID=${selectedButton.assetTypeID}`)
        } else if (selectedButton?.assetTypeName.includes('Landing')) {
            router.push(`my-projects/${assetDetails.project_name}/${assetDetails.campaign_name}/${ListTypePage.LandingPage}?asset_name=${assetDetails.asset_name}&assetTypeID=${selectedButton.assetTypeID}`)
        } else if (selectedButton?.assetTypeName.includes('LinkedIn')) {
            router.push(`my-projects/${assetDetails.project_name}/${assetDetails.campaign_name}/${ListTypePage.LinkedIn}?asset_name=${assetDetails.asset_name}&assetTypeID=${selectedButton.assetTypeID}`)
        }
    }

    return {
        clientAssetTypes,
        isModalOpen,
        chooseAssetModal,
        selectedIndexes,
        selectedButton,
        handleNext,
        closeModal,
        closeAssetModal,
        onChangeAssetDetails,
        handleShowPopup,
        onSelect
    };
};