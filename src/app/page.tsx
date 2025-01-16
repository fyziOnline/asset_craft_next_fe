"use client"

import { FC, useLayoutEffect } from "react";
import { UserIcon } from "@/assets/icons/AppIcons";
import { useLogin } from "@/hooks/useLogin";
import Button from "@/components/global/Button";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";

type TaglineObj = {
  title: string
  content: string

}

const TaglineContents: TaglineObj[] = [
  {
    title: 'Optimised Templates',
    content: 'Select from a wide range of ready-to-use templates for emails, social media posts, landing pages, and more, designed to ensure consistency and impact.'
  },
  {
    title: 'AI-Enhanced Copywriting',
    content: 'Generate tailored content based on your campaign goals, with messaging optimized for audience engagement and brand alignment'
  },
  {
    title: 'Fast and Efficient',
    content: 'Create, refine, and distribute marketing materials quickly, without the need for extensive customizations.'
  },
  {
    title: 'Cross-Platform Distribution',
    content: 'Easily generate and distribute content for various channels, streamlining your marketing operations across platforms.'
  }
]

const Home: FC = () => {
  const {
    isLoading, isOtpVisible, emailLoginDefault, handleLogin, onChangeEmail,
    handleOtpSubmit, onChangeOtp, handleCancelOtp, checkIsUserAuthorized
  } = useLogin();

  const router = useRouter()
  useLayoutEffect(() => {
    if (checkIsUserAuthorized()) {
      router.push('/dashboard');
    }
  }, [])

  return (
    <div>
      <div className="h-full flex flex-col justify-between min-h-[75vh]">
        <div className="flex relative items-center justify-between mr-[15vw]">
          <section className="text-white w-[25rem]">
            <h1 className="text-[3.45rem] leading-[6rem] font-medium font-metric text-green-100 tracking-wide">BrandCentral<sup className="text-4xl text-white">ai</sup></h1>
            <p className="text-wrap text-xl tracking-wide">Simplifying Marketing Content with AI-Driven</p>
          </section>

          <div className="relative text-white border-[1px] bg-[rgba(255,255,255,0.11)] border-white rounded-[10%] w-fit px-6 pt-8 pb-8 padbot10 flex flex-col items-center">
            <div className="absolute top-[35%] left-[25%]">
              <div className="color-wheel ">
                <div className="eclipse-1"></div>
                <div className="eclipse-2"></div>
                <div className="eclipse-3"></div>
              </div>
            </div>
            <UserIcon className="mb-[1.5rem] " color="white" />
            <input
              defaultValue={emailLoginDefault}
              onChange={onChangeEmail}
              className="home-box-element text-xs p-[0.7rem] mb-[1.3rem] placeholder:text-white w-[32ch] outline-none  bg-transparent border border-white text-white rounded-full text-center tracking-wider"
              placeholder="Enter Your email id"
              type="text"
            />
            <button disabled={isLoading} onClick={handleLogin} className={`mb-[1.3rem] text-xs home-box-element px-[1rem] py-[0.7rem] w-[32ch] Light rounded-full ${isLoading ? "" : "bg-custom-gradient-green"}`}>{isLoading ? 'Loading...' : 'Get your OTP'}</button>
            {/* <p className="text-[0.8rem] mb-[0.7rem]">Not a member? <span className="text-green-100 cursor-pointer pl-[2px]">Sign up now</span></p> */}
          </div>
        </div>


        <div className="text-grey-200 text-sm border-b-2 border-b-[rgba(255,255,255,0.10)] mt-[2%] mb-[2%]">
        </div>

        <div className="grid grid-cols-4 gap-7 mb-[2%]">
          {TaglineContents.map(tagline => {
            return (
              <section key={tagline.title} className="text-white">
                <h2 className="mb-2 font-semibold tracking-wide ">{tagline.title}</h2>
                <p className="text-grey-200 text-sm tracking-wide">{tagline.content}</p>
              </section>
            )
          })}
        </div>

      </div>

      {isOtpVisible && (
        <div className="fixed inset-0 bg-gray-900  bg-opacity-50 flex items-center justify-center pb-20 z-50">
          <div className="bg-gradient-to-br from-[#00A881]  to-[#073634] w-fit px-6 pt-[1rem] pb-8 padbot10 flex flex-col items-center rounded-[6%] border-white border">

            <div className="w-full flex justify-end">
              <button
                onClick={handleCancelOtp}
                className="text-white text-2xl mb-1">
                <IoMdClose />
              </button>
            </div>
            <h3 className="text-xl mb-4 text-white font-semibold tracking-widest">Enter OTP Code</h3>
            <input
              type="text"
              placeholder="Enter Your OTP"
              onChange={onChangeOtp}
              className="w-[32ch] p-3  mb-3 bg-transparent  text-white border border-white placeholder:text-white rounded-full outline-none text-center tracking-widest placeholder:tracking-wide"
            />

            <p className="text-[0.9rem] text-white mb-1 tracking-wider">Didn't receive the OTP?</p>

            <p onClick={handleLogin} className=" text-white pt-[1px] mb-[3%] border-b border-white inline-block leading-none cursor-pointer tracking-wide">Resend OTP </p>


            <div className="flex justify-between px-[1rem] py-[.75rem]">

              <Button
                buttonText={isLoading ? "Verifying OTP..." : "Submit OTP"}
                showIcon={false}
                textStyle='text-[1rem] font-medium text-[#00A881] tracking-wide'
                backgroundColor={"bg-custom-gradient-green"}
                handleClick={handleOtpSubmit}
                customClass='static px-[1.4rem] py-2 group-hover:border-white gap-0 w-[32ch] px-[1rem] py-[0.7rem]' />

            </div>
          </div>
        </div>
      )}

    </div>
  );
}


export default Home



