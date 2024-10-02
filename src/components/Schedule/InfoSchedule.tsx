'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Image, X } from 'lucide-react';
import { ROUTE } from '@/constant/enum';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { getAllScheduleById } from '@/api/schedule';
import { ScheduleModel } from '@/models/schedule';
import AcceptSchedule from './AcceptSchedule';
import RefuseSchedule from './RefuseSchedule';
import getTotalAmount from '@/utils/getTotalAmount';
import RefundedSchedule from './RefundedSchedule';
import { parseISO, isBefore, isAfter } from 'date-fns';
import isCancellationBeforeStart from '@/utils/isBeforeStartDate';

const InfoSchedule = () => {
    const params = useParams();
    const id = parseInt(params.id as string, 10);
    const { user, loading } = useAuth();
    const [schedule, setSchedule] = useState<ScheduleModel | null>(null);
    const [openAccept, setOpenAccept] = useState(false);
    const [scheduleIdToAccept, setScheduleIdToAccept] = useState<number | null>(null);
    const [scheduleStatusToAccept, setScheduleStatusToAccept] = useState<string | null>(null);
    const [openRefuse, setOpenRefuse] = useState(false);
    const [scheduleIdToRefuse, setScheduleIdToRefuse] = useState<number | null>(null);
    const [scheduleStatusToRefuse, setScheduleStatusToRefuse] = useState<string | null>(null);
    const [openRefunded, setOpenRefunded] = useState(false);
    const [scheduleIdToRefunded, setScheduleIdToRefunded] = useState<number | null>(null);
    const [scheduleStatusToRefunded, setScheduleStatusToRefunded] = useState<string | null>(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await getAllScheduleById(id);
                setSchedule(response.data);
            } catch (error) {
                console.error('Failed to fetch user data', error);
                toast.error('Failed to fetch user data');
            }
        };
        fetchSchedule();
    }, []);

    const handleAccept = (scheduleId: number, status: string) => {
        setOpenAccept(true);
        setScheduleIdToAccept(scheduleId);
        setScheduleStatusToAccept(status);
    };

    const handleRefuse = (scheduleId: number, status: string) => {
        setOpenRefuse(true);
        setScheduleIdToRefuse(scheduleId);
        setScheduleStatusToRefuse(status);
    };

    const handleRefunded = (scheduleId: number, status: string) => {
        setOpenRefunded(true);
        setScheduleIdToRefunded(scheduleId);
        setScheduleStatusToRefunded(status);
    };

    if (!loading && user?.role === 'R2' && schedule) {
        const imageBase64 = schedule?.image ? Buffer.from(schedule.image, 'base64').toString('binary') : '';

        return (
            <>
                <div className='flex items-center pb-5'>
                    <Link href={ROUTE.SCHEDULE} className='p-1.5'>
                        <ArrowLeft className='h-8 w-8' />
                    </Link>
                    <div className='flex flex-1 justify-center pr-12'>
                        <span className='text-2xl font-semibold'>Thông tin lịch hẹn</span>
                    </div>
                </div>
                <div className='flex flex-col items-center'>
                    <div className='h-52 w-52 ring-1 ring-inset ring-gray-300 rounded-full flex items-center justify-center text-2xl font-semibold bg-slate-100 relative'>
                        {imageBase64 ? (
                            <img src={imageBase64} alt='Avatar' className='h-full w-full rounded-full' />
                        ) : (
                            <Image className='w-10 h-10' />
                        )}
                    </div>
                    <div className='text-lg font-medium py-1 pt-3'>Số điện thoại: {schedule.phoneNumber} </div>
                    <div className='text-lg font-medium py-1'>
                        Lịch đặt: {schedule.startDate} - {schedule.endDate}
                    </div>
                    <div className='text-lg font-medium py-1'>Số đêm: {schedule.numberOfDays}</div>
                    <div className='text-lg font-medium py-1'>Số khách: {schedule.guestCount}</div>
                    <div className='text-lg font-medium py-1'>Dịch vụ: {schedule.productScheduleData?.title ?? 'N/A'}</div>
                    <div className='text-lg font-medium py-1'>
                        Địa chỉ: {schedule.productScheduleData?.districts ?? 'N/A'} - {schedule.productScheduleData?.provinces ?? 'N/A'}
                    </div>
                    <div className='text-lg font-medium py-1'>Thành tiền: {getTotalAmount(schedule)}</div>
                    <div className='flex pt-14'>
                        {(schedule.status === 'pending' || schedule.status === 'accept' || schedule.status === 'in-use') && (
                            <>
                                <button
                                    className='bg-green-600 text-white px-2 py-1 mx-5 rounded hover:bg-green-700'
                                    onClick={() => handleAccept(schedule.id, schedule.status)}
                                >
                                    <Check />
                                </button>
                                {schedule.status !== 'in-use' && (
                                    <button
                                        className='bg-red-300 text-white px-2 py-1 rounded hover:bg-red-500'
                                        onClick={() => handleRefuse(schedule.id, schedule.status)}
                                    >
                                        <X />
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <AcceptSchedule
                    openAccept={openAccept}
                    setOpenAccept={setOpenAccept}
                    scheduleIdToAccept={scheduleIdToAccept}
                    scheduleStatusToAccept={scheduleStatusToAccept}
                />
                <RefuseSchedule
                    openRefuse={openRefuse}
                    setOpenRefuse={setOpenRefuse}
                    scheduleIdToRefuse={scheduleIdToRefuse}
                    scheduleStatusToRefuse={scheduleStatusToRefuse}
                />
            </>
        );
    }

    if (!loading && user?.role === 'R1' && schedule) {
        const imageBase64 = schedule?.image ? Buffer.from(schedule.image, 'base64').toString('binary') : '';

        const totalPay = (schedule: ScheduleModel) => {
            const formattedPay = schedule.pay ?? "0";
            const priceTotal = Number(formattedPay.replace(/[^\d.-]/g, '')) || 0;
            const cancellationDate = new Date();
            const isBeforeStart = isCancellationBeforeStart(schedule.startDate, cancellationDate);
            let totalAmount = priceTotal;

            if (schedule.status === 'canceled' || schedule.status === 'refunded') {
                if (isBeforeStart) {
                    totalAmount = priceTotal;
                } else {
                    totalAmount *= 0.5;
                }
            }

            return totalAmount;
        };

        return (
            <>
                <div className='flex items-center pb-5'>
                    <Link href={ROUTE.MONTHLY_SCHEDULE} className='p-1.5'>
                        <ArrowLeft className='h-8 w-8' />
                    </Link>
                    <div className='flex flex-1 justify-center pr-12'>
                        <span className='text-2xl font-semibold'>Thông tin lịch hẹn</span>
                    </div>
                </div>
                <div className='flex flex-col items-center'>
                    <div className='h-52 w-52 ring-1 ring-inset ring-gray-300 rounded-full flex items-center justify-center text-2xl font-semibold bg-slate-100 relative'>
                        {imageBase64 ? (
                            <img src={imageBase64} alt='Avatar' className='h-full w-full rounded-full' />
                        ) : (
                            <Image className='w-10 h-10' />
                        )}
                    </div>
                    <div className='text-lg font-medium py-1 pt-3'>Số điện thoại: {schedule.phoneNumber} </div>
                    <div className='text-lg font-medium py-1'>
                        Lịch đặt: {schedule.startDate} - {schedule.endDate}
                    </div>
                    <div className='text-lg font-medium py-1'>Số đêm: {schedule.numberOfDays}</div>
                    <div className='text-lg font-medium py-1'>Số khách: {schedule.guestCount}</div>
                    <div className='text-lg font-medium py-1'>Dịch vụ: {schedule.productScheduleData?.title ?? 'N/A'}</div>
                    <div className='text-lg font-medium py-1'>
                        Địa chỉ: {schedule.productScheduleData?.districts ?? 'N/A'} - {schedule.productScheduleData?.provinces ?? 'N/A'}
                    </div>
                    <div className='text-lg font-medium py-1'>Số tiền cần hoàn: {totalPay(schedule).toLocaleString()} VND</div>
                    <div className='flex pt-14'>
                        {schedule.status === 'canceled' && (
                            <button
                                className='bg-green-600 text-white px-2 py-1 mx-5 rounded hover:bg-green-700'
                                onClick={() => handleRefunded(schedule.id, schedule.status)}
                            >
                                <Check />
                            </button>
                        )}
                    </div>
                </div>
                <RefundedSchedule
                    openRefunded={openRefunded}
                    setOpenRefunded={setOpenRefunded}
                    scheduleIdToRefunded={scheduleIdToRefunded}
                    scheduleStatusToRefunded={scheduleStatusToRefunded}
                />
            </>
        );
    }

    return null;
};

export default InfoSchedule;
