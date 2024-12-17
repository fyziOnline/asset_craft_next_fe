import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppData } from '@/context/AppContext';

export const useEditHTMLContent = () => {
    const searchParams = useSearchParams();
    const contentType = searchParams.get('type') || '';
    const { contextData } = useAppData();
    const [isShowSave, setShowSave] = useState(false)
    const [isShowAddVer, setIsShowAddVer] = useState(false)
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

    const handleSave = (type: number) => {
        if (type === 1) {
            setIsShowAddVer(true)
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
    return {
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
        setIsShowModelEdit
    };
};