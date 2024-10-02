'use client';

import { useEffect, useState } from 'react';
import { getAllScheduleBySearch, getAllScheduleByUserId } from "@/api/schedule";
import { ScheduleModel } from "@/models/schedule";
import { format, parse } from 'date-fns';
import { ProductModel } from '@/models/product';
import { useAuth } from '@/hooks/useAuth';
import { getAllProductApi } from '@/api/product';
import { ROUTE } from '@/constant/enum';
import { ArrowLeft, CircleAlert } from 'lucide-react';
import Link from 'next/link';
import defaultImage from '@/public/no-image.jpg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import getTotalAmount from '@/utils/getTotalAmount';
import { getStatusColor, getStatusLabel } from '@/utils/statusUtils';
import isCancellationBeforeStart from '@/utils/isBeforeStartDate';

interface SchedulesMonthYearProps {
    monthYear: string | null;
}

const SchedulesMonthYear: React.FC<SchedulesMonthYearProps> = ({ monthYear }) => {

    const { user, loading } = useAuth();
    const [schedules, setSchedules] = useState<ScheduleModel[]>([]);
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [searchSelected, setSearchSelected] = useState<string>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchSchedule, setSearchSchedule] = useState('');
    const router = useRouter();

    useEffect(() => {

        if (user?.role === 'R2') {
            const fetchSchedules = async () => {
                try {
                    const response = await getAllScheduleByUserId();
                    setSchedules(response.data);
                } catch (error) {
                    console.error('Failed to fetch schedule data', error);
                }
            };

            if (monthYear) {
                fetchSchedules();
            }

            const fetchProductData = async () => {
                try {
                    const response = await getAllProductApi(user.id);
                    setProducts(response.data);
                } catch (error) {
                    console.error('Failed to fetch product data', error);
                }
            };

            if (user.id) {
                fetchProductData();
            }
        }

        if (user?.role === 'R1') {
            const fetchScheduleData = async (page: number, search: string, selected: string) => {
                try {
                    const response = await getAllScheduleBySearch(page, search, selected);
                    setSchedules(response.data.schedule);
                    const totalCount = response.data.totalCount;
                    const totalPagesCount = Math.ceil(totalCount / 20);
                    setTotalPages(totalPagesCount);
                } catch (error) {
                    console.error('Failed to fetch schedule data', error);
                }
            };

            fetchScheduleData(currentPage, searchSchedule, searchSelected);
        }
    }, [monthYear, user?.role, user?.id]);

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    if (!loading && user?.role === 'R2') {

        const productIds = new Set(products.map(product => String(product.id)));

        // Filter schedules based on product IDs and monthYear
        const filteredSchedules = schedules.filter(schedule => {
            const scheduleMonthYear = format(parse(schedule.startDate, 'dd/MM/yyyy', new Date()), 'MM-yyyy');
            return productIds.has(String(schedule.productId)) && scheduleMonthYear === monthYear && schedule.status === 'completed' || schedule.status === 'canceled' || schedule.status === 'refunded';
        });

        return (
            <div>
                <div className='flex items-center pb-5'>
                    <Link href={ROUTE.DASHBOARD} className='p-1.5'>
                        <ArrowLeft className='h-8 w-8' />
                    </Link>
                    <div className='flex flex-1 justify-center pr-12'>
                        <span className='text-2xl font-semibold'>Lịch hẹn trong tháng {monthYear}</span>
                    </div>
                </div>
                {filteredSchedules.length > 0 ? (
                    <table className='min-w-full bg-white'>
                        <thead className='text-black'>
                            <tr>
                                <th className='w-1/6 text-center'>Người đại diện</th>
                                <th className='w-1/6 text-center'>Số điện thoại</th>
                                <th className='w-1/6 text-center'>Ngày</th>
                                <th className='w-1/6 text-center'>Thành tiền</th>
                                <th className='w-1/6 text-center'>Dịch vụ</th>
                                <th className='w-1/6 text-center'>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSchedules.map((schedule) => {
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
                                        <td className='py-4 flex justify-center'>
                                            <Image
                                                src={imageSrc}
                                                alt={schedule.startDate}
                                                width={150}
                                                height={150}
                                                className='rounded-md mr-7 bg-no-repeat bg-center bg-cover'
                                            />
                                        </td>
                                        <td className='py-4 text-center'>{schedule.phoneNumber}</td>
                                        <td className='py-4 text-center'>{schedule.startDate} - {schedule.endDate}</td>
                                        <td className='py-4 text-center'>{getTotalAmount(schedule)}</td>
                                        <td className='py-4 text-center w-[270px]'>{schedule.productScheduleData.title}</td>
                                        <td className='py-4 text-center'>
                                            <span className="flex items-center justify-center">
                                                <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(schedule.status)}`}></span>
                                                {getStatusLabel(schedule.status)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <p>Không tìm thấy lịch trình nào cho tháng này.</p>
                )}
            </div>
        );
    }

    if (!loading && user?.role === 'R1') {

        const filteredSchedules = schedules.filter(schedule =>
            schedule.status === 'completed' || schedule.status === 'canceled' || schedule.status === 'refunded'
        );

        const totalPay = (schedule: ScheduleModel): number => {
            const formattedPay = schedule.pay ?? "0";
            const priceTotal = Number(formattedPay.replace(/[^\d.-]/g, '')) || 0;
            const cancellationDate = new Date();
            const isBeforeStart = isCancellationBeforeStart(schedule.startDate, cancellationDate);
            let totalAmount = priceTotal;

            if (schedule.status === 'completed') {
                totalAmount = 0;
            } else if (schedule.status === 'canceled' || schedule.status === 'refunded') {
                if (isBeforeStart) {
                    totalAmount = priceTotal;
                } else {
                    totalAmount *= 0.5;
                }
            }

            return totalAmount;
        };

        const handleViewInfo = (scheduleId: any) => {
            router.push(`${ROUTE.INFO_SCHEDULE}/${scheduleId}`);
        };

        return (
            <div>
                <div className='flex items-center pb-5'>
                    <Link href={ROUTE.DASHBOARD} className='p-1.5'>
                        <ArrowLeft className='h-8 w-8' />
                    </Link>
                    <div className='flex flex-1 justify-center pr-12'>
                        <span className='text-2xl font-semibold'>Lịch hẹn trong tháng {monthYear}</span>
                    </div>
                </div>
                {filteredSchedules.length > 0 ? (
                    <table className='min-w-full bg-white'>
                        <thead className='text-black'>
                            <tr>
                                <th className='w-1/8 text-center'>Người đại diện</th>
                                <th className='w-1/8 text-center'>Số điện thoại</th>
                                <th className='w-1/8 text-center'>Ngày</th>
                                <th className='w-1/8 text-center'>Nhà cung cấp</th>
                                <th className='w-1/8 text-center'>Thành tiền</th>
                                <th className='w-1/8 text-center'>Hoàn tiền</th>
                                <th className='w-1/8 text-center'>Dịch vụ</th>
                                <th className='w-1/8 text-center'>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSchedules.map((schedule) => {
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
                                        <td className='py-4 flex justify-center'>
                                            <Image
                                                src={imageSrc}
                                                alt={schedule.startDate}
                                                width={150}
                                                height={150}
                                                className='rounded-md mr-7 bg-no-repeat bg-center bg-cover'
                                            />
                                        </td>
                                        <td className='py-4  text-center'>{schedule.phoneNumber}</td>
                                        <td className='py-4  text-center'>{schedule.startDate} - {schedule.endDate}</td>
                                        <td className='py-4  text-center'>{schedule.productScheduleData.userProductData.name}</td>
                                        <td className='py-4 text-center'>{schedule.pay} VND</td>
                                        <td className='py-4 text-center'>{totalPay(schedule).toLocaleString()} VND</td>
                                        <td className='py-4  text-center'>{schedule.productScheduleData.title}</td>
                                        <td className='py-4 text-center'>
                                            <span className="flex items-center justify-center">
                                                <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(schedule.status)}`}></span>
                                                {getStatusLabel(schedule.status)}
                                                {schedule.status === 'canceled' && (
                                                    <button
                                                        className='bg-blue-500 text-white ml-2 px-2 py-1 rounded hover:bg-blue-600'
                                                        onClick={() => handleViewInfo(schedule.id)}
                                                    >
                                                        <CircleAlert />
                                                    </button>
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <p>Không tìm thấy lịch trình nào cho tháng này.</p>
                )}
                <div className='flex justify-end mt-4'>
                    <nav className='block'>
                        <ul className='flex pl-0 rounded list-none flex-wrap'>
                            {Array.from(Array(totalPages > 0 ? totalPages : 1).keys()).map((index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => goToPage(index + 1)}
                                        className={`px-3 py-1 mx-1 rounded focus:outline-none ${currentPage === index + 1
                                            ? 'bg-primary text-white'
                                            : 'hover:bg-gray-200'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }
}

export default SchedulesMonthYear;
