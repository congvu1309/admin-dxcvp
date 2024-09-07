'use client';

import { getAllProductApi } from "@/api/product";
import { useAuth } from "@/hooks/useAuth";
import { ProductModel } from "@/models/product";
import { ScheduleModel } from "@/models/schedule";
import { useEffect, useState } from "react";
import { getAllScheduleBySearch, getAllScheduleByUserId } from "@/api/schedule";
import { Check, CircleAlert, Loader } from "lucide-react";
import defaultImage from '@/public/no-image.jpg';
import Image from 'next/image';
import { ROUTE } from "@/constant/enum";
import { useRouter } from "next/navigation";
import AcceptSchedule from "./AcceptSchedule";
import ArrangeSchdedule from "./ArrangeSchedule";
import SearchSchedule from "./SearchSchedule";

const ListSchedule = () => {
    const { user, loading } = useAuth();
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [schedules, setSchedules] = useState<ScheduleModel[]>([]);
    const router = useRouter();
    const [openAccept, setOpenAccept] = useState(false);
    const [scheduleIdToAccept, setScheduleIdToAccept] = useState<number | null>(null);
    const [scheduleStatusToAccept, setScheduleStatusToAccept] = useState<string | null>(null);
    const [openArrange, setOpenArrange] = useState(false);
    const [scheduleIdToArrange, setScheduleIdToArrange] = useState<number | null>(null);
    const [scheduleStatusToArrange, setScheduleStatusToArrange] = useState<string | null>(null);
    const [searchSchedule, setSearchSchedule] = useState('');
    const [searchSelected, setSearchSelected] = useState<string>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (user?.role === 'R2') {
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
    }, [user?.role, currentPage, searchSchedule, searchSelected]);

    const handleViewInfo = (scheduleId: any) => {
        router.push(`${ROUTE.INFO_SCHEDULE}/${scheduleId}`);
    };

    const handleAccept = (scheduleId: any, status: string) => {
        setOpenAccept(true);
        setScheduleIdToAccept(scheduleId);
        setScheduleStatusToAccept(status);
    };

    const handleArrange = (scheduleId: any, status: string) => {
        setOpenArrange(true);
        setScheduleIdToArrange(scheduleId);
        setScheduleStatusToArrange(status);
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    if (!loading && user?.role === 'R2') {

        const productIds = new Set(products.map(product => String(product.id)));

        const filteredSchedules = schedules.filter(schedule => {
            return productIds.has(String(schedule.productId));
        });

        return (
            <>
                <div className='overflow-x-auto'>
                    <SearchSchedule
                        searchSchedule={searchSchedule}
                        setSearchSchedule={setSearchSchedule}
                        searchSelected={searchSelected}
                        setSearchSelected={setSearchSelected}
                    />
                    {filteredSchedules.length > 0 ? (
                        <table className='min-w-full bg-white'>
                            <thead className='text-black'>
                                <tr>
                                    <th className='w-2/14 text-center'>Người đại diện</th>
                                    <th className='w-2/14 text-center'>Số điện thoại</th>
                                    <th className='w-2/14 text-center'>Ngày</th>
                                    <th className='w-2/14 text-center'>Thành tiền</th>
                                    <th className='w-2/14 text-center'>Dịch vụ</th>
                                    <th className='w-2/14 text-center'>Trạng thái</th>
                                    <th className='w-2/14 text-center'></th>
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
                                            <td className='py-4 text-center'>
                                                {
                                                    schedule.status === 'accept'
                                                        ? 'Chuẩn bị phòng'
                                                        : schedule.status === 'refuse'
                                                            ? 'Đã từ chối'
                                                            : schedule.status === 'canceled'
                                                                ? 'Đã hủy'
                                                                : schedule.status === 'completed'
                                                                    ? 'Hoàn thành'
                                                                    : schedule.status === 'arrange'
                                                                        ? 'Đang chờ sắp xếp'
                                                                        : 'Đang chờ xử lý'
                                                }
                                            </td>
                                            <td className='py-4 text-center'>
                                                <button
                                                    className='bg-primary-foreground text-white px-2 py-1 rounded hover:bg-primary'
                                                    onClick={() => handleViewInfo(schedule.id)}
                                                >
                                                    <CircleAlert />
                                                </button>

                                                {schedule.status === 'pending' && (
                                                    <>
                                                        <button
                                                            className='bg-primary-foreground text-white px-2 py-1 mx-5 rounded hover:bg-primary'
                                                            onClick={() => handleAccept(schedule.id, schedule.status)}
                                                        >
                                                            <Check />
                                                        </button>

                                                        <button
                                                            className='bg-primary-foreground text-white px-2 py-1 rounded hover:bg-primary'
                                                            onClick={() => handleArrange(schedule.id, schedule.status)}
                                                        >
                                                            <Loader />
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center pt-20 text-xl">Chưa có lịch hẹn nào</div>
                    )}
                </div>

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

                <AcceptSchedule
                    openAccept={openAccept}
                    setOpenAccept={setOpenAccept}
                    scheduleIdToAccept={scheduleIdToAccept}
                    scheduleStatusToAccept={scheduleStatusToAccept}
                />
                <ArrangeSchdedule
                    openArrange={openArrange}
                    setOpenArrange={setOpenArrange}
                    scheduleIdToArrange={scheduleIdToArrange}
                    scheduleStatusToArrange={scheduleStatusToArrange}
                />
            </>
        );
    }

}

export default ListSchedule;
