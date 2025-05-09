"use client";

import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useNavigationStore } from "@/store/navigationStore";

export const useAppNavigation = () => {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();

    
    const { addPath, getPreviousPath } = useNavigationStore();
    
    const fullUrl = searchParams.toString() ? `${pathName}?${searchParams.toString()}` : pathName;
    
    console.log('[useAppNavigation] History:', useNavigationStore.getState().history);
    
    // Record the current path on mount
    useEffect(() => {
        addPath(fullUrl);
    }, [fullUrl, addPath])

    const navigateToPreviousPage = () => {
        const previousPath = getPreviousPath();
        console.log('[useAppNavigation] Retrieved previous path:', previousPath);

        if (previousPath) {
            router.push(previousPath)
        } else {
            router.push("/dashboard");
        }
    };

    return { navigateToPreviousPage }
};