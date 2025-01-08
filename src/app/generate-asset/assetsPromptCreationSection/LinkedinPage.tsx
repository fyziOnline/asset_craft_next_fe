'use client';
import React, { useEffect, useState } from 'react';
import Accordion from '@/components/global/Accordion';
import Button from '@/components/global/Button';
import TextField from '@/components/global/TextField';
import DropDown from '@/components/global/DropDown';
import ChildrenTitle from '@/components/global/ChildrenTitle';
import RangeSlider from '@/components/global/RangeSlider';
import DragAndDrop from '@/components/global/DragAndDrop';
import { useAppData } from '@/context/AppContext';
import { AssetHtmlProps, Template } from '@/types/templates';
import { useGenerateTemplate } from '@/hooks/useGenerateTemplate';
import { FormDataProps, SectionProps, useInputFormDataGenerate } from '@/hooks/useInputFormDataGenerate';
import { useLoading } from '@/components/global/Loading/LoadingContext';
import { emailType, keyPoints, listofcampains, ListTargetAudience } from '@/data/dataGlobal';
import SectionAssetDetails from '@/components/assetGeneration/SectionAssetDetails';
import { useRouter } from 'next/navigation';

interface LinkedInPageProps {
    params: {
        template: Template
        project_name?: string
    }
}

