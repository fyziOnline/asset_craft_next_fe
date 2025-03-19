import useHeader from './useHeader';
import { urls } from "@/apis/urls"
import { ApiService } from "@/lib/axios_generic"
import { useLoading } from '@/components/global/Loading/LoadingContext';
import { useAppData } from '@/context/AppContext';
import { useState } from 'react';
import { UserDetailsProps } from '@/types/asset';

interface UserProfileUpdateRequest {
    userID: string;
    name: string;
    userRole: string;
    country?: string;
    company?: string;
    timeZone?: string;
    isActive: number;
    preferredLLMModelID?: string;
}

interface UserProfileResponse {
    isSuccess: boolean;
    userProfile: UserDetailsProps;
}

interface UserImageUpdateRequest {
    userID: string;
    originalImageName: string;
    imageAsBase64String: string;
}

export const useProfile = () => {
    const { setShowLoading } = useLoading()
    const { getUserDetails } = useHeader()
    const { setError, setUserDetails } = useAppData()
    const [updatingUserDetails, setUpdatingUserDetails] = useState<boolean>(false)

    const updateUserDetails = async (data: UserProfileUpdateRequest) => {
        setShowLoading(true)
        setUpdatingUserDetails(true)
        try {
            const response = await ApiService.put<UserProfileResponse>(urls.updateuserDetails, data)

            if (response.isSuccess) {
                setUserDetails(response.userProfile)
            }
            return true
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

    const changeProfilePhoto = async (data: UserImageUpdateRequest) => {
        setShowLoading(true)
        try {
            const response = await ApiService.put<UserProfileResponse>(urls.userImageUpdate, data)

            if (response.isSuccess) {
                await getUserDetails()
                return true
            }
            return false
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


