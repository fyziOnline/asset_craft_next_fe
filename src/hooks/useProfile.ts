import { useEffect, useState } from 'react'
import { urls } from "@/apis/urls"
import { nkey } from "@/data/keyStore"
import { ApiService } from "@/lib/axios_generic"
import Cookies from 'js-cookie';
import { useLoading } from '@/components/global/Loading/LoadingContext';
import { useAppData } from '@/context/AppContext';


interface UserDetailsProps {
    userID: string;
    name: string;
    email: string;
    company: string;
    country: string;
    timeZone: string;
    userRole: string;
    isActive: number;
    fileUrl: string;
}

export const useProfile = () => {
    const { setShowLoading } = useLoading()
    const { setError } = useAppData()
    const [userDetails, setUserDetails] = useState<UserDetailsProps | null>(null);

    useEffect(() => {
        getUserDetails()
    }, [])

    const getUserDetails = async () => {
        setShowLoading(true)
        try {
            const userID = Cookies.get(nkey.userID)
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
        } finally {
            setShowLoading(false)
        }
    }


    const updateUserDetails = async (data: any) => {
        setShowLoading(true)
        try {
            const response = await ApiService.put<any>(urls.updateuserDetails , data)

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
        } finally {
            setShowLoading(false)
        }
    }

    const updateUserProfile = async (data: any) => {
        setShowLoading(true)

        try {
            const response = await ApiService.put<any>(urls.userImageUpdate ,data)

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
        userDetails,
        updateUserDetails,
        updateUserProfile
    }
}


