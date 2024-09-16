'use client';

import { getAllProductApi } from "@/api/product";
import { useAuth } from "@/hooks/useAuth";
import { ProductModel } from "@/models/product";
import { ScheduleModel } from "@/models/schedule";
import { useEffect, useState } from "react";
import { getAllScheduleBySearch } from "@/api/schedule";
import { Check, CircleAlert, X } from "lucide-react";
import defaultImage from '@/public/no-image.jpg';
import Image from 'next/image';
import { ROUTE } from "@/constant/enum";
import { useRouter } from "next/navigation";
import AcceptSchedule from "./AcceptSchedule";
import SearchSchedule from "./SearchSchedule";
import RefuseSchdedule from "./RefuseSchedule";

const isCancellationDuringStay = (startDate: string, endDate: string) => {
    const currentDate = new Date();
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    return currentDate > parsedStartDate && currentDate < parsedEndDate;
};

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

    const handleRefuse = (scheduleId: number, status: string) => {
        setOpenRefuse(true);
        setScheduleIdToRefuse(scheduleId);
        setScheduleStatusToRefuse(status);
    };

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
                return 'Khách đã nhận phòng';
            default:
                return 'Đang chờ xử lý';
        }
    };

    if (!loading && user?.role === 'R2') {

        const productIds = new Set(products.map(product => String(product.id)));

        const filteredSchedules = schedules.filter(schedule => {
            return productIds.has(String(schedule.productId));
        });

        const getTotalAmount = (schedule: ScheduleModel) => {
            const formattedPrice = schedule.productScheduleData.price ?? "0";
            const formattedPay = schedule.pay ?? "0";
            const pricePerNight = Number(formattedPrice.replace(/[^\d.-]/g, '')) || 0;
            const priceTotal = Number(formattedPay.replace(/[^\d.-]/g, '')) || 0;
            const provisional = pricePerNight * (schedule.numberOfDays || 1);
            const serviceCharge = provisional * 0.2;
            let totalAmount = priceTotal - serviceCharge;

            if (schedule.status === 'canceled' && isCancellationDuringStay(schedule.startDate, schedule.endDate)) {
                totalAmount *= 0.5;
            }

            return totalAmount.toLocaleString();
        };

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
                                            <td className='py-4 text-center'>{getTotalAmount(schedule)}</td>
                                            <td className='py-4 text-center w-[270px]'>{schedule.productScheduleData.title}</td>
                                            <td className='py-4 text-center'>
                                                <span className="flex items-center justify-center">
                                                    <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(schedule.status)}`}></span>
                                                    {getStatusLabel(schedule.status)}
                                                </span>
                                            </td>
                                            <td className='py-4 text-center'>
                                                <button
                                                    className='bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600'
                                                    onClick={() => handleViewInfo(schedule.id)}
                                                >
                                                    <CircleAlert />
                                                </button>

                                                {schedule.status === 'pending' && (
                                                    <>
                                                        <button
                                                            className='bg-green-500 text-white px-2 py-1 mx-2 rounded hover:bg-green-600'
                                                            onClick={() => handleAccept(schedule.id, schedule.status)}
                                                        >
                                                            <Check />
                                                        </button>

                                                        <button
                                                            className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
                                                            onClick={() => handleRefuse(schedule?.id, schedule?.status)}
                                                        >
                                                            <X />
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
