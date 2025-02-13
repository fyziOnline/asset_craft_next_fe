import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

interface Cache {
    [key: string]: CacheEntry<unknown>;
}

const cache: Cache = {};
const CACHE_DURATION = 0.5 * 60 * 1000; // half minute

export const useApiCache = <T>(
    key: string,
    fetchFn: () => Promise<T>,
    dependencies: unknown[] = []
) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const mountedRef = useRef(false);

    const fetchData = useCallback(async (force: boolean = false) => {
        const cached = cache[key] as CacheEntry<T> | undefined;
        const now = Date.now();

        if (!force && cached && now - cached.timestamp < CACHE_DURATION) {
            console.log('Cache hit for', key);
            setData(cached.data);
            return;
        }

        // Don't fetch if we're already loading
        if (isLoading) return;

        setIsLoading(true);
        try {
            const result = await fetchFn();
            // Check if component is still mounted
            if (mountedRef.current) {
                cache[key] = { data: result, timestamp: now };
                setData(result);
                setError(null);
            }
        } catch (err) {
            if (mountedRef.current) {
                setError(err instanceof Error ? err : new Error('An error occurred'));
            }
        } finally {
            if (mountedRef.current) {
                setIsLoading(false);
            }
        }
    }, [key, fetchFn, isLoading]);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        fetchData();
    }, [...dependencies, fetchData]);

    return { 
        data, 
        isLoading, 
        error, 
        refetch: () => fetchData(true) 
    };
}; 