'use client';
import React, { useRef, useState } from 'react';
import Accordion from '@/components/global/Accordion';
import Button from '@/components/global/Button';
import TextField from '@/components/global/TextField';
import DropDown from '@/components/global/DropDown';
import ChildrenTitle from '@/components/global/ChildrenTitle';
import RangeSlider from '@/components/global/RangeSlider';
import DragAndDrop from '@/components/global/DragAndDrop';
import { useAppData } from '@/context/AppContext';
import { useGenerateTemplate } from '@/hooks/useGenerateTemplate';
import { AssetHtmlProps, Template } from '@/types/templates';

interface EmailPageProps {
    params: {
        assetID: string,
        campaignID: string,
        template: Template,
        assetVersionID: string
    }
}

export interface FormEmailDataProps {
    product?: string,
    campaignGoal?: string,
    targetAudience?: string,
    outputScale?: number,
    topic?: string,
    type?: string,
    keyPoints?: string,
    fileSelected?: File,
    webUrl?: string
}

interface SectionProps {
    assetVersionID: string,
    templateBlockID: string,
    aiPrompt: string
}

const ListTargetAudience = [
    { label: 'General Public', value: 'General Public' },
    { label: 'Existing Customers', value: 'Existing Customers' },
    { label: 'Prospective Customers', value: 'Prospective Customers' }
]

