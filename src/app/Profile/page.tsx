"use client"

import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';
import { SignOutIcon, UserDetailsIcon } from '@/assets/icons/AppIcons';
import { CiCamera } from "react-icons/ci";
import { convertImageToBase64 } from '@/utils/convertToBase64';
import { CookieManager } from '@/utils/cookieManager';
import { ApiService } from '@/lib/axios_generic';
import { urls } from '@/apis/urls';
import { useAppData } from '@/context/AppContext';
import { IoMdInformationCircleOutline } from "react-icons/io";
import LayoutWrapper from '@/layout/LayoutWrapper'
import Button from '@/components/global/Button'
import GoBackButton from '@/components/global/GoBackButton';
import LoadingIndicator from '@/components/global/LoadingIndicator';
import { UserDetailsProps } from '@/types/asset';
import useHeader from '@/hooks/useHeader';

interface LLMModel {
    modelID: string;
    providerID: string;
    modelName: string;
    displayName: string;
    maxTokens: number;
    isActive: boolean;
    isDefault: boolean;
    providerName: string;
    providerCode: string;
}

interface LLMModelsResponse {
    isSuccess: boolean;
    errorOnFailure: string;
    models: LLMModel[];
}

interface FormValues {
    name: string;
    email: string;
    userID: string;
    userRole: string;
    country?: string;
    company?: string;
    timeZone?: string;
    isActive: number;
    preferredLLMModelID?: string;
}

