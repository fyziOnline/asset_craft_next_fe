import generatePDF, { Options } from "react-to-pdf";
import React, { useEffect, useRef, useState } from 'react';
import { useAppData } from '@/context/AppContext';
import { ApiService } from "@/lib/axios_generic";
import { urls } from "@/apis/urls";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { nkey } from "@/data/keyStore";
import { AssetBlockProps, AssetHtmlProps, AssetVersionProps } from "@/types/templates";
import { ApproverProps } from "@/types/approval";
import { Option } from "@/components/global/Search";
import { useLoading } from "@/components/global/Loading/LoadingContext";
import { useGenerateTemplate } from "./useGenerateTemplate";

export const useEditHTMLContent = () => {
    const router = useRouter();
    const { contextData, setContextData, setError } = useAppData();
    const [isShowSave, setShowSave] = useState(false)
    const [isShowAddVer, setIsShowAddVer] = useState(false)
    const [isShowSubmitVer, setIsShowSubmitVer] = useState(false)
    const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
    const [versionList, setVersionList] = useState<AssetVersionProps[]>(contextData.AssetHtml.assetVersions || [])
    const [versionSelected, setVersionSelected] = useState<AssetVersionProps>(contextData.AssetHtml.assetVersions?.[0])
    const [sectionEdit, setSectionEdit] = useState<AssetBlockProps>()
    const [listApprovers, setListApprovers] = useState<ApproverProps[]>([])
    const [isShowModelEdit, setIsShowModelEdit] = useState(false)
    const { setShowLoading } = useLoading()
    const { assetIDTemplateRef, getAssetHTML } = useGenerateTemplate({})
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

    useEffect(() => {
        resAssetHtml()
        getListApprovers()
    }, [])

    const resAssetHtml = async () => {
        try {
            setShowLoading(true)
            let assetID = ""
            if (typeof window !== "undefined") {
                const params = new URLSearchParams(window.location.search);
                assetID = params.get("assetID") as string
            }

            assetIDTemplateRef.current = assetID
            const res = await getAssetHTML()
            if (res.isSuccess) {
                const AssetHtml = res as AssetHtmlProps
                setContextData({ AssetHtml: AssetHtml });
                setVersionList(AssetHtml.assetVersions || [])
                setVersionSelected(AssetHtml.assetVersions?.[0])
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
                        filename: `${contextData.AssetHtml.assetName as string} - ${versionSelected.versionName as string}.pdf`,
                        page: {
                            margin: { left: -20, right: -20, top: 0, bottom: 0 }
                        },
                    };
                    generatePDF(getTargetElement, options);
                }
            }
        }
        setShowSave(false)
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
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
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

    const onSubmit = async (itemSelected: Option) => {
        try {
            setShowLoading(true)
            const resSubmit = await ApiService.post<any>(urls.approval_assetApproval_SubmitForApproval, {
                "assetID": versionSelected.assetID,
                "assetVersionID": versionSelected.assetVersionID,
                "approverID": itemSelected.value
            })

            if (resSubmit.isSuccess) {
                setIsShowSubmitVer(false)
                router.replace("/dashboard")
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
        try {
            setShowLoading(true)
            const resUpdateIgnoreStatus = await ApiService.put<any>(urls.assetVersionBlock_updateIgnoreStatus, {
                "assetVersionBlockID": assetVersionBlockID,
                "status": ignoreBlock == 1 ? 0 : 1
            })
            if (resUpdateIgnoreStatus.isSuccess) {
                const resGenerate = await ApiService.get<any>(`${urls.asset_version_generate}?assetVersionID=${versionSelected.assetVersionID}`)
                if (resGenerate.isSuccess) {
                    const resSelect = await ApiService.get<any>(`${urls.asset_version_select}?assetVersionID=${versionSelected.assetVersionID}`)
                    if (resSelect.isSuccess) {
                        const AssetHtml = contextData.AssetHtml
                        const indexVersion = contextData.AssetHtml.assetVersions.findIndex((item) => item.assetVersionID === versionSelected.assetVersionID)
                        const assetVersions = contextData.AssetHtml.assetVersions
                        assetVersions[indexVersion] = resSelect
                        AssetHtml.assetVersions = assetVersions
                        setVersionSelected(resSelect)
                        setVersionList(assetVersions)
                        setContextData({ AssetHtml: AssetHtml })
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

    return {
        sectionEdit,
        isLoadingGenerate,
        isShowAddVer,
        isShowSubmitVer,
        versionSelected,
        isShowSave,
        versionList,
        listApprovers,
        isShowModelEdit,
        setShowSave,
        setVersionSelected,
        setVersionList,
        handleAddVersion,
        handleChangeTextVersion,
        handleSave,
        setIsShowAddVer,
        setIsShowSubmitVer,
        setIsShowModelEdit,
        onGenerateWithAI,
        onSubmit,
        setSectionEdit,
        handleHideBlock
    };
};