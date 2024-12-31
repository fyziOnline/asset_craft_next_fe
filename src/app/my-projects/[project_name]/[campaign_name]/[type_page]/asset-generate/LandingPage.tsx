'use client';
import React, { useEffect, useRef, useState } from 'react';
import Accordion from '@/components/global/Accordion';
import Button from '@/components/global/Button';
import TextField from '@/components/global/TextField';
import DropDown from '@/components/global/DropDown';
import ChildrenTitle from '@/components/global/ChildrenTitle';
import RangeSlider from '@/components/global/RangeSlider';
import DragAndDrop from '@/components/global/DragAndDrop';
import { useAppData } from '@/context/AppContext';
import { Template } from '@/types/templates';
import { useLoading } from '@/components/global/Loading/LoadingContext';
import { SectionProps, useInputFormDataGenerate } from '@/hooks/useInputFormDataGenerate';

interface LandingPageProps {
    params: {
        template: Template
        project_name?: string
    }
}

const ListTargetAudience = [
    { label: 'General Public', value: 'General Public' },
    { label: 'Existing Customers', value: 'Existing Customers' },
    { label: 'Prospective Customers', value: 'Prospective Customers' }
]

const listofcampains = [
    { label: 'Product Launch', value: 'Product Launch' },
    { label: 'Event Promotion', value: 'Event Promotion' },
    { label: 'Brand Awareness', value: 'Brand Awareness' },
    { label: 'Demand Generation', value: 'Demand Generation' }
]

