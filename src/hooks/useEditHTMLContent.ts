import React, { useEffect, useRef, useState } from 'react';
import { useAppData } from '@/context/AppContext';
import { ApiService } from "@/lib/axios_generic";
import { urls } from "@/apis/urls";
import Cookies from 'js-cookie';
import { nkey } from "@/data/keyStore";
import { AssetBlockProps, AssetHtmlProps, AssetVersionProps } from "@/types/templates";
import { ApproverProps } from "@/types/approval";
import { Option } from "@/components/global/Search";
import { useLoading } from "@/components/global/Loading/LoadingContext";
import { useGenerateTemplate } from "./useGenerateTemplate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import useEditAssetStore from '@/store/editAssetStore';

export const useEditHTMLContent = () => {
    const {  setError } = useAppData();
    const [isShowSave, setShowSave] = useState(false)
    const [isShowAddVer, setIsShowAddVer] = useState(false)
    const [isShowSubmitVer, setIsShowSubmitVer] = useState(false)
    const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
    const [sectionEdit, setSectionEdit] = useState<AssetBlockProps>()
    const [listApprovers, setListApprovers] = useState<ApproverProps[]>([])
    const { setShowLoading } = useLoading()
    const { assetIDTemplateRef, getAssetHTML } = useGenerateTemplate({})
    const refVersion = useRef('')
    const [showErrorMessage, setShowErrorMessage] = useState(false)
    const [editingVersionId, setEditingVersionId] = useState<string | null>(null);

    const versionList = useEditAssetStore.getState().versionList
    const assetHTMLData = useEditAssetStore.getState().assetHTMLData
    const selectedVersionID = useEditAssetStore.getState().selectedVersionID

    
    const setAssetHTMLData = useEditAssetStore.getState().setAssetHTMLData
    const updateVersionField = useEditAssetStore.getState().updateVersionField
    const deleteVersionFromTheList = useEditAssetStore.getState().deleteVersionFromTheList
    const updateVersionList = useEditAssetStore.getState().updateVersionList
    const updateEntireVersionList = useEditAssetStore.getState().updateEntireVersionList
    const updateUniqueStatusList = useEditAssetStore.getState().updateUniqueStatusList
    const setAssetHTMLFromSingleVersion = useEditAssetStore.getState().setAssetHTMLFromSingleVersion
    
    const generateMissingHTML = async () => {
    // Get fresh state from store instead of stale closure
    const { versionList, selectedVersionID } = useEditAssetStore.getState();
    console.log("loading...");
    console.log(versionList, selectedVersionID);
    
    const selectedVersion = versionList.find(v => v.assetVersionID === selectedVersionID);
    let needsGeneration = false;
    const apiPromises: Promise<any>[] = [];

    if (selectedVersion) {
        for (const block of selectedVersion.assetVersionBlocks) {
            if (
                (!block.blockHTMLGenerated || block.blockHTMLGenerated.trim() === '') &&
                !block.blockName.includes('_global')
            ) {
                needsGeneration = true;
                break;
            }
        }
    }

    if (needsGeneration) {
        versionList.forEach(version => {
            const promise = ApiService.get(
                `${urls.asset_generate}?assetID=${version.assetID}&assetVersionID=${version.assetVersionID}`
            );
            apiPromises.push(promise);
        });
    }

    return {
        hasPendingApiCalls: apiPromises.length > 0,
        apiPromises,
    };
    };

    const handleAndRefreshAfterGeneration = async (apiPromises: Promise<any>[]) => {
        if (!apiPromises || apiPromises.length === 0) {
            return;
        }

        const results = await Promise.allSettled(apiPromises);
        let allSucceeded = true;

        results.forEach(result => {
            if (result.status === 'rejected') {
                allSucceeded = false;
                console.error("Failed to generate HTML for a version:", result.reason);
                // Optional: Use setError to display a more user-friendly message
                // setError({
                //     status: (result.reason as any)?.response?.status || 500,
                //     message: `Failed to generate HTML. Error: ${(result.reason as any)?.message || 'Unknown error'}`,
                //     showError: true,
                // });
            }
        });

        if (allSucceeded) {
            if (typeof window !== "undefined") {
                window.location.reload();
            }
        } else {
            setError({ // Using setError as per the optional instruction if any promise rejected
                status: 500, // Generic server error status
                message: "One or more HTML generation tasks failed. Please check the console for details and try again.",
                showError: true,
            });
        }
    };

    useEffect(() => {
        resAssetHtml()
        getListApprovers()
    }, [])

    const resAssetHtml = async () => {
    try {
        let assetID = ""
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            assetID = params.get("assetID") as string
        }
        if (!assetID) {
            return await resAssetVersion()
        }

        setShowLoading(true)

        assetIDTemplateRef.current = assetID
        const res = await getAssetHTML()
        if (res.isSuccess) {
            const AssetHtml = res as AssetHtmlProps
            setAssetHTMLData(AssetHtml)
            
            // Call HTML generation after store is populated
            await initiateHTMLGeneration()
        } else {
            alert("An error occurred, please try again later.")
        }
    } catch (error) {
        const apiError = ApiService.handleError(error)
        setError({
            status: apiError.statusCode,
            message: apiError.message,
            showError: true
        })
    } finally {
        setShowLoading(false)
    }
}

    const resAssetVersion = async () => {
    try {
        setShowLoading(true)
        let assetVersionID = ""
        let assetName = ""
        let layoutName = ""
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            assetVersionID = params.get("assetVersionID") as string
            assetName = params.get("assetName") as string
            layoutName = params.get("layoutName") as string
        }
        const resSelect = await ApiService.get<any>(`${urls.asset_version_select}?assetVersionID=${assetVersionID}`)

        if (resSelect.isSuccess) {
            setAssetHTMLFromSingleVersion(resSelect)
            
            // Call HTML generation after store is populated
            await initiateHTMLGeneration()
        }
    } catch (error) {
        const apiError = ApiService.handleError(error)
        setError({
            status: apiError.statusCode,
            message: apiError.message,
            showError: true
        })
    } finally {
        setShowLoading(false)
    }
    }

    const initiateHTMLGeneration = async () => {
        
        const { hasPendingApiCalls, apiPromises } = await generateMissingHTML();
        if (hasPendingApiCalls) {
            await handleAndRefreshAfterGeneration(apiPromises);
        }
    };


    const getListApprovers = async () => {
        try {
            const clientId = Cookies.get(nkey.client_ID)
            const resListApprovers = await ApiService.get<any>(`${urls.approval_approver_select_all}?clientID=${clientId}`)
            if (resListApprovers.isSuccess && resListApprovers?.approvers?.length > 0) {
                setListApprovers(resListApprovers.approvers as ApproverProps[])
            }
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
        }
    }
    
    const handleSave = async (type: number) => {
        if (type === 1) {
            setIsShowAddVer(true)
        } else {
            const selectedVersion= versionList.find(v=>v.assetVersionID===selectedVersionID) as AssetVersionProps
            if (typeof window !== 'undefined') {
                if (type === 2) {
                    window.open(selectedVersion?.htmlFileURL, '_blank', 'noopener,noreferrer');
                } else if (type === 3) {
                    window.open(selectedVersion?.zipFileURL, '_blank', 'noopener,noreferrer');
                }  else if (type === 4) {
                    const element = document.createElement('div')
                    element.innerHTML = selectedVersion?.htmlGenerated
                    document.body.appendChild(element)
                    try {
                        await new Promise(resolve => setTimeout(resolve,1000))
                        const canvas = await html2canvas(element,{
                            scale : 2,
                            useCORS : true,
                            logging : true
                        })
                        const pdf = new jsPDF('p','mm','a4')
                        const imgData = canvas.toDataURL('image/png')
                        const pdfWidth = pdf.internal.pageSize.getWidth()
                        const pdfHeight = (canvas.height * pdfWidth) / canvas.width

                        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
                        pdf.save(`${assetHTMLData.assetName} - ${selectedVersion.versionName}.pdf`)
                    } catch (err) {
                      console.error('Error generating PDF:', err)
                    } finally {
                      if (element.parentNode) {
                        element.parentNode.removeChild(element)
                      }
                    
                     }
            }
        }
        setShowSave(false)
    }}

    const handleChangeTextVersion = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        refVersion.current = event.target.value;
    };

    const handleAddVersion = async () => {
        const selectedVersion= versionList.find(v=>v.assetVersionID===selectedVersionID) as AssetVersionProps
        try {
            if (refVersion.current !== "") {
                setShowErrorMessage(false)
                const resAddNewVersion = await ApiService.post<any>(urls.asset_version_copy, {
                    assetVersionID: selectedVersion.assetVersionID,
                    versionName: refVersion.current

                })

                if (resAddNewVersion.isSuccess) {
                    const resSelect = await ApiService.get<any>(`${urls.asset_version_select}?assetVersionID=${resAddNewVersion.assetVersionID}`)

                    if (resSelect.isSuccess) {
                        const {
                            isSuccess,
                            errorOnFailure,
                            ...restOfNewVersionData
                        } = resSelect
                        const versionExist = versionList.some((version) => version.assetVersionID === resSelect.assetVersionID)

                        if (!versionExist) {
                            updateVersionList(restOfNewVersionData)
                        }

                        setIsShowAddVer(false)
                        setShowErrorMessage(false)
                        refVersion.current = ""
                    }
                }
            } else {
                setShowErrorMessage(true)
            }

        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
        }
    };

    const onGenerateWithAI = async () => {
        const selectedVersion= versionList.find(v=>v.assetID===selectedVersionID) as AssetVersionProps
        try {
            setIsLoadingGenerate(true)
            const resGenerateWithAI = await ApiService.get<any>(`${urls.asset_version_getDataUsingAI}?assetVersionID=${selectedVersion.assetVersionID}`)
            if (resGenerateWithAI.isSuccess) {
                const resGenerate = await ApiService.get<any>(`${urls.asset_version_generate}?assetVersionID=${selectedVersion.assetVersionID}`)
                if (resGenerate.isSuccess) {
                    const resSelect = await ApiService.get<any>(`${urls.asset_version_select}?assetVersionID=${selectedVersion.assetVersionID}`)
                    if (resSelect.isSuccess) {
                        const {isSuccess,errorOnFailure,...updatedVersion} = resSelect

                        const indexAssetVersion = versionList.findIndex((item) => item.assetVersionID === selectedVersion.assetVersionID)
                        const newVersionList = versionList[indexAssetVersion] = updatedVersion
                        updateEntireVersionList(newVersionList)
                    }
                }
            }
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
        } finally {
            setIsLoadingGenerate(false);
        }
    }

    const onSubmit = async (itemSelected: Option , isComments : string) => {
        const selectedVersion= versionList.find(v=>v.assetVersionID===selectedVersionID) as AssetVersionProps
        try {
            const resSubmit = await ApiService.post<any>(urls.approval_assetApproval_SubmitForApproval, {
                "assetID": selectedVersion.assetID,
                "assetVersionID": selectedVersion.assetVersionID,
                "approverID": itemSelected.value,
                "comments": isComments
            })

            if (resSubmit.isSuccess) {
                updateVersionField(selectedVersionID,{status:'On Review'})
                updateUniqueStatusList()
                // Delay closing the modal for 1 seconds
                setTimeout(() => {
                    setIsShowSubmitVer(false);
                }, 1000);
            } else {
                alert("Submit failed, please try again later.");
            }

        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
        } finally {
            setShowLoading(false)
        }
    }

    const handleHideBlock = async (assetVersionBlockID: string, ignoreBlock: number) => {
        const selectedVersion= versionList.find(v=>v.assetID===selectedVersionID) as AssetVersionProps
        try {
            setShowLoading(true)
            const resUpdateIgnoreStatus = await ApiService.put<any>(urls.assetVersionBlock_updateIgnoreStatus, {
                "assetVersionBlockID": assetVersionBlockID,
                "status": ignoreBlock == 1 ? 0 : 1
            })
            if (resUpdateIgnoreStatus.isSuccess) {
                const resGenerate = await ApiService.get<any>(`${urls.asset_version_generate}?assetVersionID=${selectedVersion.assetVersionID}`)
                if (resGenerate.isSuccess) {
                    const resSelect = await ApiService.get<any>(`${urls.asset_version_select}?assetVersionID=${selectedVersion.assetVersionID}`)
                    if (resSelect.isSuccess) {
                        const {isSuccess,errorOnFailure,...updatedVersion} = resSelect

                        const indexAssetVersion = versionList.findIndex((item) => item.assetVersionID === selectedVersion.assetVersionID)
                        const newVersionList = versionList[indexAssetVersion] = updatedVersion
                        updateEntireVersionList(newVersionList)
                    }
                }
            }
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
        } finally {
            setShowLoading(false)
        }

    }

    const handleDelete = async (assetVersionID: string) => {
        try {
            const res = await ApiService.delete<any>(`${urls.asset_verdion_delete}?assetVersionID=${assetVersionID}`)

            if(res.isSuccess) {
                deleteVersionFromTheList(assetVersionID)
                updateUniqueStatusList()
            }

        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
        }
    }

    const handleUpdateVersionName = async (assetVersionID: string, newName: string) => {
        try {
            const res = await ApiService.put<any>(`${urls.asset_version_updateField}`, {
                assetVersionID: assetVersionID,
                fieldName: "versionname",
                fieldValue: newName
            });

            if (res.isSuccess) {
                updateVersionField(assetVersionID,{versionName:newName})
            }
        } catch (error) {
            const apiError = ApiService.handleError(error);
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            });
        } finally {
            setEditingVersionId(null);
        }
    };

    return {
        sectionEdit,
        isLoadingGenerate,
        isShowAddVer,
        isShowSubmitVer,
        isShowSave,
        listApprovers,
        setShowSave,
        handleAddVersion,
        handleChangeTextVersion,
        handleSave,
        setIsShowAddVer,
        setIsShowSubmitVer,
        onGenerateWithAI,
        onSubmit,
        setSectionEdit,
        handleHideBlock,
        showErrorMessage,
        handleDelete,
        editingVersionId,
        setEditingVersionId,
        handleUpdateVersionName,
        generateMissingHTML,
        handleAndRefreshAfterGeneration,
    };

}
