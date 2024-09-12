'use client';

import { useEffect, useState } from 'react';
import { getAllScheduleBySearch, getAllScheduleByUserId } from "@/api/schedule";
import { ScheduleModel } from "@/models/schedule";
import { format, parse } from 'date-fns';
import { ProductModel } from '@/models/product';
import { useAuth } from '@/hooks/useAuth';
import { getAllProductApi } from '@/api/product';
import { ROUTE } from '@/constant/enum';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import defaultImage from '@/public/no-image.jpg';
import Image from 'next/image';

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
            return productIds.has(String(schedule.productId)) && scheduleMonthYear === monthYear && schedule.status === 'completed';
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
                                <th className='w-1/5 text-center'>Người đại diện</th>
                                <th className='w-1/5 text-center'>Số điện thoại</th>
                                <th className='w-1/5 text-center'>Ngày</th>
                                <th className='w-1/5 text-center'>Thành tiền</th>
                                <th className='w-1/5 text-center'>Dịch vụ</th>
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
                                        <td className='py-4 text-center'>{schedule.pay}</td>
                                        <td className='py-4 text-center w-[270px]'>{schedule.productScheduleData.title}</td>

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

        const filteredSchedules = schedules.filter(schedule => schedule.status === 'completed');

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
                                <th className='w-1/6 text-center'>Nhà cung cấp</th>
                                <th className='w-1/6 text-center'>Thành tiền</th>
                                <th className='w-1/6 text-center'>Dịch vụ</th>
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
                                        <td className='py-4  text-center'>{schedule.pay}</td>
                                        <td className='py-4  text-center'>{schedule.productScheduleData.title}</td>
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
