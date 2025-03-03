import { urls } from "@/apis/urls"
import { ApiService } from "@/lib/axios_generic"
import { Dimension, GetVisualLibraryQuery } from "@/types/visualLibrary"
import { buildQueryString } from "@/utils/helperApiCall"
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

    const createMediaAssetVersion = async (queryParams:Dimension,visualID:string) => {
        const query = buildQueryString(queryParams)
        try {
            const  response = await ApiService.post<any>(`${urls.get_visual_media_library}/${visualID}/generate-version?${query}`)
            return response
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setVLibraryCallError({
                status : apiError.statusCode,
                message : apiError.message,
                showError : true
          })
        } 
    }

    const getSingleVisualMediaAsset = async (visualID:string) => {
        try {
            const response = await ApiService.get<any>(`${urls.get_visual_media_library}/${visualID}`)
            console.log('resposnse :',response);
            return response
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setVLibraryCallError({
                status : apiError.statusCode,
                message : apiError.message,
                showError : true
          })
        } 
    }

    return {
        vLibraryCallLoading,
        vLibraryCallError,
        getVisualLibrary,
        createMediaAssetVersion,
        getSingleVisualMediaAsset
    }
}