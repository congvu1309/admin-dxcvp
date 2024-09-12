'use client';

import SchedulesPage from "@/components/Schedule/SchedulesMonthYear";
import { useSearchParams } from "next/navigation";

export default function MonthlySchedulesPage() {
    const searchParams = useSearchParams();
    const monthYear = searchParams.get('monthYear');

    return (
        <>
            <SchedulesPage
                monthYear={monthYear}
            />
        </>
    );
}
