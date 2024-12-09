import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { nkey } from '@/data/keyStore';

export const useEditHTMLContent = () => {
    const searchParams = useSearchParams();
    const contentType = searchParams.get('type') || '';

    const [htmlContent, setHtmlContent] = useState("");
    const [isShowSave, setShowSave] = useState(false)
    const [isShowAddVer, setIsShowAddVer] = useState(false)
    const [versionList, setVersionList] = useState(["Version 1", "Version 2", "Version 3"])
    const [versionSelected, setVersionSelected] = useState("Version 1")
    const refVersion = useRef('')

    useEffect(() => {
        const savedData = sessionStorage.getItem(nkey.html_content);
        if (savedData) {
            setHtmlContent(savedData);
        }
    }, []);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;

        const svgElement = target.closest('svg[data-id]') as SVGElement | null;
        if (svgElement) {
            const id = svgElement.dataset.id;
            console.log(`Click SVG with ID: ${id}`);
            setHtmlContent(htmlContent.replace("Prospect Details", "Test Demo"))
        }
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
        setVersionList([...versionList, refVersion.current])
        setIsShowAddVer(false)
    };
    return {
        htmlContent,
        isShowAddVer,
        versionSelected,
        isShowSave,
        versionList,
        setShowSave,
        setVersionSelected,
        handleAddVersion,
        handleChangeTextVersion,
        handleSave,
        handleClick,
        setIsShowAddVer
    };
};