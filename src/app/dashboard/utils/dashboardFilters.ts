import { STATUS } from "@/constants";
import { AssetData, AssetType, ClientAssetTypeProps } from "@/types/asset";
import { formatDate } from "@/utils/formatDate";

// Define the type for each asset in the dashboard
interface DashboardAsset {
    project: string;
    campaignName: string;
    status: string;
    assetID: string;
    assetTypeName: string;
    clientID: string;
    campaignID: string;
    assetVersionID: string;
    assetName: string;
    language: string;
    createdOn: string;
    assetAIPrompt: string;
    isVisible: number;
    layoutID: string;
    layoutName: string;
    layoutHTML: string;
    assetVersions: AssetVersion[];
    isSuccess: boolean;
    errorOnFailure: string;
    approvedOn ?: string
    approvedBy ?: string
}

interface AssetVersion {
    assetVersionID: string;
    assetID: string;
    templateID: string;
    versionNumber: number;
    versionName: string;
    htmlGenerated: string;
    htmlFileURL: string | null;
    zipFileURL: string | null;
    status: string;
}

// Define the type for each item in the dashboard data
interface DashboardData {
    projectName: string;
    allProjectDate?: string;
    totalAssets: number;
    underReview: number;
    inProgress: number;
    completedAssets :number;
}

// Helper function to filter and count assets based on type and status
const countAssetsByTypeAndStatus = (assets: DashboardAsset[], type: string, status: string) => {
    const filteredAssets = assets.filter(asset => asset.assetTypeName === type);
    const countByStatus = filteredAssets.filter(asset => asset.status === status).length;
    return { total: filteredAssets.length, statusCount: countByStatus };
};

const getCurrentDateFormatted = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = today.getFullYear();
    return `${day}.${month}.${year}`;
};

// The main function that processes the dashboard assets
const processDashboardAssets = (dashboardAssets: DashboardAsset[],assetType:AssetType="email",clientAssetTypes:ClientAssetTypeProps[]): { updatedDashboardData: DashboardData[], assetsDisplayTable: any[], pendingApproval: any[], assetData : any[] } => {
    const dashboardData: DashboardData[] = [
        { projectName: "", allProjectDate: `as of ${getCurrentDateFormatted()}`, totalAssets: 0, underReview: 0, inProgress: 0, completedAssets: 0 },
        { projectName: "", totalAssets: 0, underReview: 0, inProgress: 0, completedAssets: 0 },
        { projectName: "", totalAssets: 0, underReview: 0, inProgress: 0, completedAssets: 0 },
        { projectName: "", totalAssets: 0, underReview: 0, inProgress: 0, completedAssets: 0 },
        { projectName: "", totalAssets: 0, underReview: 0, inProgress: 0, completedAssets: 0 },
    ];

    // console.log("clientAssetTypes",clientAssetTypes);

    const sortedDashBoardData = dashboardData.map((data, index) => ({
        ...data,
        projectName: clientAssetTypes[index]?.assetTypeName === "All in One"
            ? "All Projects"
            : clientAssetTypes[index]?.assetTypeName || ""
    }));

    // console.log("sortedDashBoardData",sortedDashBoardData);
    
    // Calculate the totals for all projects
    const totalAssets = dashboardAssets.length;
    
    
    const inProgressCount = dashboardAssets.filter(asset => asset.status === STATUS.IN_PROGRESS).length;
    
    const onReviewCount = dashboardAssets.filter(asset => asset.status === STATUS.ON_REVIEW).length;

    const pendingApproval = dashboardAssets.filter(asset => asset.status === STATUS.ON_REVIEW)

    const completedAssetsCount = dashboardAssets.filter(asset => asset.status === STATUS.COMPLETED).length

    // Calculate for each project type
    const projectTypes = ["Email", "LinkedIn", "Landing Page", "Call Script"];
    const updatedDashboardData = sortedDashBoardData.map((data) => {
        if (data.projectName === "All Projects") {
            return {
                ...data,
                underReview: onReviewCount,
                inProgress: inProgressCount,
                totalAssets: totalAssets,
                completedAssets: completedAssetsCount
            };
        }

        if (projectTypes.includes(data.projectName)) {
            const { total, statusCount } = countAssetsByTypeAndStatus(dashboardAssets, data.projectName, STATUS.IN_PROGRESS);
            const onReviewStatusCount = countAssetsByTypeAndStatus(dashboardAssets, data.projectName, STATUS.ON_REVIEW).statusCount;
            const completedAssetsCount = countAssetsByTypeAndStatus(dashboardAssets, data.projectName, STATUS.COMPLETED).statusCount;
            return {
                ...data,
                underReview: onReviewStatusCount,
                inProgress: statusCount,
                totalAssets: total,
                completedAssets: completedAssetsCount
            };
        }

        return data;
    });

    const mappedAssets = mapAssetsByType(dashboardAssets,assetType);
    const assetData = mappedAssets.assetData
    const assetsDisplayTable = mappedAssets.assetsDisplayTable;
    return { updatedDashboardData, assetsDisplayTable, pendingApproval,assetData};
};



const mapAssetsByType = (assets:DashboardAsset[],type:AssetType) => {
  const result = {
    assetData : [] as AssetData[],
    assetsDisplayTable: [] as AssetData[]
  };

  for (let i = 0; i < assets.length; i++) {
    const data = assets[i];
    const mappedData:AssetData = {
        assetName: data.assetName,
        campaignName: data.campaignName,
        assetTypeIcon: data.assetTypeName,
        projectName: data.project,
        createdOn: formatDate(data.createdOn),
        currentStatus: data.status,
        assetID: data.assetID,
    };

    const assetName = data.assetTypeName.toLocaleLowerCase() 
    
    if (assetName === type?.toLocaleLowerCase()) {
      result.assetData.push({
        ...mappedData,
        approvedOn : data.approvedOn ? formatDate(data.approvedOn) : "",
        approvedBy : data.approvedBy
    })
    } 

    if (type?.toLocaleLowerCase() === 'all projects') {
        result.assetData.push({
            ...mappedData,
            approvedOn : data.approvedOn ? formatDate(data.approvedOn) : "",
            approvedBy : data.approvedBy
        })
    }

    if (result.assetsDisplayTable.length < 5) {
      result.assetsDisplayTable.push(mappedData)
    }
  }

  return result;
}


export default processDashboardAssets;
