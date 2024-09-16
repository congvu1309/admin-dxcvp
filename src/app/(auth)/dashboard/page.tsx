'use client';

import { useAuth } from "@/hooks/useAuth";
import AdminStatistical from "@/components/Statistical/AdminStatistical";
import ServinceStatistical from "@/components/Statistical/ServinceStatistical";

export default function DashboardPage() {

    const { user, loading } = useAuth();

    if (!loading && user?.role === 'R2') {
        return (
            <>
                <ServinceStatistical />
            </>
        )
    }

    if (!loading && user?.role === 'R1') {
        return (
            <>
                <AdminStatistical />
            </>
        )
    }
}