const LinkedInPage = ({ params }: LinkedInPageProps) => {
    const router = useRouter();
    const [generateStep, setGenerateStep] = useState(1); //1 - Normal, 2 - (Loading or disable), 3 - Regenerate
    const [checkedList, setCheckedList] = useState<number[]>([]);
    const [disableList, setDisableList] = useState<number[]>([1, 2, 3, 4]);
    const [isShowList, setIsShowList] = useState<number[]>([]);
    const { generateHTML } = useGenerateTemplate({ params: { templateID: params.template?.templateID ?? '' as string } })
    const { refFormData, refSection, handleInputText, handleInputSection } = useInputFormDataGenerate()
    const { setShowLoading } = useLoading()
    const { contextData, setContextData } = useAppData();

    useEffect(() => {
        refFormData.current = {
            ...refFormData.current,
            product: params.project_name
        }
    }, [])

    const onNext = (step: number): void => {
        if (step === 0) {
            setDisableList([0, 2, 3, 4]);
            setIsShowList([1]);
        } else if (step === 1) {
            setDisableList([0, 1, 3, 4]);
            setIsShowList([2]);
        } else if (step === 2) {
            setDisableList([0, 1, 2, 4]);
            setIsShowList([3]);
        } else if (step === 3) {
            setDisableList([0, 1, 2, 3]);
            setIsShowList([4]);
        } else if (step === 4) {
            setIsShowList([]);
            if (checkedList.length === 5) {
                return
            }
        }
        setCheckedList((prev) => {
            const updatedList = [...prev, step];
            return updatedList;
        });
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
            setCheckedList([0]);
        } else if (step === 1) {
            setDisableList([1, 2, 3, 4])
            setIsShowList([0])
            setCheckedList([])
        }
    };

    const handleGenerate = async () => {
        if (generateStep === 2 || checkedList.length !== 5) {
            return;
        }

        let newStep = generateStep + 1;

        if (newStep > 3) { // Reset after completing step 3
            newStep = 1;
            setIsShowList([]);
            setCheckedList([]);
            setDisableList([1, 2, 3, 4]);
            setContextData({ assetTemplateShow: false });
        } else {
            setContextData({ assetTemplateShow: true });

            if (newStep === 2) {
                setCheckedList([0, 1, 2, 3, 4]);
                setDisableList([0, 1, 2, 3, 4]);
                setContextData({ assetGenerateStatus: newStep });
                setGenerateStep(newStep);
                setShowLoading(true)
                const res = await generateHTML(refFormData.current as FormDataProps, refSection.current as SectionProps[], contextData.ProjectDetails, contextData.isRegenerateHTML)
                setShowLoading(false)
                // setContextData({ assetGenerateStatus: 3, AssetHtml: res as AssetHtmlProps, isRegenerateHTML: true });
                setContextData({ AssetHtml: res as AssetHtmlProps });
                if (res?.isSuccess) {
                    router.replace(`/edit-html-content`)
                } else {
                    setGenerateStep(3);
                    setContextData({ assetGenerateStatus: 3 })
                }
                return
            }
        }
        setContextData({ assetGenerateStatus: newStep });
        setGenerateStep(newStep);
    };

    return (
        <div>
            <div>
                <Accordion
                    isRequire={true}
                    HeaderTitle='Project Details'
                    checked={checkedList.includes(0)}
                    handleShowContent={() => { setIsShowList([0]) }}
                    disableShowContent={disableList.includes(0)}
                    isShowContent={isShowList.includes(0)}
                >
                    <SectionAssetDetails />
                    <div className='max-w-full flex justify-end pt-5 pb-3'>
                        <Button
                            buttonText='Next'
                            showIcon
                            textStyle='text-[1rem] font-base text-[#00A881]'
                            textColor="text-[#00A881]"
                            iconColor="#00A881"
                            backgroundColor='bg-[#fff]'
                            handleClick={() => { onNext(0) }}
                            customClass='static  px-[1.4rem] py-2 group-hover:border-white' />
                    </div>
                </Accordion>
            </div>
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
                        <ChildrenTitle title='Product/Solution'></ChildrenTitle>
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
                    HeaderTitle="Post Context"
                    checked={checkedList.includes(2)}
                    disableShowContent={disableList.includes(2)}
                    handleShowContent={() => { setIsShowList([2]) }}
                    isShowContent={isShowList.includes(2)}>
                    <div className='max-w-[90%]'>
                        <ChildrenTitle customClass='mt-5' title='Specify the topic, occasion, event or context for your post.' />
                        <TextField
                            handleChange={(e) => { handleInputText(e, "topic") }}
                            placeholder="Please enter the name of your campaign, event or occasion." customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>

                        <div className='flex items-center gap-[16%]'>
                            <div className='w-[260px]'>
                                <ChildrenTitle title='Email Type' customClass='mt-5' />
                                <DropDown onSelected={(optionSelected) => {
                                    refFormData.current = {
                                        ...refFormData.current,
                                        type: optionSelected.value
                                    }
                                }} selectPlaceHolder="Select Post Type" optionLists={emailType} />
                            </div>

                            <div className='w-[260px]'>
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
                        <TextField handleChange={(e) => { handleInputText(e, "webUrl") }}
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
                        <ChildrenTitle title='Hook/Headline & Introduction' customClass="text-[18px]" />
                        <ChildrenTitle title='Catchy introduction to the topic/product along with a brief overview.' />
                        <TextField customClass='h-16' placeholder={`"Write a compelling headline that promotes the benefits of HPE GreenLake’s hybrid cloud solution, followed by a 2-3 sentence introduction explaining the benefits of HPE GreenLake and why attending StorageAsia 2024 is beneficial."`} />

                        <ChildrenTitle title='Main Message & Call-to-Action (CTA)' customClass="text-[18px] mt-[20px]" />
                        <ChildrenTitle title='Highlight the core benefits of the product along with actionable event details.' />
                        <TextField placeholder={`"List 2-3 key benefits of HPE GreenLake, focusing on flexibility, control, and cost efficiency. Write a 2-3 sentence event promotion with a call-to-action that encourages users to attend StorageAsia 2024 and engage with HPE experts."`} rows={2} />

                        <ChildrenTitle title='Hashtags & Keywords' customClass="text-[18px] mt-[20px]" />
                        <ChildrenTitle title='Industry-relevant hashtags for discoverability.' />
                        <TextField placeholder={`"Generate 4-5 relevant hashtags for an HPE GreenLake LinkedIn post on hybrid cloud solutions."`} rows={1} />

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
                    backgroundColor={((checkedList.length === 5 && generateStep != 2) || generateStep === 5) ? "bg-custom-gradient-green" : "bg-[#B1B1B1]"}
                    handleClick={handleGenerate}
                    customClass='static  px-[1.4rem] py-2 group-hover:border-white' />
            </div>
        </div>
    );
};

export default LinkedInPage;
