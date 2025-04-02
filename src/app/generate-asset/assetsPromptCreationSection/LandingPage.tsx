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
import { AIPromptAsset, AssetHtmlProps, CampaignSelectResponse, Template } from '@/types/templates';
import { useLoading } from '@/components/global/Loading/LoadingContext';
import { FormDataProps, SectionProps, useInputFormDataGenerate } from '@/hooks/useInputFormDataGenerate';
import { useGenerateTemplate } from '@/hooks/useGenerateTemplate';
import { listofcampains, ListTargetAudience } from '@/data/dataGlobal';
import SectionAssetDetails from '@/components/assetGeneration/SectionAssetDetails';
import { useRouter } from 'next/navigation';

interface LandingPageProps {
    params: {
        template: Template
        assetPrompts?: AIPromptAsset
        project_name?: string
        campaign_name?:string
        asset_name?:string
    }
}

const LandingPage = ({ params }: LandingPageProps) => {
    const router = useRouter();
    const [generateStep, setGenerateStep] = useState(1); //1 - Normal, 2 - (Loading or disable), 3 - Regenerate
    const [checkedList, setCheckedList] = useState<number[]>([]);
    const [isShowList, setIsShowList] = useState<number[]>([]);
    const { assetIDTemplateRef, generateHTML } = useGenerateTemplate({ params: { templateID: params.template?.templateID ?? '' as string } })
    const { refFormData, refSection, handleInputText, handleInputSection } = useInputFormDataGenerate()
    const { setShowLoading } = useLoading()
    const { contextData, setContextData } = useAppData();
    const [existingCampaignDetails, setExistingCampaignDetails] = useState<CampaignSelectResponse | null>(null)
    const [existingAssetPrompt, setExistingAssetPrompt] = useState<AIPromptAsset | null>(params.assetPrompts||null)
    

    useEffect(() => {
        refFormData.current = {
            ...refFormData.current,
            product: params.project_name
        }
    }, [])

    const updateShowList = (value: number) => {
        setIsShowList((prev) => {
            if (prev.includes(value)) {
                return prev.filter((item) => item !== value);
            } else {
                return [...prev, value];
            }
        })
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
        if (isShowList.includes(1) || checkedList.includes(1)) {
            doesFormCompleted(2)
        }
    }

    const appendExistingAssetPromptData = (data:AIPromptAsset|null) => {
            if (!data) {
               return 
            } 
            refFormData.current ={
                ...refFormData.current,
                topic:params.assetPrompts?.topic,
                type:params.assetPrompts?.type,
                keyPoints:params.assetPrompts?.keyPoints
            }
            doesFormCompleted(3)
        }
    useEffect(()=>{
            if (existingAssetPrompt) {
                appendExistingAssetPromptData(existingAssetPrompt)
                promptResVisit()
            }
        },[existingAssetPrompt])
    
        const promptResVisit = () => {
            setCheckedList([0,1,2,3])
        }
    

    const doesFormCompleted = (step: number, status?: boolean) => {
        if (step === 1) {
            setCheckedList((prev) =>
                status
                    ? prev.includes(0) ? prev : [...prev, 0]
                    : prev.filter((item) => item !== 0)
            )
        }
        if (step === 2) {
            if (
                refFormData.current?.campaignGoal?.length &&
                refFormData.current?.targetAudience?.length
            ) {
                setCheckedList((prev) => (prev.includes(1) ? prev : [...prev, 1]))
            } else {
                setCheckedList((prev) => prev.filter((item) => item !== 1))
            }
        }
        if (step === 3) {
            if (
                refFormData.current?.topic?.length
                // refFormData.current?.keyPoints?.length
            ) {
                setCheckedList((prev) => (prev.includes(2) ? prev : [...prev, 2]))
            } else {
                setCheckedList((prev) => prev.filter((item) => item !== 2))
            }
        }
        if (step === 4) {
            setCheckedList((prev) => (prev.includes(3) ? prev : [...prev, 3]))
        }
    }


    const handleGenerate = async () => {
        if (generateStep === 2 || checkedList.length !== 4) {
            return;
        }

        let newStep = generateStep + 1;

        if (newStep > 3) { // Reset after completing step 3
            newStep = 1;
            setIsShowList([]);
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

                if (res?.isSuccess) {
                    router.replace(`/edit-html-content?assetID=${assetIDTemplateRef.current}&projectName=${contextData.ProjectDetails.project_name}&campaignName=${contextData.ProjectDetails.campaign_name}&assetTypeIcon=Landing Page`)
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
                    isPreventEdit={params.asset_name ? true : false}
                >
                    <SectionAssetDetails
                        validatingTheData={doesFormCompleted}
                        returnCampaignDetails={fetchExistingCampaignData}
                        existingAssetMeta={
                            {
                                campaign_name:params.campaign_name || "",
                                project_name:params.project_name || "",
                                asset_name:params.asset_name || ""
                            }}
                    />
                </Accordion>
            </div>
            <div className='mt-[25px]'>
                {/* step 1 */}
                <Accordion
                    isRequire={true}
                    HeaderTitle="Campaign Overview"
                    checked={checkedList.includes(1)}
                    handleShowContent={() => {
                        updateShowList(1)
                        doesFormCompleted(2)
                    }}
                >
                    <div>
                        {/* <ChildrenTitle title='Product/Solution' ></ChildrenTitle>
                        <TextField
                            handleChange={(e) => { handleInputText(e, "product") }}
                            placeholder="Enter the name of the product or solution."
                            value={params.project_name}
                            customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField> */}

                        <div className='flex items-start gap-[16%]'>
                            <div className='w-[260px]'>
                                <ChildrenTitle showStar={true} title='Campaign Goal' customClass='mt-5' ></ChildrenTitle>
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
                                <ChildrenTitle showStar={true} title='Target audience' customClass='mt-5' ></ChildrenTitle>
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

                        <div >
                            <ChildrenTitle customClass='mt-5' title='Additional Campaign Assets'></ChildrenTitle>
                            <TextField handleChange={(e) => {
                                handleInputText(e, "webUrl")
                                // doesFormCompleted(4)
                            }} defaultValue={existingCampaignDetails ? existingCampaignDetails.aIPromptCampaign.webUrl : ""}
                                placeholder="Enter your URL here." customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>
                            <DragAndDrop onFileSelect={(file) => {
                                refFormData.current = {
                                    ...refFormData.current,
                                    fileSelected: file
                                }
                                // doesFormCompleted(4)
                            }} />

                        </div>
                    </div>
                </Accordion>
            </div>
            <div className='mt-[25px]'>
                {/* step 2 */}
                <Accordion
                    isRequire={true}
                    HeaderTitle="Key Message & Content"
                    checked={checkedList.includes(2)}
                    handleShowContent={() => {
                        doesFormCompleted(3)
                        updateShowList(2)
                    }}
                >
                    <div>
                        <ChildrenTitle showStar={true} customClass='mt-5' title='What is the primary message of the landing page?'></ChildrenTitle>
                        <TextField
                            handleChange={(e) => {
                                handleInputText(e, "topic")
                                doesFormCompleted(3)
                            }}
                            defaultValue={existingAssetPrompt ? existingAssetPrompt.topic : ""}
                            rows={4}
                            placeholder="Primary message" customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>

                        <ChildrenTitle customClass='mt-5' title='Provide additional information that supports the main message.'></ChildrenTitle>
                        <TextField
                            handleChange={(e) => {
                                handleInputText(e, "keyPoints")
                                doesFormCompleted(3)
                            }}
                            rows={4}
                            defaultValue={existingAssetPrompt ? existingAssetPrompt.keyPoints : ""}
                            placeholder={`HPE GreenLake helps you manage both public and private cloud environments with full control and flexibility.\nFeature 1\nFeature 2\nFeature 3`}
                            customAreaClass='whitespace-pre-line overflow-x-hidden overflow-y-auto scrollbar-hide'></TextField>

                    </div>
                </Accordion>
            </div>

            <div className={`mt-[25px] ${params.asset_name ? "hidden" : ""}`}>
                {/* step 4 */}
                <Accordion
                    HeaderTitle="Content Brief"
                    checked={checkedList.includes(3)}
                    handleShowContent={() => {
                        doesFormCompleted(4)
                        updateShowList(3)
                    }}
                >
                    <div>
                        {params.template?.templatesBlocks && params.template?.templatesBlocks.filter((item) => !item.isStatic).map((item, index) => {
                            if (params.template.templatesBlocks && refSection.current.length < params.template?.templatesBlocks.filter((item) => !item.isStatic).length) {
                                refSection.current = [...refSection.current as SectionProps[], {
                                    templateBlockID: item.templateBlockID || "",
                                    aiPrompt: ""
                                }]
                            }

                            return (
                                <div key={index}>
                                    <ChildrenTitle title={`Section ${index + 1}: ${item.aiTitle || ''}`} customClass={`text-[18px] ${index === 0 ? "" : "mt-[20px]"}`} />
                                    <ChildrenTitle title={item.aiDescription || ''} customClass="text-[14px]" />
                                    <TextField handleChange={(e) => {
                                        handleInputSection(e, index)
                                        // doesFormCompleted(5)    
                                    }} customClass='h-16' placeholder={item.aiPrompt || ''} />
                                </div>
                            )
                        })}
                    </div>
                    <div className='w-[300px]'>
                        <ChildrenTitle title='How creative you want the output?' customClass='mt-5' ></ChildrenTitle>
                        <RangeSlider onSelectValue={(value) => {
                            refFormData.current = {
                                ...refFormData.current,
                                outputScale: value
                            }
                        }} defaultValue={existingCampaignDetails ? existingCampaignDetails.aIPromptCampaign.outputScale : 7}
                        ></RangeSlider>
                    </div>
                </Accordion>
            </div>
            {!existingAssetPrompt?.assetID && <div className='flex justify-end my-[30px]'>
                <Button
                    buttonText={[1, 2].includes(generateStep) ? 'Generate' : 'Regenerate'}
                    showIcon
                    textStyle='text-[1rem] font-base text-[#00A881]'
                    backgroundColor={((checkedList.length === 4 && generateStep != 2) || generateStep === 4) ? "bg-custom-gradient-green" : "bg-[#B1B1B1]"}
                    handleClick={handleGenerate}
                    customClass='static  px-[1.4rem] py-2 group-hover:border-white' />
            </div>}
        </div>
    );
};

export default LandingPage;
