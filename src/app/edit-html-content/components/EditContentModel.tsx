'use client';
import { useAppData } from '@/context/AppContext';
import React, { useEffect, useState, useRef } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells, } from '@jsonforms/material-renderers';
import { AssetBlockProps } from '@/types/templates';
import Button from '@/components/global/Button';

const EditContentModel = ({ setIsShowModelEdit }: any) => {
    const { contextData } = useAppData();
    const [assetHTML, setAssetHTML] = useState(contextData.AssetHtml)
    const [assetBlockSelected, setAssetBlockSelected] = useState<AssetBlockProps>(contextData.AssetHtml?.assetBlocks?.[0] as AssetBlockProps)
    const [schema, setSchema] = useState(JSON.parse(contextData.AssetHtml?.assetBlocks?.[0]?.schema as string))
    const [blockData, setBlockData] = useState(JSON.parse(contextData.AssetHtml?.assetBlocks?.[0]?.assetBlockDataVersions?.[0]?.blockData as string))
    const refIndexBlockSelected = useRef(0)

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    }

    const onSelectBlock = (item: AssetBlockProps, index: number) => {
        refIndexBlockSelected.current = index
        setAssetBlockSelected(item)
        setSchema(JSON.parse(item.schema as string))
        setBlockData(JSON.parse(item.assetBlockDataVersions?.[0]?.blockData as string))
    }

    const onHandleEditData = ({ data, errors }: any) => {
        try {
            let newAssetBlockDataVersions = assetBlockSelected.assetBlockDataVersions
            if (newAssetBlockDataVersions && newAssetBlockDataVersions?.length > 0) {
                newAssetBlockDataVersions[0].blockData = JSON.stringify(data);
            }

            const newAssetBlockSelected = {
                ...assetBlockSelected,
                assetBlockDataVersions: newAssetBlockDataVersions
            }

            const newAssetBlocks = assetHTML?.assetBlocks
            if (newAssetBlocks && newAssetBlocks[refIndexBlockSelected.current]) {
                newAssetBlocks[refIndexBlockSelected.current] = newAssetBlockSelected
            }

            setBlockData(data)
            setAssetBlockSelected(newAssetBlockSelected)
            setAssetHTML({ ...assetHTML, assetBlocks: newAssetBlocks })
        } catch (ex) {

        }
    }

    const onSaveAllAndClose = () => {
        setIsShowModelEdit(false);
    }

    return (
        <div onClick={handleClick} className="fixed z-[1000] left-0 right-0 top-0 bottom-0 bg-black bg-opacity-55 flex items-center justify-center">
            <div className='w-[90vw] h-[94vh] bg-white rounded-md relative flex flex-col'>
                <div className='border-b border-solid border-[#D9D9D9] px-4 pb-4 flex flex-wrap'>
                    {assetHTML?.assetBlocks?.map((item, index) => {
                        return (
                            <div onClick={() => { onSelectBlock(item, index) }}
                                className={`p-2 mr-2 mt-4 rounded-md cursor-pointer ${assetBlockSelected.assetBlockDataVersionID === item.assetBlockDataVersionID ? `text-white bg-[#01A982]` : `text-black bg-[#e4e4e4]`}`}
                                key={index}>{item.name?.replaceAll("_", " ")}</div>
                        )
                    })}
                </div>

                <div className='flex-1 overflow-y-scroll scrollbar-hide px-5 py-2'>
                    <JsonForms
                        schema={schema}
                        data={blockData}
                        renderers={materialRenderers}
                        cells={materialCells}
                        // uischema={uiSChema}
                        onChange={onHandleEditData}
                    />
                </div>
                <div className='border-t border-solid border-[#D9D9D9] p-4 flex justify-end'>
                    <Button
                        handleClick={onSaveAllAndClose}
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