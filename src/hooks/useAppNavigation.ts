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
        addPath(pathName);
    }, [pathName, addPath])

    const navigateToPreviousPage = () => {
        const previousPath = getPreviousPath();

        if (previousPath) {
            router.push(previousPath)
        } else {
            router.push("/");
        }
    };

    return { navigateToPreviousPage }
};