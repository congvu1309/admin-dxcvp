'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Image } from 'lucide-react';
import { ROUTE } from '@/constant/enum';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { getUserByIdApi } from '@/api/user';

interface FormData {
    id: number;
    email: string;
    name: string;
    phoneNumber: string;
    address: string;
    avatar: string | ArrayBuffer | null;
    previewImgURL: string;
    role: string;
    status: string;
}

const InfoUser = () => {

    const initialFormData: FormData = {
        id: 0,
        email: '',
        name: '',
        phoneNumber: '',
        address: '',
        avatar: '',
        previewImgURL: '',
        role: '',
        status: ''
    };

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const params = useParams();
    const id = parseInt(params.id as string, 10);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserByIdApi(id);
                const userData = response.data;

                let imageBase64 = '';
                if (userData.avatar) {
                    imageBase64 = Buffer.from(userData.avatar, 'base64').toString('binary');
                }

                setFormData({
                    id: userData.id,
                    email: userData.email,
                    name: userData.name,
                    phoneNumber: userData.phoneNumber,
                    address: userData.address,
                    previewImgURL: imageBase64,
                    role: userData.role,
                    avatar: null,
                    status: userData.status
                });
            } catch (error) {
                console.error('Failed to fetch user data', error);
                toast.error('Failed to fetch user data');
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id]);

    return (
        <>
            <div className='flex items-center pb-5'>
                <Link href={ROUTE.USER} className='p-1.5'>
                    <ArrowLeft className='h-8 w-8' />
                </Link>
                <div className='flex flex-1 justify-center pr-12'>
                    <span className='text-2xl font-semibold'>Thông tin tài khoản</span>
                </div>
            </div>
            <div className='flex flex-col justify-center items-center'>
                <div className='h-44 w-44 ring-1 ring-inset ring-gray-300 rounded-full flex items-center justify-center text-2xl font-semibold bg-slate-100 relative cursor-not-allowed'>
                    {formData.previewImgURL ? (
                        <img src={formData.previewImgURL} alt='Avatar' className='h-full w-full rounded-full' />
                    ) : (
                        <div>{!formData.previewImgURL && <Image className='w-10 h-10' />}</div>
                    )}
                    <input
                        id='previewImg'
                        type='file'
                        hidden
                    />
                </div>
                <div className='mt-8 flex space-x-8'>
                    <div className='w-96'>
                        <div className='mb-4'>
                            <label htmlFor='email' className='block text-gray-700'>Email</label>
                            <input
                                id='email'
                                name='email'
                                type='email'
                                className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed'
                                value={formData.email}
                                disabled
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='role' className='block text-gray-700'>Vai trò</label>
                            <input
                                id='role'
                                name='role'
                                type='text'
                                className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed'
                                value={formData.role === 'R2' ? 'Người cung cấp dịch vụ' : 'Admin'}
                                disabled
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='status' className='block text-gray-700'>Trạng thái</label>
                            <input
                                id='status'
                                name='status'
                                type='text'
                                className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 cursor-not-allowed'
                                value={formData.status === 'S1' ? 'Hoạt động' : 'Chặn'}
                                disabled
                            />
                        </div>
                    </div>
                    <div className='w-96'>
                        <div className='mb-4'>
                            <label htmlFor='name' className='block text-gray-700'>Họ và tên</label>
                            <input
                                id='name'
                                name='name'
                                type='text'
                                className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500
                                    cursor-not-allowed'
                                value={formData.name}
                                disabled
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='phoneNumber' className='block text-gray-700'>Số điện thoại</label>
                            <input
                                id='phoneNumber'
                                name='phoneNumber'
                                type='text'
                                className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500
                                    cursor-not-allowed'
                                value={formData.phoneNumber}
                                disabled
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='address' className='block text-gray-700'>Địa chỉ</label>
                            <input
                                id='address'
                                name='address'
                                type='text'
                                className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500
                                    cursor-not-allowed'
                                value={formData.address}
                                disabled
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default InfoUser;