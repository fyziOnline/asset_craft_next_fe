import React, { useRef, useEffect, useState } from 'react';
import Button from '@/components/global/Button';
import Search, { Option } from '@/components/global/Search';
import { ApproverProps } from '@/types/approval';
import { generateColorFromInitial } from '@/lib/utils';

interface SubmitVersionModelProps {
    isShowSubmitVer: boolean,
    setIsShowSubmitVer: (value: boolean) => void,
    handleSubmitVersion: (optionsSelected: Option) => void,
    listApprovers: ApproverProps[]
}

const SubmitVersionModel = ({ isShowSubmitVer, setIsShowSubmitVer, handleSubmitVersion, listApprovers }: SubmitVersionModelProps) => {
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [optionsList, setOptionsList] = useState<Option[]>([])
    const [optionsSelected, setOptionsSelected] = useState<Option>({} as Option)

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

    if (!isShowSubmitVer) return null;

    return (
        <div className="z-100 absolute left-0 right-0 bottom-0 top-0 bg-black bg-opacity-55 flex items-center justify-center">
            <div ref={modalRef} className="w-[900px] relative bg-white rounded-3xl">
                <div className="flex items-center px-[50px] pt-[25px]">
                    <div className="flex-1 w-[207px] h-[21px] text-black text-xl font-semibold font-['Inter'] leading-[17.11px]">
                        {/* Submit the version: */}
                    </div>
                    <Button
                        buttonText="Next"
                        showIcon
                        textStyle="text-[1rem] font-base text-[#00A881]"
                        textColor="text-[#00A881]"
                        iconColor="#00A881"
                        backgroundColor="#fff"
                        handleClick={() => {
                            if (optionsSelected.value) {
                                handleSubmitVersion(optionsSelected)
                            }
                        }}
                        customClass="static py-2 group-hover:border-white"
                    />
                </div>
                <div className="w-full h-px bg-[#ebeff2]" />
                <div className='flex justify-center items-center mx-[50px] mt-[15px] pb-[35px]'>
                    <div className='flex items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="21" height="17" viewBox="0 0 21 17" fill="none">
                            <path d="M14.7037 16.1797V14.513C14.7037 13.629 14.3428 12.7811 13.7003 12.156C13.0578 11.5309 12.1864 11.1797 11.2778 11.1797H4.42593C3.51731 11.1797 2.64592 11.5309 2.00343 12.156C1.36094 12.7811 1 13.629 1 14.513V16.1797" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.85171 7.84635C9.74379 7.84635 11.2776 6.35397 11.2776 4.51302C11.2776 2.67207 9.74379 1.17969 7.85171 1.17969C5.95962 1.17969 4.42578 2.67207 4.42578 4.51302C4.42578 6.35397 5.95962 7.84635 7.85171 7.84635Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19.8429 16.0714V14.4047C19.8423 13.6661 19.5897 12.9487 19.1246 12.3649C18.6595 11.7812 18.0084 11.3643 17.2734 11.1797" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.8477 1.28906C14.5846 1.47265 15.2378 1.88965 15.7042 2.47432C16.1706 3.059 16.4238 3.77809 16.4238 4.51823C16.4238 5.25837 16.1706 5.97746 15.7042 6.56214C15.2378 7.14681 14.5846 7.56381 13.8477 7.7474" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="mx-2 text-black text-base tracking-wide font-normal">Assign Approver</div>
                    </div>
                    <Search onSelect={setOptionsSelected} optionsList={optionsList} customOuterClass="w-[400px]" placeHolder=''></Search>
                </div>
            </div>
        </div>
    );
};

export default SubmitVersionModel;
