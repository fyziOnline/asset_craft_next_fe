import Button from '@/components/global/Button';
import TextField from '@/components/global/TextField';
import React, { useRef, useEffect } from 'react';

const AddVersionModel = ({ isShowAddVer, setIsShowAddVer, handleAddVersion, handleChangeTextVersion }: any) => {
    const modalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsShowAddVer(false);
                document.body.style.overflow = '';
            }
        };

        document.body.style.overflow = 'hidden';
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsShowAddVer]);

    if (!isShowAddVer) return null;

    return (
        <div className=" fixed left-0 right-0 h-[82vh] bg-black bg-opacity-55 flex items-center justify-center z-50">
            <div ref={modalRef} className="z-[99] w-[900px] relative bg-white rounded-3xl">
                <div className="flex items-center px-[50px] pt-[25px]">
                    <div className="flex-1 w-[207px] h-[21px] text-black text-xl font-semibold font-['Inter'] leading-[17.11px]">
                        Save new version as:
                    </div>
                    {/* <Button
                        buttonText="Next"
                        showIcon
                        textStyle="text-[1rem] font-base text-[#00A881]"
                        textColor="text-[#00A881]"
                        iconColor="#00A881"
                        backgroundColor="#fff"
                        handleClick={handleAddVersion}
                        customClass="static py-2 group-hover:border-white"
                    /> */}
                </div>
                <div className="w-full h-px bg-[#ebeff2]" />
                <div className="mx-[50px] mt-[15px] pb-[35px]">
                    <div className="text-[#160647] mb-[15px] text-base font-bold font-['Inter'] leading-tight">
                        New Version Name
                    </div>
                    <TextField
                        handleChange={handleChangeTextVersion}
                        placeholder="Type the name of your new version."
                        rows={1}
                    ></TextField>
                </div>
                <div className='px-[50px] pb-[25px] w-full flex justify-between'>
                    <Button
                            buttonText="Cancel"
                            showIcon = {false}
                            textStyle="text-[1rem] font-base text-[#00A881]"
                            textColor="text-[#e06565]"
                            iconColor="#e06565"
                            backgroundColor="#fff"
                            handleClick={handleAddVersion}
                            customClass="static py-2 group-hover:border-white"
                        />
                    <Button
                            buttonText="Next"
                            showIcon
                            textStyle="text-[1rem] font-base text-[#00A881]"
                            textColor="text-[#00A881]"
                            iconColor="#00A881"
                            backgroundColor="#fff"
                            handleClick={()=>{setIsShowAddVer(false)}}
                            customClass="static py-2 group-hover:border-white"
                        />
                </div>
            </div>
        </div>
    );
};

export default AddVersionModel;
