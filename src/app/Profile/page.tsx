"use client"

import React, { useState } from 'react'
import LayoutWrapper from '@/layout/LayoutWrapper'
import Button from '@/components/global/Button'
import Cookies from 'js-cookie';
import { nkey } from '@/data/keyStore';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';

interface FormValues {
    fullName: string;
    company: string;
    country: string;
    timeZone: string;
}


const page: React.FC = () => {
    const [formValues, setFormValues] = useState<FormValues>({
        fullName: '',
        company: '',
        country: '',
        timeZone: '',
    });

    const router = useRouter()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
          ...prevValues,
          [name]: value,
        }));
    };

    const handleLogout = () => {
        Cookies.remove(nkey.auth_token)
        Cookies.remove(nkey.email_login)
        Cookies.remove(nkey.client_ID)
        Cookies.remove(nkey.userID)
        Cookies.remove(nkey.userRole)

        router.push('/')
    }

    const { userDetails } = useProfile()

  return (
    <LayoutWrapper layout='main'>
        <div className='w-[80%] h-full mt-8  mx-auto'>
            <div className='flex items-baseline justify-between mb-5'>
                <h1 className="text-[30px] text-green-100 font-bold leading-normal">
                    Welcome, {userDetails?.name}
                </h1>
                <Button
                  buttonText='Request Access' 
                  customClass='border-2 border-green-300 px-4'
                  textColor='text-green-300'
                  backgroundColor='bg-white'
                  iconColor='#01A982'
                />
            </div>

            <div className="relative bg-green-100 w-full h-[200px] rounded-2xl p-6 mb-8">
                <p className="text-white text-4xl font-semibold text-end absolute bottom-4 right-5">Creator Access</p>
                <div className="absolute bottom-[-50px] flex items-center justify-between">
                    <div className="flex relative items-center gap-4">
                        <div className="w-[100px] h-[100px] bg-[#C4C4C4] rounded-full" />
                        <div className='absolute bottom-0 left-[120px]'>
                            <h3 className="font-medium">{userDetails?.name}</h3>
                            <p className="text-gray-500 text-sm">{userDetails?.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full flex items-end justify-end mt-[-15px]'>
                <button className='bg-green-100 text-white font-light text-base px-6 py-2 rounded-md'>Edit</button>
            </div>

            <div className='flex flex-wrap gap-x-6 gap-y-4 mt-4'>
                <div className='flex flex-col flex-1'>
                    <label className='text-sm font-light text-black' htmlFor="">Full Name</label>
                    <div className='bg-grey-100 p-1 rounded-md px-4 py-2 mt-3'>
                        <input 
                            className='bg-transparent w-full h-full font-light border-none outline-none placeholder:font-light placeholder:text-sm ' 
                            type="text" 
                            placeholder='Your Full Name' 
                            value={formValues.fullName}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div  className='flex flex-col flex-1'>
                    <label className='text-sm font-light text-black' htmlFor="">Company</label>
                    <div className='bg-grey-100 rounded-md px-4 py-2 mt-3'>
                        <input 
                            className='bg-transparent w-full h-full font-light border-none outline-none placeholder:font-light placeholder:text-sm ' 
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
                        <label className='text-sm font-light text-black' htmlFor="">Country</label>
                        <div className='bg-grey-100  rounded-md px-4 py-2 mt-3'>
                            <input 
                                className='bg-transparent w-full h-full font-light border-none outline-none placeholder:font-light placeholder:text-sm ' 
                                type="text" 
                                placeholder='Your Country'
                                value={formValues.country}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div  className='flex flex-col flex-1'>
                        <label className='text-sm font-light text-black' htmlFor="">Time Zone</label>
                        <div className='bg-grey-100  rounded-md px-4 py-2 mt-3'>
                            <input className='bg-transparent w-full h-full font-light border-none outline-none placeholder:font-light placeholder:text-sm ' 
                                type="text" 
                                placeholder='Your Time Zone' 
                                value={formValues.timeZone}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div> 
            </div>

            <div onClick={handleLogout} className='flex gap-2 float-end w-fit mt-6 cursor-pointer '>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17L21 12L16 7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12H9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
                <p className='text-base'>Sign Out</p>
            </div>

        </div>
    </LayoutWrapper>
  )
}

export default page