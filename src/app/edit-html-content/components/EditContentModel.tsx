'use client';
import React, { useEffect, useState, useRef } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells, } from '@jsonforms/material-renderers';
import { AssetBlockProps, AssetHtmlProps, AssetVersionProps } from '@/types/templates';
import Button from '@/components/global/Button';
import { ApiService } from '@/lib/axios_generic';
import { urls } from '@/apis/urls';
import { createTheme, TextareaAutosize, ThemeProvider } from '@mui/material';
import { useAppData } from '@/context/AppContext';
import ShadowDomContainer from './ShadowDomContainer';
import TextField from '@/components/global/TextField';
import { useLoading } from '@/components/global/Loading/LoadingContext';
import CloseIcon from '@mui/icons-material/Close';

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
    setVersionList?: (value: AssetVersionProps[]) => void,
    setVersionSelected?: (value: AssetVersionProps) => void,
    setIsShowModelEdit: any,
    assetBlock: AssetBlockProps,
    assetVersion: AssetVersionProps
}

const EditContentModel = ({ setIsShowModelEdit, assetBlock, assetVersion, setVersionList = () => { }, setVersionSelected = () => { } }: EditContentModelProps) => {
    const { contextData, setContextData } = useAppData();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
    const [isEditPrompt, setIsEditPrompt] = useState(false);
    const [assetBlockSelected, setAssetBlockSelected] = useState<AssetBlockProps>(assetBlock)
    const [blockData, setBlockData] = useState(JSON.parse(assetBlock.blockData as string))
    const refAiPromptCurrent = useRef(assetBlock.aiPrompt)
    const { setShowLoading } = useLoading()

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    }

    const handleInputAIPrompt = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let newAssetBlockDataVersions = {
            ...assetBlockSelected,
            aiPrompt: e.target.value
        }
        setAssetBlockSelected(newAssetBlockDataVersions)
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

            setBlockData(data)
            setAssetBlockSelected(newAssetBlockSelected)
        } catch (ex) {

        }
    }

    const onGenerateWithAI = async () => {
        try {
            setShowLoading(true)
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
            setShowLoading(false)
        }
    }

    const onSaveAIPrompt = async () => {
        try {
            setShowLoading(true);
            const resUpdate = await ApiService.put<any>(urls.assetVersionBlock_update, {
                "assetVersionBlockID": assetBlockSelected.assetVersionBlockID,
                "blockName": assetBlockSelected.blockName,
                "aiPrompt": assetBlockSelected.aiPrompt,
                "blockData": assetBlockSelected.blockData,
                "blockHTMLGenerated": assetBlockSelected.blockHTMLGenerated
            });

            if (resUpdate.isSuccess) {
                setIsEditPrompt(false)
            }
            else {
                alert("Save data failed, please try again later.");
            }
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            alert(ApiService.handleError(error));
        } finally {
            setShowLoading(false);
        }
    }

    const onSaveAllAndClose = async () => {
        try {
            setShowLoading(true)
            setIsLoading(true);

            const resUpdate = await ApiService.put<any>(urls.assetVersionBlock_update, {
                "assetVersionBlockID": assetBlockSelected.assetVersionBlockID,
                "blockName": assetBlockSelected.blockName,
                "aiPrompt": assetBlockSelected.aiPrompt,
                "blockData": assetBlockSelected.blockData,
                "blockHTMLGenerated": assetBlockSelected.blockHTMLGenerated
            });

            if (resUpdate.isSuccess) {
                const resGenerate = await ApiService.get<any>(`${urls.asset_generate}?assetID=${assetVersion.assetID}&assetVersionID=${assetVersion.assetVersionID}`);
                if (resGenerate.isSuccess) {
                    const resAssetSelect = await ApiService.get<any>(`${urls.asset_version_select}?assetVersionID=${assetVersion.assetVersionID}`);
                    if (resAssetSelect.isSuccess) {
                        const assetHtml = contextData.AssetHtml
                        const indexAssetVersion = assetHtml.assetVersions.findIndex((item) => item.assetVersionID === assetVersion.assetVersionID)
                        assetHtml.assetVersions[indexAssetVersion] = resAssetSelect
                        setVersionList(assetHtml.assetVersions)
                        setVersionSelected(resAssetSelect)
                        setContextData({ AssetHtml: assetHtml as AssetHtmlProps });
                        setIsShowModelEdit(false);
                    }
                }
            } else {
                alert("Save data failed, please try again later.");
            }
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            alert(ApiService.handleError(error));
        } finally {
            setIsLoading(false);
            setShowLoading(false)
        }
    };

    return (
        <ThemeProvider theme={customTheme}>
            <div onClick={handleClick} className="fixed z-[100] left-0 right-0 top-0 bottom-0 bg-black bg-opacity-55 flex items-center justify-center">
                <div className='w-[90vw] bg-white rounded-md relative flex flex-col'>
                    <div className='flex flex-row flex-1'>
                        <div className='p-1 max-w-[50vw] h-[86vh] overflow-y-scroll scrollbar-hide relative border-r border-solid border-[#D9D9D9]'>
                            <ShadowDomContainer htmlContent={assetVersion.layoutHTMLGenerated.replace("[(blocks)]", assetBlock.blockHTMLGenerated || "")}></ShadowDomContainer>
                        </div>
                        <div className='flex-1 h-[86vh] overflow-y-scroll scrollbar-hide px-5 py-2'>
                            <div className='border-b border-solid border-[#D9D9D9] pb-3 mt-2'>
                                <div className='flex flex-row justify-between mt-2'>
                                    <div className='flex flex-row mb-1 items-center'>
                                        {!isEditPrompt ? <div onClick={() => {
                                            refAiPromptCurrent.current = assetBlockSelected.aiPrompt
                                            setIsEditPrompt(true)
                                        }} className='p-1'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 30 30" fill="none">
                                                <path d="M21.459 2.79243C22.2215 2.02993 23.2557 1.60156 24.334 1.60156C25.4123 1.60156 26.4465 2.02993 27.209 2.79243C27.9715 3.55492 28.3998 4.58909 28.3998 5.66743C28.3998 6.74576 27.9715 7.77993 27.209 8.54243L9.00065 26.7508L1.33398 28.6674L3.25065 21.0008L21.459 2.79243Z" stroke="#00A881" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div> : null}
                                        <div className='text-[14px] font-bold'>AI Prompt:</div>
                                    </div>
                                    <div className='mt-[-10px] mr-[-10px]'>
                                        <div
                                            onClick={() => setIsShowModelEdit(false)}
                                            className="p-1 cursor-pointer hover:bg-gray-200 rounded-full transition ease-in-out duration-200"
                                        >
                                            <CloseIcon className="text-gray-600" fontSize="medium" />
                                        </div>
                                    </div>
                                </div>
                                <TextareaAutosize
                                    disabled={!isEditPrompt}
                                    value={assetBlockSelected.aiPrompt}
                                    onChange={handleInputAIPrompt}
                                    minRows={1}
                                    maxRows={3}
                                    className="w-full p-3 border rounded-[10px] resize-none"
                                />
                                <div className='flex justify-end mt-3'>
                                    {!isEditPrompt ? <Button
                                        handleClick={onGenerateWithAI}
                                        disabled={isLoadingGenerate}
                                        buttonText={isLoadingGenerate ? 'Generating...' : 'Generate Data Using AI'}
                                        showIcon={false}
                                        textStyle='text-[1rem] font-base text-[#00A881]'
                                        textColor="text-[#fff]"
                                        backgroundColor={isLoadingGenerate ? "bg-[#00A881]" : "bg-custom-gradient-green"}
                                        customClass='static ml-[0px] px-[35px] py-[10px] group-hover:border-white' /> :
                                        <div className='flex'>
                                            <Button
                                                handleClick={() => {
                                                    let newAssetBlockDataVersions = {
                                                        ...assetBlockSelected,
                                                        aiPrompt: refAiPromptCurrent.current
                                                    }
                                                    setAssetBlockSelected(newAssetBlockDataVersions)
                                                    setIsEditPrompt(false)
                                                }}
                                                buttonText='Cancel'
                                                showIcon={false}
                                                textStyle='text-[1rem] font-base'
                                                textColor="text-[#00A881]"
                                                backgroundColor="bg-[#fff]"
                                                customClass='static ml-[0px] px-[35px] py-[10px] group-hover:border-white mr-[20px] border border-solid border-[#00A881]' />
                                            <Button
                                                handleClick={onSaveAIPrompt}
                                                disabled={isLoading}
                                                buttonText={isLoading ? 'Saving...' : 'Save Changes'}
                                                showIcon={false}
                                                textStyle='text-[1rem] font-base text-[#00A881]'
                                                textColor="text-[#fff]"
                                                backgroundColor={isLoading ? "bg-[#00A881]" : "bg-custom-gradient-green"}
                                                customClass='static ml-[0px] px-[35px] py-[10px] group-hover:border-white' />
                                        </div>}
                                </div>
                            </div>
                            <JsonForms
                                schema={JSON.parse(assetBlock.schema as string)}
                                data={blockData}
                                renderers={materialRenderers}
                                cells={materialCells}
                                // uischema={uiSChema}
                                onChange={onHandleEditData}
                            />
                        </div>
                    </div>
                    <div className='border-t border-solid border-[#D9D9D9] p-4 flex justify-end'>
                        <div className='flex'>
                            {/* <Button
                                handleClick={() => { setIsShowModelEdit(false) }}
                                buttonText='Close'
                                showIcon={false}
                                textStyle='text-[1rem] font-base'
                                textColor="text-[#00A881]"
                                backgroundColor="bg-[#fff]"
                                customClass='static ml-[0px] px-[35px] py-[10px] group-hover:border-white mr-[20px] border border-solid border-[#00A881]' /> */}
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