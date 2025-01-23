import { AssetData, AssetType } from "@/types/asset";
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
}

// type AssetData = {
//     assetTypeIcon:string
//     assetName:string
//     campaignName:string
//     projectName:string
//     createdOn:string
//     currentStatus:string
//     assetID:string
//     approvedOn ?: string | undefined
//     approvedBy ?: string | undefined
// }

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
const processDashboardAssets = (dashboardAssets: DashboardAsset[],assetType:AssetType="email"): { updatedDashboardData: DashboardData[], assetsDisplayTable: any[], pendingApproval: any[], assetData : any[] } => {
    const dashboardData: DashboardData[] = [
        { projectName: "All Projects", allProjectDate: `as of ${getCurrentDateFormatted()}`, totalAssets: 0, underReview: 0, inProgress: 0 },
        { projectName: "Email", totalAssets: 0, underReview: 0, inProgress: 0 },
        { projectName: "LinkedIn", totalAssets: 0, underReview: 0, inProgress: 0 },
        { projectName: "Landing Page", totalAssets: 0, underReview: 0, inProgress: 0 },
        { projectName: "Call Script", totalAssets: 0, underReview: 0, inProgress: 0 },
    ];

    // Calculate the totals for all projects
    const totalAssets = dashboardAssets.length;
    const inProgressCount = dashboardAssets.filter(asset => asset.status === "In Progress").length;
    const onReviewCount = dashboardAssets.filter(asset => asset.status === "On Review").length;

    const pendingApproval = dashboardAssets.filter(asset => asset.status === "On Review")

    // Calculate for each project type
    const projectTypes = ["Email", "LinkedIn", "Landing Page", "Call Script"];
    const updatedDashboardData = dashboardData.map((data) => {
        if (data.projectName === "All Projects") {
            return {
                ...data,
                underReview: onReviewCount,
                inProgress: inProgressCount,
                totalAssets: totalAssets,
            };
        }

        if (projectTypes.includes(data.projectName)) {
            const { total, statusCount } = countAssetsByTypeAndStatus(dashboardAssets, data.projectName, "In Progress");
            const onReviewStatusCount = countAssetsByTypeAndStatus(dashboardAssets, data.projectName, "On Review").statusCount;
            return {
                ...data,
                underReview: onReviewStatusCount,
                inProgress: statusCount,
                totalAssets: total,
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
        projectName: data.project,
        campaignName: data.campaignName,
        assetTypeIcon: data.assetTypeName,
        assetName: data.assetName,
        createdOn: formatDate(data.createdOn),
        currentStatus: data.status,
        assetID: data.assetID,
    };
    const assetName = data.assetTypeName.toLocaleLowerCase() 
    if (assetName === type?.toLocaleLowerCase()) {
      result.assetData.push({
        ...mappedData,
        approvedOn : data.approvedOn,
        approvedBy : data.approvedBy
    })
    } 
    if (type?.toLocaleLowerCase() === 'all projects') {
        result.assetData.push({
            ...mappedData,
            approvedOn : data.approvedOn,
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
