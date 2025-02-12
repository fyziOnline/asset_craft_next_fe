import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { ApiService } from '@/lib/axios_generic';
import { nkey } from '@/data/keyStore';
import { urls } from '@/apis/urls';
import { useAppData } from '@/context/AppContext';

interface ResLoginProps {
    isSuccess: boolean,
    twoFactorToken: string
}

export const useLogin = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpVisible, setIsOtpVisible] = useState(false);
    const [emailLoginDefault, setEmailLoginDefault] = useState("");
    const emailRef = useRef("");
    const loginRef = useRef<ResLoginProps>();
    const otpRef = useRef("");
    const { setError } = useAppData()
    const [isResending, setIsResending] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

    useEffect(() => {
        const email_login = Cookies.get(nkey.email_login);
        emailRef.current = email_login as string
        setEmailLoginDefault(email_login as string)
    }, [])

    const handleResendOtp = async () => {
        setIsResending(true);
        await handleLogin(true);
        setIsResending(false);
    };

    const handleLogin = async (skipLoading = false) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        try {
            if (emailRef.current.trim().length === 0 || !emailRegex.test(emailRef.current)) {
                return;
            }

            if (!skipLoading) {
                setIsLoading(true);
            }


            const resLogin = await ApiService.post<any>(urls.login, {
                "email": emailRef.current
            });

            if (resLogin.isSuccess) {
                Cookies.set(nkey.email_login, emailRef.current, { expires: 180 });
                loginRef.current = resLogin
                setIsOtpVisible(true);
            }
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
        } finally {
            if (!skipLoading) {
                setIsLoading(false);
            }
        }
    }

    const handleOtpSubmit = async () => {
        if (otpRef.current.trim().length === 0) {
            alert("Please enter OTP code.");
            return;
        }

        try {
            setIsVerifyingOtp(true);

            const resToken = await ApiService.post<any>(urls.finalise, {
                "twoFactorToken": loginRef.current?.twoFactorToken,
                "otp": otpRef.current
            });

            if (resToken.isSuccess) {
                const decodedToken: any = jwtDecode(resToken.accessToken);
                const { UserID, UserRole } = decodedToken;

                Cookies.set(nkey.userID, UserID, { expires: 180 });
                Cookies.set(nkey.userRole, UserRole, { expires: 180 });
                Cookies.set(nkey.auth_token, resToken.accessToken, { expires: 180 });
                Cookies.set(nkey.refresh_token, resToken.refreshToken, { expires: 180 });
                Cookies.set(nkey.refresh_token_expiry, resToken.refreshTokenExpiryTime, { expires: 180 });

                const resClientID = await ApiService.get<any>(urls.client_select_all, {});

                if (resClientID.isSuccess && resClientID.clients.length > 0) {
                    Cookies.set(nkey.client_ID, resClientID.clients[0].clientID, { expires: 180 });
                    router.push('/dashboard');
                } else {
                    Cookies.remove(nkey.auth_token);
                    Cookies.remove(nkey.refresh_token);
                    Cookies.remove(nkey.refresh_token_expiry);
                    alert("Failed to get client information!");
                }
            } else {
                alert("OTP code is incorrect!");
            }
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
        } finally {
            setIsVerifyingOtp(false);
        }
    }

    const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        emailRef.current = e.target.value;
    }

    const onChangeOtp = (e: ChangeEvent<HTMLInputElement>) => {
        otpRef.current = e.target.value;
    }

    const handleCancelOtp = () => {
        setIsOtpVisible(false);
        otpRef.current = ""
    }

    const checkIsUserAuthorized = (): boolean => {
        const accessToken = Cookies.get(nkey.auth_token);
        return !!accessToken;
    }

    return {
        emailLoginDefault,
        isLoading,
        isVerifyingOtp,
        isResending,
        isOtpVisible,
        handleLogin,
        onChangeEmail,
        handleOtpSubmit,
        onChangeOtp,
        handleResendOtp,
        handleCancelOtp,
        checkIsUserAuthorized
    };
};
