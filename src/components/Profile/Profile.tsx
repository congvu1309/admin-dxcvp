'use client';

import { getUserByIdApi, updateUserApi } from '@/api/user';
import { ROUTE } from '@/constant/enum';
import { useAuth } from '@/hooks/useAuth';
import CommonUtils from '@/utils/CommonUtils';
import { ArrowLeft, Pen } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const Profile = () => {
    const { user } = useAuth();
    const id = user?.id;

    useEffect(() => {

        const fetchUserById = async () => {
            try {
                if (id) {
                    const response = await getUserByIdApi(id);
                    const userData = response.data;

                    let imageBase64 = '';
                    if (userData.avatar) {
                        imageBase64 = Buffer.from(userData.avatar, 'base64').toString('binary');
                    }

                    formik.setValues({
                        ...initialFormData,
                        id: userData.id,
                        name: userData.name,
                        phoneNumber: userData.phoneNumber,
                        address: userData.address,
                        previewImgURL: imageBase64,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch me data', error);
                toast.error('Failed to fetch me data');
            }
        };

        fetchUserById();
        
    }, [id]);

    const initialFormData = {
        id: 0,
        name: '',
        phoneNumber: '',
        address: '',
        avatar: '',
        previewImgURL: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Vui lòng nhập thông tin!'),
        phoneNumber: Yup.string().required('Vui lòng nhập thông tin!'),
        address: Yup.string().required('Vui lòng nhập thông tin!'),
    });

    const handleOnchangeImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const data = event.target.files;
        if (data && data.length > 0) {
            const file = data[0];
            if (file) {
                const base64 = await CommonUtils.getBase64(file);
                const objectUrl = URL.createObjectURL(file);
                formik.setFieldValue('previewImgURL', objectUrl);
                formik.setFieldValue('avatar', base64);
            }
        }
    };

    const mutation = useMutation({
        mutationFn: (data: typeof initialFormData) => updateUserApi(data as any),
        onSuccess: (data: any) => {
            if (data.status === 0) {
                toast.success('Cập nhật thành công!');
                setTimeout(() => {
                    window.location.href = ROUTE.PROFILE;
                }, 1500);
            } else if (data.status === 1) {
                toast.error('Cập nhật thất bại!');
            }
        },
        onError: (error: any) => {
            console.log('Update failed', error.response?.data);
        },
    });

    const formik = useFormik({
        initialValues: initialFormData,
        validationSchema,
        onSubmit: (values) => {
            mutation.mutate(values);
        },
    });

    return (
        <>
            <div className='flex items-center pb-5'>
                <Link href={ROUTE.DASHBOARD} className='p-1.5'>
                    <ArrowLeft className='h-8 w-8' />
                </Link>
                <div className='flex flex-1 justify-center pr-12'>
                    <span className='text-2xl font-semibold'>Trang cá nhân</span>
                </div>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className='flex flex-col justify-center items-center'>
                    <div className='h-44 w-44 ring-1 ring-inset ring-gray-300 rounded-full flex items-center justify-center text-2xl font-semibold bg-slate-100 relative bg-no-repeat bg-center bg-cover'>
                        {user?.avatar && formik.values.previewImgURL ? (
                            <img src={formik.values.previewImgURL} alt='Avatar' className='h-full w-full rounded-full' />
                        ) : (
                            <span>{user?.name.charAt(0).toUpperCase()}</span>
                        )}
                        <input
                            id='previewImg'
                            type='file'
                            hidden
                            onChange={handleOnchangeImage}
                        />
                        <label htmlFor='previewImg' className='absolute bottom-2 right-1.5 p-2 border-2 border-gray-700 text-gray-700 rounded-full cursor-pointer'>
                            <Pen />
                        </label>
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
                                    value={user?.email}
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
                                    value={user?.role === 'R2' ? 'Người cung cấp dịch vụ' : 'Admin'}
                                    disabled
                                />
                            </div>
                            <div className='mb-4'>
                                <label htmlFor='password' className='block text-gray-700'>Mật khẩu</label>
                                <Link href={ROUTE.CHANGE_PASSWORD} className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-primary text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-center cursor-pointer'>
                                    Đổi mật khẩu
                                </Link>
                            </div>
                        </div>
                        <div className='w-96'>
                            <div className='mb-4'>
                                <label htmlFor='name' className='block text-gray-700'>Họ và tên</label>
                                <input
                                    id='name'
                                    name='name'
                                    type='text'
                                    className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                    value={formik.values.name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.name && formik.errors.name ? (
                                    <div className='text-primary'>{formik.errors.name}</div>
                                ) : null}
                            </div>
                            <div className='mb-4'>
                                <label htmlFor='phoneNumber' className='block text-gray-700'>Số điện thoại</label>
                                <input
                                    id='phoneNumber'
                                    name='phoneNumber'
                                    type='text'
                                    className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                    value={formik.values.phoneNumber}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                                    <div className='text-primary'>{formik.errors.phoneNumber}</div>
                                ) : null}
                            </div>
                            <div className='mb-4'>
                                <label htmlFor='address' className='block text-gray-700'>Địa chỉ</label>
                                <input
                                    id='address'
                                    name='address'
                                    type='text'
                                    className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                    value={formik.values.address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.address && formik.errors.address ? (
                                    <div className='text-primary'>{formik.errors.address}</div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className='mt-5 px-12'>
                        <button
                            className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-primary text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                            type='submit'
                        >
                            Cập nhật
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default Profile;
