'use client';
import React, { useState } from 'react';
import LayoutWrapper from "@/layout/LayoutWrapper";
import Breadcrumb from "@/components/global/Breadcrumb";
import Image from 'next/image';
import Accordion from '@/components/global/Accordion';
import Button from '@/components/global/Button';
import TextField from '@/components/global/TextField';
import DropDown from '@/components/global/DropDown';
import ChildrenTitle from './components/ChildrenTitle';
import ChooseLabel from './components/ChooseLabel';
import RangeSlider from '@/components/global/RangeSlider';
import { useRouter } from 'next/navigation';
// import { html_content } from './data/data';
import { ApiService } from '@/lib/axios_generic';
import { urls } from '@/apis/urls';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const Page = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [generateStep, setGenerateStep] = useState(1); //1 - Normal, 2 - (Loading or disable), 3 - Regenerate
    const [checkedList, setCheckedList] = useState<number[]>([]);
    const [disableList, setDisableList] = useState<number[]>([2, 3]);
    const [isShowList, setIsShowList] = useState<number[]>([]);
    const [html_content, setHtml_content] = useState("");

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const ListTargetAudience = [
        { label: 'General Public', value: 'General Public' },
        { label: 'Existing Customers', value: 'Existing Customers' },
        { label: 'Prospective Customers', value: 'Prospective Customers' }
    ]

    const ListTone = [
        { label: 'Empathetic (for grievance/support)', value: 'Empathetic (for grievance/support)' },
        { label: 'Professional and Technical', value: 'Professional and Technical' },
        { label: 'Conversational and Collaborative', value: 'Conversational and Collaborative' },
        { label: 'Persuasive and Sales-Oriented', value: 'Persuasive and Sales-Oriented' }
    ]

    const onNext = (step: number): void => {
        if (step === 1) {
            setDisableList([1, 3])
            setIsShowList([2])
        } else if (step === 2) {
            setDisableList([1, 2])
            setIsShowList([3])
        } else if (step === 3) {
            setIsShowList([])
            if (checkedList.length === 3) { return }
        }
        setCheckedList([...checkedList, step])
    };

    const onBack = (step: number): void => {
        if (step === 3) {
            setDisableList([1, 3])
            setIsShowList([2])
            setCheckedList([1])
        } else if (step === 2) {
            setDisableList([2, 3])
            setIsShowList([1])
            setCheckedList([])
        }
    }

    const handleGenerate = async () => {
        if (generateStep === 2 || checkedList.length !== 3) { return }

        let newStep = generateStep + 1
        if (newStep === 4) {
            newStep = 1
            setIsOpen(false)
            setIsShowList([])
            setCheckedList([])
            setDisableList([2, 3])
        } else {
            if (newStep === 2) {
                const resHTML = await ApiService.get<any>(`${urls.asset_select}?assetId=e3c33964-f8a6-ef11-ac7b-0a9328dfcacd`)
                if (resHTML.isSuccess && resHTML.assetContentVersions.length > 0) {
                    const assetHTML = resHTML.assetContentVersions[0].assetHTML
                    setHtml_content(assetHTML)
                }

                setCheckedList([1, 2, 3])
                setDisableList([1, 2, 3])

                setTimeout(() => {
                    setGenerateStep(3)
                }, 1000);
            }
            setIsOpen(true)
        }
        setGenerateStep(newStep)
    }

    const handleEdit = () => {
        router.push("/call-script/call-script-edit")
    }

    const sidebarStep1 = () => {
        return (<div>
            <div>
                <Image
                    src="/images/event_invite_call_script.png"
                    alt="call script"
                    width={267}
                    height={362}
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
        return (<Image
            src="/images/event_invite_call_script.png"
            alt="call script"
            width={390}
            height={528}
        />)
    }

    const sidebarStep3 = () => {
        // return <div className="w-full h-full p-16 overflow-y-scroll" dangerouslySetInnerHTML={{ __html: html_content }} />;
        return (
            <TransformWrapper
                initialScale={0.4}
                minScale={0.4}
                maxScale={0.4}
                panning={{ lockAxisX: true }}
                centerZoomedOut
                initialPositionX={171}
            >
                <TransformComponent
                    wrapperStyle={{ width: '100%', height: '100%' }}
                >
                    <div dangerouslySetInnerHTML={{ __html: html_content }} />
                </TransformComponent>
            </TransformWrapper>
        )
    }

    return (
        <LayoutWrapper layout="main">
            <div className="flex py-[2rem] px-[1.5rem]">
                <div className='flex-1'>
                    <Breadcrumb projectName="GreenLake" TaskName="Storage Asia 2024" TaskType="SalesCall_1" />
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
                                    HeaderTitle="Call Objective and Target Audience"
                                    checked={checkedList.includes(1)}
                                    disableShowContent={disableList.includes(1)}
                                    handleShowContent={() => { setIsShowList([1]) }}
                                    isShowContent={isShowList.includes(1)}>
                                    <div className='max-w-[90%]'>
                                        <ChildrenTitle title='Provide details on the purpose of the call' ></ChildrenTitle>
                                        <TextField placeholder="What is the purpose of the call? What would you like to communicate?" customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>

                                        <ChildrenTitle title='Target audience' customClass='mt-5' ></ChildrenTitle>
                                        <DropDown selectPlaceHolder="Select Target Audience" optionLists={ListTargetAudience} ></DropDown>

                                        <ChildrenTitle title='Describe the key messages you want to highlight' customClass='mt-5' ></ChildrenTitle>
                                        <TextField placeholder="What are the 2-3 key points you want to highlight in this post?" customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>
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
                                    HeaderTitle="Tone, Style, and Objections"
                                    checked={checkedList.includes(2)}
                                    disableShowContent={disableList.includes(2)}
                                    handleShowContent={() => { setIsShowList([2]) }}
                                    isShowContent={isShowList.includes(2)}>
                                    <div className='max-w-[90%] flex'>
                                        <div className='flex-1'>
                                            <ChildrenTitle title='What tone should the call have?'></ChildrenTitle>
                                            <ChooseLabel optionLists={ListTone}></ChooseLabel>
                                        </div>
                                        <div className='flex-1'>
                                            <ChildrenTitle title='How creative you want the output?'></ChildrenTitle>
                                            <RangeSlider></RangeSlider>
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
                                    HeaderTitle="Content Structuring for Communication"
                                    checked={checkedList.includes(3)}
                                    disableShowContent={disableList.includes(3)}
                                    handleShowContent={() => { setIsShowList([3]) }}
                                    isShowContent={isShowList.includes(3)}>
                                    <div>
                                        <ChildrenTitle title='Prospect Details' customClass="text-[18px]" ></ChildrenTitle>
                                        <ChildrenTitle title='What is the prospect’s company and role?' ></ChildrenTitle>
                                        <TextField placeholder={`"Generate a personalized introduction for a sales call the Chief Information Officer (CIO) at Global Tech Solutions."`}
                                        ></TextField>

                                        <ChildrenTitle title='Solution Introduction' customClass="text-[18px] mt-[20px]" ></ChildrenTitle>
                                        <ChildrenTitle title='How does your solution align with the needs of this role and industry?' ></ChildrenTitle>
                                        <TextField placeholder={`"Generate an introduction for HPE GreenLake focusing on challenges like cloud management, cost optimization, and scalability. Include the benefits of a pay-per-use model and hybrid cloud flexibility."`} rows={2} ></TextField>

                                        <ChildrenTitle title='Value Proposition' customClass="text-[18px] mt-[20px]" ></ChildrenTitle>
                                        <ChildrenTitle title='What are the top benefits of your solution that would appeal to this prospect?' ></ChildrenTitle>
                                        <TextField placeholder={`"Generate a description of the key benefits of HPE GreenLake, focusing on cost reduction, scalability, and simplified cloud management. Emphasize how it helps streamline operations and allows the IT team to focus on strategic initiatives."`} rows={2}  ></TextField>

                                        <ChildrenTitle title='The Next Steps' customClass="text-[18px] mt-[20px]" ></ChildrenTitle>
                                        <ChildrenTitle title='What is the next step that you’d like the prospect to take?' ></ChildrenTitle>
                                        <TextField placeholder={`"Generate a call-to-action to schedule a demo. Highlight the value of the demo in showcasing how HPE GreenLake can optimize cloud operations. Mention a 30-minute session to walk through real-world applications for their team."`} rows={2}></TextField>
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
                            <div className='flex justify-end my-[50px]'>
                                <Button
                                    buttonText={[1, 2].includes(generateStep) ? 'Generate' : 'Regenerate'}
                                    showIcon
                                    textStyle='text-[1rem] font-base text-[#00A881]'
                                    backgroundColor={((checkedList.length === 3 && generateStep != 2) || generateStep === 3) ? "bg-custom-gradient-green" : "bg-[#B1B1B1]"}
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