const LandingPage = ({ params }: LandingPageProps) => {
    const [generateStep, setGenerateStep] = useState(1); //1 - Normal, 2 - (Loading or disable), 3 - Regenerate
    const [checkedList, setCheckedList] = useState<number[]>([]);
    const [disableList, setDisableList] = useState<number[]>([2, 3, 4]);
    const [isShowList, setIsShowList] = useState<number[]>([]);
    const { refFormData, refSection, handleInputText, handleInputSection } = useInputFormDataGenerate()
    const { setShowLoading } = useLoading()
    const { setContextData } = useAppData();

    useEffect(() => {
        refFormData.current = {
            ...refFormData.current,
            product: params.project_name
        }
    }, [])

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
                setShowLoading(true)
                //call api
                // const res = await generateHTML(refFormData.current as FormDataProps, refSection.current as SectionProps[], contextData.isRegenerateHTML)
                setShowLoading(false)
                setGenerateStep(3);
                //next step
                // setContextData({ assetGenerateStatus: 3, AssetHtml: res as AssetHtmlProps, isShowEdit_Save_Button: res?.isSuccess, isRegenerateHTML: true });
                return
            }
        }
        setContextData({ assetGenerateStatus: newStep });
        setGenerateStep(newStep);
    };

    return (
        <div>
            <div className='mt-[40px]'>
                {/* step 1 */}
                <Accordion
                    isRequire={true}
                    HeaderTitle="Campaign Overview"
                    checked={checkedList.includes(1)}
                    disableShowContent={disableList.includes(1)}
                    handleShowContent={() => { setIsShowList([1]) }}
                    isShowContent={isShowList.includes(1)}>
                    <div>
                        <ChildrenTitle title='Product/Solution' ></ChildrenTitle>
                        <TextField
                            handleChange={(e) => { handleInputText(e, "product") }}
                            placeholder="Enter the name of the product or solution."
                            value={params.project_name}
                            customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>

                        <div className='flex items-start gap-[16%]'>
                            <div className='w-[260px]'>
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

                            <div className='w-[260px]'>
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
                    isRequire={true}
                    HeaderTitle="Key Message & Content"
                    checked={checkedList.includes(2)}
                    disableShowContent={disableList.includes(2)}
                    handleShowContent={() => { setIsShowList([2]) }}
                    isShowContent={isShowList.includes(2)}>
                    <div>
                        <ChildrenTitle customClass='mt-5' title='What is the primary message of the landing page?'></ChildrenTitle>
                        <TextField
                            handleChange={(e) => { handleInputText(e, "topic") }}
                            placeholder="Are you ready to experience the future of IT with the power of hybrid cloud?" customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>

                        <ChildrenTitle customClass='mt-5' title='Provide additional information that supports the main message.'></ChildrenTitle>
                        <TextField
                            handleChange={(e) => { handleInputText(e, "keyPoints") }}
                            rows={4}
                            placeholder={`HPE GreenLake helps you manage both public and private cloud environments with full control and flexibility.\nFeature 1\nFeature 2\nFeature 3`}
                            customAreaClass='whitespace-pre-line overflow-x-hidden overflow-y-auto scrollbar-hide'></TextField>

                    </div>
                    <div className='max-w-full flex justify-end pt-5 pb-3'>
                        <Button
                            buttonText='Back'
                            showIcon
                            textStyle='text-[1rem] font-base text-[#000000]'
                            textColor="text-[#000000]"
                            iconColor="#000000"
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
                        <TextField
                            handleChange={(e) => { handleInputText(e, "webUrl") }}
                            placeholder="Paste your URL here." customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>
                    </div>
                    <div className='max-w-full flex justify-end pt-5 pb-3'>
                        <Button
                            buttonText='Back'
                            showIcon
                            textStyle='text-[1rem] font-base text-[#000000]'
                            textColor="text-[#000000]"
                            iconColor="#000000"
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
                        {params.template?.templatesBlocks && params.template?.templatesBlocks.filter((item) => !item.isStatic).map((item, index) => {
                            if (params.template.templatesBlocks && refSection.current.length < params.template.templatesBlocks.length) {
                                refSection.current = [...refSection.current as SectionProps[], {
                                    templateBlockID: item.templateBlockID || "",
                                    aiPrompt: item.aiPrompt || ""
                                }]
                            }

                            return (
                                <div key={index}>
                                    <ChildrenTitle title={`Section ${index + 1}: ${item.aiTitle || ''}`} customClass={`text-[18px] ${index === 0 ? "" : "mt-[20px]"}`} />
                                    <ChildrenTitle title={item.aiDescription || ''} customClass="text-[14px]" />
                                    <TextField handleChange={(e) => { handleInputSection(e, index) }} customClass='h-16' defaultValue={item.aiPrompt || ''} />
                                </div>
                            )
                        })}
                    </div>
                    {/* <div>
                        <ChildrenTitle title='Section 1: Hero Section' customClass="text-[18px]" />
                        <ChildrenTitle title='Headline:' />
                        <TextField customClass='h-16' placeholder={`"Generate a compelling headline that captures attention and introduces the product. The product is [Product Name], and it is designed to help [Target Audience] with [Main Benefit]."`} />

                        <ChildrenTitle title='Subheading:' customClass="text-[18px] mt-[20px]" />
                        <TextField placeholder={`"Generate a brief subheading or tagline that supports the headline and highlights the product’s core value. Focus on [Key Feature] for [Target Audience]."`} rows={2} />

                        <ChildrenTitle title='Call-to-Action (CTA):' customClass="text-[18px] mt-[20px]" />
                        <TextField placeholder={`"Generate a clear call-to-action (CTA) encouraging users to engage. Focus on [Desired User Action]."`} rows={1} />

                        <ChildrenTitle title='Section 2: Feature Highlights' customClass="text-[18px] mt-[20px]" />
                        <ChildrenTitle title='Main Features:' />
                        <TextField placeholder={`“List 3-5 main features or benefits of the product. Focus on [Key Features] and how they help [Target Audience]."`} rows={1} />

                        <ChildrenTitle title='Section 3: Closing CTA' customClass="text-[18px] mt-[20px]" />
                        <ChildrenTitle title='Final Call-to-Action:' />
                        <TextField placeholder={`"Sign up for a free demo and experience cloud efficiency today!"`} rows={1} />
                    </div> */}
                    <div className='max-w-full flex justify-end pt-5 pb-3'>
                        <Button
                            buttonText='Back'
                            showIcon
                            textStyle='text-[1rem] font-base text-[#000000]'
                            textColor="text-[#000000]"
                            iconColor="#000000"
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

export default LandingPage;
