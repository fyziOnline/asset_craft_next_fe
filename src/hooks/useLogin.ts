import { urls } from '@/apis/urls';
import { nkey } from '@/data/keyStore';
import { ApiService } from '@/lib/axios_generic';
import { CookieManager } from '@/utils/cookieManager';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

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
    const [otpGeneratedAt, setOtpGeneratedAt] = useState<number | null>(null);
const [otpEmail, setOtpEmail] = useState<string | null>(null);


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

//     const handleLogin = async (skipLoading = false) => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// setEmailErrorMessage("Validating email…");
//         try {

//             if (email.length === 0) {
//                 setEmailErrorMessage("Email is required")
//                 return
//             }

//             if (!emailRegex.test(email)) {
//                 setEmailErrorMessage("Please enter a valid email address");
//                 return
//             }

//             setErrorMessage("");
//             setEmailErrorMessage("");

//             if (!skipLoading) {
//                 setIsLoading(true);
//             }

//             const resLogin = await ApiService.post<any>(urls.login, {
//                 "email": email
//             });

//             if (resLogin.isSuccess) {
//                 setEmailErrorMessage("");
//                  setOtpErrorMessage("");
//                 Cookies.set(nkey.email_login, email, { expires: 180 });

//                 loginRef.current = resLogin
//                 setOtpEmail(email);
//                 setIsOtpVisible(true);
//                 setEmailErrorMessage("");

//                 setIsResending(true);
//                 setOtpTimer(60);
//                 otpRef.current = "";
//                 setOtpGeneratedAt(Date.now());
//             }

//         } 

//         catch (error) {
//   setIsLoading(false);

//   const apiError = ApiService.handleError(error);
//   const serverErrorMessage = apiError.message || "An error occurred while logging in";

//   // Determine if OTP was actually triggered (login was successful earlier)
//   const isOtpInProgress = isOtpVisible && otpGeneratedAt && otpEmail === email;

//   // Only suppress if OTP is in progress AND within grace period
//   const FIVE_MINUTES = 5 * 60 * 1000;
//   const now = Date.now();
//   const isSameOtpEmail = otpEmail && email === otpEmail;
//   const isWithinGracePeriod = isOtpInProgress  && isSameOtpEmail &&  now - otpGeneratedAt < FIVE_MINUTES;

//   if (!isWithinGracePeriod) {
//   // Show login error immediately
//   setEmailErrorMessage(serverErrorMessage);
// } else {
//   console.warn("Email error suppressed during OTP grace period");
// }

//   console.error("Login Error:", apiError);
// }
        
// //         catch (error) {
// //              setIsLoading(false);
// //           const apiError = ApiService.handleError(error);
// //         const FIVE_MINUTES = 5 * 60 * 1000;
// //         const now = Date.now();

// //         const isWithinGracePeriod =
// //             otpGeneratedAt !== null && now - otpGeneratedAt < FIVE_MINUTES;
// // const isSameOtpEmail = otpEmail && email === otpEmail;
// //         const shouldSuppressError = isOtpVisible && isSameOtpEmail && isWithinGracePeriod;

// //   if (!shouldSuppressError) {
// //     setEmailErrorMessage(apiError.message || "An error occurred while logging in");
// //   } else {
// //     console.warn("Email error suppressed after OTP generation or within grace period");
// //   }

// //   console.error("Error:", apiError);

// //         } 
//         finally {
//             if (!skipLoading) {
//                 setIsLoading(false);
//             }
//         }
//     }

const handleLogin = async (skipLoading = false) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailErrorMessage("Validating email…");

    try {
        if (email.length === 0) {
            setEmailErrorMessage("Email is required");
            return;
        }

        if (!emailRegex.test(email)) {
            setEmailErrorMessage("Please enter a valid email address");
            return;
        }

        setErrorMessage("");
        setEmailErrorMessage("");

        if (!skipLoading) {
            setIsLoading(true);
        }

        // ⏱️ 5 second timeout promise
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Server took too long to respond. Please try again.")), 5000)
        );

        // 📨 Call API with timeout
        const resLogin = await Promise.race([
            ApiService.post<any>(urls.login, { email }),
            timeoutPromise
        ]);

        if (resLogin?.isSuccess) {
            setEmailErrorMessage("");
            setOtpErrorMessage("");
            Cookies.set(nkey.email_login, email, { expires: 180 });

            loginRef.current = resLogin;
            setOtpEmail(email);
            setIsOtpVisible(true);
            setEmailErrorMessage("");

            setIsResending(true);
            setOtpTimer(60);
            otpRef.current = "";
            setOtpGeneratedAt(Date.now());
        }
    } catch (error: any) {
        setIsLoading(false);

        const apiError = ApiService.handleError(error);
        const serverErrorMessage = error?.message || apiError?.message || "An error occurred while logging in";

        const now = Date.now();
        const isSameOtpEmail = otpEmail && email === otpEmail;
        const isOtpInProgress = isOtpVisible && otpGeneratedAt && isSameOtpEmail;
        const isWithinGracePeriod = isOtpInProgress && now - otpGeneratedAt < 5 * 60 * 1000;

        if (!isWithinGracePeriod) {
            setEmailErrorMessage(serverErrorMessage);
        } else {
            console.warn("Email error suppressed during OTP grace period");
        }

        console.error("Login Error:", apiError || error);
    } finally {
        if (!skipLoading) {
            setIsLoading(false);
        }
    }
};


    const handleOtpSubmit = async () => {
        setEmailErrorMessage("");
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        if (otpRef.current.trim().length === 0) {
            setEmailErrorMessage("");
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
                setEmailErrorMessage("");

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
         setEmailErrorMessage("");
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
        errorMessage,
        // otpGeneratedAt,
    };
};
