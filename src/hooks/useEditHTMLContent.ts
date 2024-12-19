import generatePDF, { Options, Resolution } from "react-to-pdf";
import React, { useEffect, useRef, useState } from 'react';
import { useAppData } from '@/context/AppContext';
import { ApiService } from "@/lib/axios_generic";
import { urls } from "@/apis/urls";

export const useEditHTMLContent = () => {
    const { contextData } = useAppData();
    const [isShowSave, setShowSave] = useState(false)
    const [isShowAddVer, setIsShowAddVer] = useState(false)
    const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
    const [versionList, setVersionList] = useState(contextData.AssetHtml.assetVersions || [])
    const [versionSelected, setVersionSelected] = useState(contextData.AssetHtml.assetVersions?.[0])
    const [isShowModelEdit, setIsShowModelEdit] = useState(false)
    const refVersion = useRef('')

    useEffect(() => {
        try {
            const findSelected = contextData.AssetHtml.assetVersions?.filter((item) => item.assetVersionID === versionSelected.assetVersionID)
            if (findSelected.length > 0) {
                setVersionSelected(findSelected[0])
            } else {
                setVersionSelected(contextData.AssetHtml.assetVersions[0])
            }
            setVersionList(contextData.AssetHtml.assetVersions)
        } catch (error) {

        }
    }, [contextData.AssetHtml])

    const handleCopy = () => {

    };

    const getTargetElement = () => document.getElementById("container");

    const handleSave = (type: number) => {
        if (type === 1) {
            setIsShowAddVer(true)
        } else {
            if (typeof window !== 'undefined') {
                if (type === 2) {
                    window.open(versionSelected.htmlFileURL, '_blank', 'noopener,noreferrer');
                } else if (type === 3) {
                    window.open(versionSelected.zipFileURL, '_blank', 'noopener,noreferrer');
                } else if (type === 4) {
                    const options: Options = {
                        filename: `${contextData.AssetHtml.assetName as string}${versionSelected.versionName as string}.pdf`
                    };
                    generatePDF(getTargetElement, options);
                }
            }
        }
        setShowSave(!isShowSave)
    }

    const handleChangeTextVersion = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        refVersion.current = event.target.value;
    };

    const handleAddVersion = () => {
        if (refVersion.current.trim().length === 0) { return }
        // setVersionList([...versionList, refVersion.current])
        setIsShowAddVer(false)
    };

    const onGenerateWithAI = async () => {
        try {
            setIsLoadingGenerate(true)
            const resGenerateWithAI = await ApiService.get<any>(`${urls.asset_version_getDataUsingAI}?assetVersionID=${versionSelected.assetVersionID}`)
            if (resGenerateWithAI.isSuccess) {
                const resGenerate = await ApiService.get<any>(`${urls.asset_version_generate}?assetVersionID=${versionSelected.assetVersionID}`)
                if (resGenerate.isSuccess) {
                    const resSelect = await ApiService.get<any>(`${urls.asset_version_select}?assetVersionID=${versionSelected.assetVersionID}`)
                    console.log('resSelect: ', resSelect);
                    if (resSelect.isSuccess) {
                        setVersionSelected(resSelect)
                    }
                }

            }
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            alert(ApiService.handleError(error));
        } finally {
            setIsLoadingGenerate(false);
        }
    }

    return {
        isLoadingGenerate,
        isShowAddVer,
        versionSelected,
        isShowSave,
        versionList,
        isShowModelEdit,
        setShowSave,
        setVersionSelected,
        handleAddVersion,
        handleChangeTextVersion,
        handleSave,
        handleCopy,
        setIsShowAddVer,
        setIsShowModelEdit,
        onGenerateWithAI
    };
};