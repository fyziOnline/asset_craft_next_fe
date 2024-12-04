import { ChangeEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ApiService } from '@/lib/axios_generic';
import { nkey } from '@/data/keyStore';
import { urls } from '@/apis/urls';

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

    useEffect(() => {
        const email_login = Cookies.get(nkey.email_login);
        emailRef.current = email_login as string
        setEmailLoginDefault(email_login as string)
    }, [])

    const handleLogin = async () => {
        try {
            if (emailRef.current.trim().length === 0) {
                return;
            }

            setIsLoading(true);
            const resLogin = await ApiService.post<any>(urls.login, {
                "email": emailRef.current
            });

            if (resLogin.isSuccess) {
                Cookies.set(nkey.email_login, emailRef.current, { expires: 180 });
                loginRef.current = resLogin
                setIsOtpVisible(true);
            }
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            alert(ApiService.handleError(error));
        } finally {
            setIsLoading(false);
        }
    }

    const handleOtpSubmit = async () => {
        if (otpRef.current.trim().length === 0) {
            alert("Please enter OTP code.");
            return;
        }

        try {
            setIsLoading(true);

            const resToken = await ApiService.post<any>(urls.finalise, {
                "twoFactorToken": loginRef.current?.twoFactorToken,
                "otp": otpRef.current
            });

            if (resToken.isSuccess) {
                Cookies.set(nkey.auth_token, resToken.loginToken, { expires: 180 });
                const resClientID = await ApiService.get<any>(urls.client_select_all, {});

                if (resClientID.isSuccess && resClientID.clients.length > 0) {
                    Cookies.set(nkey.client_ID, resClientID.clients[0].clientID, { expires: 180 });
                    router.push('/dashboard');
                } else {
                    Cookies.remove(nkey.auth_token)
                    alert("Failed to get client information!");
                }
            } else {
                alert("OTP code is incorrect!");
            }
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            alert(ApiService.handleError(error));
        } finally {
            setIsLoading(false);
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

    return {
        emailLoginDefault,
        isLoading,
        isOtpVisible,
        handleLogin,
        onChangeEmail,
        handleOtpSubmit,
        onChangeOtp,
        handleCancelOtp
    };
};
