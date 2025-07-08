"use client";

import React, { createContext, useContext, useState, ReactNode, FC } from 'react';
import LoadingOverlay from './LoadingOverlay';
import { usePathname } from 'next/navigation';

type LoadingContextType = {
    showLoading: boolean;
    setShowLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [showLoading, setShowLoading] = useState(false);
    const pathname = usePathname()

    const hideLoadingRoutes = ['/dashboard', '/asset-in-progress', '/assets-under-review', '/assets-to-approve', '/completed-assets']
    const shouldHideLoading = hideLoadingRoutes.includes(pathname)

    return (
        <LoadingContext.Provider value={{ showLoading, setShowLoading }}>
            {!shouldHideLoading && showLoading && (
                <LoadingOverlay loading={showLoading} />
            )}
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
