'use client';

import { loginApi } from '@/api/user';
import { ROUTE } from '@/constant/enum';
import { useMutation } from 'react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const LoginForm = () => {

    const { user, loading } = useAuth();
    const router = useRouter();

    const initialFormData = {
        email: 'admin@gmail.com',
        password: '12345678',
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Email không hợp lệ!').required('Vui lòng nhập thông tin!'),
        password: Yup.string().min(8, 'Mật khẩu cần dài ít nhất 8 ký tự!').required('Vui lòng nhập thông tin!'),
    });


    const mutation = useMutation({
        mutationFn: (data: typeof initialFormData) => loginApi(data),
        onSuccess: (data: any) => {
            if (data.status === 0) {
                toast.success('Đăng nhập thành công!');
                setTimeout(() => {
                    router.push(ROUTE.DASHBOARD);
                }, 1500);
            } else if (data.status === 1) {
                toast.error('Thiếu thông số!');
            } else if (data.status === 2) {
                toast.error('Không tìm thấy người dùng!');
            } else if (data.status === 3) {
                toast.error('Sai mật khẩu!');
            } else if (data.status === 4) {
                toast.error('Người dùng bị chặn, liên hệ để tìm hiểu!');
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

    useEffect(() => {
        if (!loading && user) {
            router.push(ROUTE.DASHBOARD);
        }
    }, [user, router, loading]);

    if (!loading && !user) {
        return (
            <>
                <div className='h-screen custom-gradient'>
                    <div className='w-1/4 h-1/2 bg-white rounded-xl absolute m-auto inset-0'>
                        <div className='flex flex-col'>
                            <div className='text-center text-2xl font-semibold py-6'>Đăng nhập</div>
                            <div className='p-5'>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className='pb-2'>
                                        <label
                                            htmlFor='email'
                                            className='text-xl font-medium'
                                        >
                                            Email
                                        </label>
                                        <div className='mt-2'>
                                            <input
                                                id='email'
                                                name='email'
                                                type='email'
                                                placeholder='your@example.com'
                                                className='w-full border-2 p-3 rounded-lg outline-none'
                                                value={formik.values.email}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.email && formik.errors.email ? (
                                                <div className='text-primary'>{formik.errors.email}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor='password'
                                            className='text-xl font-medium'
                                        >
                                            Mật khẩu
                                        </label>
                                        <div className='mt-2'>
                                            <input
                                                id='password'
                                                name='password'
                                                type='password'
                                                className='w-full border-2 p-3 rounded-lg outline-none'
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.touched.password && formik.errors.password ? (
                                                <div className='text-primary'>{formik.errors.password}</div>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className='text-center text-xl font-semibold py-5'>
                                        <button
                                            type='submit'
                                            className='w-full border-2 p-3 rounded-lg outline-none bg-primary text-white'
                                        >
                                            Tiếp tục
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return null;
};

export default LoginForm;
