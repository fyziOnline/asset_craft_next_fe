import { ChangeEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { ApiService } from '@/lib/axios_generic';
import { nkey } from '@/data/keyStore';
import { urls } from '@/apis/urls';

export const useLogin = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const emailRef = useRef("");

    const handleLogin = async () => {
        try {
            if (emailRef.current.trim().length === 0) { return }

            setIsLoading(true);
            const resLogin = await ApiService.post<any>(urls.login, {
                "email": emailRef.current
            });

            if (resLogin.isSuccess) {
                const otp = prompt("Enter OTP code:");
                if (otp && otp.trim().length > 0) {
                    const resToken = await ApiService.post<any>(urls.finalise, {
                        "twoFactorToken": resLogin.twoFactorToken,
                        "otp": otp
                    })

                    if (resToken.isSuccess) {
                        Cookies.set(nkey.auth_token, resToken.loginToken, { expires: 30 });
                        router.push('/dashboard');
                    } else {
                        alert("OTP code is incorrect!");
                    }
                } else {
                    alert("Please enter OTP code.");
                }
            }
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            alert(ApiService.handleError(error))
        } finally {
            setIsLoading(false);
        }

    }

    const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        emailRef.current = e.target.value;
    }

    return {
        isLoading,
        handleLogin,
        onChangeEmail
    };
};