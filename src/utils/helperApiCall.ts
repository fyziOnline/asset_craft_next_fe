export type GetVisualLibraryQuery = {
    category ?: String
    searchTerm ?: String 
    pageNumber ?: Number 
    pageSize ?: Number
}

export const buildQueryString = (params: GetVisualLibraryQuery): string => {
    const queryParams: string[] = []
  
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const value = params[key as keyof GetVisualLibraryQuery];
  
        if (value !== undefined && value !== null && value !== '') {
          queryParams.push(`${key}=${encodeURIComponent(value.toString())}`)
        }
      }
    }
  
    return queryParams.length > 0 ? `${queryParams.join('&')}` : ''
  };