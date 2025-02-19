"use client"

import { FC, useEffect } from "react";
import { LoginPageIcon1, LoginPageIcon2, LoginPageIcon3, LoginPageIcon4, UserIcon } from "@/assets/icons/AppIcons";
import { useLogin } from "@/hooks/useLogin";
import Button from "@/components/global/Button";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import HomeHeader from "@/components/Layout/HomeHeader";

type TaglineObj = {
  title: string
  IconComponent?: React.ReactNode;
}

const TaglineContents: TaglineObj[] = [
  {
    title: 'Create marketing assets with simple prompts',
    IconComponent: <LoginPageIcon1 />
  },
  {
    title: 'Entire campaign materials built in a few clicks',
    IconComponent: <LoginPageIcon2 />
  },
  {
    title: 'Reusable AI model, trained for you',
    IconComponent: <LoginPageIcon4 />
  },
  {
    title: 'Pre-designed campaign templates for you',
    IconComponent: <LoginPageIcon3 />
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

  useEffect(() => {
    if (checkIsUserAuthorized()) {
      router.push('/dashboard');
    }
  }, [checkIsUserAuthorized]);

  return (
    <div>
      <div style={{ backgroundImage: "url('/images/loginpagebg.png')" }} className="h-full py-6 justify-center min-h-[50vh] 2xl:min-h-[60vh] bg-no-repeat bg-cover bg-center">
        <HomeHeader />
        <div className="flex flex-col lg:flex-row relative items-center justify-between px-32 gap-9 lg:py-6">
          <section className="text-white md:w-[32rem]">
            <h1 className="text-[4rem] leading-[7rem] font-medium font-metric text-green-100 tracking-wide">
              BrandLab<sup className="text-[2.75rem] text-white">ai</sup>
            </h1>
            <p className="text-wrap text-2xl tracking-wide">Simplifying Marketing Content with AI-Driven Tech</p>
          </section>

          <div className=" text-white border-[1px] bg-[rgba(255,255,255,0.11)] border-white rounded-[10%] w-fit px-4 md:px-8 pt-12 pb-8 padbot10 flex flex-col items-center backdrop-blur-lg">

            {/* <div className="absolute top-[35%] left-[25%]">
              <div className="color-wheel ">
                <div className="eclipse-1"></div>
                <div className="eclipse-2"></div>
                <div className="eclipse-3"></div>
              </div>
            </div> */}

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
        {/* <div className="text-grey-200 text-sm border-b-2 border-b-[rgba(255,255,255,0.10)] mt-[2%] mb-[2%] margin2rem">
        </div> */}

        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-[2%]">
          {TaglineContents.map(tagline => {
            return (
              <section key={tagline.title} className="text-white">
                <h2 className="mb-3 text-lg font-semibold tracking-wide">{tagline.title}</h2>
                <p className="text-grey-200 text-base tracking-wide">{tagline.content}</p>
              </section>
            )
          })}
        </div> */}


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

      <section>
        <div className="flex flex-col md:flex-row w-full h-full">
          <div className="w-full md:w-[50%] flex-shrink-0">
            <img className='w-full h-full bg-no-repeat bg-center object-cover object-left' src="/images/loginPageGirl.png" alt="" />
          </div>
          <div className="w-full lg:w-[50%] bg-[#00A881] text-white px-8 lg:px-16 pb-8 lg:pb-14 flex flex-col items-start justify-center">
            <h1 className="text-xl pt-12 tracking-wide">BUILD MARKETING ASSETS USING AI</h1>
            <p className="text-3xl w-full xl:max-w-[65%]  pt-4">How can you transform and scale your marketing operations effortlessly?</p>
            <p className="pt-4  font-metricLight text-lg leading-6 tracking-wide">HPE BrandLab redefines marketing planning and campaign production, enabling you to execute operations faster, more efficiently, and at a lower cost. With your own Gen AI marketing concierge, you can streamline workflows, enhance creativity, and scale digital marketing like never before. Experience a smarter, more agile way to manage and supercharge your marketing efforts.</p>
            <Button
              buttonText="Experience Now"
              showIcon={false}
              backgroundColor="bg-white"
              textColor="text-green-300"
              customClass='px-8 py-1 mt-4 cursor-pointer tracking-wide text-base'
              handleClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="flex w-full flex-col lg:flex-row gap-4 items-center h-full lg:h-[430px] bg-white px-8 lg:px-32 py-6">
          <div className="w-full lg:w-1/2">
            <h1 className="text-[#00A881] text-xl leading-5  tracking-wide">HOW HPE BRANDLAB WORKS</h1>

            <p className="pt-4 text-3xl font-normal w-full xl:max-w-[60%]">Enabling Marketers With DIY Assets Creation driven through Gen AI</p>

            <p className="pt-6 text-wrap font-metricLight text-lg leading-6 tracking-wide">HPE BrandLab ai redefines marketing planning and campaign production, enabling you to execute operations faster, more efficiently, and at a lower cost. With your own Gen AI marketing concierge, you can streamline workflows, enhance creativity, and scale digital marketing like never before. Experience a smarter, more agile way to manage and supercharge your marketing efforts.</p>

            <Button
              buttonText="Start Now"
              showIcon={false}
              customClass='px-8 py-1 mt-4 cursor-pointer tracking-wide text-base'
              handleClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </div>
          <div className="w-full lg:w-1/2 flex items-center justify-center pt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center w-full">
              {TaglineContents.map((data, index) => (
                <div key={index} className=" h-full p-4 px-8 w-full max-w-[100%] lg:max-w-[240px] bg-white custom_shadowLoginpage flex flex-col gap-2 items-center">
                  <div className="mb-2">{data.IconComponent}</div>
                  <p className="text-center text-base leading-5">{data.title}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section className="relative w-full">
        <div className="flex w-full h-[150px] bg-no-repeat bg-cover bg-center">
          <img className="w-full h-full" src="/images/loginBottom.png" alt="" />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white">
          <h1 className="text-sm lg:text-3xl text-center font-bold tracking-wide">ELEVATE TO THE NEXT LEVEL</h1>
          <p className="text-sm lg:text-2xl text-center tracking-wide my-1 relative">Experience the power of HPE BrandLab<span className="absolute -top-1 text-sm">ai</span></p>
          <h1 className="text-sm lg:text-3xl text-center font-bold tracking-wide">JUMPSTART YOUR CAMPAIGNS</h1>
        </div>
      </section>
    </div>
  );
}

export default Home
