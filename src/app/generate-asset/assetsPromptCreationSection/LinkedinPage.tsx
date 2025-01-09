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
    const [isShowList, setIsShowList] = useState<number[]>([]);
    const { assetIDTemplateRef, generateHTML } = useGenerateTemplate({ params: { templateID: params.template?.templateID ?? '' as string } })
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
                refFormData.current.type?.length && 
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

    return (
        <div>
            <div>
                <Accordion
                    isRequire={true}
                    HeaderTitle='Project Details'
                    checked={checkedList.includes(0)}
                >
                    <SectionAssetDetails validatingTheData={doesFormCompleted}/>
                </Accordion>
            </div>
            <div className='mt-[25px]'>
                {/* step 1 */}
                <Accordion
                    isRequire={true}
                    HeaderTitle="Campaign Overview"
                    checked={checkedList.includes(1)}
                    >
                    <div>
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
                    HeaderTitle="Post Context"
                    checked={checkedList.includes(2)}
                    >
                    <div className='max-w-[90%]'>
                        <ChildrenTitle customClass='mt-5' title='Specify the topic, occasion, event or context for your post.' />
                        <TextField
                            handleChange={(e) => { 
                                handleInputText(e, "topic") 
                                doesFormCompleted(3)
                            }}
                            placeholder="Please enter the name of your campaign, event or occasion." customAreaClass='whitespace-nowrap overflow-x-auto overflow-y-hidden scrollbar-hide'></TextField>

                        <div className='flex items-center gap-[16%]'>
                            <div className='w-[260px]'>
                                <ChildrenTitle title='Email Type' customClass='mt-5' />
                                <DropDown onSelected={(optionSelected) => {
                                    refFormData.current = {
                                        ...refFormData.current,
                                        type: optionSelected.value
                                    }
                                doesFormCompleted(3)
                                }} selectPlaceHolder="Select Post Type" optionLists={emailType} />
                            </div>

                            <div className='w-[260px]'>
                                <ChildrenTitle title='Key Points' customClass='mt-5' />
                                <DropDown onSelected={(optionSelected) => {
                                    refFormData.current = {
                                        ...refFormData.current,
                                        keyPoints: optionSelected.value
                                    }
                                    doesFormCompleted(3)
                                }} selectPlaceHolder="Select Key Points" optionLists={keyPoints} />
                            </div>
                        </div>

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
                        <TextField handleChange={(e) => { 
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
                </Accordion>
            </div>
            <div className='flex justify-end my-[20px]'>
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
