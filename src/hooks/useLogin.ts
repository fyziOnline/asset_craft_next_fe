import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { ApiService } from '@/lib/axios_generic';
import { nkey } from '@/data/keyStore';
import { urls } from '@/apis/urls';
import { useAppData } from '@/context/AppContext';
import { CookieManager } from '@/utils/cookieManager';

interface ResLoginProps {
    isSuccess: boolean,
    twoFactorToken: string
}

export const useLogin = () => {
    const router = useRouter();
    const loginRef = useRef<ResLoginProps>();
    const otpRef = useRef("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpVisible, setIsOtpVisible] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [otpTimer, setOtpTimer] = useState(60)
    const [isResending, setIsResending] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
    const [otpErrorMessage, setOtpErrorMessage] = useState<string>("");

    useEffect(() => {
        const email_login = Cookies.get(nkey.email_login);
        if (email_login) {
            setEmail(email_login);
        }
    }, []);

    useEffect(() => {
        if (isResending) {
            const timer = setTimeout(() => {
                setOtpTimer(current => {
                    if (current <= 1) {
                        setIsResending(false);
                        return 60;
                    }
                    return current - 1;
                });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isResending, otpTimer]);

    const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailErrorMessage("")
    };

    const handleResendOtp = async () => {
        await handleLogin(true);
    };

    const handleLogin = async (skipLoading = false) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        try {
            setEmailErrorMessage("Validating email…");
            if (email.length === 0) {
                setEmailErrorMessage("Email is required")
                return
            }

            if (!emailRegex.test(email)) {
                setEmailErrorMessage("Please enter a valid email address");
                return
            }

            setErrorMessage("");
            // setEmailErrorMessage("");

            if (!skipLoading) {
                setIsLoading(true);
            }

            const resLogin = await ApiService.post<any>(urls.login, {
                "email": email
            });

            if (resLogin.isSuccess) {
                setEmailErrorMessage("");
                Cookies.set(nkey.email_login, email, { expires: 180 });
                loginRef.current = resLogin
                setIsOtpVisible(true);
                setIsResending(true);
                setOtpTimer(60)
            }
        } catch (error) {
            const apiError = ApiService.handleError(error)
        setEmailErrorMessage(apiError.message || "An error occurred while logging in");
            console.error("Error:", apiError)
        } finally {
            if (!skipLoading) {
                setIsLoading(false);
            }
        }
    }

    const handleOtpSubmit = async () => {

        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        if (otpRef.current.trim().length === 0) {
            setOtpErrorMessage("Please enter OTP code.");
            return;
        }

        try {
            setIsVerifyingOtp(true);
            setOtpErrorMessage(""); // Clear previous error

            // Set a timeout fallback after 1s if no response
            timeoutId = setTimeout(() => {
                setOtpErrorMessage((prev) => {
                    // Only show fallback if no error was already set
                    return prev ? prev : "OTP code is incorrect!";
                });
            }, 1000);

            const resToken = await ApiService.post<any>(urls.finalise, {
                "twoFactorToken": loginRef.current?.twoFactorToken,
                "otp": otpRef.current
            });
            if (timeoutId) clearTimeout(timeoutId); // Clear timeout if API responds in time

            if (resToken.isSuccess) {
                const decodedToken: any = jwtDecode(resToken.accessToken);
                const { UserID, UserRole } = decodedToken;

                CookieManager.setUserId(UserID);
                CookieManager.setUserRole(UserRole);
                CookieManager.setAuthToken(resToken.accessToken);
                CookieManager.setRefreshToken(resToken.refreshToken);
                CookieManager.setRefreshTokenExpiry(resToken.refreshTokenExpiryTime);
                CookieManager.setUserEmail(email);

                const resClientID = await ApiService.get<any>(urls.client_select_all, {});

                if (resClientID.isSuccess && resClientID.clients.length > 0) {
                    CookieManager.setClientId(resClientID.clients[0].clientID);
                    router.push('/dashboard');
                } else {
                    CookieManager.clearAuthCookies(true);
                    // alert("Failed to get client information!");
                    setErrorMessage("Failed to get client information!");
                }
            } else {
                // alert("OTP code is incorrect!");
                setOtpErrorMessage("OTP code is incorrect!");
            }
        } catch (error) {
            if (timeoutId) clearTimeout(timeoutId);
            const apiError = ApiService.handleError(error);

            if (apiError?.statusCode === 500 || apiError?.message?.toLowerCase().includes("otp")) {
                setOtpErrorMessage("OTP code is incorrect!");
            } else {
                setOtpErrorMessage(apiError.message || "Something went wrong while verifying OTP");
            }

        } finally {
            setIsVerifyingOtp(false);
        }
    }

    const onChangeOtp = (e: ChangeEvent<HTMLInputElement>) => {
        otpRef.current = e.target.value;
        setOtpErrorMessage("");
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
        email,
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
        checkIsUserAuthorized,
        otpTimer,
        emailErrorMessage,
        otpErrorMessage,
        errorMessage
    };
};
