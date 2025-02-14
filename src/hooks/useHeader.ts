import Cookies from 'js-cookie';
import { useAppData } from '@/context/AppContext'
import { ApiService } from '@/lib/axios_generic'
import { urls } from "@/apis/urls"
import { nkey } from "@/data/keyStore"

const useHeader = () => {
    const { setError, setUserDetails } = useAppData()

    const getUserDetails = async () => {        
        const userID = Cookies.get(nkey.userID)
        try {
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

    return { 
        getUserDetails
     }

}

export default useHeader