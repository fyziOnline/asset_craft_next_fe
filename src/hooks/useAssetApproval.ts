import { ChangeEvent, useEffect, useState } from "react"
import { ApiService } from "@/lib/axios_generic"
import { urls } from "@/apis/urls"
import { AssetApprovalHookArg, AssetApprovalResponse, ReAssignApprovalDetailsStruct } from "@/types/approval"
import { useAppData } from "@/context/AppContext"
import { convertFileToBase64 } from "@/lib/utils"
import { debounce } from "lodash"
import { useRouter } from "next/navigation"

class ApiError extends Error {
    status?: number;
    data?: any;
  
    constructor(message: string, status?: number, data?: any) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.data = data;
    }
  }

export const useAssetApproval = (assetData : AssetApprovalHookArg) => {
    const router = useRouter()

    const [reAssignLoading, setReAssignLoading] = useState<boolean>(false)
    const [loadingApproval,setLoadingApproval] = useState<boolean>(false)
    const [isReAssignSuccessFull, setIsReAssignSuccessFull] = useState<boolean>(false)
    const [canReassign,setCanReassign] = useState<boolean>(false)
    const {setError} = useAppData()
    const [approvalDetails,setApprovalDetails] = useState<AssetApprovalResponse>(
        {
            assetApprovalID: "",
            assetID: "",
            assetVersionID: "",
            approverID: "",
            editorID: "",
            assignedTo: 0,
            createdBy: "",
            createdOn: "",
            modifiedBy: "",
            modifiedOn: "",
            fileUrl: "",
            comments: "",
            editorName: ""
        }
    )
    const [fileConversionError,setFileConversionError] = useState<{}|null>(null)
    const [reAssignAssetDetails,setReAssignAssetDetails]=useState<ReAssignApprovalDetailsStruct>({
        fileInBase64 : "",
        fileName : "",
        comment : "" 
    })

    type Comment = {
        comment: string;
        createdOn: string;
        createdBy: string;
        type: string;
    }

    const [comments,setComments] = useState<Comment[]>([])

    useEffect(() => {
        if (assetData.assetVersionID) {
            init_hook()
        }
    }, [assetData.assetVersionID])

    const init_hook = async () => {
        if (assetData.versionStatus === "On Review" || assetData.versionStatus === "In Progress") {
            await getApprovalDetails()
        }
    }

    const handleUploadFile = async (file:File) => {
        
        try {
            const res_fileCOnversion = await convertFileToBase64(file)
            if(res_fileCOnversion.isSuccess) {
                setReAssignAssetDetails(pre=>({
                    ...pre,
                    fileInBase64 : res_fileCOnversion.base64String || "",
                    fileName : file.name
                }))
            } else {
                setFileConversionError(res_fileCOnversion.error)
            }
        } catch (error) {
            if (error) {
                setFileConversionError(error)
            } else {
                setFileConversionError({status:false,message:"unable to upload file, internal error"})
            }
        }
    }

    const eventInputComment = debounce((e:ChangeEvent<HTMLTextAreaElement>) => {
        setReAssignAssetDetails(pre=>({
            ...pre,
            comment : e.target.value
        }))
        e.target.value.length > 0 ? 
            setCanReassign(true) : setCanReassign(false)
    },500)

    const handleRemoveFile = () => {
        setReAssignAssetDetails(pre=>({
            ...pre,
            fileInBase64 : "",
            fileName : ""
        }))
        setFileConversionError(null)
    }

    const getApprovalDetails = async () => {
        try {
            // setReAssignLoading(true)
            const res_approvalDetails = await ApiService.get<any>(`${urls.getAssetApprovalDetails}?assetVersionID=${assetData.assetVersionID}`)
            if (!res_approvalDetails || res_approvalDetails.errorOnFailure.length > 0 ) {
                throw new ApiError('Approval details fetch failed', 400, res_approvalDetails.errorOnFailure);
            }
            setApprovalDetails(res_approvalDetails.assetApproval)
            setComments(res_approvalDetails.comments)
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setIsReAssignSuccessFull(false)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
        } 
    }
    
    const reAssignAsset = async () => {
        try {
            setReAssignLoading(true)
            setCanReassign(false)
            if(reAssignAssetDetails.fileName !== ""  ) {
                const resRemoteFileUpload = await uploadReAssignFile(approvalDetails)
                if(!resRemoteFileUpload?.status) {
                    throw new ApiError('Uploading file failed', 500, {});
                }
            }

            const resReAssignment = await updateAssetReassign (approvalDetails)
            if (resReAssignment?.status) { 
                setIsReAssignSuccessFull(true)
            }
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setIsReAssignSuccessFull(false)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true,
            })
        } finally {
            setReAssignLoading(false)
            setCanReassign(true)
        }
        
    }


    const uploadReAssignFile = async (approvalDetails:AssetApprovalResponse) => {
        
        try {
            const res_updateAssetReAssignComment = await ApiService.put<any>(urls.updateAssetReAssignFile,{
                "assetApprovalID": approvalDetails.assetApprovalID,
                "originalImageName": reAssignAssetDetails.fileName,
                "imageAsBase64String": reAssignAssetDetails.fileInBase64
            })
            if (res_updateAssetReAssignComment.isSuccess) {
                return {status : true}
            }
            if (res_updateAssetReAssignComment.errorOnFailure.length > 0 ) {
                throw new ApiError(
                    'Failed to upload reassignment file',
                    400,
                    res_updateAssetReAssignComment.errorOnFailure
                )
            }
        } catch (error) {
            throw new ApiError('Reassignment upload error', 500, error)
        }

    }

    const updateAssetReassign = async (approvalDetails:AssetApprovalResponse) => {
        try {
            const res_updateAssetReassignFinal = await ApiService.put<any>(urls.updateAssetReassignFinal,{
                "assetVersionID": approvalDetails.assetVersionID,
                "approverID": approvalDetails.approverID,
                "editorID": approvalDetails.editorID,
                "comments": reAssignAssetDetails.comment
            })
            if (res_updateAssetReassignFinal.isSuccess) {
                return { status : true}
            }
            if (res_updateAssetReassignFinal.errorOnFailure.length>0) {
                throw new ApiError(
                    'Failed to upload reassignment file',
                    400,
                    res_updateAssetReassignFinal.errorOnFailure
                )
            }
        } catch (error) {
            throw new ApiError('Reassignment error', 500, error)
        }
    }

    const approveAsset = async () => {
        try {
            setLoadingApproval(true)
            const res_approveAsset = await ApiService.put<any>(`${urls.approveAsset}?assetVersionID=${approvalDetails.assetVersionID}`)
            if (!res_approveAsset || res_approveAsset.errorOnFailure.length>0) {
                throw new ApiError('Unable to approve this asset', 400, res_approveAsset.errorOnFailure);
            }
            router.back()
        } catch (error) {
            const apiError = ApiService.handleError(error)
            setError({
                status: apiError.statusCode,
                message: apiError.message,
                showError: true
            })
        } finally {
            setLoadingApproval(false)
        }
    }

    return {
        fileConversionError,
        eventInputComment,
        isReAssignSuccessFull,
        reAssignLoading,
        approvalDetails,
        canReassign,
        setIsReAssignSuccessFull,
        handleUploadFile,
        handleRemoveFile,
        getApprovalDetails,
        reAssignAsset,
        approveAsset,
        comments
    }
}