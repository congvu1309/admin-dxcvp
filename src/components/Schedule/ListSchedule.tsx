'use client';

import { getAllProductApi } from "@/api/product";
import { useAuth } from "@/hooks/useAuth";
import { ProductModel } from "@/models/product";
import { ScheduleModel } from "@/models/schedule";
import { useEffect, useState } from "react";
import { getAllScheduleByUserId } from "@/api/schedule";
import { X, Check, CircleAlert } from "lucide-react";
import defaultImage from '@/public/no-image.jpg';
import Image from 'next/image';
import { ROUTE } from "@/constant/enum";
import { useRouter } from "next/navigation";
import AcceptSchedule from "./AcceptSchedule";
import RefuseSchdedule from "./RefuseSchedule";

const ListSchedule = () => {
    const { user, loading } = useAuth();
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [schedules, setSchedules] = useState<ScheduleModel[]>([]);
    const router = useRouter();
    const [openAccept, setOpenAccept] = useState(false);
    const [scheduleIdToAccept, setScheduleIdToAccept] = useState<number | null>(null);
    const [scheduleStatusToAccept, setScheduleStatusToAccept] = useState<string | null>(null);
    const [openRefuse, setOpenRefuse] = useState(false);
    const [scheduleIdToRefuse, setScheduleIdToRefuse] = useState<number | null>(null);
    const [scheduleStatusToRefuse, setScheduleStatusToRefuse] = useState<string | null>(null);

    useEffect(() => {
        if (user?.role === 'R2') {
            const fetchScheduleData = async () => {
                try {
                    const response = await getAllScheduleByUserId();
                    setSchedules(response.data);
                } catch (error) {
                    console.error('Failed to fetch schedule data', error);
                }
            };

            const fetchProductData = async () => {
                try {
                    const response = await getAllProductApi(user.id);
                    setProducts(response.data);
                } catch (error) {
                    console.error('Failed to fetch product data', error);
                }
            };

            fetchScheduleData();
            if (user.id) {
                fetchProductData();
            }
        }
    }, [user?.role]);

    const handleViewInfo = (scheduleId: any) => {
        router.push(`${ROUTE.INFO_SCHEDULE}/${scheduleId}`);
    };

    const handleAccept = (scheduleId: any, status: string) => {
        setOpenAccept(true);
        setScheduleIdToAccept(scheduleId);
        setScheduleStatusToAccept(status);
    };

    const handleRefuse = (scheduleId: number, status: string) => {
        setOpenRefuse(true);
        setScheduleIdToRefuse(scheduleId);
        setScheduleStatusToRefuse(status);
    };

    if (!loading && user?.role === 'R2') {

        const productIds = new Set(products.map(product => String(product.id)));

        const filteredSchedules = schedules.filter(schedule => {
            return productIds.has(String(schedule.productId));
        });

        return (
            <>
                <div className='overflow-x-auto'>
                    <table className='min-w-full bg-white'>
                        <thead className='text-black'>
                            <tr>
                                <th className='w-2/14 text-left'>Người đại diện</th>
                                <th className='w-2/14 text-left'>Số điện thoại</th>
                                <th className='w-2/14 text-left'>Ngày</th>
                                <th className='w-2/14 text-left'>Thành tiền</th>
                                <th className='w-2/14 text-left'>Dịch vụ</th>
                                <th className='w-2/14 text-left'>Trạng thái</th>
                                <th className='w-2/14 text-left'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSchedules.length > 0 ? filteredSchedules.map((schedule) => {

                                let imageSrc = defaultImage.src;
                                const imageProductData = schedule.image;

                                if (imageProductData) {
                                    try {
                                        imageSrc = Buffer.from(imageProductData, 'base64').toString('binary');
                                    } catch (error) {
                                        imageSrc = defaultImage.src;
                                    }
                                }

                                return (
                                    <tr
                                        key={schedule.id}
                                        className={`border-b border-gray-200`}
                                    >
                                        <td className='py-4'>
                                            <Image
                                                src={imageSrc}
                                                alt={schedule.startDate}
                                                width={150}
                                                height={150}
                                                className='rounded-md mr-7 bg-no-repeat bg-center bg-cover'
                                            />
                                        </td>
                                        <td className='py-4'>{schedule.phoneNumber}</td>
                                        <td className='py-4'>{schedule.startDate} - {schedule.endDate}</td>
                                        <td className='py-4'>{schedule.pay}</td>
                                        <td className='py-4'>{schedule.productScheduleData.title}</td>
                                        <td className='py-4'>
                                            <td className='py-4'>
                                                {schedule.status === 'accept'
                                                    ? 'Chuẩn bị phòng'
                                                    : schedule.status === 'refuse'
                                                        ? 'Đã từ chối'
                                                        : schedule.status === 'canceled'
                                                            ? 'Đã hủy'
                                                            : schedule.status === 'completed'
                                                                ? 'Hoàn thành'
                                                                : 'Đang chờ xử lý'
                                                }
                                            </td>
                                        </td>
                                        <td className='py-4'>
                                            <button
                                                className='bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600'
                                                onClick={() => handleViewInfo(schedule.id)}
                                            >
                                                <CircleAlert />
                                            </button>

                                            {schedule.status === 'pending' && (
                                                <>
                                                    <button
                                                        className='bg-green-600 text-white px-2 py-1 mx-5 rounded hover:bg-green-700'
                                                        onClick={() => handleAccept(schedule.id, schedule.status)}
                                                    >
                                                        <Check />
                                                    </button>

                                                    <button
                                                        className='bg-red-300 text-white px-2 py-1 rounded hover:bg-red-500'
                                                        onClick={() => handleRefuse(schedule.id, schedule.status)}
                                                    >
                                                        <X />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <div className="text-center pt-20 text-xl">Chưa có lịch hẹn nào</div>
                            )}
                        </tbody>
                    </table>
                </div>
                <AcceptSchedule
                    openAccept={openAccept}
                    setOpenAccept={setOpenAccept}
                    scheduleIdToAccept={scheduleIdToAccept}
                    scheduleStatusToAccept={scheduleStatusToAccept}
                />
                <RefuseSchdedule
                    openRefuse={openRefuse}
                    setOpenRefuse={setOpenRefuse}
                    scheduleIdToRefuse={scheduleIdToRefuse}
                    scheduleStatusToRefuse={scheduleStatusToRefuse}
                />
            </>
        );
    }

}

export default ListSchedule;
