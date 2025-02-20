import { urls } from "@/apis/urls"
import { ApiService } from "@/lib/axios_generic"
import { buildQueryString, GetVisualLibraryQuery } from "@/utils/helperApiCall"
import { useState } from "react"


export const useEditAssetSection = () => {
    const [vLibraryCallLoading,setVLibraryCallLoading] = useState<Boolean>(false)
    const [vLibraryCallError,setVLibraryCallError] = useState<{} | null>(null)

    const getVisualLibrary = async (queryParams:GetVisualLibraryQuery) => {
        setVLibraryCallLoading(true)
        const query = buildQueryString(queryParams)
        try {
            const response = await ApiService.get<any>(`${urls.get_visual_media_library}?${query}`)
            if (response.isSuccess) {
                return response.items
            }
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setVLibraryCallError({
                status : apiError.statusCode,
                message : apiError.message,
                showError : true
          })
        } finally {
            setVLibraryCallLoading(false)
        }
    }

    return {
        vLibraryCallLoading,
        vLibraryCallError,
        getVisualLibrary
    }
}