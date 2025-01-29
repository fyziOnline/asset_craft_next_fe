import { useAppData } from '@/context/AppContext'
import { ApiService } from '@/lib/axios_generic'
import React, { useEffect, useState } from 'react'
import { urls } from "@/apis/urls"
import { nkey } from "@/data/keyStore"
import Cookies from 'js-cookie';

interface UserDetailsProps {
    userID: string;
    name: string;
    email: string;
    company: string;
    country: string;
    timeZone: string;
    userRole: string;
    isActive: number;
}


const useHeader = () => {
    const { setError } = useAppData()
    const [userDetails, setUserDetails] = useState<UserDetailsProps | null>(null);

    useEffect(() => {
        getUserDetails()
    }, [])

    const getUserDetails = async () => {
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
        }
    }

    return { userDetails }


}

export default useHeader