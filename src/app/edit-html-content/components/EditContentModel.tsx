'use client';
import React, { useEffect, useState, useRef } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells, } from '@jsonforms/material-renderers';
import { AssetBlockProps, AssetHtmlProps, AssetVersionProps } from '@/types/templates';
import Button from '@/components/global/Button';
import { ApiService } from '@/lib/axios_generic';
import { urls } from '@/apis/urls';
import { createTheme, ThemeProvider } from '@mui/material';
import { useAppData } from '@/context/AppContext';

const customTheme = createTheme({
    palette: {
        primary: {
            main: '#01A982', // Primary color
        },
        secondary: {
            main: '#D9D9D9', // Secondary color
        },
        background: {
            default: '#f7f7f7', // Background color
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        body1: {
            fontSize: '0.9rem',
        },
    },
    components: {
        MuiInputBase: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    padding: '3px',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: '500',
                },
            },
        },
        MuiGrid: {
            styleOverrides: {
                root: {
                    gap: '14px',
                    marginTop: "6px"
                },
            },
        },
    },
});

interface EditContentModelProps {
    setIsShowModelEdit: any,
    assetBlocks: AssetBlockProps[],
    assetVersion: AssetVersionProps
}

const EditContentModel = ({ setIsShowModelEdit, assetBlocks, assetVersion }: EditContentModelProps) => {
    const { contextData, setContextData } = useAppData();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
    const [listAssetBlocks, setListAssetBlocks] = useState(assetBlocks)
    const [assetBlockSelected, setAssetBlockSelected] = useState<AssetBlockProps>(assetBlocks[0])
    const [schema, setSchema] = useState(JSON.parse(assetBlocks[0].schema as string))
    const [blockData, setBlockData] = useState(JSON.parse(assetBlocks[0].blockData as string))
    const refIndexBlockSelected = useRef(0)

    useEffect(() => {
        setDataDefault()
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const setDataDefault = () => {
        try {
            const newListAssetBlocks = assetBlocks.filter((item) => !item.isStatic && item.type !== "_global")
            setListAssetBlocks(newListAssetBlocks)
            setAssetBlockSelected(newListAssetBlocks[0])
            setSchema(JSON.parse(newListAssetBlocks[0].schema as string))
            setBlockData(JSON.parse(newListAssetBlocks[0].blockData as string))
        } catch (error) {

        }
    }

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    }

    const onSelectBlock = (item: AssetBlockProps, index: number) => {
        refIndexBlockSelected.current = index
        setAssetBlockSelected(item)
        setSchema(JSON.parse(item.schema as string))
        setBlockData(JSON.parse(item.blockData as string))
    }

    const onHandleEditData = ({ data, errors }: any) => {
        try {
            let newAssetBlockDataVersions = assetBlockSelected
            if (newAssetBlockDataVersions) {
                newAssetBlockDataVersions.blockData = JSON.stringify(data);
            }

            const newAssetBlockSelected = {
                ...assetBlockSelected,
                assetBlockDataVersions: newAssetBlockDataVersions
            }

            const newListAssetBlocks = listAssetBlocks
            if (newListAssetBlocks && newListAssetBlocks[refIndexBlockSelected.current]) {
                newListAssetBlocks[refIndexBlockSelected.current] = newAssetBlockSelected
            }

            setBlockData(data)
            setAssetBlockSelected(newAssetBlockSelected)
            setListAssetBlocks(newListAssetBlocks)
        } catch (ex) {

        }
    }

    const onGenerateWithAI = async () => {
        try {
            setIsLoadingGenerate(true)
            const resUpdate = await ApiService.get<any>(`${urls.asset_version_getDataUsingAI}?assetVersionID=${assetBlockSelected.assetVersionID}&assetVersionBlockID=${assetBlockSelected.assetVersionBlockID}`)
            if (resUpdate.isSuccess) {
                const dataJson = JSON.parse(resUpdate.jsonData as string)
                if (dataJson.blocks && dataJson.blocks.length > 0) {
                    setBlockData(JSON.parse(dataJson.blocks[0].data as string))
                }
            }
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            alert(ApiService.handleError(error));
        } finally {
            setIsLoadingGenerate(false);
        }
    }

    const onSaveAllAndClose = async () => {
        try {
            setIsLoading(true);

            if (listAssetBlocks) {
                const promises = listAssetBlocks.map(async (item) => {
                    try {
                        const resUpdate = await ApiService.put<any>(urls.assetVersionBlock_update, {
                            "assetVersionBlockID": item.assetVersionBlockID,
                            "blockName": item.blockName,
                            "aiPrompt": item.aiPrompt,
                            "blockData": item.blockData,
                            "blockHTMLGenerated": item.blockHTMLGenerated
                        });
                        return resUpdate;
                    } catch (innerError) {
                        console.error('API Error for item:', item, ApiService.handleError(innerError));
                        return { isSuccess: false };
                    }
                });

                const results = await Promise.all(promises);

                const allSuccess = results.every((res) => res.isSuccess);

                if (allSuccess) {
                    const resGenerate = await ApiService.get<any>(`${urls.asset_generate}?assetID=${contextData.AssetHtml.assetID}&assetVersionID=${assetVersion.assetVersionID}`);
                    if (resGenerate.isSuccess) {
                        const resAssetSelect = await ApiService.get<any>(`${urls.asset_select}?assetID=${contextData.AssetHtml.assetID}`);
                        if (resAssetSelect.isSuccess && resAssetSelect.assetVersions.length > 0) {
                            setContextData({ AssetHtml: resAssetSelect as AssetHtmlProps });
                            setIsShowModelEdit(false);
                        }
                    }
                } else {
                    alert("Save data failed, please try again later.");
                }
            }
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            alert(ApiService.handleError(error));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeProvider theme={customTheme}>
            <div onClick={handleClick} className="fixed z-[1000] left-0 right-0 top-0 bottom-0 bg-black bg-opacity-55 flex items-center justify-center">
                <div className='w-[90vw] h-[94vh] bg-white rounded-md relative flex flex-col'>
                    <div className='border-b border-solid border-[#D9D9D9] px-4 pb-4 flex flex-wrap'>
                        {listAssetBlocks?.map((item, index) => {
                            if (item.isStatic || item.type === "_global") { return }
                            return (
                                <div onClick={() => { onSelectBlock(item, index) }}
                                    className={`p-2 mr-2 mt-4 rounded-md cursor-pointer ${assetBlockSelected.assetVersionBlockID === item.assetVersionBlockID ? `text-white bg-[#01A982]` : `text-black bg-[#e4e4e4]`}`}
                                    key={index}>{item.blockName?.replaceAll("_", " ")}</div>
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
                    <div className='border-t border-solid border-[#D9D9D9] p-4 flex justify-between'>
                        <Button
                            handleClick={onGenerateWithAI}
                            disabled={isLoadingGenerate}
                            buttonText={isLoadingGenerate ? 'Generating...' : 'Generate with AI'}
                            showIcon={false}
                            textStyle='text-[1rem] font-base text-[#00A881]'
                            textColor="text-[#fff]"
                            backgroundColor={isLoadingGenerate ? "bg-[#00A881]" : "bg-custom-gradient-green"}
                            customClass='static ml-[0px] px-[35px] py-[10px] group-hover:border-white' />

                        <div className='flex'>
                            <Button
                                handleClick={() => { setIsShowModelEdit(false) }}
                                buttonText='Close'
                                showIcon={false}
                                textStyle='text-[1rem] font-base'
                                textColor="text-[#00A881]"
                                backgroundColor="bg-[#fff]"
                                customClass='static ml-[0px] px-[35px] py-[10px] group-hover:border-white mr-[20px] border border-solid border-[#00A881]' />
                            <Button
                                handleClick={onSaveAllAndClose}
                                disabled={isLoading}
                                buttonText={isLoading ? 'Saving...' : 'Save All'}
                                showIcon={false}
                                textStyle='text-[1rem] font-base text-[#00A881]'
                                textColor="text-[#fff]"
                                backgroundColor={isLoading ? "bg-[#00A881]" : "bg-custom-gradient-green"}
                                customClass='static ml-[0px] px-[35px] py-[10px] group-hover:border-white' />
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default EditContentModel;