'use client';
import { useAppData } from '@/context/AppContext';
import React, { useEffect, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells, } from '@jsonforms/material-renderers';
import { AssetBlockProps } from '@/types/templates';
import Button from '@/components/global/Button';

const EditContentModel = () => {
    const { contextData } = useAppData();
    const [assetHTML, setAssetHTML] = useState(contextData.AssetHtml)
    const [assetBlockSelected, setAssetBlockSelected] = useState<AssetBlockProps>(contextData.AssetHtml?.assetBlocks?.[0] as AssetBlockProps)

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    }

    return (
        <div onClick={handleClick} className="fixed z-[1000] left-0 right-0 top-0 bottom-0 bg-black bg-opacity-55 flex items-center justify-center">
            <div className='w-[90vw] h-[94vh] bg-white rounded-md relative flex flex-col'>
                <div className='border-b border-solid border-[#D9D9D9] px-4 pb-4 flex flex-wrap'>
                    {assetHTML?.assetBlocks?.map((item, index) => {
                        return (
                            <div onClick={() => { setAssetBlockSelected(item) }}
                                className={`p-2 mr-2 mt-4 rounded-md cursor-pointer ${assetBlockSelected.assetBlockDataVersionID === item.assetBlockDataVersionID ? `text-white bg-[#01A982]` : `text-black bg-[#e4e4e4]`}`}
                                key={index}>{item.name?.replaceAll("_", " ")}</div>
                        )
                    })}
                </div>

                <div className='flex-1 overflow-y-scroll scrollbar-hide px-5 py-2'>
                    <JsonForms
                        schema={JSON.parse(assetBlockSelected?.schema as string)}
                        data={JSON.parse(assetBlockSelected.assetBlockDataVersions?.[0]?.blockData as string)}
                        renderers={materialRenderers}
                        cells={materialCells}
                        // uischema={uiSChema}
                        onChange={({ data, errors }) => {
                            console.log('data: ', data)
                            // setData(data)
                        }}
                    />
                </div>
                <div className='border-t border-solid border-[#D9D9D9] p-4 flex justify-end'>
                    <Button
                        buttonText='Save All & Close'
                        showIcon={false}
                        textStyle='text-[1rem] font-base text-[#00A881]'
                        textColor="text-[#fff]"
                        customClass='static ml-[0px] px-[35px] py-[10px] group-hover:border-white' />
                </div>
            </div>
        </div>
    );
};

export default EditContentModel;