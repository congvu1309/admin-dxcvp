'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Image } from 'lucide-react';
import { ROUTE } from '@/constant/enum';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { getUserByIdApi } from '@/api/user';
import { useAuth } from '@/hooks/useAuth';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';

const InfoUser = () => {

    const params = useParams();
    const id = parseInt(params.id as string, 10);
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {

        if (user?.role === 'R1') {
            const fetchUser = async () => {
                try {
                    const response = await getUserByIdApi(id);
                    const userData = response.data;

                    let imageBase64 = '';
                    if (userData.avatar) {
                        imageBase64 = Buffer.from(userData.avatar, 'base64').toString('binary');
                    }
                    formik.setValues({
                        ...initialFormData,
                        id: userData.id,
                        email: userData.email,
                        name: userData.name,
                        phoneNumber: userData.phoneNumber,
                        address: userData.address,
                        previewImgURL: imageBase64,
                        role: userData.role,
                        avatar: imageBase64,
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
        }

    }, [id, user?.role, router]);

    const initialFormData = {
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

    const mutation = useMutation({
        mutationFn: (data: typeof initialFormData) => (data as any),
        onSuccess: (data: any) => {
            if (data.status === 0) {
                toast.success('Cập nhật thành công!');
                setTimeout(() => {
                    window.location.href = ROUTE.CATEGORY;
                }, 1500);
            } else if (data.status === 1) {
                toast.error('Cập nhật thất bại!');
            }
        },
        onError: (error: any) => {
            toast.error('Cập nhật thất bại!');
            console.log('Cập nhật thất bại!', error);
        },
    });

    const formik = useFormik({
        initialValues: initialFormData,
        onSubmit: (values) => {
            mutation.mutate(values);
        },
    });

    if (!loading && user?.role === 'R1') {
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
                <form onSubmit={formik.handleSubmit}>
                    <div className='flex flex-col justify-center items-center'>
                        <div className='h-44 w-44 ring-1 ring-inset ring-gray-300 rounded-full flex items-center justify-center text-2xl font-semibold bg-slate-100 relative cursor-not-allowed'>
                            {formik.values.previewImgURL ? (
                                <img src={formik.values.previewImgURL} alt='Avatar' className='h-full w-full rounded-full' />
                            ) : (
                                <div>{!formik.values.previewImgURL && <Image className='w-10 h-10' />}</div>
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
                                        value={formik.values.email}
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
                                        value={formik.values.role === 'R2' ? 'Người cung cấp dịch vụ' : 'Admin'}
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
                                        value={formik.values.status === 'S1' ? 'Hoạt động' : 'Chặn'}
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
                                        value={formik.values.name}
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
                                        value={formik.values.phoneNumber}
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
                                        value={formik.values.address}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </>
        );
    }
}

export default InfoUser;