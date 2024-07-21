'use client';

import LoadingPage from '@/app/loading';
import { ROUTE } from '@/constant/enum';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export const ProtectedProvider = ({ children }: Readonly<{ children: ReactNode }>): JSX.Element => {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            const timeout = setTimeout(() => {
                if (!user) {
                    router.push(ROUTE.LOGIN);
                }
            }, 1000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [user, router, loading]);

    if (loading) {
        return <LoadingPage />;
    }

    return user ? <>{children}</> : <></>;
};
