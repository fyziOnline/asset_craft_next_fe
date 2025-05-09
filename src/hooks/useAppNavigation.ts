"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useNavigationStore } from "@/store/navigationStore";

export const useAppNavigation = () => {
    const router = useRouter();
    const pathName = usePathname();

    const { addPath, getPreviousPath } = useNavigationStore();

    // Record the current path on mount
    useEffect(() => {
        console.log('[useAppNavigation] Current path:', pathName);
        addPath(pathName);
    }, [pathName, addPath])

    const navigateToPreviousPage = () => {
        const previousPath = getPreviousPath();
        console.log('[useAppNavigation] Retrieved previous path:', previousPath);

        if (previousPath) {
            console.log('[useAppNavigation] Navigating to:', previousPath);
            router.push(previousPath)
        } else {
            console.log('[useAppNavigation] No previous path found. Navigating to root.');
            router.push("/dashboard");
        }
    };

    return { navigateToPreviousPage }
};