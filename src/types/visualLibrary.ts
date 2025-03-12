
export interface Version {
    colorSpace: string;
    fileID: number;
    fileSizeKB: number;
    fileURL: string;
    frameRate: string | null;
    height: number;
    isVector: boolean;
    orientation: string;
    resolutionDPI: number;
    transparent: boolean;
    versionID: string;
    versionLabel: string;
    videoDuration: string | null;
    visualID: string;
    width: number;
  }
  
  export interface MediaItem {
    assetType: string;
    category: string | null;
    clientID: string;
    description: string | null;
    fileID: number;
    fileURL: string;
    tags: string | null;
    title: string;
    versions: Version[];
    visualID: string;
  }

  export type Dimension =  {
      width: number;
      height: number;
  }
  export type AspectRatioObject = {
    w_part:number
    h_part:number 
  }
  export type GetVisualLibraryQuery = {
    category ?: string
    searchTerm ?: string 
    pageNumber ?: number 
    pageSize ?: number
  }


export type MediaType = 'image' | 'video';
export type Orientation = 'all' | 'portrait' | 'landscape' | 'square';


  