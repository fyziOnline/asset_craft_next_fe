import { urls } from "@/apis/urls"
import { useLoading } from "@/components/global/Loading/LoadingContext"
import { useAppData } from "@/context/AppContext"
import { ApiService } from "@/lib/axios_generic"
import { AllUserAssignedProps } from "@/types/asset"
import { useEffect, useState } from "react"

export const useAssetInProgress = () => {
    const { setShowLoading } = useLoading()
    const { setError } = useAppData()
    const [assetInProgress, setAssetInProgress] = useState<AllUserAssignedProps[]>([])

    useEffect(() => {
        getAssetInProgressData()
    }, [])

    const getAssetInProgressData = async () => {
        setShowLoading(true)
        try {
            const response = await ApiService.post<any>(`${urls.getAssetsToApprove}`, {
                assignedTo: 0
            })

            if (response.isSuccess) {
                setAssetInProgress(response.assets as AllUserAssignedProps[])
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
        assetInProgress
    }
}
