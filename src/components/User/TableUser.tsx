'use client';

import { getAllUserApi } from '@/api/user';
import { ROUTE } from '@/constant/enum';
import { useAuth } from '@/hooks/useAuth';
import { UserModel } from '@/models/user';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SearchUser from './SearchUser';
import { CircleAlert, Ban } from 'lucide-react';
import BanUser from './BanUser';

const TableUser = () => {
    const { user: currentUser, loading } = useAuth();
    const [users, setUsers] = useState<UserModel[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const router = useRouter();
    const [searchUser, setSearchUser] = useState('');
    const [searchSelected, setSearchSelected] = useState<string>('ALL');
    const [open, setOpen] = useState(false);
    const [userIdToBan, setUserIdToBan] = useState<number | null>(null);
    const [userStatusToBan, setUserStatusToBan] = useState<string | null>(null);

    useEffect(() => {

        if (!loading && currentUser?.role !== 'R1') {
            router.push(ROUTE.DASHBOARD + ROUTE.NOT_FOUND);
        }

        if (currentUser?.role === 'R1') {
            const fetchUserData = async (page: number, search: string, selected: string) => {
                try {
                    const response = await getAllUserApi(page, search, selected);
                    setUsers(response.data.users);
                    const totalCount = response.data.totalCount;
                    const totalPagesCount = Math.ceil(totalCount / 20);
                    setTotalPages(totalPagesCount);
                } catch (error) {
                    console.error('Failed to fetch user data', error);
                }
            };

            fetchUserData(currentPage, searchUser, searchSelected);
        }

    }, [currentPage, searchUser, searchSelected, currentUser?.role]);

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const handleViewInfoUser = (userId: any) => {
        router.push(`${ROUTE.INFO_USER}/${userId}`);
    };

    const handleBanUser = (userId: number, status: string) => {
        setOpen(true);
        setUserIdToBan(userId);
        setUserStatusToBan(status);
    };

    if (!loading && currentUser?.role === 'R1') {
        return (
            <>
                <div className='overflow-x-auto'>
                    <SearchUser
                        searchUser={searchUser}
                        setSearchUser={setSearchUser}
                        searchSelected={searchSelected}
                        setSearchSelected={setSearchSelected}
                    />
                    <table className='min-w-full bg-white'>
                        <thead className='text-black'>
                            <tr>
                                <th className='w-4/12 text-left'>Email</th>
                                <th className='w-3/12 text-left'>Tên</th>
                                <th className='w-3/12 text-left'>Vai trò</th>
                                <th className='w-2/12 text-left'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => {
                                if (user.id === currentUser?.id) {
                                    return null;
                                }

                                return (
                                    <tr
                                        key={user.id}
                                        className={`border-b border-gray-200 ${user.status === 'S2' ? 'text-[#b9bdc4]' : ''}`}
                                    >
                                        <td className='py-4'>{user.email}</td>
                                        <td className='py-4'>{user.name}</td>
                                        <td className='py-4'>
                                            {user.role === 'R2' ? 'Người cung cấp dịch vụ' : 'Khách'}
                                        </td>
                                        <td className='py-4 flex justify-end'>
                                            <button
                                                className='bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600'
                                                onClick={() => handleViewInfoUser(user.id)}
                                            >
                                                <CircleAlert />
                                            </button>

                                            <button
                                                className='bg-gray-300 text-white px-2 py-1 ml-5 rounded hover:bg-gray-500'
                                                onClick={() => handleBanUser(user.id, user.status)}
                                            >
                                                <Ban />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
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
                    <BanUser
                        open={open}
                        setOpen={setOpen}
                        userId={userIdToBan}
                        userStatus={userStatusToBan}
                    />
                </div>
            </>
        );
    }

    return null;
};

export default TableUser;
