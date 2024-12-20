import generatePDF, { Options } from "react-to-pdf";
import React, { useEffect, useRef, useState } from 'react';
import { useAppData } from '@/context/AppContext';
import { ApiService } from "@/lib/axios_generic";
import { urls } from "@/apis/urls";
import { useRouter } from "next/navigation";
import { AssetInProgressProps } from "@/types/asset";
import moment from "moment";
import Cookies from 'js-cookie';
import { nkey } from "@/data/keyStore";

export const useEditHTMLContent = () => {
    const router = useRouter();
    const { contextData, setContextData } = useAppData();
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
                        filename: `${contextData.AssetHtml.assetName as string} - ${versionSelected.versionName as string}.pdf`
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

    const handleAddVersion = async () => {
        try {
            const resAddNewVersion = await ApiService.post<any>(urls.asset_version_copy, {
                assetVersionID: versionSelected.assetVersionID,
                versionName: refVersion.current
            })
            if (resAddNewVersion.isSuccess) {
                const resSelect = await ApiService.get<any>(`${urls.asset_version_select}?assetVersionID=${resAddNewVersion.assetVersionID}`)
                if (resSelect.isSuccess) {
                    const AssetHtml = contextData.AssetHtml
                    const assetVersions = contextData.AssetHtml.assetVersions
                    assetVersions.push(resSelect)
                    AssetHtml.assetVersions = assetVersions
                    setVersionSelected(resSelect)
                    setContextData({ AssetHtml: AssetHtml })
                    setIsShowAddVer(false)
                }
            }
        } catch (error) {
            console.error('API Error:', ApiService.handleError(error));
            alert(ApiService.handleError(error));
        }
    };

    const onGenerateWithAI = async () => {
        try {
            setIsLoadingGenerate(true)
            const resGenerateWithAI = await ApiService.get<any>(`${urls.asset_version_getDataUsingAI}?assetVersionID=${versionSelected.assetVersionID}`)
            if (resGenerateWithAI.isSuccess) {
                const resGenerate = await ApiService.get<any>(`${urls.asset_version_generate}?assetVersionID=${versionSelected.assetVersionID}`)
                if (resGenerate.isSuccess) {
                    const resSelect = await ApiService.get<any>(`${urls.asset_version_select}?assetVersionID=${versionSelected.assetVersionID}`)
                    if (resSelect.isSuccess) {
                        const AssetHtml = contextData.AssetHtml
                        const indexVersion = contextData.AssetHtml.assetVersions.findIndex((item) => item.assetVersionID === versionSelected.assetVersionID)
                        const assetVersions = contextData.AssetHtml.assetVersions
                        assetVersions[indexVersion] = resSelect
                        AssetHtml.assetVersions = assetVersions
                        setContextData({ AssetHtml: AssetHtml })
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

    const onSubmit = () => {
        try {
            let project_name = ""
            let campaign_name = ""
            let asset_name = ""
            if (typeof window !== "undefined") {
                const params = new URLSearchParams(window.location.search);
                project_name = params.get("project_name") || ""
                campaign_name = params.get("campaign_name") || ""
                asset_name = params.get("asset_name") || ""
            }
            const currentDate = moment().format('DD.MM.YYYY')
            const email_login = Cookies.get(nkey.email_login) || ""
            let name = ""
            try {
                name = email_login.split("@")[0];
            } catch (error) {

            }

            const asset: AssetInProgressProps = {
                assetVersionId: versionSelected.assetVersionID,
                projectName: project_name,
                campaignName: campaign_name,
                assetName: `${asset_name}_${versionSelected.versionName}`.replace(" ", ""),
                assetType: "",
                createdOn: currentDate,
                approvedBy: name,
                approvedOn: "",
                currentStatus: "Pending Approval"
            }


            const assetInProgressTemporary = JSON.parse(localStorage.getItem(nkey.assetInProgressTemporary) || "[]") as AssetInProgressProps[]
            assetInProgressTemporary.push(asset)
            localStorage.setItem(nkey.assetInProgressTemporary, JSON.stringify(assetInProgressTemporary));
        } catch (error) {
            console.log('error: ', error);
        }
        router.replace("/dashboard")
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
        onGenerateWithAI,
        onSubmit
    };
};