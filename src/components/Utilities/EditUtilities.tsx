'use client';

import { ROUTE } from '@/constant/enum';
import { ArrowLeft, Image, Pen, Trash } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import CommonUtils from '@/utils/CommonUtils';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import { getUtilitiesByIdApi, updateUtilitiesApi } from '@/api/utilities';
import DeleteUtilities from './DeleteUtilities';
import { useAuth } from '@/hooks/useAuth';

const EditUtilities = () => {

    const params = useParams();
    const id = parseInt(params.id as string, 10);
    const { user, loading } = useAuth();
    const [open, setOpen] = useState(false);
    const [utilitiesId, setUtilitiesId] = useState<number | null>(null);

    useEffect(() => {

        if (user?.role === 'R1') {
            const fetchUtilities = async () => {
                try {
                    const response = await getUtilitiesByIdApi(id);
                    const utilityData = response.data;

                    let imageBase64 = '';
                    if (utilityData.image) {
                        imageBase64 = Buffer.from(utilityData.image, 'base64').toString('binary');
                    }

                    formik.setValues({
                        ...initialFormData,
                        id: utilityData.id,
                        title: utilityData.title,
                        previewImgURL: imageBase64,
                    });

                } catch (error) {
                    console.error('Failed to fetch data', error);
                    toast.error('Failed to fetch data');
                }
            };

            if (id) {
                fetchUtilities();
            }
        }

    }, [id, user?.role]);

    const initialFormData = {
        id: 0,
        title: '',
        image: '',
        previewImgURL: '',
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Vui lòng nhập thông tin!')
    });

    const handleOnchangeImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const data = event.target.files;
        if (data && data.length > 0) {
            const file = data[0];
            if (file) {
                const base64 = await CommonUtils.getBase64(file);
                const objectUrl = URL.createObjectURL(file);
                formik.setFieldValue('previewImgURL', objectUrl);
                formik.setFieldValue('image', base64);
            }
        }
    };

    const mutation = useMutation({
        mutationFn: (data: typeof initialFormData) => updateUtilitiesApi(data as any),
        onSuccess: (data: any) => {
            if (data.status === 0) {
                toast.success('Cập nhật thành công!');
                setTimeout(() => {
                    window.location.href = ROUTE.UTILITY;
                }, 1500);
            } else if (data.status === 1) {
                toast.error('Cập nhật thất bại!');
            }
        },
        onError: (error: any) => {
            console.log('Cập nhật thất bại!', error.response?.data);
        },
    });

    const formik = useFormik({
        initialValues: initialFormData,
        validationSchema,
        onSubmit: (values) => {
            mutation.mutate(values);
        },
    });

    const handleDeleteUtilities = (id: number) => {
        setOpen(true);
        setUtilitiesId(id);
    };

    if (!loading && user?.role === 'R1') {
        return (
            <>
                <div className='flex items-center pb-5'>
                    <Link href={ROUTE.UTILITY} className='p-1.5'>
                        <ArrowLeft className='h-8 w-8' />
                    </Link>
                    <div className='flex flex-1 justify-center pr-12'>
                        <span className='text-2xl font-semibold'>Chỉnh sửa danh mục</span>
                    </div>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className='flex flex-col justify-center items-center'>
                        <div className='h-48 w-48 ring-1 ring-inset ring-gray-300 flex rounded items-center justify-center text-2xl font-semibold bg-slate-100 relative p-4'>
                            {formik.values.previewImgURL ? (
                                <img src={formik.values.previewImgURL} alt='Avatar' className='h-full w-full rounded' />
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
                        <div className='w-96 pt-10'>
                            <div className='mb-4'>
                                <label htmlFor='title' className='block text-gray-700'>Tên danh mục</label>
                                <input
                                    id='title'
                                    name='title'
                                    type='text'
                                    className='block w-full mt-1 rounded-md border-[1px] border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500'
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.title && formik.errors.title ? (
                                    <div className='text-primary'>{formik.errors.title}</div>
                                ) : null}
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
                <button className='absolute bottom-5 right-5' onClick={() => handleDeleteUtilities(id)}>
                    <Trash className='ml-3 h-10 w-10 cursor-pointer bg-primary text-white rounded-md p-2' />
                </button>
                <DeleteUtilities
                    open={open}
                    setOpen={setOpen}
                    utilitiesId={utilitiesId}
                />
            </>
        );
    }
}

export default EditUtilities;