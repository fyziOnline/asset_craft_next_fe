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

const ErrorPopup: React.FC<ErrorPopupProps> = ({ title = "Error",message }) => {
    const router = useRouter();
    const { error, setError } = useAppData();

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
        if (error.showError) {
            const accessToken = Cookies.get(nkey.auth_token);
            if (!accessToken && (error.status === 401 || error.status === 403)) {
                setTimeout(() => {
                    resetError();
                    clearCookies();
                    router.push("/");
                }, 3000); // 3 seconds delay
            }
        }
    }, [error.showError, error.status, clearCookies, resetError, router]);


    const handleClick = useCallback(() => {
        if (isAuthError) {
            resetError();
            clearCookies();
            router.push("/");
        } else {
            resetError();
            // router.back();
        }
    }, [isAuthError, clearCookies, resetError, router]);

     if (!error.showError) return null;


    const getErrorMessage = () => {

        if (error.message === "Network Error" || error.status === 0) {
            return "Please check your internet connection.";
        }
    
        if (error.status >= 500) {
            return "Server glitch, please try again after some time.";
        }
    
        if (error.status === 404) {
            return "not found.";
        }
    
        if (isAuthError) {
            return "Your session has expired. Please login again.";
        }
    
        return error.message || "Something went wrong. Please try again.";
    };
    

    const getErrorTitle = () => {
        if (isAuthError) return "Session Expired";
        if (error.status === 404) return "Screen Not Found";
        if (error.status >= 500) return "Server Error";
        if (error.message === "Network Error" || error.status === 0) return "Network Error";
        return title;
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-[999] overflow-hidden">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                <div className="flex items-center justify-center">
                    <ErrorIcon />
                </div>
                <div className="flex items-center justify-center mt-4 text-2xl flex-col">
                    <p className="font-semibold tracking-wide">Whoops,</p>
                    <p className="font-semibold tracking-wide">{getErrorTitle()}</p>
                </div>
                <p className="text-[#969696] mt-2 tracking-wide text-wrap text-center">{getErrorMessage()}</p>
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
