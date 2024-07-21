'use client';

import { getUserByIdApi, updateUserApi } from '@/api/user';
import { ROUTE } from '@/constant/enum';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useFormik } from 'formik';

interface FormData {
    id: number;
    password: string;
    confirmPassword: string;
}

const ChangePassword = () => {

    const { user } = useAuth();
    const id = user?.id;
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const initialFormData: FormData = {
        id: 0,
        password: '',
        confirmPassword: '',
    };

    const validationSchema = Yup.object({
        password: Yup.string().min(8, 'Mật khẩu cần dài ít nhất 8 ký tự').required('Vui lòng nhập thông tin!'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Mật khẩu phải trùng khớp!')
            .required('Vui lòng nhập thông tin!'),
    });

    useEffect(() => {
        const fetchUserById = async () => {
            try {
                if (id) {
                    const response = await getUserByIdApi(id);
                    const userData = response.data;

                    formik.setValues({
                        ...initialFormData,
                        id: userData.id,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch me data', error);
                toast.error('Failed to fetch me data');
            }
        };

        fetchUserById();
    }, [id]);

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
            console.log('Login failed', error.response?.data);
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
                <Link href={ROUTE.PROFILE} className='p-1.5'>
                    <ArrowLeft className='h-8 w-8' />
                </Link>
                <div className='flex flex-1 justify-center pr-12'>
                    <span className='text-2xl font-semibold'>Đổi mật khẩu</span>
                </div>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div className='flex flex-col items-center justify-center'>
                    <div className='w-96'>
                        <div className='mb-4'>
                            <label htmlFor='password' className='block text-gray-700'>Mật khẩu</label>
                            <div className='relative'>
                                <input
                                    id='password'
                                    name='password'
                                    type={showPassword ? 'text' : 'password'}
                                    className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <div
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                                </div>
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <div className='text-primary'>{formik.errors.password}</div>
                            ) : null}
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='confirmPassword' className='block text-gray-700'>Nhập lại mật khẩu</label>
                            <div className='relative'>
                                <input
                                    id='confirmPassword'
                                    name='confirmPassword'
                                    type={showConfirm ? 'text' : 'password'}
                                    className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                    value={formik.values.confirmPassword}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <div
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                                    onClick={() => setShowConfirm(!showConfirm)}
                                >
                                    {showConfirm ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                                </div>
                            </div>
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                <div className='text-primary'>{formik.errors.confirmPassword}</div>
                            ) : null}
                        </div>
                        <div className='mt-5'>
                            <button
                                className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-primary text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                type='submit'
                            >
                                Cập nhập
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}

export default ChangePassword;