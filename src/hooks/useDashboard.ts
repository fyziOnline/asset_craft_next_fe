import moment from 'moment';
import Cookies from 'js-cookie';
import { urls } from '@/apis/urls';
import { useLoading } from '@/components/global/Loading/LoadingContext';
import { ApiService } from '@/lib/axios_generic';
import { ChangeEvent, useEffect, useRef, useState, useCallback } from 'react';
import { nkey } from '@/data/keyStore';
import { useRouter } from 'next/navigation';
import { ListTypePage } from '@/data/dataGlobal';
import { debounce } from 'lodash';
import { DropDownOptions } from '@/components/global/DropDown';
import { useAppData } from '@/context/AppContext';
import { AllAssetsTypeProps, AssetDetails, AssetsProps, CampaignsProps, ClientAssetTypeProps, UserDetailsProps } from '@/types/asset';
import { useApiCache } from './useApiCache';
import { CookieManager } from '@/utils/CookieManager';

export const useDashboard = () => {
    const { setShowLoading } = useLoading();
    const { setContextData, setError } = useAppData();
    const router = useRouter();
    const mountedRef = useRef(false);

    // States that need to persist
    const [clientAssetTypes, setClientAssetTypes] = useState<ClientAssetTypeProps[]>([]);
    const [selectedButton, setSelectedButton] = useState<ClientAssetTypeProps>();
    const userRole = CookieManager.getUserRole();

    // Use API cache for dashboard data
    const { 
        data: dashboardAssets,
        isLoading: isDashboardLoading 
    } = useApiCache<AllAssetsTypeProps[]>(
        'dashboardAssets',
        async () => {
            const response = await ApiService.get<any>(`${urls.getAssetsAllDashboard}?timePeriod=${90}`);
            if (!response.isSuccess) throw new Error('Failed to fetch dashboard assets');
            return response.assets;
        },
        []
    );

    // Use API cache for pending approvals
    const { 
        data: pendingApproval,
        isLoading: isApprovalLoading 
    } = useApiCache<any[]>(
        'pendingApproval',
        async () => {
            const response = await ApiService.post<any>(urls.getAssetsToApprove, {
                assignedTo: CookieManager.getUserRole() === 'Approver' ? 1 : 0
            });
            if (!response.isSuccess) throw new Error('Failed to fetch pending approvals');
            return response.assets;
        },
        []
    );

    // Use API cache for asset types
    const { 
        data: fetchedAssetTypes,
        isLoading: isAssetTypesLoading 
    } = useApiCache<ClientAssetTypeProps[]>(
        'assetTypes',
        async () => {
            const clientId = CookieManager.getClientId();
            const response = await ApiService.get<any>(`${urls.clientAssetType_select_all}?clientID=${clientId}`);
            if (!response.isSuccess) throw new Error('Failed to fetch asset types');
            return response.clientAssetTypes;
        },
        []
    );

    // Update loading state
    useEffect(() => {
        const isLoading = isDashboardLoading || isApprovalLoading || isAssetTypesLoading;
        setShowLoading(isLoading);
    }, [isDashboardLoading, isApprovalLoading, isAssetTypesLoading, setShowLoading]);

    // Update client asset types when data is fetched
    useEffect(() => {
        if (fetchedAssetTypes) {
            setClientAssetTypes([{ assetTypeName: "All in One" }, ...fetchedAssetTypes]);
        }
    }, [fetchedAssetTypes]);

    // Component mounted state
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const selectAssetType = useCallback(async (item: ClientAssetTypeProps) => {
        setSelectedButton(item);
        router.push(`generate-asset?asset-type=${item?.assetTypeName}&assetTypeID=${item.assetTypeID}`);
    }, [router]);

    return {
        clientAssetTypes,
        selectAssetType,
        dashboardAssets: dashboardAssets || [],
        pendingApproval: pendingApproval || [],
        userRole,
        isLoading: isDashboardLoading || isApprovalLoading || isAssetTypesLoading
    };
};