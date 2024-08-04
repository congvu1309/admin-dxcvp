import React from 'react';
import Link from 'next/link';
import { ROUTE } from '@/constant/enum';

const NotFound = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-gray-800'>404</h1>
        <p className='my-5 text-2xl text-gray-600'>Không tìm thấy trang</p>
        <Link href={ROUTE.DASHBOARD}>
          <span className='bg-primary p-4 rounded text-white'>
            Quay lại dashboard
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
