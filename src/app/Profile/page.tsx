"use client"

import React, { useEffect, useState } from 'react'
import LayoutWrapper from '@/layout/LayoutWrapper'
import Button from '@/components/global/Button'
import Cookies from 'js-cookie';
import { nkey } from '@/data/keyStore';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';
import { SignOutIcon, UserDetailsIcon } from '@/assets/icons/AppIcons';

interface FormValues {
    name: string;
    email: string;
    userId: string;
    userRole: string;
    country: string;
    company: string;
    timeZone: string;
    isActive: number;
}


const page: React.FC = () => {
    const router = useRouter()
    const { userDetails, updateUserDetails } = useProfile()
    const [formValues, setFormValues] = useState<FormValues>({
        name: '',
        email: '',
        userId: '',
        userRole: '',
        country: '',
        company: '',
        timeZone: '',
        isActive: 1,
    });

    useEffect(() => {
        if (userDetails) {
            setFormValues({
                name: userDetails.name || '',
                email: userDetails.email,
                userId: userDetails.userID,
                userRole: userDetails.userRole,
                country: userDetails.country || '',
                company: userDetails.company || '',
                timeZone: userDetails.timeZone || '',
                isActive: userDetails.isActive,
            });
        }
    }, [userDetails]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));

        console.log("formValues", formValues);

    };

    const handleLogout = () => {
        Cookies.remove(nkey.auth_token)
        Cookies.remove(nkey.email_login)
        Cookies.remove(nkey.client_ID)
        Cookies.remove(nkey.userID)
        Cookies.remove(nkey.userRole)

        router.push('/')
    }


    console.log("userDetails", userDetails);

    return (
        <LayoutWrapper layout='main'>
            <div className='w-[80%] h-full mx-auto'>
                <div className='flex items-baseline justify-between mb-5'>
                    <h1 className="text-[30px] text-green-100 font-bold leading-normal">
                        Welcome, {userDetails?.name}
                    </h1>
                    <Button
                        buttonText='Request Access'
                        customClass='border-2 border-green-300 px-4 py-1'
                        textColor='text-green-300'
                        backgroundColor='bg-white'
                        iconColor='#01A982'
                    />
                </div>

                <div className="relative bg-green-100 w-full h-[200px] rounded-2xl p-6 mb-8">
                    <p className="text-white text-4xl font-semibold text-end absolute bottom-4 right-5">{userDetails?.userRole} Access</p>
                    <div className="absolute bottom-[-50px] flex items-center justify-between">
                        <div className="flex relative items-center gap-4">
                            <div className="w-[100px] h-[100px] aspect-square bg-[url('/images/userProfile.jpeg')] bg-cover bg-center rounded-full" />
                            <div className='absolute bottom-0 top-16 left-[112px]'>
                                {/* <h3 className="font-medium">{userDetails?.name}</h3> */}
                                <p className="text-gray-500 text-base w-[400px]">{userDetails?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className='w-full flex items-end justify-end mt-[-15px]'>
                    <button onClick={() => updateUserDetails(formValues)} className='bg-green-100 text-white font-light text-base px-6 py-2 rounded-md'>Update</button>
                </div> */}

                <div className='flex flex-wrap gap-x-6 gap-y-4 mt-20'>
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

                </div>

                <div className='flex flex-wrap gap-x-6 gap-y-4 mt-4'>
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
                        {/* <label className='text-base font-light text-black' htmlFor="">Time Zone</label>
                        <div className='bg-grey-100  rounded-md px-4 py-2 mt-3'>
                            <input
                                name='timeZone' 
                                className='bg-transparent w-full h-full font-light border-none outline-none placeholder:font-light placeholder:text-base '
                                type="text"
                                placeholder='Your Time Zone'
                                value={formValues.timeZone}
                                onChange={handleInputChange}
                            />
                        </div> */}
                    </div>
                </div>

                <div className='flex items-center justify-end gap-2 mt-2'>
                    <Button
                        buttonText='Update'
                        customClass='border-2 border-green-300 px-6 py-1'
                        textColor='text-green-300'
                        backgroundColor='bg-white'
                        iconColor='#01A982'
                        IconComponent={<UserDetailsIcon />}
                        showIcon={false}
                        handleClick={() => updateUserDetails(formValues)}
                    />

                    <Button
                        IconComponent={<SignOutIcon />}
                        buttonText='Sign Out'
                        customClass='px-6 py-[5px]'
                        iconColor='#fff'
                        handleClick={handleLogout}
                        showIcon={false}
                    />
                </div>

            </div>
        </LayoutWrapper>
    )
}

export default page