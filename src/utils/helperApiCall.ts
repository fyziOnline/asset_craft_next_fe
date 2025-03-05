export const buildQueryString = <T extends Record<string, string|number>>(params: T): string => {
    const queryParams: string[] = []
  
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const value = params[key];
  
        if (value !== undefined && value !== null && value !== '') {
          queryParams.push(`${key}=${encodeURIComponent(value.toString())}`)
        }
      }
    }
  
    return queryParams.length > 0 ? `${queryParams.join('&')}` : ''
  };