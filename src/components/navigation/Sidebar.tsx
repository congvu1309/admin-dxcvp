'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Logo from '@/public/favicon.ico';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ROUTE, UserRoleEnum } from '@/constant/enum';
import { useAuth } from '@/hooks/useAuth';
import { NavLinkProps, ROUTES_ADMIN, ROUTES_MANAGER, ROUTES } from '@/constant/routes';
import { NavLink, NavLinkAction, NavLinkCollapse } from './nav-link';
import { Bell } from 'lucide-react';
import { ProductModel } from '@/models/product';
import { ScheduleModel } from '@/models/schedule';
import { getAllScheduleByUserId } from '@/api/schedule';
import { getAllProductApi } from '@/api/product';
import { useRouter } from 'next/navigation';

const RenderRoutes = ({ routes }: { routes: NavLinkProps[] }) => {
    return routes.map((route) => {
        const { href, childrenNav, action, dialogComponent, ...rest } = route;

        if (href) {
            return <NavLink key={route.title} href={href} {...rest} />;
        }

        if (childrenNav) {
            return <NavLinkCollapse key={route.title} childrenNav={childrenNav} {...rest} />;
        }

        if (action || dialogComponent) {
            return (
                <NavLinkAction
                    key={route.title}
                    action={action}
                    dialogComponent={dialogComponent}
                    {...rest}
                />
            );
        }

        return null;
    });
};

const Sidebar = ({ children }: Readonly<{ children: ReactNode }>) => {
    const { user, logout } = useAuth();
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [schedules, setSchedules] = useState<ScheduleModel[]>([]);
    const [notifications, setNotifications] = useState<ScheduleModel[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [newNotifications, setNewNotifications] = useState<Set<number>>(new Set());
    const router = useRouter();

    let imageBase64 = '';
    if (user?.avatar) {
        imageBase64 = Buffer.from(user.avatar, 'base64').toString('binary');
    }

    const routesForRole = useMemo(() => {
        switch (user?.role) {
            case UserRoleEnum.ADMIN:
                return ROUTES_ADMIN;
            case UserRoleEnum.MANAGER:
                return ROUTES_MANAGER;
            default:
                return ROUTES;
        }
    }, [user]);

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

        if (user?.role === 'R2') {
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

        const intervalId = setInterval(fetchScheduleData, 20000);

        return () => clearInterval(intervalId);
    }, [user?.role, user?.id]);

    const productIds = new Set(products.map(product => String(product.id)));

    useEffect(() => {
        const checkNewSchedules = () => {
            if (!schedules.length || !productIds.size) {
                return;
            }

            const filteredSchedules = schedules.filter(schedule =>
                productIds.has(String(schedule.productId)) && schedule.status === 'pending'
            ).reverse();

            const newNotifications = filteredSchedules.filter(schedule =>
                !notifications.some(notification => notification.id === schedule.id)
            );

            if (newNotifications.length > 0) {
                setNotifications(prev => [...prev, ...newNotifications]);
                setNewNotifications(prev => new Set([...prev, ...newNotifications.map(n => n.id)]));
            }
        };

        checkNewSchedules();

        const intervalId = setInterval(checkNewSchedules, 20000);
        return () => clearInterval(intervalId);
    }, [schedules, productIds, notifications]);

    const handleViewInfo = (scheduleId: number) => {
        router.push(`${ROUTE.INFO_SCHEDULE}/${scheduleId}`);
        setShowNotifications(false);
        setNewNotifications(prev => new Set([...prev].filter(id => id !== scheduleId)));
    };

    return (
        <>
            <nav className='fixed top-0 z-50 w-full border-b border-gray-200'>
                <div className='px-3 py-3 lg:px[22px] flex items-center bg-white'>
                    <div className='flex lg:flex-1'>
                        <Link href={ROUTE.DASHBOARD} className='p-1.5 flex items-center'>
                            <img alt='Logo' src={Logo.src} className='h-16 w-auto' />
                            <span className='text-3xl text-primary'>dxcvp</span>
                        </Link>
                    </div>
                    <div className='hidden lg:flex lg:flex-1 lg:justify-end items-center'>
                        <div className="pr-5 cursor-pointer relative">
                            <button onClick={() => setShowNotifications(prev => !prev)}>
                                <Bell size={30} />
                                {notifications.length > 0 && (
                                    <div
                                        className={`absolute top-0 right-5 w-3 h-3 rounded-full ${newNotifications.size > 0 ? 'bg-red-500' : 'bg-gray-300'}`}
                                    ></div>
                                )}
                            </button>
                        </div>
                        {showNotifications && notifications.length > 0 && (
                            <div className='fixed top-20 right-4 bg-white border p-4 rounded shadow-lg'>
                                <h3 className='text-lg font-semibold'>Thông báo mới</h3>
                                <ul>
                                    {notifications.map(notification => (
                                        <li
                                            key={notification.id}
                                            className={`py-4 cursor-pointer hover:bg-red-50 ${newNotifications.has(notification.id) ? 'font-bold' : ''}`}
                                            onClick={() => handleViewInfo(notification.id)}
                                        >
                                            Lịch trình mới cho {notification.productScheduleData.title} vào ngày {notification.startDate} - {notification.endDate}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <Menu as='div' className='relative inline-block text-left'>
                            <MenuButton>
                                <div className='h-16 w-16 ring-1 ring-inset ring-gray-300 rounded-full flex items-center justify-center text-2xl font-semibold bg-slate-100'>
                                    {user?.avatar && imageBase64 ? (
                                        <img src={imageBase64} alt='Avatar' className='h-full w-full rounded-full' />
                                    ) : (
                                        <span>{user?.name.charAt(0).toUpperCase()}</span>
                                    )}
                                </div>
                            </MenuButton>

                            <MenuItems
                                transition
                                className='absolute right-0 z-10 mt-5 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'
                            >
                                {user &&
                                    <div className='py-1'>
                                        <MenuItem>
                                            <Link
                                                href={ROUTE.PROFILE}
                                                className='block px-4 py-2 text-base text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
                                            >
                                                Trang cá nhân
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link
                                                href='#'
                                                className='block px-4 py-2 text-base text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
                                                onClick={logout}
                                            >
                                                Đăng xuất
                                            </Link>
                                        </MenuItem>
                                    </div>
                                }
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </nav>
            <aside className='fixed scroll-auto top-0 left-0 z-40 w-72 h-screen pt-28 border-r bg-white' >
                <div className='h-full overflow-y-auto'>
                    <div className='pt-2 px-3 pb-4'>
                        <ul className='space-y-2 font-medium text-black'>
                            <RenderRoutes routes={[...routesForRole]} />
                        </ul>
                    </div>
                </div>
            </aside>
            <div className='py-4 ml-72 pt-28 min-h-screen relative flex flex-col'>
                <div className='grow p-10 pt-5'>
                    {children}
                </div>
                <div className='flex justify-center items-center'>
                    <p className='text-[15px]'>
                        © 2024, made with ❤️ by <b>CV</b>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Sidebar;