'use client';

import { loginApi } from '@/api/user';
import { ROUTE } from '@/constant/enum';
import { useMutation } from 'react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { EyeOff, Eye } from 'lucide-react';

const LoginForm = () => {

    const { user, loading } = useAuth();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            router.push(ROUTE.DASHBOARD);
        }
    }, [user, router, loading]);

    const initialFormData = {
        email: 'admin@gmail.com',
        password: '12345678',
        check: 'admin',
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
                toast.error('Người dùng bị chặn!');
            } else if (data.status === 5) {
                toast.error('Người dùng không có quyền!');
            }
        },
        onError: (error: any) => {
            console.log('Login failed', error);
        },
    });

    const formik = useFormik({
        initialValues: initialFormData,
        validationSchema,
        onSubmit: (values) => {
            mutation.mutate(values);
        },
    });

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
                                        <label htmlFor='email' className='text-xl font-medium'>Email</label>
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
                                        <label htmlFor='password' className='text-xl font-medium'>Mật khẩu</label>
                                        <div className='mt-2'>
                                            <div className="relative">
                                                <input
                                                    id='password'
                                                    name='password'
                                                    type={showPassword ? 'text' : 'password'}
                                                    className='w-full border-2 p-3 rounded-lg outline-none'
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
};

export default LoginForm;
