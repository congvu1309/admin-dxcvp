'use client';

import CommonUtils from '@/utils/CommonUtils';
import Link from 'next/link';
import { ArrowLeft, Pen, Image, Eye, EyeOff } from 'lucide-react';
import { ROUTE } from '@/constant/enum';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { createNewUser } from '@/api/user';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    phoneNumber: string;
    address: string;
    avatar: string | ArrayBuffer | null;
    previewImgURL: string;
    roleCheck: string;
}

const AddUser = () => {

    const { user: currentUser, loading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    useEffect(() => {

        if (!loading && currentUser?.role !== 'R1') {
            router.push(ROUTE.NOT_FOUND);
        }

    }, [currentUser?.role, router, loading]);

    const initialFormData: FormData = {
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phoneNumber: '',
        address: '',
        avatar: '',
        previewImgURL: '',
        roleCheck: 'R1',
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Email không hợp lệ!').required('Vui lòng nhập thông tin!'),
        password: Yup.string().min(8, 'Mật khẩu cần dài ít nhất 8 ký tự').required('Vui lòng nhập thông tin!'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Mật khẩu phải trùng khớp!')
            .required('Vui lòng nhập thông tin!'),
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
        mutationFn: (data: typeof initialFormData) => createNewUser(data as any),
        onSuccess: (data: any) => {
            if (data.status === 0) {
                toast.success('Tạo mới thành công!');
                setTimeout(() => {
                    window.location.href = ROUTE.USER;
                }, 1500);
            } else if (data.status === 1) {
                toast.error('Tài khoản đã tồn tại!');
            }
        },
        onError: (error: any) => {
            toast.error('Tạo mới thất bại!');
            console.error('Tạo mới thất bại!', error);
        },
    });

    const formik = useFormik({
        initialValues: initialFormData,
        validationSchema,
        onSubmit: (values) => {
            mutation.mutate(values);
        },
    });

    if (!loading && currentUser?.role === 'R1') {
        return (
            <>
                <div className='flex items-center pb-5'>
                    <Link href={ROUTE.USER} className='p-1.5'>
                        <ArrowLeft className='h-8 w-8' />
                    </Link>
                    <div className='flex flex-1 justify-center pr-12'>
                        <span className='text-2xl font-semibold'>Tạo tài khoản mới</span>
                    </div>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className='flex flex-col justify-center items-center'>
                        <div className='h-44 w-44 ring-1 ring-inset ring-gray-300 rounded-full flex items-center justify-center text-2xl font-semibold bg-slate-100 relative bg-no-repeat bg-center bg-cover'>
                            {formik.values.previewImgURL ? (
                                <img src={formik.values.previewImgURL} alt='Avatar' className='h-full w-full rounded-full' />
                            ) : (
                                <div>{!formik.values.previewImgURL && <Image className='w-10 h-10' />}</div>
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
                                        className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.email && formik.errors.email ? (
                                        <div className='text-primary'>{formik.errors.email}</div>
                                    ) : null}
                                </div>
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
                                className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-5 bg-primary text-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                type='submit'
                            >
                                Tiếp tục
                            </button>
                        </div>
                    </div>
                </form>
            </>
        );
    }

    return null;

};

export default AddUser;
