import useHeader from './useHeader';
import { urls } from "@/apis/urls"
import { ApiService } from "@/lib/axios_generic"
import { useLoading } from '@/components/global/Loading/LoadingContext';
import { useAppData } from '@/context/AppContext';
import { useState } from 'react';

export const useProfile = () => {
    const { setShowLoading } = useLoading()
    const { getUserDetails } = useHeader()
    const { setError, setUserDetails } = useAppData()
    const [updatingUserDetails, setUpdatingUserDetails] = useState<boolean>(false)

    const updateUserDetails = async (data: any) => {
        setShowLoading(true)
        setUpdatingUserDetails(true)
        try {
            const response = await ApiService.put<any>(urls.updateuserDetails, data)

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
        } finally {
            setShowLoading(false)
            setUpdatingUserDetails(false)
        }
    }

    const changeProfilePhoto = async (data: any) => {
        setShowLoading(true)
        try {
            const response = await ApiService.put<any>(urls.userImageUpdate, data)

            if (response.isSuccess) {
                await getUserDetails()
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
        finally {
            setShowLoading(false)
        }
    }

    return {
        updateUserDetails,
        changeProfilePhoto,
        updatingUserDetails
    }
}


