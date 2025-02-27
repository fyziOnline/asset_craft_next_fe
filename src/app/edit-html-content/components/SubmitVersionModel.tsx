import React, { useRef, useEffect, useState } from 'react';
import Button from '@/components/global/Button';
import Search, { Option } from '@/components/global/Search';
import { ApproverProps } from '@/types/approval';
import { generateColorFromInitial } from '@/lib/utils';
import { MdOutlineClose } from "react-icons/md";
import { AiOutlineCheckCircle } from "react-icons/ai";
interface SubmitVersionModelProps {
    isShowSubmitVer: boolean,
    setIsShowSubmitVer: (value: boolean) => void,
    handleSubmitVersion: (optionsSelected: Option, isComments: string) => Promise<void>;
    listApprovers: ApproverProps[]
}

const SubmitVersionModel = ({ isShowSubmitVer, setIsShowSubmitVer, handleSubmitVersion, listApprovers }: SubmitVersionModelProps) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [optionsList, setOptionsList] = useState<Option[]>([])
    const [optionsSelected, setOptionsSelected] = useState<Option>({} as Option)
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [isComments, setIsComments] = useState<string>("")

    useEffect(() => {
        const list: Option[] = []
        listApprovers.forEach(element => {
            const initial = element.name.trim().charAt(0);
            const color = generateColorFromInitial(initial);

            const item: Option = {
                label: element.name,
                value: element.userID,
                firstLetter: initial,
                IconColor: color
            }

            list.push(item)
        });
        setOptionsList(list)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsShowSubmitVer(false);
                document.body.style.overflow = '';
            }
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsShowSubmitVer]);

    const handleNextClick = () => {
        if (optionsSelected.value) {            
            handleSubmitVersion(optionsSelected, isComments);
            setShowSuccessPopup(true);

            setTimeout(() => {
                setShowSuccessPopup(false);
                setTimeout(() => {
                    setIsShowSubmitVer(false);
                }, 300);
            }, 2000);
        }
    };

    if (!isShowSubmitVer) return null;

    return (
        <div className="z-[300] absolute left-0 right-0 bottom-0 top-0 bg-black bg-opacity-55 flex items-center justify-center">
            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg p-5 rounded-lg z-[400] flex flex-col items-center">
                    {/* Green Checkmark */}
                    <AiOutlineCheckCircle size={40} className="text-[#00A881] mb-2" />

                    {/* Success Message */}
                    <p className=" text-lg">Your request has been successfully submitted</p>
                </div>
            )}

            {!showSuccessPopup && (
                <div ref={modalRef} className="w-[600px] relative bg-white rounded-3xl">
                    <div className="flex items-center px-[50px] pt-[25px] p-6">
                        <h1 className="text-xl font-bold">Select the approver</h1>
                        <div className="flex-1 w-[207px] h-[21px] text-black text-xl font-semibold font-['Inter'] leading-[17.11px]">
                            {/* Submit the version: */}
                        </div>
                        <button onClick={() => setIsShowSubmitVer(false)} className="text-[#00A881]">
                            <MdOutlineClose size={24} />
                        </button>
                    </div>
                    <div className="w-full h-px bg-[#ebeff2]" />
                    <div className='flex justify-center flex-col mx-[50px] mt-[15px] mb-5'>
                        <div className='flex items-center pb-4'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="17" viewBox="0 0 21 17" fill="none">
                                <path d="M14.7037 16.1797V14.513C14.7037 13.629 14.3428 12.7811 13.7003 12.156C13.0578 11.5309 12.1864 11.1797 11.2778 11.1797H4.42593C3.51731 11.1797 2.64592 11.5309 2.00343 12.156C1.36094 12.7811 1 13.629 1 14.513V16.1797" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M7.85171 7.84635C9.74379 7.84635 11.2776 6.35397 11.2776 4.51302C11.2776 2.67207 9.74379 1.17969 7.85171 1.17969C5.95962 1.17969 4.42578 2.67207 4.42578 4.51302C4.42578 6.35397 5.95962 7.84635 7.85171 7.84635Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="mx-2 text-fileupload-text text-lg font-semibold tracking-wide ">Assign Approver</div>
                        </div>
                        <Search onSelect={setOptionsSelected} optionsList={optionsList} customOuterClass="w-[400px]" placeHolder=''></Search>
                    </div>

                    <div className='flex justify-center flex-col mx-[50px]'>
                        <p className="text-lg font-semibold text-fileupload-text mb-4">Enter your comments here</p>
                        <textarea
                            placeholder="Type your comments"
                            onChange={(e) => setIsComments(e.target.value)}
                            className="w-full h-32 p-3 border rounded-xl resize-none mb-4 focus:outline-none "
                        />
                    </div>
                    <div className="flex items-center px-[55px] pt-[20px] mb-6 ">
                        <div className="flex-1 w-[207px] h-[21px] text-black text-xl font-semibold font-['Inter'] leading-[17.11px]">
                            {/* Submit the version: */}
                        </div>
                        <Button
                            buttonText="Next"
                            showIcon
                            textStyle="text-[1rem] font-base text-[#00A881]"
                            textColor="text-white"
                            iconColor="#ffff"
                            backgroundColor="bg-[#00A881]"
                            handleClick={handleNextClick}
                            customClass="text-white px-8 py-1 rounded-full font-medium"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmitVersionModel;
