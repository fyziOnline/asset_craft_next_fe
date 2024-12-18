"use client"

import { FC, useState } from "react";
import { UserIcon } from "@/assets/icons/AppIcons";
// import LayoutWrapper from "@/layout/LayoutWrapper";
import { useLogin } from "@/hooks/useLogin";
import Button from "@/components/global/Button";

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
    handleOtpSubmit, onChangeOtp, handleCancelOtp,
  } = useLogin();

  return (
    <>
        <div className="h-full pt-7">
          <div className="flex relative justify-evenly items-center gap-[2rem] ">
            <section className="text-white w-[25rem]">
              <h1 className="text-[3.45rem] leading-[6rem]">BrandCentral<sup className="text-5xl">ai</sup></h1>
              <p className="text-wrap text-base">Simplifying Marketing Content with AI-Driven Precision by HPE</p>
            </section>

            <div className="relative text-white border-4 bg-[rgba(255,255,255,0.11)] border-white rounded-[10%] w-fit px-6 pt-8 pb-10 flex flex-col items-center">
              <div className="absolute top-[35%] left-[25%]">
                <div className="color-wheel ">
                  <div className="eclipse-1"></div>
                  <div className="eclipse-2"></div>
                  <div className="eclipse-3"></div>
                </div>
              </div>
              <UserIcon className="mb-[1.5rem]" />
              <input defaultValue={emailLoginDefault} onChange={onChangeEmail} className="home-box-element text-xs p-[0.7rem] mb-[1.3rem] placeholder:text-white w-[35ch] outline-none" placeholder="Email ID" type="text" />
              <button disabled={isLoading} onClick={handleLogin} className={`mb-[1.3rem] text-xs home-box-element px-[1rem] py-[0.7rem] ${isLoading ? "" : "bg-custom-gradient-green"}`}>{isLoading ? 'Loading...' : 'Get your OTP'}</button>
              <p className="text-[0.7rem] mb-[0.7rem] ">Not an member? <span className="text-green-100">Sing up now</span></p>
              <p className="login-divider-or mb-[1.3rem] text-[0.7rem] w-full flex justify-center">or</p>
              <button className="home-box-element p-[0.7rem] text-xs w-full">Sign in through SSO</button>
            </div>
          </div>

          <div className="text-grey-200 text-sm border-b-2 border-b-[rgba(255,255,255,0.10)] mb-6">
            <p className="mb-6">Tailored Content at Scale</p>
          </div>

          <div className="grid grid-cols-4 gap-7">
            {TaglineContents.map(tagline => {
              return (
                <section key={tagline.title} className="text-white">
                  <h2 className="mb-[1rem]">{tagline.title}</h2>
                  <p className="text-grey-200 text-sm">{tagline.content}</p>
                </section>
              )
            })}
          </div>

        </div>

        <div className="text-grey-200 text-sm border-b-2 border-b-[rgba(255,255,255,0.10)] mb-6">
          <p className="mb-6">Tailored Content at Scale</p>
        </div>

        <div className="grid grid-cols-4 gap-7">
          {TaglineContents.map(tagline => {
            return (
              <section key={tagline.title} className="text-white">
                <h2 className="mb-[1rem]">{tagline.title}</h2>
                <p className="text-grey-200 text-sm">{tagline.content}</p>
              </section>
            )
          })}
        </div>

        {isOtpVisible && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-xl mb-4">Enter OTP Code</h3>
              <input
                type="text"
                placeholder="Enter OTP"
                onChange={onChangeOtp}
                className="w-full p-3 mb-4 border border-gray-300 rounded"
              />
              <div className="flex justify-between">
                <Button
                  buttonText={"Cancel"}
                  showIcon={false}
                  textStyle='text-[1rem] font-base text-[#00A881]'
                  backgroundColor={"bg-[#B1B1B1]"}
                  handleClick={handleCancelOtp}
                  customClass='static  px-[1.4rem] py-2 group-hover:border-white gap-0' />
                <Button
                  buttonText={isLoading ? "Verifying OTP..." : "Submit OTP"}
                  showIcon={false}
                  textStyle='text-[1rem] font-base text-[#00A881]'
                  backgroundColor={"bg-custom-gradient-green"}
                  handleClick={handleOtpSubmit}
                  customClass='static px-[1.4rem] py-2 group-hover:border-white gap-0' />

              </div>
            </div>
          </div>
        )}

    </>
  );
}

export default Home



