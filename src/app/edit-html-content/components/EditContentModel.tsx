'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells, } from '@jsonforms/material-renderers';
import { AssetBlockProps, AssetHTMLData, AssetHtmlProps, AssetVersionProps } from '@/types/templates';
import Button from '@/components/global/Button';
import { ApiService } from '@/lib/axios_generic';
import { urls } from '@/apis/urls';
import { createTheme, TextareaAutosize, ThemeProvider } from '@mui/material';
import ShadowDomContainer from './ShadowDomContainer';
import { useLoading } from '@/components/global/Loading/LoadingContext';
import CloseIcon from '@mui/icons-material/Close';
import { CustomTextArea, CustomTextTester } from './CustomTextArea';
import { linkedIn_noImage_Uischema, linkedIn_Uischema } from './schema';
import { ImagePickerTester } from './Controller/test/ImageController';
import { ImagePickerController } from './Controller/ImagePickerController';
import { STATUS } from '@/constants';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useEditAssetStoreSelector } from '@/store/editAssetStore';

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
        // MuiButton: {
        //     styleOverrides: {
        //         root: {
        //             textTransform: 'none',
        //             fontSize: '1rem',
        //             fontWeight: '500',
        //         },
        //     },
        // },
        // MuiGrid: {
        //     styleOverrides: {
        //         root: {
        //             gap: '14px',
        //             marginTop: "6px"
        //         },
        //     },
        // },
    },
});

interface EditContentModelProps {
    setIsShowModelEdit: React.Dispatch<React.SetStateAction<boolean>>,
    assetBlock: AssetBlockProps,
    assetVersion: AssetVersionProps
}

