import { urls } from "@/apis/urls"
import { useLoading } from "@/components/global/Loading/LoadingContext"
import { useAppData } from "@/context/AppContext"
import { ApiService } from "@/lib/axios_generic"
import { AllUserAssignedProps } from "@/types/asset"
import { useEffect, useState } from "react"

interface useGetAssetProps {
    assignedTo: number
}

export const useGetAsset = ({ assignedTo = 0 }: useGetAssetProps) => {
    const { setShowLoading } = useLoading()
    const { setError } = useAppData()
    const [listAssets, setListAssets] = useState<AllUserAssignedProps[]>([])

    useEffect(() => {
        getAssetData()
    }, [])

    const getAssetData = async () => {
        setShowLoading(true)
        try {
            const response = await ApiService.post<any>(`${urls.getAssetsToApprove}`, {
                assignedTo: assignedTo
            })

            if (response.isSuccess) {
                setListAssets(response.assets as AllUserAssignedProps[])
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
        listAssets
    }
};