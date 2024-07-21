'use client';

import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30000, // Stale time in milliseconds (30 seconds)
            cacheTime: 60000, // Cache time in milliseconds (1 minute)
            refetchOnWindowFocus: false, // Optional: Disable automatic refetch on window focus
        },
    },
});

/**
 * @param {Object} children - ReactNode representing the child components.
 * @returns {JSX.Element} - JSX element containing the child components.
 **/

export const AppProvider = ({ children }: Readonly<{ children: ReactNode }>): JSX.Element => {

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
