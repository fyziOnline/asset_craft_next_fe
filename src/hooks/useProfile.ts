import { useEffect, useState } from 'react'
import { urls } from "@/apis/urls"
import { nkey } from "@/data/keyStore"
import { ApiService } from "@/lib/axios_generic"
import Cookies from 'js-cookie';
import { useLoading } from '@/components/global/Loading/LoadingContext';


interface UserDetailsProps {
    userID: string;
    name: string;
    email: string;
    userRole: string;
    isActive: number;
}

export const useProfile = () => {
    const { setShowLoading } = useLoading()
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
            alert(ApiService.handleError(error))
            return false
        } finally {
            setShowLoading(false)
        }
    }

    return {
        userDetails
    }
}


