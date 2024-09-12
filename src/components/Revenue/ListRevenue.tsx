'use client';

import { getAllScheduleBySearch } from "@/api/schedule";
import { useAuth } from "@/hooks/useAuth";
import { ScheduleModel } from "@/models/schedule";
import { useEffect, useState } from "react";
import defaultImage from '@/public/no-image.jpg';
import Image from 'next/image';
import SearchRevenue from "./SearchRevenue";

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


    const getStatusColor = (status: any) => {
        switch (status) {
            case 'accept':
                return 'bg-green-500';
            case 'refuse':
                return 'bg-red-500';
            case 'canceled':
                return 'bg-yellow-500';
            case 'completed':
                return 'bg-blue-500';
            case 'in-use':
                return 'bg-purple-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusLabel = (status: any) => {
        switch (status) {
            case 'accept':
                return 'Chuẩn bị phòng';
            case 'refuse':
                return 'Đã từ chối';
            case 'canceled':
                return 'Đã hủy';
            case 'completed':
                return 'Hoàn thành';
            case 'in-use':
                return 'Khách đã nhận phòng'; // New label for "in-use" status
            default:
                return 'Đang chờ xử lý';
        }
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
                                <th className='w-2/12 text-left'>Người đại diện</th>
                                <th className='w-1/12 text-left'>Số điện thoại</th>
                                <th className='w-2/12 text-center'>Ngày</th>
                                <th className='w-1/12 text-left'>Nhà cung cấp</th>
                                <th className='w-2/12 text-left'>Thành tiền</th>
                                <th className='w-2/12 text-left'>Dịch vụ</th>
                                <th className='w-2/12 text-left'>Trạng thái</th>
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
                                        <td className='py-4'>{schedule.productScheduleData.userProductData.name}</td>
                                        <td className='py-4'>{formattedTotalAmount}</td>
                                        <td className='py-4'>{schedule.productScheduleData.title}</td>
                                        <td className='py-4'>
                                            <td className='py-4'>
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