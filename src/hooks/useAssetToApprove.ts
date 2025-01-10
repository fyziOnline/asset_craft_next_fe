import { urls } from "@/apis/urls"
import { useLoading } from "@/components/global/Loading/LoadingContext"
import { useAppData } from "@/context/AppContext"
import { ApiService } from "@/lib/axios_generic"
import { useEffect, useState } from "react"

interface AssetToApproveProps {
    projectName: string;
    campaignName: string;
    assetName: string;
    assetTypeName: string;
    modifiedOn: string;
    createdOn: string;
}

export const useAssetToApprove = () => {
    const { setShowLoading } = useLoading()
    const { setError } = useAppData()
    const [assetToApprove, setAssetToApprove] = useState<AssetToApproveProps[]>([])

    useEffect(() => {
        getAssetToApproveData()
    }, [])

    const getAssetToApproveData = async () => {
        setShowLoading(true)

        try {
            const response = await ApiService.post<any>(`${urls.getAssetsToApprove}`, {
                assignedTo: 1
            })

            if (response.isSuccess) {
                setAssetToApprove(response.assets)
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
        assetToApprove
    }
}