const ProfilePage: React.FC = () => {
    const router = useRouter()

    const { updateUserDetails, changeProfilePhoto, updatingUserDetails, } = useProfile()
    
    const { userDetails, setError } = useAppData();
const { setUserDetails } = useAppData();
const { getUserDetails } = useHeader();
    const [logoutFromAll, setLogoutFromAll] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [availableModels, setAvailableModels] = useState<LLMModel[]>([]);
    const [loadingModels, setLoadingModels] = useState<boolean>(false);
    const [formValues, setFormValues] = useState<FormValues>({
        name: '',
        email: '',
        userID: '',
        userRole: '',
        country: '',
        company: '',
        timeZone: '',
        isActive: 1,
        preferredLLMModelID: '',
    });


    useEffect(() => {
        if (userDetails) {
            const newFormValues = {
                name: userDetails.name || '',
                email: userDetails.email,
                userID: userDetails.userID,
                userRole: userDetails.userRole,
                country: userDetails.country || '',
                company: userDetails.company || '',
                timeZone: userDetails.timeZone || '',
                isActive: userDetails.isActive,
                preferredLLMModelID: userDetails.preferredLLMModelID || '',
            };

            setFormValues(newFormValues);
        }
    }, [userDetails]);

    // Fetch available AI models
    useEffect(() => {
        const fetchModels = async () => {
            setLoadingModels(true);
            try {
                const response = await ApiService.get<LLMModelsResponse>(urls.get_llm_models);
                if (response.isSuccess) {
                    
                    setAvailableModels(response.models);
                }
            } catch (error) {
                const apiError = ApiService.handleError(error);
                setError({
                    status: apiError.statusCode,
                    message: apiError.message,
                    showError: true
                });
            } finally {
                setLoadingModels(false);
            }
        };

        fetchModels();
    }, [setError]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };


useEffect(() => {
  if (!userDetails?.userID) {
    getUserDetails();
  }
}, []);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);

            interface LogoutResponse {
                isSuccess: boolean;
            }

            const response = await ApiService.post<LogoutResponse>(urls.logout, {
                revokeAll: logoutFromAll
            });

            if (response.isSuccess) {
                // Clear cookies based on logout type
                CookieManager.clearAuthCookies(!logoutFromAll);
                 setUserDetails(null);
                router.push('/');
            }
        } catch (error) {
            // const apiError = ApiService.handleError(error);
            // setError({
            //     status: apiError.statusCode,
            //     message: apiError.message,
            //     showError: true
            // });
        } finally {
            setIsLoggingOut(false);
        }
    };


    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (file) {
            const base64Image = await convertImageToBase64(file as File);

            const data = {
                userID: userDetails!.userID,
                originalImageName: "Name.png",
                imageAsBase64String: base64Image
            }

            await changeProfilePhoto(data);
        }

    };

    return (
        <LayoutWrapper layout='main'>
            <div className='w-[80%] h-full mx-auto relative'>
                <div className='absolute -left-10 top-2'>
                    <Suspense fallback={<LoadingIndicator />}>
                        <GoBackButton />
                    </Suspense>
                </div>
                <div className='flex items-baseline justify-start mb-5'>
                    <h1 className="text-[30px] text-green-100 font-bold leading-normal">
                        Welcome, {userDetails?.name}
                    </h1>
                    {/* <Button
                        buttonText='Request Access'
                        customClass='border-2 border-green-300 px-4 py-1'
                        textColor='text-green-300'
                        backgroundColor='bg-white'
                        iconColor='#01A982'
                    /> */}
                </div>

                <div className="relative bg-green-100 w-full h-[200px] rounded-2xl p-6 mb-8">
                    <p className="text-white text-3xl font-semibold text-end absolute bottom-4 right-5">Access Level: {userDetails?.userRole}</p>
                    <div className="absolute bottom-[-50px] flex items-center justify-between">
                        <div className="flex relative items-center gap-4">
                            <div
                                className="relative w-[100px] h-[100px] rounded-full overflow-hidden"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onClick={handleFileSelect}
                                style={{
                                    backgroundImage: `url(${userDetails?.fileUrl || '/images/userProfile.jpeg'})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            >
                                {isHovered && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer transition-opacity duration-200">
                                        <CiCamera className="text-white" size={24} />
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>


                            <div className="absolute bottom-0 top-16 left-[112px]">
                                <p className="text-gray-500 text-base w-[400px]">
                                    {userDetails?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-wrap gap-x-6 gap-y-4 mt-12'>
                    <div className='flex flex-col flex-1'>
                        <label className='text-base font-light text-black' htmlFor="">Full Name</label>
                        <div className='bg-grey-100 p-1 rounded-md px-4 py-2 mt-3'>
                            <input
                                name='name'
                                className='bg-transparent w-full h-full font-light border-none outline-none placeholder:font-light placeholder:text-base '
                                type="text"
                                placeholder='Your Full Name'
                                value={formValues.name}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col flex-1'>
                        <label className='text-base font-light text-black' htmlFor="">Email</label>
                        <div className='bg-grey-100 rounded-md px-4 py-2 mt-3'>
                            <input
                                name='email'
                                className='bg-transparent w-full h-full font-light border-none outline-none placeholder:font-light placeholder:text-base text-gray-500'
                                type="text"
                                placeholder='Your Email'
                                value={formValues.email}
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                <div className='flex flex-wrap gap-x-6 gap-y-4 mt-4'>
                    <div className='flex flex-col flex-1'>
                        <label className='text-base font-light text-black' htmlFor="">Company</label>
                        <div className='bg-grey-100 rounded-md px-4 py-2 mt-3'>
                            <input
                                name='company'
                                className='bg-transparent w-full h-full font-light border-none outline-none placeholder:font-light placeholder:text-base '
                                type="text"
                                placeholder='Your Company'
                                value={formValues.company}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col flex-1'>
                        <label className='text-base font-light text-black' htmlFor="">Country</label>
                        <div className='bg-grey-100  rounded-md px-4 py-2 mt-3'>
                            <input
                                name='country'
                                className='bg-transparent w-full h-full font-light border-none outline-none placeholder:font-light placeholder:text-base '
                                type="text"
                                placeholder='Your Country'
                                value={formValues.country}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className='flex flex-col flex-1'>
                        <label className='text-base font-light text-black' htmlFor="">Preferred AI Model</label>
                        <div className='bg-grey-100 rounded-md px-4 py-2 mt-3'>
                            <select
                                name='preferredLLMModelID'
                                className='bg-transparent w-full h-full font-light border-none outline-none placeholder:font-light placeholder:text-base'
                                value={formValues.preferredLLMModelID}
                                onChange={handleInputChange}
                            >
                                <option value="">Select an AI Model (Optional)</option>
                                {availableModels
                                    .filter(model => model.isActive)
                                    .map(model => (
                                        <option key={model.modelID} value={model.modelID}>
                                            {model.providerName} - {model.displayName}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                        {loadingModels && <p className="text-sm text-gray-500 mt-1">Loading models...</p>}
                    </div>
                </div>

                <div className='flex flex-col gap-4 mt-2 pb-4'>
                    <div className='flex justify-end'>
                        <Button
                            buttonText={updatingUserDetails ? 'Updating...' : 'Update'}
                            customClass='border-2 border-green-300 px-6 py-1'
                            textColor='text-green-300'
                            backgroundColor='bg-white'
                            iconColor='#01A982'
                            IconComponent={<UserDetailsIcon />}
                            showIcon={false}
                            handleClick={async () => {
    const success = await updateUserDetails({
        userID: formValues.userID,
        name: formValues.name,
        userRole: formValues.userRole,
        country: formValues.country,
        company: formValues.company,
        timeZone: formValues.timeZone,
        isActive: formValues.isActive,
        preferredLLMModelID: formValues.preferredLLMModelID || undefined
    });

    if (success) {
  await getUserDetails(); // ✅ Correct usage now
}
}}
                     
                            // handleClick={() => updateUserDetails({
                            //     userID: formValues.userID,
                            //     name: formValues.name,
                            //     userRole: formValues.userRole,
                            //     country: formValues.country,
                            //     company: formValues.company,
                            //     timeZone: formValues.timeZone,
                            //     isActive: formValues.isActive,
                            //     preferredLLMModelID: formValues.preferredLLMModelID || undefined
                            // })}
                        />
                    </div>

                    <div className="border-t border-gray-200 my-4"></div>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={logoutFromAll}
                                    onChange={(e) => setLogoutFromAll(e.target.checked)}
                                    className="form-checkbox h-4 w-4 text-green-300 rounded border-gray-300 focus:ring-green-300 cursor-pointer"
                                />
                                <span>Logout from all devices</span>
                                <div className="group relative inline-block">
                                    <IoMdInformationCircleOutline className="text-gray-400 hover:text-gray-600 cursor-help" size={18} />
                                    <div className="invisible group-hover:visible absolute left-0 bottom-full mb-2 w-72 bg-gray-800 text-white text-xs rounded p-2 shadow-lg">
                                        When enabled, this will terminate all active sessions across all devices where you&apos;re currently logged in.
                                        This is useful if you suspect unauthorized access or want to ensure complete security across all devices.
                                        Your email will also be removed from the login screen.
                                    </div>
                                </div>
                            </label>
                        </div>

                        <Button
                            IconComponent={<SignOutIcon />}
                            buttonText={isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                            customClass='w-fit px-6 py-[5px]'
                            iconColor='#fff'
                            handleClick={handleLogout}
                            showIcon={false}
                            disabled={isLoggingOut}
                        />
                    </div>
                </div>

            </div>
        </LayoutWrapper>
    )
}

export default ProfilePage