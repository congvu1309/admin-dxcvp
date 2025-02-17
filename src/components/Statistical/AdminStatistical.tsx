'use client';

import { getAllScheduleByUserId } from "@/api/schedule";
import { ROUTE } from "@/constant/enum";
import { useAuth } from "@/hooks/useAuth";
import { ScheduleModel } from "@/models/schedule";
import { format, parse } from "date-fns";
import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import 'chart.js/auto';
import isCancellationBeforeStart from "@/utils/isBeforeStartDate";

const AdminStatistical = () => {
    const { user, loading } = useAuth();
    const [schedules, setSchedules] = useState<ScheduleModel[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchScheduleData = async () => {
            try {
                const response = await getAllScheduleByUserId();
                setSchedules(response.data);
            } catch (error) {
                console.error('Failed to fetch schedule data', error);
            }
        };

        fetchScheduleData();
    }, [user?.role]);

    const handleViewInfo = (monthYear: string) => {
        router.push(`${ROUTE.MONTHLY_SCHEDULE}?monthYear=${monthYear}`);
    }

    if (!loading && user?.role === 'R1') {

        const filteredSchedules = schedules.filter(schedule =>
            schedule.status === 'completed' || schedule.status === 'canceled' || schedule.status === 'refunded'
        );

        const monthlyStats = filteredSchedules.reduce((acc, schedule) => {
            const monthYear = format(parse(schedule.startDate, 'dd/MM/yyyy', new Date()), 'MM-yyyy');
            const formattedPay = typeof schedule.pay === 'string' ? schedule.pay : String(schedule.pay || '0');
            const cleanPay = Number(formattedPay.replace(/[^\d.-]/g, ''));

            if (!acc[monthYear]) {
                acc[monthYear] = { totalPay: 0, appointments: 0, canceledAppointments: 0 };
            }

            const cancellationDate = new Date();
            const isBeforeStart = isCancellationBeforeStart(schedule.startDate, cancellationDate);

            if (schedule.status === 'completed') {
                acc[monthYear].totalPay += cleanPay;
                acc[monthYear].appointments += 1;
            }
            else if (schedule.status === 'canceled' || schedule.status === 'refunded') {
                if (isBeforeStart) {
                    acc[monthYear].totalPay += 0;
                } else {
                    acc[monthYear].totalPay += cleanPay * 0.5;
                }
                acc[monthYear].canceledAppointments += 1;
            }

            return acc;
        }, {} as Record<string, { totalPay: number, appointments: number, canceledAppointments: number }>);

        const chartData = {
            labels: Object.keys(monthlyStats),
            datasets: [
                {
                    label: 'Tổng tiền theo tháng',
                    data: Object.values(monthlyStats).map(stats => stats.totalPay),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        };

        const chartOptions = {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        };

        return (
            <>
                <div className="w-4/5 mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
                    <Bar data={chartData} options={chartOptions} />
                </div>

                <table className="w-full mt-8 table-auto text-left bg-white shadow-lg rounded-lg">
                    <thead className="bg-teal-600 text-white">
                        <tr>
                            <th className="py-3 px-6 text-center">Tháng</th>
                            <th className="py-3 px-6 text-center">Số lịch hẹn thành công</th>
                            <th className="py-3 px-6 text-center">Số lịch hẹn đã hủy</th>
                            <th className="py-3 px-6 text-center">Tổng tiền</th>
                            <th className="py-3 px-6 text-center">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(monthlyStats).map(([monthYear, stats], idx) => (
                            <tr key={monthYear} className={`border-b ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                <td className="py-3 px-6 text-center">{monthYear}</td>
                                <td className="py-3 px-6 text-center">{stats.appointments}</td>
                                <td className="py-3 px-6 text-center">{stats.canceledAppointments}</td>
                                <td className="py-3 px-6 text-center">{stats.totalPay.toLocaleString()} VND</td>
                                <td className="py-3 px-6 text-center">
                                    <button
                                        className='bg-teal-600 text-white px-2 py-1 rounded hover:bg-teal-500'
                                        onClick={() => handleViewInfo(monthYear)}
                                    >
                                        <CircleAlert />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        );
    }
}

export default AdminStatistical;