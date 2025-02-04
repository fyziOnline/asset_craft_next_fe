"use client";

import React, { createContext, useContext, useState, ReactNode, FC } from 'react';
import LoadingOverlay from './LoadingOverlay';

type LoadingContextType = {
    showLoading: boolean;
    setShowLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [showLoading, setShowLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ showLoading, setShowLoading }}>
            {showLoading && <LoadingOverlay loading={showLoading} />}
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
