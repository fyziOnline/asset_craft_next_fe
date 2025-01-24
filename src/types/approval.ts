export interface ApproverProps {
    name: string,
    userID: string,
    clientID: string,
    isDefault: number
}

export type AssetApprovalHookArg = {
  assetVersionID?: string
  assetID?: string  
}

export interface AssetApprovalResponse  {
    assetApprovalID?: string
    assetID?: string
    assetVersionID?: string
    approverID?: string
    editorID?: string
    assignedTo?: number
    createdBy?: string
    createdOn?: string
    modifiedBy?: string
    modifiedOn?: string
    fileUrl?: string
    comments?: string
  }
  

export type ReAssignApprovalDetailsStruct = {
  fileInBase64 : string
  fileName : string
  comment : string
}