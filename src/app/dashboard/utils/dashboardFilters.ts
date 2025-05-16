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
    approvedOn?: string
    approvedBy?: string
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
    completedAssets: number;
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
const processDashboardAssets = (
    dashboardAssets: DashboardAsset[], 
    assetType?: AssetType | null, 
    clientAssetTypes: ClientAssetTypeProps[] = [],
    showApprovalFields: boolean = true
): { 
    updatedDashboardData: DashboardData[], 
    assetsDisplayTable: AssetData[], 
    pendingApproval: DashboardAsset[], 
    assetData: AssetData[] 
} => {
    // Default to EMAIL if assetType is null or undefined
    // const effectiveAssetType = assetType || AssetType.EMAIL;
    const effectiveAssetType = assetType ?? null;

    
    const dashboardData: DashboardData[] = [
        { projectName: "", allProjectDate: `as of ${getCurrentDateFormatted()}`, totalAssets: 0, underReview: 0, inProgress: 0, completedAssets: 0 },
        { projectName: "", totalAssets: 0, underReview: 0, inProgress: 0, completedAssets: 0 },
        { projectName: "", totalAssets: 0, underReview: 0, inProgress: 0, completedAssets: 0 },
        { projectName: "", totalAssets: 0, underReview: 0, inProgress: 0, completedAssets: 0 },
        { projectName: "", totalAssets: 0, underReview: 0, inProgress: 0, completedAssets: 0 },
    ];

    const sortedDashBoardData = dashboardData?.map((data, index) => ({
        ...data,
        projectName: clientAssetTypes[index]?.assetTypeName === "All in One"
            ? "All Projects"
            : clientAssetTypes[index]?.assetTypeName || ""
    }));

    // Calculate the totals for all projects
    const totalAssets = dashboardAssets.length;


    const inProgressCount = dashboardAssets.filter(asset => asset.status === STATUS.IN_PROGRESS).length;

    const onReviewCount = dashboardAssets.filter(asset => asset.status === STATUS.ON_REVIEW).length;

    const pendingApproval = dashboardAssets.filter(asset => asset.status === STATUS.ON_REVIEW);

    const completedAssetsCount = dashboardAssets.filter(asset => asset.status === STATUS.COMPLETED).length;


    const projectTypes = clientAssetTypes.filter(item => item.assetTypeName !== "All in One")
        .map(item => item.assetTypeName);

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

    const mappedAssets = mapAssetsByType(dashboardAssets, effectiveAssetType, showApprovalFields);
    const assetData = mappedAssets.assetData;
    const assetsDisplayTable = mappedAssets.assetsDisplayTable;
    return { updatedDashboardData, assetsDisplayTable, pendingApproval, assetData };
};

const mapAssetsByType = (assets: DashboardAsset[], type?: AssetType | null , showApprovalFields: boolean = true) => {
    const result = {
        assetData: [] as AssetData[],
        assetsDisplayTable: [] as AssetData[]
    };

    for (let i = 0; i < assets.length; i++) {
        const data = assets[i];
        
        // Base properties that are always included
        const mappedData: Partial<AssetData> = {
            assetName: data.assetName,
            campaignName: data.campaignName,
            assetTypeIcon: data.assetTypeName,
            projectName: data.project,
            createdOn: formatDate(data.createdOn),
            currentStatus: data.status,
            assetID: data.assetID,
        };

        const assetName = data.assetTypeName.toLocaleLowerCase();
        // const isAllProjects = type.toLocaleLowerCase() === 'all projects';
        const isAllProjects = type === null || type === undefined || type.toLowerCase() === 'all projects';


        // Add approval fields only if showApprovalFields is true and not for 'all projects'
        if (showApprovalFields && !isAllProjects) {
            mappedData.approvedOn = data.approvedOn ? formatDate(data.approvedOn) : "";
            mappedData.approvedBy = data.approvedBy || "";
        }

        // Handle the "All Projects" special case
        if (isAllProjects) {
            result.assetData.push(mappedData as AssetData);
            continue;
        }

        // Compare enum value string with asset type name
        if (assetName === type.toLocaleLowerCase()) {
            result.assetData.push(mappedData as AssetData);
        }

        if (result.assetsDisplayTable.length < 5) {
            result.assetsDisplayTable.push(mappedData as AssetData);
        }
    }

    return result;
};

export default processDashboardAssets;
