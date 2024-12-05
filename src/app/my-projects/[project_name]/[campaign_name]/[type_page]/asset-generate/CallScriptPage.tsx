'use client';
import React, { useState } from 'react';
import Accordion from '@/components/global/Accordion';
import Button from '@/components/global/Button';
import TextField from '@/components/global/TextField';
import DropDown from '@/components/global/DropDown';
import RangeSlider from '@/components/global/RangeSlider';
import { useRouter } from 'next/navigation';
import { ApiService } from '@/lib/axios_generic';
import { urls } from '@/apis/urls';
import ChooseLabel from '@/components/global/ChooseLabel';
import { useAppData } from '@/context/AppContext';
import ChildrenTitle from '@/components/global/ChildrenTitle';


const CallScriptPage = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [generateStep, setGenerateStep] = useState(1); //1 - Normal, 2 - (Loading or disable), 3 - Regenerate
    const [checkedList, setCheckedList] = useState<number[]>([]);
    const [disableList, setDisableList] = useState<number[]>([2, 3]);
    const [isShowList, setIsShowList] = useState<number[]>([]);
    const [html_content, setHtml_content] = useState("");

    const { setContextData } = useAppData();

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
                const resHTML = await ApiService.get<any>(`${urls.asset_select}?assetId=a844c23c-a4ac-ef11-ac7b-0a9328dfcacd`)
                if (resHTML.isSuccess && resHTML.assetContentVersions.length > 0) {
                    const assetHTML = resHTML.assetContentVersions[0].assetHTML
                    setHtml_content(assetHTML)
                }

                setCheckedList([1, 2, 3])
                setDisableList([1, 2, 3])

                setTimeout(() => {
                    setGenerateStep(3)
                    setContextData({ assetGenerateStatus: 3 });
                }, 1000);
            }
            setIsOpen(true)
            setContextData({ assetTemplateShow: true });

        }
        setGenerateStep(newStep)
        setContextData({ assetGenerateStatus: newStep });
    }





    return (
        <div>
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
    );
};

export default CallScriptPage;