const EditContentModel = ({ setIsShowModelEdit, assetBlock, assetVersion }: EditContentModelProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
    const [isEditPrompt, setIsEditPrompt] = useState(false);
    const [assetBlockSelected, setAssetBlockSelected] = useState<AssetBlockProps>(assetBlock);
    const [blockData, setBlockData] = useState(JSON.parse(assetBlock.blockData as string));
    // console.log("blockData :",blockData.schema)
    const refAiPromptCurrent = useRef(assetBlock.aiPrompt);
    const { setShowLoading } = useLoading();
    
    // New states for preview refresh functionality
    const [previewHtml, setPreviewHtml] = useState<string>(assetBlock.blockHTMLGenerated || '');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [isUpdatingPreview, setIsUpdatingPreview] = useState(false);
    const lastSavedDataRef = useRef(assetBlock.blockData);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const assetHTMLData = useEditAssetStoreSelector.use.assetHTMLData() as AssetHTMLData
    // console.log('assetHTMLDATA :',assetHTMLData);
    const decision = assetHTMLData.layoutName.toLowerCase().includes("linkedin") ? (assetBlock.schema.includes("image_url") ? linkedIn_Uischema : linkedIn_noImage_Uischema) : undefined
    // console.log('decision :',decision);
    // console.log('assetBlock.schema :',assetBlock.schema);
    
    const updateEntireVersionList = useEditAssetStoreSelector.use.updateEntireVersionList()
    const versionList = useEditAssetStoreSelector.use.versionList() as AssetVersionProps[]
    
    // Function to refresh preview HTML
    const refreshPreview = useCallback(async () => {
        if (!hasChanges) return;
        
        try {
            setIsRefreshing(true);
            setIsUpdatingPreview(true);
            
            const response = await ApiService.post<any>(urls.assetVersionBlock_renderBlockHTML, {
                assetVersionBlockID: assetBlockSelected.assetVersionBlockID,
                blockData: assetBlockSelected.blockData
            });
            
            if (response.isSuccess) {
                setPreviewHtml(response.blockHTMLGenerated || '');
                lastSavedDataRef.current = assetBlockSelected.blockData;
                setHasChanges(false);
            } else {
                console.error('Failed to refresh preview:', response.errorOnFailure);
            }
        } catch (error) {
            console.error('API Error when refreshing preview:', ApiService.handleError(error));
        } finally {
            setIsRefreshing(false);
            setIsUpdatingPreview(false);
        }
    }, [assetBlockSelected.assetVersionBlockID, assetBlockSelected.blockData, hasChanges]);
    
    // Setup debounced auto-refresh
    useEffect(() => {
        // Cleanup previous timer on each data change
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        
        // Only trigger if there are changes
        if (hasChanges) {
            debounceTimerRef.current = setTimeout(() => {
                refreshPreview();
            }, 2000); // 2 second debounce
        }
        
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [hasChanges, refreshPreview]);
    
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
        const newAssetBlockDataVersions = {
            ...assetBlockSelected,
            aiPrompt: e.target.value
        }
        setAssetBlockSelected(newAssetBlockDataVersions);
    }

    const onHandleEditData = ({ data, errors }: any) => {
        try {
            const newAssetBlockDataVersions = assetBlockSelected;
            if (newAssetBlockDataVersions) {
                newAssetBlockDataVersions.blockData = JSON.stringify(data);
            }

            const newAssetBlockSelected = {
                ...assetBlockSelected,
                assetBlockDataVersions: newAssetBlockDataVersions
            }

            setBlockData(data);
            setAssetBlockSelected(newAssetBlockSelected);
            
            // Mark that changes have occurred
            setHasChanges(true);
        } catch (ex) {
            // Handle error
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
                    setBlockData(JSON.parse(dataJson.blocks[0].Data as string))
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
            setIsUpdatingPreview(true);

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
                        const {isSuccess,errorOnFailure,...updatedVersion} = resAssetSelect
                        
                        const indexAssetVersion = versionList.findIndex((item) => item.assetVersionID === assetVersion.assetVersionID)
                        const newVersionList = versionList[indexAssetVersion] = updatedVersion
                        updateEntireVersionList(newVersionList)
                        // setIsShowModelEdit(false);
                    }

                    if(assetVersion.status === STATUS.ON_REVIEW) {
                        const resVersionStatusUpdate = await ApiService.put<any>(`${urls.assetversion_status_change}?assetVersionID=${assetVersion.assetVersionID}`);
                    }

                    
                }
            } else {
                alert("Save data failed, please try again later.");
            }
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            // alert(ApiService.handleError(error));
        } finally {
            setIsLoading(false);
            setShowLoading(false)
            setIsUpdatingPreview(false);
            setIsShowModelEdit(false);
        }
    };

    return (
        <ThemeProvider theme={customTheme}>
            <div onClick={handleClick} className="fixed z-[100] left-0 right-0 top-0 bottom-0 bg-black bg-opacity-55 flex items-center justify-center">
                <div className='w-[90vw] bg-white rounded-md relative flex flex-col'>
                    <div className='flex flex-row flex-1 border-solid border-violet-500'>
                        {(assetBlock.blockHTMLGenerated || previewHtml) ? (
                            <div className='p-1 max-w-[50vw] h-[86vh] overflow-y-scroll scrollbar-hide relative border-r border-solid border-[#D9D9D9]'>
                                <div className="absolute top-2 right-2 z-10 hidden">
                                    <button 
                                        onClick={refreshPreview}
                                        disabled={!hasChanges || isRefreshing}
                                        className={`flex items-center p-2 rounded-full ${hasChanges ? 'bg-[#01A982] text-white' : 'bg-gray-200 text-gray-500'} ${isRefreshing ? 'opacity-70' : ''}`}
                                        title="Refresh preview"
                                    >
                                        <RefreshIcon className={isRefreshing ? 'animate-spin' : ''} />
                                    </button>
                                </div>
                                <ShadowDomContainer 
                                    htmlContent={assetVersion.layoutHTMLGenerated
                                        .replace("prefers-color-scheme:dark", "prefers-color-hide-dark")
                                        .replace("[(blocks)]", previewHtml || assetBlock.blockHTMLGenerated || "")}
                                />
                                {isUpdatingPreview && (
                                    <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                                        <div className="flex space-x-1 items-center">
                                            <div className="w-2 h-2 bg-[#01A982] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-[#01A982] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-[#01A982] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : null}
                        {/* col 2  below */}
                        <div className='flex-1 h-[86vh] overflow-y-scroll scrollbar-hide px-5 py-2'>
                            <div className='mt-7' />
                            {!assetBlock.isStatic ? <div className='pb-3'>
                                <div className='flex flex-row mb-1 mt-2 items-center'>
                                    <div className='flex-grow text-[14px] font-bold'>AI Prompt:</div>
                                    {!isEditPrompt ? <div onClick={() => {
                                        refAiPromptCurrent.current = assetBlockSelected.aiPrompt
                                        setIsEditPrompt(true)
                                    }} className='p-1 cursor-pointer flex flex-row text-[14px] font-bold bg-custom-gradient-green rounded-[30px] px-3 py-1'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 30 30" fill="none">
                                            <path d="M21.459 2.79243C22.2215 2.02993 23.2557 1.60156 24.334 1.60156C25.4123 1.60156 26.4465 2.02993 27.209 2.79243C27.9715 3.55492 28.3998 4.58909 28.3998 5.66743C28.3998 6.74576 27.9715 7.77993 27.209 8.54243L9.00065 26.7508L1.33398 28.6674L3.25065 21.0008L21.459 2.79243Z" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className='ml-1 text-white'>Edit</div>
                                    </div> : null}
                                </div>
                                <TextareaAutosize
                                    disabled={!isEditPrompt}
                                    value={assetBlockSelected.aiPrompt}
                                    onChange={handleInputAIPrompt}
                                    minRows={1}
                                    maxRows={3}
                                    className={`w-full p-3 border rounded-[10px] resize-none focus:border-[#01A982] outline-none ${isEditPrompt ? `hover:border-[#01A982]` : ``}`}
                                />
                                <div className='flex justify-end mt-3'>
                                    {!isEditPrompt 
                                        ? 
                                            <Button
                                            handleClick={onGenerateWithAI}
                                            disabled={isLoadingGenerate}
                                            buttonText={isLoadingGenerate ? 'Generating...' : 'Generate Data Using AI'}
                                            showIcon={false}
                                            textStyle='text-[1rem] font-base text-[#00A881]'
                                            textColor="text-[#fff]"
                                            backgroundColor={isLoadingGenerate ? "bg-[#00A881]" : "bg-custom-gradient-green"}
                                            customClass='static ml-[0px] px-[35px] py-[10px] group-hover:border-white' /> 
                                        :
                                            <div className='flex'>
                                                <Button
                                                    handleClick={() => {
                                                        const newAssetBlockDataVersions = {
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
                            </div> : null}
                            
                            {/* Form section */}
                            <div className="relative">
                                {hasChanges && (
                                    <div className="absolute right-0 top-0 text-xs text-gray-500 italic hidden">
                                        Preview will update automatically in 3 seconds
                                    </div>
                                )}
                                <JsonForms
                                    schema = {JSON.parse(assetBlock.schema as string)}
                                    data={blockData}
                                    renderers={[
                                        ...materialRenderers,
                                        { tester: CustomTextTester, renderer: CustomTextArea },
                                        {tester : ImagePickerTester, renderer : ImagePickerController }
                                    ]}
                                    uischema={assetHTMLData.layoutName.toLowerCase().includes("linkedin") ? (assetBlock.schema.includes("image_url") ? linkedIn_Uischema : linkedIn_noImage_Uischema) : undefined }
                                    cells={materialCells}
                                    onChange={onHandleEditData}
                                />
                            </div>
                        </div>
                    </div>
                    {/* section footer  */}
                    <div className='border-t border-solid border-[#D9D9D9] p-4 flex justify-end'>
                        <div className='flex'>
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
                    {/* float : close top right  */}
                    <div className='absolute top-1 right-1'>
                        <div
                            onClick={() => setIsShowModelEdit(false)}
                            className="p-1 cursor-pointer hover:bg-gray-200 rounded-full transition ease-in-out duration-200"
                        >
                            <CloseIcon className="text-gray-600" fontSize="medium" />
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default EditContentModel;