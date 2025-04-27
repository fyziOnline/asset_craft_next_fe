"use client"

import { EditData, EditContextType } from '@/types/appContext';
import { createContext, useContext, useState, ReactNode, FC, useEffect } from 'react'

import {  } from '@/types/templates';

interface EditContextProviderProps {
    children: ReactNode;
}


const INITIAL_APP_DATA: EditData = {
    aiPrompt: {},
    templateData: {},
}


export const EditDataContext = createContext<EditContextType | undefined>(undefined);

export const EditContextProvider: FC<EditContextProviderProps> = ({ children }) => {
    const [editSection, setEditSection] = useState(INITIAL_APP_DATA);

    const updateEditSection = (data: Partial<EditData>) => {
        setEditSection((prevData) => ({
           ...prevData,
           ...data,
        }));
    }

    useEffect(() => {
    }, [editSection]);

    return (
        <EditDataContext.Provider
            value={{
                editSection,
                setEditSection: updateEditSection,
            }}
        >
            {children}
        </EditDataContext.Provider>
    )
}

export const useEditData = () => {
    const context = useContext(EditDataContext)
    if (!context) {
        throw new Error('useEditData must be used within an EditContextProvider')
    }

    return context;
}