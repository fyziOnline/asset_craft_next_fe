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
const processDashboardAssets = (dashboardAssets: DashboardAsset[]): { updatedDashboardData: DashboardData[], assetsDisplayTable: any[], pendingApproval: any[] } => {
    const dashboardData: DashboardData[] = [
        { projectName: "All Projects", allProjectDate: `as of ${getCurrentDateFormatted()}`, totalAssets: 0, underReview: 0, inProgress: 0 },
        { projectName: "Email", totalAssets: 0, underReview: 0, inProgress: 0 },
        { projectName: "LinkedIn", totalAssets: 0, underReview: 0, inProgress: 0 },
        { projectName: "Landing Page", totalAssets: 0, underReview: 0, inProgress: 0 },
        { projectName: "Call Script", totalAssets: 0, underReview: 0, inProgress: 0 },
    ];

    console.log("dashboardAssets", dashboardAssets);

    // Calculate the totals for all projects
    const totalAssets = dashboardAssets.length;
    const inProgressCount = dashboardAssets.filter(asset => asset.status === "In Progress").length;
    const onReviewCount = dashboardAssets.filter(asset => asset.status === "On review").length;

    const pendingApproval = dashboardAssets.filter(asset => asset.status === "On review")

    console.log("pendingApproval", pendingApproval);
    
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
            const onReviewStatusCount = countAssetsByTypeAndStatus(dashboardAssets, data.projectName, "On review").statusCount;
            return {
                ...data,
                underReview: onReviewStatusCount,
                inProgress: statusCount,
                totalAssets: total,
            };
        }

        return data;
    });

    // Format the dashboard asset data for the display table
    const assetsDisplayTable = dashboardAssets.slice(0, 5).map((data) => ({
        assetTypeIcon: data.assetTypeName,
        assetName: data.assetName,
        campaignName: data.campaignName,
        projectName: data.project,
        createdOn: formatDate(data.createdOn),
        currentStatus: data.status,
    }));

    return { updatedDashboardData, assetsDisplayTable, pendingApproval };
};

export default processDashboardAssets;
