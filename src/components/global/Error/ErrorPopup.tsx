"use client"

import React, { useCallback, useEffect } from "react";
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
    const { error, setError } = useAppData();

    if (!error.showError) return null

    const isAuthError = error.status === 401 || error.status === 403;
    const errorTitle = isAuthError ? "Session Expired" : title;
    const buttonText = isAuthError ? "LOGIN AGAIN" : "TRY AGAIN";

    const clearCookies = useCallback(() => {
        const cookiesToClear = [
            nkey.auth_token,
            nkey.email_login,
            nkey.client_ID,
            nkey.userID,
            nkey.userRole
        ];

        cookiesToClear.forEach(cookie => Cookies.remove(cookie));
    }, []);

    // Helper function to reset error state
    const resetError = useCallback(() => {
        setError({ showError: false, status: 0, message: '' });
    }, [setError]);

    useEffect(() => {
        const accessToken = Cookies.get(nkey.auth_token);
        if (!accessToken) {
            resetError();
            clearCookies();
            router.push("/");
        }
    }, [clearCookies, resetError, router]);

    const handleClick = useCallback(() => {
        if (isAuthError) {
          resetError();
          clearCookies();
          router.push("/");
        } else {
          resetError();
          router.back();
        }
      }, [isAuthError, clearCookies, resetError, router]);

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
                    <button onClick={handleClick} className="mt-6 px-14 py-2 bg-red-600 text-white rounded-full hover:bg-red-700">
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPopup;
