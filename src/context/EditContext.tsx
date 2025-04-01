"use client"

import { editData, EditContextType } from '@/types/appContext';
import { createContext, useContext, useState, ReactNode, FC, useEffect } from 'react'

interface EditContextProviderProps {
    children: ReactNode;
}


const INITIAL_APP_DATA: editData = {
    aiPrompt: {}
}


export const EditDataContext = createContext<EditContextType | undefined>(undefined);

export const EditContextProvider: FC<EditContextProviderProps> = ({ children }) => {
    const [editSection, setEditSection] = useState(INITIAL_APP_DATA);

    const updateEditSection = (data: Partial<editData>) => {
        setEditSection((prevData) => ({
           ...prevData,
           ...data,
        }));
    }

    useEffect(() => {
        console.log("Edit Context Updated:", editSection);
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