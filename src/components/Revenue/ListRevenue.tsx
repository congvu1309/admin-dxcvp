'use client';

import { getAllScheduleBySearch } from "@/api/schedule";
import { useAuth } from "@/hooks/useAuth";
import { ScheduleModel } from "@/models/schedule";
import { useEffect, useState } from "react";
import defaultImage from '@/public/no-image.jpg';
import Image from 'next/image';
import SearchRevenue from "./SearchRevenue";
import { getStatusColor, getStatusLabel } from "@/utils/statusUtils";

const ListRevenue = () => {

    const [schedules, setSchedules] = useState<ScheduleModel[]>([]);
    const { user, loading } = useAuth();
    const [searchSchedule, setSearchSchedule] = useState('');
    const [searchSelected, setSearchSelected] = useState<string>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
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
    }, [user?.role, currentPage, searchSchedule, searchSelected]);

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    if (!loading && user?.role === 'R1') {

        return (
            <>
                <div className='overflow-x-auto'>
                    <SearchRevenue
                        searchSchedule={searchSchedule}
                        setSearchSchedule={setSearchSchedule}
                        searchSelected={searchSelected}
                        setSearchSelected={setSearchSelected}
                    />
                    <table className='min-w-full bg-white'>
                        <thead className='text-black'>
                            <tr>
                                <th className='w-1/7 text-center'>Người đại diện</th>
                                <th className='w-1/7 text-center'>Số điện thoại</th>
                                <th className='w-1/7 text-center'>Ngày</th>
                                <th className='w-1/7 text-center'>Nhà cung cấp</th>
                                <th className='w-1/7 text-center'>Thành tiền</th>
                                <th className='w-1/7 text-center'>Dịch vụ</th>
                                <th className='w-1/7 text-center'>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.length > 0 ? schedules.map((schedule) => {

                                let imageSrc = defaultImage.src;
                                const imageProductData = schedule.image;

                                if (imageProductData) {
                                    try {
                                        imageSrc = Buffer.from(imageProductData, 'base64').toString('binary');
                                    } catch (error) {
                                        imageSrc = defaultImage.src;
                                    }
                                }

                                const formattedPrice = schedule.pay ?? "0";
                                const pricePerNight = Number(formattedPrice.replace(/[^\d.-]/g, ''));
                                const provisional = pricePerNight * 0.2;
                                const totalAmount = provisional + pricePerNight;
                                const formattedTotalAmount = totalAmount.toLocaleString();

                                return (
                                    <tr
                                        key={schedule.id}
                                        className={`border-b border-gray-200`}
                                    >
                                        <td className='py-4 text-center '>
                                            <Image
                                                src={imageSrc}
                                                alt={schedule.startDate}
                                                width={150}
                                                height={150}
                                                className='rounded-md mr-7 bg-no-repeat bg-center bg-cover'
                                            />
                                        </td>
                                        <td className='py-4 text-center '>{schedule.phoneNumber}</td>
                                        <td className='py-4 text-center '>{schedule.startDate} - {schedule.endDate}</td>
                                        <td className='py-4 text-center '>{schedule.productScheduleData.userProductData.name}</td>
                                        <td className='py-4 text-center '>{formattedTotalAmount} VND</td>
                                        <td className='py-4 text-center w-[270px]'>{schedule.productScheduleData.title}</td>
                                        <td className='py-4 text-center '>
                                            <td className='py-4 text-center '>
                                                <span className="flex items-center justify-center">
                                                    <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(schedule.status)}`}></span>
                                                    {getStatusLabel(schedule.status)}
                                                </span>
                                            </td>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <div className="text-center pt-20 text-xl">Chưa có lịch hẹn nào</div>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
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
            </>
        )
    }
}

export default ListRevenue;