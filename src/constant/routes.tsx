import { ReactNode } from 'react';
import {
    LayoutDashboard,
    Plus,
    CircleUserRound,
    CalendarDays,
    Rows2,
    List,
    CircleDollarSign
} from 'lucide-react';
import { ROUTE } from './enum';

export type NavLinkProps = {
    href?: string;
    icon: React.ReactNode;
    title: string;
    childrenNav?: NavLinkChildrens[];
    action?: () => void;
    dialogComponent?: ReactNode;
};

export type NavLinkChildrens = {
    title: string;
    href: string;
};

export const ROUTES: NavLinkProps[] = [
    {
        href: ROUTE.DASHBOARD,
        title: 'Trang chủ',
        icon: <LayoutDashboard size={18} />,
    },
];

export const ROUTES_ADMIN: NavLinkProps[] = [
    {
        title: 'Danh mục',
        icon: <Plus size={18} />,
        href: ROUTE.CATEGORY
    },
    {
        title: 'Tiện ích',
        icon: <List size={18} />,
        href: ROUTE.UTILITY,
    },
    {
        title: 'Tài khoản',
        icon: <CircleUserRound size={18} />,
        href: ROUTE.USER
    },
    {
        title: 'Danh thu',
        icon: <CircleDollarSign size={18} />,
        href: ROUTE.USER
    },
];

export const ROUTES_MANAGER: NavLinkProps[] = [
    {
        title: 'Dịch vụ',
        icon: <Rows2 size={18} />,
        href: ROUTE.PRODUCT,
    },
    {
        title: 'Lịch hẹn',
        icon: <CalendarDays size={18} />,
        href: ROUTE.PRODUCT,
    },
];