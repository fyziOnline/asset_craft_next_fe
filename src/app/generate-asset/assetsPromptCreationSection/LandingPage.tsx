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
import { AssetHtmlProps, Template } from '@/types/templates';
import { useLoading } from '@/components/global/Loading/LoadingContext';
import { FormDataProps, SectionProps, useInputFormDataGenerate } from '@/hooks/useInputFormDataGenerate';
import { useGenerateTemplate } from '@/hooks/useGenerateTemplate';
import { listofcampains, ListTargetAudience } from '@/data/dataGlobal';
import SectionAssetDetails from '@/components/assetGeneration/SectionAssetDetails';
import { useRouter } from 'next/navigation';

interface LandingPageProps {
    params: {
        template: Template
        project_name?: string
    }
}

const LandingPage = ({ params }: LandingPageProps) => {
    const router = useRouter();
    const [generateStep, setGenerateStep] = useState(1); //1 - Normal, 2 - (Loading or disable), 3 - Regenerate
    const [checkedList, setCheckedList] = useState<number[]>([]);
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

    const doesFormCompleted = (step:number,status?:boolean) => {
            if (step===1) {
                setCheckedList((prev) =>
                    status
                      ? prev.includes(0) ? prev : [...prev, 0] 
                      : prev.filter((item) => item !== 0)
                  ) 
            }
            if(step===2) {
                if (
                    refFormData.current?.campaignGoal?.length &&
                    refFormData.current?.targetAudience?.length 
                 )  {
                    setCheckedList((prev) => (prev.includes(1) ? prev : [...prev, 1]))
                 } else {
                    setCheckedList((prev) => prev.filter((item) => item !== 1))
                }
            }
            if (step===3) {
                if (
                    refFormData.current?.topic?.length && 
                    // refFormData.current.type?.length && 
                    refFormData.current.keyPoints?.length
                ) {
                    setCheckedList((prev) => (prev.includes(2) ? prev : [...prev, 2]))
                 } else {
                    setCheckedList((prev) => prev.filter((item) => item !== 2))
                }
            }
            if (step===4) {
                if (
                    refFormData.current?.webUrl?.length || 
                    refFormData.current?.fileSelected
                ) {
                    setCheckedList((prev) => (prev.includes(3) ? prev : [...prev, 3]))
                 } else {
                    setCheckedList((prev) => prev.filter((item) => item !== 3))
                }
            } if (step===5) {
                let flag = false
                for (const obj of refSection.current) {
                    if (obj.aiPrompt.length > 0) {
                      flag = true
                    } else {
                      flag = false
                      break
                    }
                }
                if (flag) {
                    setCheckedList((prev) => (prev.includes(4) ? prev : [...prev, 4]))
                 } else {
                    setCheckedList((prev) => prev.filter((item) => item !== 4))
                }
            }
        }


    const handleGenerate = async () => {
        if (generateStep === 2 || checkedList.length !== 5) {
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
                >
                    <SectionAssetDetails validatingTheData={doesFormCompleted} />
                </Accordion>
            </div>
            <div className='mt-[40px]'>
                {/* step 1 */}
                <Accordion
                    isRequire={true}
                    HeaderTitle="Campaign Overview"
                    checked={checkedList.includes(1)}
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
                                <ChildrenTitle title='Campaign Goal' customClass='mt-5' ></ChildrenTitle>
                                <DropDown
                                    onSelected={(optionSelected) => {
                                        refFormData.current = {
                                            ...refFormData.current,
                                            campaignGoal: optionSelected.value
                                        }
                                        doesFormCompleted(2)
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
                                        doesFormCompleted(2)
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
                                doesFormCompleted(2)
                            }}></RangeSlider>
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
                    >
                    <div>
                        <ChildrenTitle customClass='mt-5' title='What is the primary message of the landing page?'></ChildrenTitle>
                        <TextField
                            handleChange={(e) => { 
                                handleInputText(e, "topic") 
                                doesFormCompleted(3)
                            }}
                            placeholder="Are you ready to experience the future of IT with the power of hybrid cloud?" customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>

                        <ChildrenTitle customClass='mt-5' title='Provide additional information that supports the main message.'></ChildrenTitle>
                        <TextField
                            handleChange={(e) => { 
                                handleInputText(e, "keyPoints") 
                                doesFormCompleted(3)
                            }}
                            rows={4}
                            placeholder={`HPE GreenLake helps you manage both public and private cloud environments with full control and flexibility.\nFeature 1\nFeature 2\nFeature 3`}
                            customAreaClass='whitespace-pre-line overflow-x-hidden overflow-y-auto scrollbar-hide'></TextField>

                    </div>
                </Accordion>
            </div>
            <div className='mt-[25px]'>
                {/* step 3 */}
                <Accordion
                    HeaderTitle="Additional Campaign Assets"
                    checked={checkedList.includes(3)}
                    >
                    <div>
                        <DragAndDrop onFileSelect={(file) => {
                            refFormData.current = {
                                ...refFormData.current,
                                fileSelected: file
                            }
                            doesFormCompleted(4)
                        }} />

                        <ChildrenTitle customClass='mt-5' title='Website Link'></ChildrenTitle>
                        <TextField
                            handleChange={(e) => { 
                                handleInputText(e, "webUrl") 
                                doesFormCompleted(4)
                            }}
                            placeholder="Paste your URL here." customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>
                    </div>
                </Accordion>
            </div>

            <div className='mt-[25px]'>
                {/* step 4 */}
                <Accordion
                    HeaderTitle="Content Structuring for Communication"
                    checked={checkedList.includes(4)}
                    handleShowContent={()=>{doesFormCompleted(5)}}
                    >
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
                                    <TextField handleChange={(e) => { 
                                        handleInputSection(e, index) 
                                        doesFormCompleted(5)    
                                    }} customClass='h-16' defaultValue={item.aiPrompt || ''} />
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

export default LandingPage;