const listofcampains = [
    { label: 'Product Launch', value: 'Product Launch' },
    { label: 'Event Promotion', value: 'Event Promotion' },
    { label: 'Brand Awareness', value: 'Brand Awareness' }
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

const EmailPage = ({ params }: EmailPageProps) => {
    const [generateStep, setGenerateStep] = useState(1); //1 - Normal, 2 - (Loading or disable), 3 - Regenerate
    const [checkedList, setCheckedList] = useState<number[]>([]);
    const [disableList, setDisableList] = useState<number[]>([2, 3, 4]);
    const [isShowList, setIsShowList] = useState<number[]>([]);
    const { generateHTML } = useGenerateTemplate({ params: { assetID: params.assetID, campaignID: params.campaignID } })
    const refFormData = useRef<FormEmailDataProps>()
    const refSection = useRef<SectionProps[]>([])

    const { setContextData } = useAppData();

    const onNext = (step: number): void => {
        console.log('refFormData.current: ', refFormData.current);

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

    const handleGenerate = async () => {
        if (generateStep === 2 || checkedList.length !== 4) {
            return;
        }

        let newStep = generateStep + 1;

        if (newStep > 3) { // Reset after completing step 3
            newStep = 1;
            setIsShowList([]);
            setCheckedList([]);
            setDisableList([2, 3, 4]);
            setContextData({ assetTemplateShow: false });
        } else {
            setContextData({ assetTemplateShow: true });

            if (newStep === 2) {
                setCheckedList([1, 2, 3, 4]);
                setDisableList([1, 2, 3, 4]);
                setContextData({ assetGenerateStatus: newStep });
                setGenerateStep(newStep);
                const res = await generateHTML(refFormData.current as FormEmailDataProps)
                setGenerateStep(3);
                setContextData({ assetGenerateStatus: 3, AssetHtml: res as AssetHtmlProps, isShowEdit_Save_Button: res?.isSuccess });
                return
            }
        }
        setContextData({ assetGenerateStatus: newStep });
        setGenerateStep(newStep);
    };

    const handleInputText = (e: React.ChangeEvent<HTMLTextAreaElement>, key: string) => {
        refFormData.current = {
            ...refFormData.current,
            [key]: e.target.value
        }
    }

    const handleInputSection = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
        if (refSection.current && refSection.current[index]) {
            refSection.current[index] = {
                ...refSection.current[index],
                aiPrompt: e.target.value
            }
        }
        console.log('refSection.current: ', refSection.current);
    }

    return (
        <div>
            <div className='mt-[40px]'>
                {/* step 1 */}
                <Accordion
                    HeaderTitle="Campaign Overview"
                    checked={checkedList.includes(1)}
                    disableShowContent={disableList.includes(1)}
                    handleShowContent={() => { setIsShowList([1]) }}
                    isShowContent={isShowList.includes(1)}>
                    <div>
                        <ChildrenTitle title='Product/Solution' ></ChildrenTitle>
                        <TextField handleChange={(e) => { handleInputText(e, "product") }}
                            placeholder="Enter the name of the product or solution."
                            customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>

                        <div className='flex items-start gap-[16%]'>
                            <div>
                                <ChildrenTitle title='Campaign Goal' customClass='mt-5' ></ChildrenTitle>
                                <DropDown
                                    onSelected={(optionSelected) => {
                                        refFormData.current = {
                                            ...refFormData.current,
                                            campaignGoal: optionSelected.value
                                        }
                                    }}
                                    selectPlaceHolder="Select Campaign Goal" optionLists={listofcampains} ></DropDown>
                            </div>

                            <div>
                                <ChildrenTitle title='Target audience' customClass='mt-5' ></ChildrenTitle>
                                <DropDown
                                    onSelected={(optionSelected) => {
                                        refFormData.current = {
                                            ...refFormData.current,
                                            targetAudience: optionSelected.value
                                        }
                                    }}
                                    selectPlaceHolder="Select Target Audience" optionLists={ListTargetAudience} ></DropDown>
                            </div>
                        </div>

                        <div className='w-[300px]'>
                            <ChildrenTitle title='How creative you want the output?' customClass='mt-5' ></ChildrenTitle>
                            <RangeSlider onSelectValue={(value) => {
                                refFormData.current = {
                                    ...refFormData.current,
                                    outputScale: value
                                }
                            }}></RangeSlider>
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
                    HeaderTitle="Email - Key Messages & Content"
                    checked={checkedList.includes(2)}
                    disableShowContent={disableList.includes(2)}
                    handleShowContent={() => { setIsShowList([2]) }}
                    isShowContent={isShowList.includes(2)}>
                    <div className='max-w-[90%]'>
                        <ChildrenTitle customClass='mt-5' title='Specify the topic, occasion, event or context for your post.' />
                        <TextField handleChange={(e) => { handleInputText(e, "topic") }}
                            placeholder="Please enter the name of your campaign, event or occasion." customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>

                        <div className='flex items-start gap-[16%]'>
                            <div>
                                <ChildrenTitle title='Email Type' customClass='mt-5' />
                                <DropDown onSelected={(optionSelected) => {
                                    refFormData.current = {
                                        ...refFormData.current,
                                        type: optionSelected.value
                                    }
                                }} selectPlaceHolder="Select Post Type" optionLists={emailType} />
                            </div>

                            <div>
                                <ChildrenTitle title='Key Points' customClass='mt-5' />
                                <DropDown onSelected={(optionSelected) => {
                                    refFormData.current = {
                                        ...refFormData.current,
                                        keyPoints: optionSelected.value
                                    }
                                }} selectPlaceHolder="Select Key Points" optionLists={keyPoints} />
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
                        <DragAndDrop onFileSelect={(file) => {
                            refFormData.current = {
                                ...refFormData.current,
                                fileSelected: file
                            }
                        }} />

                        <ChildrenTitle customClass='mt-5' title='Website Link'></ChildrenTitle>
                        <TextField handleChange={(e) => { handleInputText(e, "webUrl") }}
                            placeholder="Paste your URL here." customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>
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
                        {params.template.templatesBlocks.map((item, index) => {
                            if (refSection.current.length < params.template.templatesBlocks.length) {
                                refSection.current = [...refSection.current as SectionProps[], {
                                    assetVersionID: params.assetVersionID,
                                    templateBlockID: item.templateBlockID as string,
                                    aiPrompt: ""
                                }]
                            }
                            return (
                                <div key={index}>
                                    <ChildrenTitle title={`Section ${index + 1}: ${item.aiTitle || ''}`} customClass={`text-[18px] ${index === 0 ? "" : "mt-[20px]"}`} />
                                    <ChildrenTitle title={item.aiDescription || ''} customClass="text-[14px]" />
                                    <TextField handleChange={(e) => { handleInputSection(e, index) }} customClass='h-16' placeholder={item.aiPrompt || ''} />
                                </div>
                            )
                        })}
                        {/* <ChildrenTitle title='Section 1: Event Overview ' customClass="text-[18px]" />
                        <ChildrenTitle title='What are the key details for the event, including the title, date, location, a brief overview, and any call-to-action text?' customClass="text-[14px]" />
                        <TextField handleChange={(e) => { handleInputText(e, "section1") }}
                            customClass='h-16' placeholder={`“Event Title: HPE Discover More AI Singapore 2024. Date and Time: Thursday, 14 November 2024, 11:00 AM - 5:25 PM”`} />

                        <ChildrenTitle title='Section 2: Event Agenda' customClass="text-[18px] mt-[20px]" />
                        <ChildrenTitle title='Can you outline the event agenda, including session timings, special sessions, notable speakers, and closing activities?' customClass="text-[14px] w-[85%] text-wrap" />
                        <TextField handleChange={(e) => { handleInputText(e, "section2") }}
                            placeholder={`“11:00 - 13:00: Registration and HPE Discover More AI Showcase (Lunch provided). 13:00 - 15:30: Plenary Session 15:30 - 16:30: Breakout Tracks “`} rows={2} />

                        <ChildrenTitle title='Section 3: Key Benefits and Highlights' customClass="text-[18px] mt-[20px]" />
                        <ChildrenTitle title='What are the main benefits and highlights of the event for attendees, including key takeaways, showcased technologies, and target industries?' customClass="text-[14px] w-[95%] text-wrap" />
                        <TextField handleChange={(e) => { handleInputText(e, "section3") }}
                            placeholder={`"Generate Key Benefits and Highlights, including takeaways, showcased technologies, and target industries."`} rows={1} />

                        <ChildrenTitle title='Section 4: Partnership and Sponsorship' customClass="text-[18px] mt-[20px]" />
                        <ChildrenTitle title='Who are the event partners or sponsors, and what sponsorship levels and logo specifications would you like to include?' customClass="text-[14px] w-[95%] text-wrap" />
                        <TextField handleChange={(e) => { handleInputText(e, "section4") }}
                            placeholder={`“Platinum Sponsors: Intel NVIDIA. Gold Sponsors: AMD, Cohesity, Commvault, Ekahau, Nutanix, Red Hat, Veeam”`} rows={1} /> */}
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
    );
};

export default EmailPage;
