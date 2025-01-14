'use client';
import React, { useEffect, useState } from 'react';
import Accordion from '@/components/global/Accordion';
import Button from '@/components/global/Button';
import TextField from '@/components/global/TextField';
import DropDown from '@/components/global/DropDown';
import RangeSlider from '@/components/global/RangeSlider';
import ChooseLabel from '@/components/global/ChooseLabel';
import { useAppData } from '@/context/AppContext';
import ChildrenTitle from '@/components/global/ChildrenTitle';
import SectionAssetDetails from '@/components/assetGeneration/SectionAssetDetails';
import { AssetHtmlProps, CampaignSelectResponse, Template } from '@/types/templates';
import { FormDataProps, SectionProps, useInputFormDataGenerate } from '@/hooks/useInputFormDataGenerate';
import DragAndDrop from '@/components/global/DragAndDrop';
import { listofcampains } from '@/data/dataGlobal';
import { useLoading } from '@/components/global/Loading/LoadingContext';
import { useRouter } from 'next/navigation';
import { useGenerateTemplate } from '@/hooks/useGenerateTemplate';

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
interface CallScriptPageProps {
    params: {
        template: Template
        project_name?: string
    }
}

const CallScriptPage = ({ params }: CallScriptPageProps) => {
    const router = useRouter();
    const [generateStep, setGenerateStep] = useState(1); //1 - Normal, 2 - (Loading or disable), 3 - Regenerate
    const [checkedList, setCheckedList] = useState<number[]>([]);
    const { refFormData, refSection, handleInputSection, handleInputText } = useInputFormDataGenerate()
    const [existingCampaignDetails, setExistingCampaignDetails] = useState<CampaignSelectResponse | null>(null)
    const { assetIDTemplateRef, generateHTML } = useGenerateTemplate({ params: { templateID: params.template?.templateID ?? '' as string } })
    const { contextData, setContextData } = useAppData()
    const { setShowLoading } = useLoading()

    useEffect(() => {
        refFormData.current = {
            ...refFormData.current,
            product: params.project_name
        }
    }, [])

    const handleGenerate = async () => {
        if (generateStep === 2 || checkedList.length !== 4) {
            return;
        }

        let newStep = generateStep + 1;

        if (newStep > 3) { // Reset after completing step 3
            newStep = 1;
            setCheckedList([]);
            setContextData({ assetTemplateShow: false });
        } else {
            setContextData({ assetTemplateShow: true });

            if (newStep === 2) {
                setCheckedList([0, 1, 2, 3, 4]);
                setContextData({ assetGenerateStatus: newStep });
                setGenerateStep(newStep);
                setShowLoading(true)
                const res = await generateHTML(refFormData.current as FormDataProps, refSection.current as SectionProps[], contextData.ProjectDetails, contextData.isRegenerateHTML)
                setShowLoading(false)
                // setContextData({ assetGenerateStatus: 3, AssetHtml: res as AssetHtmlProps, isRegenerateHTML: true });
                // setContextData({ AssetHtml: res as AssetHtmlProps });
                if (res?.isSuccess) {
                    router.replace(`/edit-html-content?assetID=${assetIDTemplateRef.current}`)
                } else {
                    setGenerateStep(3);
                    setContextData({ assetGenerateStatus: 3 })
                    setContextData({ AssetHtml: res as AssetHtmlProps });
                }
                return
            }
        }
        setContextData({ assetGenerateStatus: newStep });
        setGenerateStep(newStep);
    };

    const doesFormCompleted = (step: number, status?: boolean) => {
        if (step === 1) {
            setCheckedList((prev) =>
                status
                    ? prev.includes(0) ? prev : [...prev, 0]
                    : prev.filter((item) => item !== 0)
            )
        }
        if (step === 2) {
            setCheckedList((prev) => (prev.includes(1) ? prev : [...prev, 1]))
        }
        if (step === 3) {
            setCheckedList((prev) => (prev.includes(2) ? prev : [...prev, 2]))
        }
        if (step === 4) {
            setCheckedList((prev) => (prev.includes(3) ? prev : [...prev, 3]))
        } if (step === 5) {
            setCheckedList((prev) => (prev.includes(4) ? prev : [...prev, 4]))
        }
    }

    const fetchExistingCampaignData = (data: CampaignSelectResponse | null) => {
        setExistingCampaignDetails(data)
        refFormData.current = {
            ...refFormData.current,
            campaignGoal: data?.aIPromptCampaign.campaignGoal,
            targetAudience: data?.aIPromptCampaign.targetAudience,
            webUrl: data?.aIPromptCampaign.webUrl,
            outputScale: data?.aIPromptCampaign.outputScale
            // fileSelected:data?.aIPromptCampaign.fileName,
        }
    }

    return (
        <div>
            <div>
                <Accordion
                    isRequire={true}
                    HeaderTitle='Project Details'
                    checked={checkedList.includes(0)}
                >
                    <SectionAssetDetails
                        validatingTheData={doesFormCompleted}
                        returnCampaignDetails={fetchExistingCampaignData}
                    />
                </Accordion>
            </div>
            <div className='mt-[40px]'>
                {/* step 1 */}
                <Accordion
                    HeaderTitle="Call Objective and Target Audience"
                    checked={checkedList.includes(1)}
                    handleShowContent={() => { doesFormCompleted(2) }}
                >
                    <div className='flex items-start gap-[16%]'>
                        <div className='w-[260px]'>
                            <ChildrenTitle title='Campaign Goal' customClass='mt-5' ></ChildrenTitle>
                            <DropDown
                                onSelected={(optionSelected) => {
                                    refFormData.current = {
                                        ...refFormData.current,
                                        campaignGoal: optionSelected.value
                                    }
                                    doesFormCompleted(2)
                                }}
                                isShowOther={false}
                                preSelectValue={existingCampaignDetails ? existingCampaignDetails.aIPromptCampaign.campaignGoal : ""}
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
                                    doesFormCompleted(2)
                                }}
                                isShowOther={false}
                                preSelectValue={existingCampaignDetails ? existingCampaignDetails.aIPromptCampaign.targetAudience : ""}
                                selectPlaceHolder="Select Target Audience" optionLists={ListTargetAudience} ></DropDown>
                        </div>
                    </div>

                    <div>
                        <ChildrenTitle customClass='mt-5' title='Additional Campaign Assets'></ChildrenTitle>
                        <TextField handleChange={(e) => {
                            handleInputText(e, "webUrl")
                            // doesFormCompleted(4)
                        }} defaultValue={existingCampaignDetails ? existingCampaignDetails.aIPromptCampaign.webUrl : ""}
                            placeholder="Paste your URL here." customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>
                        <DragAndDrop onFileSelect={(file) => {
                            refFormData.current = {
                                ...refFormData.current,
                                fileSelected: file
                            }
                            // doesFormCompleted(4)
                        }} />

                    </div>
                </Accordion>
            </div>
            <div className='mt-[25px]'>
                {/* step 2 */}
                <Accordion
                    HeaderTitle="Tone, Style, and Objections"
                    checked={checkedList.includes(2)}
                    handleShowContent={() => { doesFormCompleted(3) }}
                >
                    <div className='max-w-[90%]'>
                        <ChildrenTitle title='Provide details on the purpose of the call' ></ChildrenTitle>
                        <TextField
                            placeholder="What is the purpose of the call? What would you like to communicate?"
                            customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'
                            handleChange={(e) => {
                                handleInputText(e, "topic")
                            }}
                        ></TextField>

                        <ChildrenTitle title='Describe the key messages you want to highlight' customClass='mt-5' ></ChildrenTitle>
                        <TextField
                            placeholder="What are the 2-3 key points you want to highlight in this post?"
                            customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'
                            handleChange={(e) => {
                                handleInputText(e, "keyPoints")
                            }}
                        ></TextField>
                    </div>
                    <div className='max-w-[90%] flex mt-5'>
                        <div className='flex-1'>
                            <ChildrenTitle title='What tone should the call have?'></ChildrenTitle>
                            <ChooseLabel
                                onSelect={(selectedOption) => {
                                    refFormData.current = {
                                        ...refFormData.current,
                                        tone: selectedOption.value
                                    }
                                }}
                                optionLists={ListTone}
                            ></ChooseLabel>
                        </div>

                    </div>
                </Accordion>
            </div>
            <div className='mt-[25px]'>
                {/* step 3 */}
                <Accordion
                    HeaderTitle="Content Brief"
                    checked={checkedList.includes(3)}
                    handleShowContent={() => { doesFormCompleted(4) }}
                >
                    <div>
                        {params.template?.templatesBlocks && params.template?.templatesBlocks.filter((item) => !item.isStatic).map((item, index) => {
                            if (params.template.templatesBlocks && refSection.current.length < params.template?.templatesBlocks.filter((item) => !item.isStatic).length) {
                                refSection.current = [...refSection.current as SectionProps[], {
                                    templateBlockID: item.templateBlockID || "",
                                    aiPrompt: item.aiPrompt || ""
                                }]
                            }

                            return (
                                <div key={index}>
                                    <ChildrenTitle title={`Section ${index + 1}: ${item.aiTitle || ''}`} customClass={`text-[18px] ${index === 0 ? "" : "mt-[20px]"}`} />
                                    <ChildrenTitle title={item.aiDescription || ''} customClass="text-[14px]" />
                                    <TextField handleChange={(e) => {
                                        handleInputSection(e, index)
                                        //  doesFormCompleted(5)
                                    }} customClass='h-16' defaultValue={item.aiPrompt || ''} />
                                </div>
                            )
                        })}

                    </div>
                    <div className='flex-1'>
                        <ChildrenTitle title='How creative you want the output?'></ChildrenTitle>
                        <RangeSlider onSelectValue={(value) => {
                            refFormData.current = {
                                ...refFormData.current,
                                outputScale: value
                            }
                        }}
                        ></RangeSlider>
                    </div>
                </Accordion>
            </div>
            <div className='flex justify-end my-[30px]'>
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

export default CallScriptPage;