'use client';
import React, { useState } from 'react';
import LayoutWrapper from "@/layout/LayoutWrapper";
// import Breadcrumb from "@/components/global/Breadcrumb";
import Image from 'next/image';
import Accordion from '@/components/global/Accordion';
import Button from '@/components/global/Button';
import TextField from '@/components/global/TextField';
import DropDown from '@/components/global/DropDown';
import ChildrenTitle from '@/components/global/ChildrenTitle';
import RangeSlider from '@/components/global/RangeSlider';
import { useRouter } from 'next/navigation';
import DragAndDrop from '@/components/global/DragAndDrop';

const Page = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [generateStep, setGenerateStep] = useState(1); //1 - Normal, 2 - (Loading or disable), 3 - Regenerate
    const [checkedList, setCheckedList] = useState<number[]>([]);
    const [disableList, setDisableList] = useState<number[]>([2, 3, 4]);
    const [isShowList, setIsShowList] = useState<number[]>([]);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const ListTargetAudience = [
        { label: 'General Public', value: 'General Public' },
        { label: 'Existing Customers', value: 'Existing Customers' },
        { label: 'Prospective Customers', value: 'Prospective Customers' }
    ]

    const listofcampains = [
        { label: 'Product Launch', value: 'Product Launch' },
        { label: 'Event Promotion', value: 'Event Promotion' },
        { label: 'Brand Awareness', value: 'Brand Awareness' },
        {label: 'Demand Generation' , value: 'Demand Generation'}
    ]

    const emailType = [
        { label: 'Announcement', value: 'Announcement' },
        { label: 'Newsletter', value: 'Newsletter' },
        { label: 'Promotional Email', value: 'Promotional Email' }
    ]

    const keyPoints = [
        { label: 'Innovation', value: 'Innovation' },
        { label: 'Performance', value: 'Performance' },
        { label: 'Increased Security', value: 'Increased Security' },
    ]

    const onNext = (step: number): void => {
        if (step === 1) {
            setDisableList([1, 3])
            setIsShowList([2])
        } else if (step === 2) {
            setDisableList([1, 2])
            setIsShowList([3])
        } else if (step === 3) {
            setIsShowList([4])
        } else if (step === 4) {
            setIsShowList([])
            if (checkedList.length === 4) { return }
        }
        setCheckedList([...checkedList, step])
    };

    const onBack = (step: number): void => {
        if (step === 4) {
            setDisableList([1, 2, 4]);
            setIsShowList([3]);
            setCheckedList([1, 2, 3]);
        } else if (step === 3) {
            setDisableList([1, 3]);
            setIsShowList([2]);
            setCheckedList([1]);
        } else if (step === 2) {
            setDisableList([2, 3, 4]);
            setIsShowList([1]);
            setCheckedList([]);
        }
    };


    const handleGenerate = (): void => {
        if (generateStep === 2 || checkedList.length !== 4) {
            return;
        }

        let newStep = generateStep + 1;

        if (newStep === 5) { // Reset after completing step 4
            newStep = 1;
            setIsOpen(false);
            setIsShowList([]);
            setCheckedList([]);
            setDisableList([2, 3, 4]);
        } else {
            if (newStep === 2) {
                setCheckedList([1, 2, 3, 4]);
                setDisableList([1, 2, 3, 4]);
                setTimeout(() => {
                    setGenerateStep(3);
                }, 3000);
            }
            setIsOpen(true);
        }
        setGenerateStep(newStep);
    };


    const handleEdit = () => {
        router.push("")
    }

    const sidebarStep1 = () => {
        return (<div>
            <div>
                <Image
                    className='w-[267px] h-[420px]'
                    src="/images/linkedin-template.png"
                    alt="call script"
                    width="267"
                    height="360"
                />
                <p className="w-[275px] mt-[16px] [font-family:'Inter-SemiBold',Helvetica] font-normal text-black text-[11px] tracking-[0] leading-[normal]">
                    <span className="font-semibold">Prospect Details</span>

                    <span className="[font-family:'Inter-Regular',Helvetica]"> </span>

                    <span className="[font-family:'Inter-Regular',Helvetica] text-[10px]">
                        Personalise the introduction based on the prospect’s background.
                        <br />
                    </span>

                    <span className="[font-family:'Inter-Regular',Helvetica]">
                        <br />
                    </span>

                    <span className="font-semibold">Solution Introduction</span>

                    <span className="[font-family:'Inter-Regular',Helvetica]"> </span>

                    <span className="[font-family:'Inter-Regular',Helvetica] text-[10px]">
                        Explain how your product or service is relevant to the prospect’s
                        needs.
                        <br />
                    </span>

                    <span className="[font-family:'Inter-Regular',Helvetica]">
                        <br />
                    </span>

                    <span className="font-semibold">Value Proposition</span>

                    <span className="[font-family:'Inter-Regular',Helvetica]"> </span>

                    <span className="[font-family:'Inter-Regular',Helvetica] text-[10px]">
                        Showcase the primary benefits of your product or service that directly
                        address the prospect’s pain points.
                        <br />
                    </span>

                    <span className="[font-family:'Inter-Regular',Helvetica]">
                        <br />
                    </span>

                    <span className="font-semibold">The Next Steps</span>

                    <span className="[font-family:'Inter-Regular',Helvetica]"> </span>

                    <span className="[font-family:'Inter-Regular',Helvetica] text-[10px]">
                        Encourage the prospect to take action to move the conversation
                        forward.
                    </span>
                </p>
            </div>
        </div>)
    }

    const sidebarStep2 = () => {
        return (
            <div className='w-full h-full flex items-center justify-center overflow-y-scroll'>
                <img className='w-[350px] h-[550px]' src="/images/post-template.png" alt="" />
            </div>
        )
    }

    const sidebarStep3 = () => {
        return (
            <div className='w-full h-full flex items-center justify-center overflow-y-scroll'>
                <img className='w-[350px] h-[550px]' src="/images/Frame-linkedin.png" alt="" />
            </div>
        )
    }

    return (
        <LayoutWrapper layout="main">
            <div className="flex py-[2rem] px-[1.5rem]">
                <div className='flex-1'>
                    {/* <Breadcrumb projectName="GreenLake" TaskName="Storage Asia 2024" TaskType="LinkedIn_1" /> */}
                </div>
                {generateStep === 3 ? <div className='flex'>
                    <Button
                        buttonText='View & Edit'
                        showIcon
                        textStyle='text-[1rem] font-base text-[#00A881]'
                        textColor="text-[#00A881]"
                        iconColor="#00A881"
                        backgroundColor='bg-[#fff]'
                        handleClick={handleEdit}
                        customClass='min-w-[180px] static border-[3px] border-[#00A881] px-[1.4rem] py-2 group-hover:border-white mr-[70px]' />
                    <Button
                        buttonText='Save'
                        showIcon
                        textStyle='text-[1rem] font-base text-[#00A881]'
                        textColor="text-[#00A881]"
                        iconColor="#00A881"
                        backgroundColor='bg-[#fff]'
                        customClass='min-w-[180px] static border-[3px] border-[#00A881] px-[1.4rem] py-2 group-hover:border-white' />
                </div> : null}
            </div>
            <div className="min-h-[70vh] border-t border-solid border-[#D9D9D9]">
                <div className="flex">
                    <div className="flex-1 py-10">
                        <div className="flex items-center justify-center">
                            <p className="[font-family:'Inter-Bold',Helvetica] font-bold text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap pb-[10px]">
                                Please provide the necessary information to generate AI content
                            </p>
                        </div>
                        <div className='px-[10%] overflow-y-scroll scrollbar-hide h-[62vh]'>
                            <div className='mt-[40px]'>
                                {/* step 1 */}
                                <Accordion
                                    HeaderTitle="Campaign Overview"
                                    checked={checkedList.includes(1)}
                                    disableShowContent={disableList.includes(1)}
                                    handleShowContent={() => { setIsShowList([1]) }}
                                    isShowContent={isShowList.includes(1)}>
                                    <div className='max-w-[90%]'>
                                        <ChildrenTitle title='Product/Solution' ></ChildrenTitle>
                                        <TextField placeholder="Enter the name of the product or solution." customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>

                                        <div className='flex items-center gap-[16%]'>
                                            <div>
                                                <ChildrenTitle title='Campaign Goal' customClass='mt-5' ></ChildrenTitle>
                                                <DropDown selectPlaceHolder="Select Campaign Goal" optionLists={listofcampains} ></DropDown>
                                            </div>

                                            <div>
                                                <ChildrenTitle title='Target audience' customClass='mt-5' ></ChildrenTitle>
                                                <DropDown selectPlaceHolder="Select Target Audience" optionLists={ListTargetAudience} ></DropDown>
                                            </div>
                                        </div>

                                        <div className='w-[300px]'>
                                            <ChildrenTitle title='How creative you want the output?' customClass='mt-5' ></ChildrenTitle>
                                            <RangeSlider></RangeSlider>
                                        </div>
                                    </div>
                                    <div className='max-w-full flex justify-end pt-5 pb-3'>
                                        <Button
                                            buttonText='Next'
                                            showIcon
                                            textStyle='text-[1rem] font-base text-[#00A881]'
                                            textColor="text-[#00A881]"
                                            iconColor="#00A881"
                                            backgroundColor='bg-[#fff]'
                                            handleClick={() => { onNext(1) }}
                                            customClass='static  px-[1.4rem] py-2 group-hover:border-white' />
                                    </div>
                                </Accordion>
                            </div>
                            <div className='mt-[25px]'>
                                {/* step 2 */}
                                <Accordion
                                    HeaderTitle="Post Context"
                                    checked={checkedList.includes(2)}
                                    disableShowContent={disableList.includes(2)}
                                    handleShowContent={() => { setIsShowList([2]) }}
                                    isShowContent={isShowList.includes(2)}>
                                    <div className='max-w-[90%]'>
                                        <ChildrenTitle customClass='mt-5' title='Specify the topic, occasion, event or context for your post.' />
                                        <TextField placeholder="Please enter the name of your campaign, event or occasion." customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>

                                        <div className='flex items-center gap-[16%]'>
                                            <div>
                                                <ChildrenTitle title='Email Type' customClass='mt-5' />
                                                <DropDown selectPlaceHolder="Select Post Type" optionLists={emailType} />
                                            </div>

                                            <div>
                                                <ChildrenTitle title='Key Points' customClass='mt-5' />
                                                <DropDown selectPlaceHolder="Select Key Points" optionLists={keyPoints} />
                                            </div>
                                        </div>

                                    </div>
                                    <div className='max-w-full flex justify-end pt-5 pb-3'>
                                        <Button
                                            buttonText='Back'
                                            showIcon
                                            textStyle='text-[1rem] font-base text-[#00A881]'
                                            textColor="text-[#B1B1B1]"
                                            iconColor="#B1B1B1"
                                            backgroundColor='bg-[#fff]'
                                            customClassIcon="rotate-180"
                                            handleClick={() => { onBack(2) }}
                                            customClass='static  px-[1.4rem] py-2 group-hover:border-white flex-row-reverse' />
                                        <Button
                                            buttonText='Next'
                                            showIcon
                                            textStyle='text-[1rem] font-base text-[#00A881]'
                                            textColor="text-[#00A881]"
                                            iconColor="#00A881"
                                            backgroundColor='bg-[#fff]'
                                            handleClick={() => { onNext(2) }}
                                            customClass='static  px-[1.4rem] py-2 group-hover:border-white' />
                                    </div>
                                </Accordion>
                            </div>
                            <div className='mt-[25px]'>
                                {/* step 3 */}
                                <Accordion
                                    HeaderTitle="Additional Campaign Assets"
                                    checked={checkedList.includes(3)}
                                    disableShowContent={disableList.includes(3)}
                                    handleShowContent={() => { setIsShowList([3]) }}
                                    isShowContent={isShowList.includes(3)}>
                                    <div>
                                        <DragAndDrop />

                                        <ChildrenTitle customClass='mt-5' title='Website Link'></ChildrenTitle>
                                        <TextField placeholder="Paste your URL here." customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>
                                    </div>
                                    <div className='max-w-full flex justify-end pt-5 pb-3'>
                                        <Button
                                            buttonText='Back'
                                            showIcon
                                            textStyle='text-[1rem] font-base text-[#00A881]'
                                            textColor="text-[#B1B1B1]"
                                            iconColor="#B1B1B1"
                                            backgroundColor='bg-[#fff]'
                                            customClassIcon="rotate-180"
                                            handleClick={() => { onBack(3) }}
                                            customClass='static  px-[1.4rem] py-2 group-hover:border-white flex-row-reverse' />
                                        <Button
                                            buttonText='Next'
                                            showIcon
                                            textStyle='text-[1rem] font-base text-[#00A881]'
                                            textColor="text-[#00A881]"
                                            iconColor="#00A881"
                                            backgroundColor='bg-[#fff]'
                                            handleClick={() => { onNext(3) }}
                                            customClass='static  px-[1.4rem] py-2 group-hover:border-white' />
                                    </div>
                                </Accordion>
                            </div>

                            <div className='mt-[25px]'>
                                {/* step 4 */}
                                <Accordion
                                    HeaderTitle="Content Structuring for Communication"
                                    checked={checkedList.includes(4)}
                                    disableShowContent={disableList.includes(4)}
                                    handleShowContent={() => { setIsShowList([4]) }}
                                    isShowContent={isShowList.includes(4)}>
                                    <div>
                                        <ChildrenTitle title='Hook/Headline & Introduction' customClass="text-[18px]" />
                                        <ChildrenTitle title='Catchy introduction to the topic/product along with a brief overview.' />
                                        <TextField customClass='h-16' placeholder={`"Write a compelling headline that promotes the benefits of HPE GreenLake’s hybrid cloud solution, followed by a 2-3 sentence introduction explaining the benefits of HPE GreenLake and why attending StorageAsia 2024 is beneficial."`} />

                                        <ChildrenTitle title='Main Message & Call-to-Action (CTA)' customClass="text-[18px] mt-[20px]" />
                                        <ChildrenTitle title='Highlight the core benefits of the product along with actionable event details.' />
                                        <TextField placeholder={`"List 2-3 key benefits of HPE GreenLake, focusing on flexibility, control, and cost efficiency. Write a 2-3 sentence event promotion with a call-to-action that encourages users to attend StorageAsia 2024 and engage with HPE experts."`} rows={2} />

                                        <ChildrenTitle title='Hashtags & Keywords' customClass="text-[18px] mt-[20px]" />
                                        <ChildrenTitle title='Industry-relevant hashtags for discoverability.' />
                                        <TextField placeholder={`"Generate 4-5 relevant hashtags for an HPE GreenLake LinkedIn post on hybrid cloud solutions."`} rows={1} />

                                    </div>
                                    <div className='max-w-full flex justify-end pt-5 pb-3'>
                                        <Button
                                            buttonText='Back'
                                            showIcon
                                            textStyle='text-[1rem] font-base text-[#00A881]'
                                            textColor="text-[#B1B1B1]"
                                            iconColor="#B1B1B1"
                                            backgroundColor='bg-[#fff]'
                                            customClassIcon="rotate-180"
                                            handleClick={() => { onBack(4) }}
                                            customClass='static  px-[1.4rem] py-2 group-hover:border-white flex-row-reverse' />
                                        <Button
                                            buttonText='Next'
                                            showIcon
                                            textStyle='text-[1rem] font-base text-[#00A881]'
                                            textColor="text-[#00A881]"
                                            iconColor="#00A881"
                                            backgroundColor='bg-[#fff]'
                                            handleClick={() => { onNext(4) }}
                                            customClass='static  px-[1.4rem] py-2 group-hover:border-white' />
                                    </div>
                                </Accordion>
                            </div>
                            <div className='flex justify-end my-[50px]'>
                                <Button
                                    buttonText={[1, 2].includes(generateStep) ? 'Generate' : 'Regenerate'}
                                    showIcon
                                    textStyle='text-[1rem] font-base text-[#00A881]'
                                    backgroundColor={((checkedList.length === 4 && generateStep != 2) || generateStep === 4) ? "bg-custom-gradient-green" : "bg-[#B1B1B1]"}
                                    handleClick={handleGenerate}
                                    customClass='static  px-[1.4rem] py-2 group-hover:border-white' />
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        {/* Button */}
                        {generateStep === 1 ? <div
                            className="flex w-[25px] h-14 items-center gap-2.5 px-2 py-[19px] relative bg-[#00b188] rounded-[10px_0px_0px_10px] mt-[20px] cursor-pointer"
                            onClick={toggleSidebar}
                        >
                            <img
                                className={`relative w-[10.5px] h-[18.5px] mt-[-0.25px] mb-[-0.25px] ml-[-0.75px] mr-[-0.75px] transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`}
                                alt="Vector"
                                src="/vector_right_arrow.svg"
                            />
                        </div> : null}
                        {/* Sidebar */}
                        <div
                            className={`bg-[#F5F5F7] flex items-center justify-center overflow-y-scroll scrollbar-hide transition-all duration-300 ease-in-out ${isOpen ? (generateStep === 1 ? 'w-[320px]' : 'w-[525px]') : 'w-[0px]'} h-[70vh]`}
                        >
                            {generateStep === 1 && sidebarStep1()}
                            {generateStep === 2 && sidebarStep2()}
                            {generateStep === 3 && sidebarStep3()}
                        </div>
                    </div>
                </div>
            </div>
        </LayoutWrapper>
    );
};

export default Page;
