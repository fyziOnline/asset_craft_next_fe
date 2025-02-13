import { useEffect, useState, useCallback, useRef } from 'react'
import { urls } from "@/apis/urls"
import { ApiService } from "@/lib/axios_generic"
import { useLoading } from '@/components/global/Loading/LoadingContext';
import { useAppData } from '@/context/AppContext';
import { CookieManager } from '@/utils/cookieManager';
import { useApiCache } from './useApiCache';

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
    const { setShowLoading } = useLoading();
    const { setError } = useAppData();
    const mountedRef = useRef(false);

    const fetchUserDetails = useCallback(async () => {
        const userID = CookieManager.getUserId();
        if (!userID) throw new Error('No user ID found');

        const response = await ApiService.get<any>(`${urls.getuserDetails}?userProfileId=${userID}`);
        if (!response.isSuccess) {
            throw new Error('Failed to fetch user details');
        }
        return response.userProfile as UserDetailsProps;
    }, []);

    const { 
        data: userDetails, 
        isLoading, 
        refetch 
    } = useApiCache<UserDetailsProps>(
        'userProfile',
        fetchUserDetails,
        []
    );

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        setShowLoading(isLoading);
    }, [isLoading, setShowLoading]);

    const updateUserDetails = async (data: Partial<UserDetailsProps>) => {
        setShowLoading(true);
        try {
            const response = await ApiService.put<any>(urls.updateuserDetails, data);
            if (response.isSuccess) {
                await refetch();
                return true;
            }
            return false;
        } catch (error) {
            const apiError = ApiService.handleError(error);
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            });
            return false;
        } finally {
            if (mountedRef.current) {
                setShowLoading(false);
            }
        }
    };

    const updateUserProfile = async (data: any) => {
        setShowLoading(true);
        try {
            const response = await ApiService.put<any>(urls.userImageUpdate, data);
            if (response.isSuccess) {
                await refetch();
                return true;
            }
            return false;
        } catch (error) {
            const apiError = ApiService.handleError(error);
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            });
            return false;
        } finally {
            if (mountedRef.current) {
                setShowLoading(false);
            }
        }
    };

    return {
        userDetails: userDetails || null,
        updateUserDetails,
        updateUserProfile
    };
};


