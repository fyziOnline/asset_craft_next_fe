"use client"

import React, { useEffect } from "react";
import { ErrorIcon } from '@/assets/icons/AppIcons'
import { useRouter } from "next/navigation";
import { useAppData } from "@/context/AppContext";
import Cookies from 'js-cookie'; 
import { nkey } from "@/data/keyStore";

interface ErrorPopupProps {
    title?: string;
    message?: string;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ title = "Error" }) => {
    const router = useRouter();
    const { error , setError } = useAppData();

    if(!error.showError) return null

    const errorTitle = error.status === 401 || error.status === 403 ? "Session Expired" : title;
    const buttonText = error.status === 401 || error.status === 403 ? "LOGIN AGAIN" : "TRY AGAIN";

    useEffect(() => {
        const accessToken = Cookies.get(nkey.auth_token);

        if (!accessToken) {
            router.push("/")
            setError({ showError: false, status: 0, message: '' });
        }

    },[])

    const handleclick = () => {
        if (error.status === 401 || error.status === 403) {
            setError({ showError: false, status: 0, message: '' })
            router.push("/");
        } else {
            setError({ showError: false, status: 0, message: '' });
            router.back();
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-[999] overflow-hidden">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                <div className="flex items-center justify-center">
                    <ErrorIcon />
                </div>
                <div className="flex items-center justify-center mt-4 text-2xl flex-col">
                    <p className="font-semibold tracking-wide">Whoops,</p>
                    <p className="font-semibold tracking-wide">{errorTitle}</p>
                </div>
                <p className="text-[#969696] mt-2 tracking-wide text-wrap text-center">{error.message}</p>
                <div className="flex items-center justify-center">
                    <button onClick={handleclick} className="mt-6 px-14 py-2 bg-red-600 text-white rounded-full hover:bg-red-700">
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPopup;
