"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import Button from '../Button';

type YesNoPopupContextType = {
    isOpen: boolean;
    title: string;
    message: string;
    onYes?: () => void;
    onNo?: () => void;
    openPopup: (
        title: string,
        message: string,
        yesText?: string,
        noText?: string,
        onYes?: () => void,
        onNo?: () => void
    ) => void;
    closePopup: () => void;
};

const YesNoPopupContext = createContext<YesNoPopupContextType | undefined>(undefined);

export const YesNoPopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [onYes, setOnYes] = useState<(() => void) | undefined>(undefined);
    const [onNo, setOnNo] = useState<(() => void) | undefined>(undefined);
    const [yesText, setYesText] = useState('Yes');
    const [noText, setNoText] = useState('No');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    const openPopup = (
        title: string,
        message: string,
        yesText: string = 'Yes',
        noText: string = 'No',
        onYes?: () => void,
        onNo?: () => void
    ) => {
        setTitle(title);
        setMessage(message);
        setYesText(yesText);
        setNoText(noText);
        setOnYes(() => onYes);
        setOnNo(() => onNo);
        setIsOpen(true);
    };

    const closePopup = () => {
        setIsOpen(false);
        setTitle('');
        setMessage('');
        setYesText('Yes');
        setNoText('No');
        setOnYes(undefined);
        setOnNo(undefined);
    };

    return (
        <YesNoPopupContext.Provider
            value={{ isOpen, title, message, onYes, onNo, openPopup, closePopup }}
        >
            {children}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-lg font-semibold mb-4">{title}</h2>
                        <p className="text-sm text-gray-700 mb-6">{message}</p>
                        <div className="flex justify-end gap-4">
                            <Button
                                buttonText={noText}
                                showIcon={false}
                                textStyle='text-[1rem] font-base text-[#00A881]'
                                backgroundColor={"bg-[#B1B1B1]"}
                                handleClick={() => {
                                    onNo?.();
                                    closePopup();
                                }}
                                customClass='static  px-[1.4rem] py-2 group-hover:border-white gap-0' />
                            <Button
                                buttonText={yesText}
                                showIcon={false}
                                textStyle='text-[1rem] font-base text-[#00A881]'
                                backgroundColor={"bg-custom-gradient-green"}
                                handleClick={() => {
                                    onYes?.();
                                    closePopup();
                                }}
                                customClass='static px-[1.4rem] py-2 group-hover:border-white gap-0' />
                        </div>
                    </div>
                </div>
            )}
        </YesNoPopupContext.Provider>
    );
};

export const useYesNoPopup = () => {
    const context = useContext(YesNoPopupContext);
    if (!context) {
        throw new Error('usePopup must be used within a PopupProvider');
    }
    return context;
}
