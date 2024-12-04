"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import LoadingOverlay from './LoadingOverlay';

interface LoadingContextType {
    showLoading: boolean;
    setShowLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [showLoading, setShowLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ showLoading, setShowLoading }}>
            {children}
            <LoadingOverlay loading={showLoading} />
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
