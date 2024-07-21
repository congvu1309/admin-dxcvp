'use client';

import Link from 'next/link';
import { NavLinkProps } from '@/constant/routes';
import { usePathname } from 'next/navigation';
import { memo } from 'react';

export const NavLink = memo(({ icon, title, href }: NavLinkProps) => {
    const pathname = usePathname();

    return (
        <li>
            <Link
                href={href as string}
                className={`${pathname === href && 'bg-white'
                    } flex items-center p-2 rounded-lg text-base hover:bg-primary hover:text-white`}
            >
                {icon}
                <span className='ms-3'>{title}</span>
            </Link>
        </li>
    );
});

NavLink.displayName = 'NavLink';
