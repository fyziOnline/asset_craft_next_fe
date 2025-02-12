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
  const router = useRouter()

  const {
    isLoading,
    isResending,
    isOtpVisible,
    isVerifyingOtp,
    emailLoginDefault,
    handleLogin,
    onChangeEmail,
    handleOtpSubmit,
    handleResendOtp,
    onChangeOtp,
    handleCancelOtp,
    checkIsUserAuthorized
  } = useLogin();

  useLayoutEffect(() => {
    if (checkIsUserAuthorized()) {
      router.push('/dashboard');
    }
  }, [checkIsUserAuthorized]);

  return (
    <div>

      <div className="h-full flex flex-col justify-around min-h-[75vh] ">
        <div className="flex flex-col lg:flex-row relative items-center justify-between md:mr-[15vw] gap-9">
          <section className="text-white w-[30rem] md:w-[32rem] pad16px">
            <h1 className="text-[4rem] leading-[7rem] font-medium font-metric text-green-100 tracking-wide">
              BrandLab<sup className="text-[2.75rem] text-white">ai</sup>
            </h1>
            <p className="text-wrap text-2xl tracking-wide">Simplifying Marketing Content with AI-Driven Tech</p>
          </section>

          <div className="relative text-white border-[1px] bg-[rgba(255,255,255,0.11)] border-white rounded-[10%] w-fit px-8 pt-10 pb-10 padbot10 flex flex-col items-center">

            <div className="absolute top-[35%] left-[25%]">
              <div className="color-wheel ">
                <div className="eclipse-1"></div>
                <div className="eclipse-2"></div>
                <div className="eclipse-3"></div>
              </div>
            </div>

            <UserIcon className="mb-[2rem] scale-125" color="white" />
            <input
              defaultValue={emailLoginDefault}
              onChange={onChangeEmail}
              className="home-box-element text-lg p-[0.85rem] mb-[1.5rem] placeholder:text-white w-[34ch] outline-none  bg-transparent border border-white text-white rounded-full text-center tracking-wider focus:placeholder:text-gray-300"
              placeholder="Enter your email id"
              type="text"
            />

            <button disabled={isLoading} onClick={() => handleLogin(true)} className={`mb-[1.5rem] text-sm home-box-element px-[1rem] py-[0.85rem] w-[34ch] Light rounded-full ${isLoading ? "" : "bg-custom-gradient-green"}`}>{isLoading ? 'Loading...' : 'Get your OTP'}</button>


          </div>



        </div>


        <div className="text-grey-200 text-sm border-b-2 border-b-[rgba(255,255,255,0.10)] mt-[2%] mb-[2%] margin2rem">
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-[2%]">
          {TaglineContents.map(tagline => {
            return (
              <section key={tagline.title} className="text-white">
                <h2 className="mb-3 text-lg font-semibold tracking-wide">{tagline.title}</h2>
                <p className="text-grey-200 text-base tracking-wide">{tagline.content}</p>
              </section>
            )
          })}
        </div>

      </div>


      {isOtpVisible && (
        <div className="fixed inset-0 bg-gray-900  bg-opacity-50 flex items-center justify-center pb-20 z-50">
          <div className="bg-gradient-to-br from-[#00A881]  to-[#073634] w-fit px-8 pt-[1.25rem] pb-10 padbot10 flex flex-col items-center rounded-[6%] border-white border">

            <div className="w-full flex justify-end">
              <button
                onClick={handleCancelOtp}
                className="text-white text-2xl mb-2">
                <IoMdClose />
              </button>
            </div>
            <h3 className="text-2xl mb-5 text-white font-semibold tracking-widest">Enter OTP Code</h3>
            <input
              type="text"
              placeholder="Enter Your OTP"
              onChange={onChangeOtp}
              className="w-[34ch] p-4 mb-4 bg-transparent text-white border border-white placeholder:text-white rounded-full outline-none text-center text-lg tracking-widest placeholder:tracking-wide focus:placeholder:text-gray-300"
            />

            <p className="text-base text-white mb-2 tracking-wider">Didn't receive the OTP?</p>

            <p
              onClick={!isResending ? handleResendOtp : undefined}
              className={`text-white pt-[1px] mb-[3%] inline-flex items-center gap-2 leading-none cursor-pointer tracking-wide text-base ${!isResending ? "border-b border-white" : ""
                }`}
            >
              {isResending ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              ) : (
                "Resend OTP"
              )}
            </p>


            <div className="flex justify-between px-[1rem] py-[.75rem]">

              <Button
                buttonText={isVerifyingOtp ? "Verifying OTP..." : "Submit OTP"}
                showIcon={false}
                textStyle='text-[1.1rem] font-medium text-[#00A881] tracking-wide'
                backgroundColor={"bg-custom-gradient-green"}
                handleClick={handleOtpSubmit}
                customClass='static px-[1.4rem] py-3 group-hover:border-white gap-0 w-[34ch]' />

            </div>
          </div>
        </div>
      )}


    </div>
  );
}


export default Home



