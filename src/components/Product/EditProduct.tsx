'use client';

import { ROUTE } from '@/constant/enum';
import { ArrowLeft, X, Image } from 'lucide-react';
import Link from 'next/link';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { getAllCategoryApi } from '@/api/category';
import { useAuth } from '@/hooks/useAuth';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CategoryModel } from '@/models/category';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import Select, { MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import { NumericFormat } from 'react-number-format';
import CommonUtils from '@/utils/CommonUtils';
import { UtilitiesModel } from '@/models/utilities';
import { getAllUtilitiesApi } from '@/api/utilities';
import { TIME_TS } from '@/constant/time';
import { getProductByIdApi } from '@/api/product';
interface FormData {
    id: number;
    userId: number;
    title: string;
    address: string;
    price: string;
    categoryId: string;
    guests: string;
    bedrooms: string;
    beds: string;
    bathrooms: string;
    utilities: string[];
    checkIn: string;
    checkOut: string;
    description: string;
    images: Array<string | ArrayBuffer | null>;
    previewImgURLs: string[];
}

const animatedComponents = makeAnimated();

const EditProduct = () => {

    const { user: currentUser, loading } = useAuth();
    const router = useRouter();
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [utilities, setUtilities] = useState<UtilitiesModel[]>([]);
    const params = useParams();
    const id = parseInt(params.id as string, 10);

    const initialFormData: FormData = {
        id: 0,
        userId: 0,
        title: '',
        address: '',
        price: '',
        categoryId: '',
        guests: '',
        bedrooms: '',
        beds: '',
        bathrooms: '',
        utilities: [],
        checkIn: '',
        checkOut: '',
        description: '',
        images: [],
        previewImgURLs: [],
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Vui lòng nhập thông tin!'),
        address: Yup.string().required('Vui lòng nhập thông tin!'),
        price: Yup.string().required('Vui lòng nhập thông tin!'),
        guests: Yup.number().required('Vui lòng nhập thông tin!'),
        bedrooms: Yup.number().required('Vui lòng nhập thông tin!'),
        beds: Yup.number().required('Vui lòng nhập thông tin!'),
        bathrooms: Yup.number().required('Vui lòng nhập thông tin!'),
        checkIn: Yup.string().required('Chọn thời gian nhận phòng!'),
        checkOut: Yup.string().required('Chọn thời gian trả phòng!'),
        description: Yup.string().required('Vui lòng nhập thông tin!'),
    });

    useEffect(() => {
        if (!loading && currentUser?.role !== 'R2') {
            router.push(ROUTE.NOT_FOUND);
        }

        if (currentUser?.role === 'R2') {
            const fetchProductData = async () => {
                try {
                    const response = await getProductByIdApi(id);
                    const productData = response.data;

                    const images = productData.imageProductData || [];
                    const previewImgURLs = images.map((item: any) => {
                        const imageBase64 = Buffer.from(item.image, 'base64').toString('binary');
                        return imageBase64;
                    });

                    const utilitiesData = productData.utilityProductData || [];
                    const utilityId = utilitiesData.map((item: any) => item.utilityId);

                    formik.setValues({
                        ...initialFormData,
                        id: productData.id,
                        previewImgURLs,
                        title: productData.title,
                        address: productData.address,
                        price: productData.price,
                        categoryId: productData.categoryId,
                        guests: productData.guests,
                        bedrooms: productData.bedrooms,
                        beds: productData.beds,
                        bathrooms: productData.bathrooms,
                        utilities: utilityId,
                        checkIn: productData.checkIn,
                        checkOut: productData.checkOut,
                        description: productData.description
                    });

                } catch (error) {
                    console.error('Failed to fetch product data', error);
                    toast.error('Failed to fetch product data');
                }
            };

            fetchProductData();
        }

        if (currentUser?.role === 'R2') {
            const fetchCategoryData = async () => {
                try {
                    const response = await getAllCategoryApi();
                    setCategories(response.data);
                } catch (error) {
                    console.error('Failed to fetch category data', error);
                    toast.error('Failed to fetch category data');
                }
            };

            fetchCategoryData();
        }

        if (currentUser?.role === 'R2') {
            const fetchUtilitiesData = async () => {
                try {
                    const response = await getAllUtilitiesApi();
                    setUtilities(response.data);
                } catch (error) {
                    console.error('Failed to fetch Utilities data', error);
                    toast.error('Failed to fetch setUtilities data');
                }
            };

            fetchUtilitiesData();
        }

    }, [currentUser?.role, loading, router]);

    const handleOnchangeImage = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const data = event.target.files;
        if (data && data.length > 0) {
            const file = data[0];
            if (file) {
                const base64 = await CommonUtils.getBase64(file);
                const objectUrl = URL.createObjectURL(file);
                if (formik.values.images.length < 5) {
                    const newImages = [...formik.values.images];
                    const newPreviewImgURLs = [...formik.values.previewImgURLs];
                    newImages[index] = base64;
                    newPreviewImgURLs[index] = objectUrl;
                    formik.setFieldValue('images', newImages);
                    formik.setFieldValue('previewImgURLs', newPreviewImgURLs);
                } else {
                    toast.error('Bạn chỉ có thể tải lên tối đa 5 ảnh');
                }
            }
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = [...formik.values.images];
        const newPreviewImgURLs = [...formik.values.previewImgURLs];
        newImages.splice(index, 1);
        newPreviewImgURLs.splice(index, 1);
        formik.setFieldValue('images', newImages);
        formik.setFieldValue('previewImgURLs', newPreviewImgURLs);
    };

    const categoryOptions = categories.map(category => ({
        value: category.id.toString(),
        label: category.title,
    }));

    const handleCategoryChange = (selectedOption: { value: string; label: string } | null) => {
        formik.setFieldValue('categoryId', selectedOption ? selectedOption.value : '');
    };

    const utilitiesOptions = utilities.map(utility => ({
        value: utility.id.toString(),
        label: utility.title,
    }));

    const handleUtilitiesChange = (newValue: MultiValue<{ value: string; label: string }>) => {
        formik.setFieldValue('utilities', newValue.map(option => option.value));
    };


    const timeOptions = TIME_TS.map(time => ({
        value: time.id.toString(),
        label: time.title,
    }));

    const handleCheckInChange = (selectedOption: { value: string; label: string } | null) => {
        formik.setFieldValue('checkIn', selectedOption ? selectedOption.value : '');
    };

    const handleCheckOutChange = (selectedOption: { value: string; label: string } | null) => {
        formik.setFieldValue('checkOut', selectedOption ? selectedOption.value : '');
    };

    const mutation = useMutation({
        mutationFn: (data: typeof initialFormData) => (data as any),
        onSuccess: (data: any) => {
            if (data.status === 0) {
                toast.success('Tạo mới thành công!');
                setTimeout(() => {
                    window.location.href = ROUTE.PRODUCT;
                }, 1500);
            } else if (data.status === 1) {
                toast.error('Tạo mới thất bại!');
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

    if (!loading && currentUser?.role === 'R2') {
        return (
            <>
                <div className="flex items-center pb-5">
                    <Link href={ROUTE.PRODUCT} className="p-1.5">
                        <ArrowLeft className="h-8 w-8" />
                    </Link>
                    <div className="flex flex-1 justify-center pr-36">
                        <span className="text-2xl font-semibold">Chỉnh sửa dịch vụ</span>
                    </div>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col justify-center items-center">
                        <div className="flex flex-row items-center mb-4 space-x-4">
                            {formik.values.previewImgURLs.map((url, index) => (
                                <div
                                    key={url}
                                    className="h-48 w-48 ring-1 ring-inset ring-gray-300 rounded flex items-center justify-center text-2xl font-semibold bg-slate-100 relative bg-no-repeat bg-center bg-cover"
                                    style={{ backgroundImage: url ? `url(${url})` : 'none' }}
                                >
                                    {url && (
                                        <button
                                            type="button"
                                            className="absolute top-2 right-2 text-white bg-black rounded-full"
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <div
                                className={`h-48 w-48 border border-gray-300 bg-center bg-no-repeat bg-contain cursor-pointer text-center flex items-center justify-center rounded-md ${formik.values.previewImgURLs.length ? 'hidden' : 'block'}`}
                            >
                                {formik.values.previewImgURLs.length === 0 && <Image className="w-10 h-10" />}
                            </div>
                            <input
                                id="uploadNewImage"
                                type="file"
                                hidden
                                onChange={(e) => handleOnchangeImage(e, formik.values.previewImgURLs.length)}
                            />
                            <label
                                className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                htmlFor="uploadNewImage"
                            >
                                Tải ảnh
                            </label>
                        </div>
                        <div className="mb-4 w-full">
                            <label htmlFor="title" className="block text-gray-700">Tiêu đề</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                className="block w-full mt-1 rounded-md border border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.title && formik.errors.title ? (
                                <div className="text-primary">{formik.errors.title}</div>
                            ) : null}
                        </div>
                        <div className="mb-4 w-full">
                            <label htmlFor="address" className="block text-gray-700">Địa chỉ</label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                className="block w-full mt-1 rounded-md border border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.address && formik.errors.address ? (
                                <div className="text-primary">{formik.errors.address}</div>
                            ) : null}
                        </div>
                        <div className="flex items-center space-x-4 w-full mb-4">
                            <div className="w-full">
                                <label htmlFor="price" className="block text-gray-700">Giá/đêm</label>
                                <NumericFormat
                                    id="price"
                                    name="price"
                                    className="block w-full mt-1 rounded-md border border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    allowLeadingZeros
                                    allowNegative={false}
                                    thousandsGroupStyle="thousand"
                                    thousandSeparator=","
                                />
                                {formik.touched.price && formik.errors.price ? (
                                    <div className="text-primary">{formik.errors.price}</div>
                                ) : null}
                            </div>
                            <div className="w-full">
                                <label htmlFor="categoryId" className="block text-gray-700">Danh mục</label>
                                <Select
                                    id='categoryId'
                                    name="categoryId"
                                    options={categoryOptions}
                                    value={categoryOptions.find(option => option.value === formik.values.categoryId) || null}
                                    onChange={handleCategoryChange}
                                    placeholder='Chọn danh mục'
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 w-full mb-4">
                            <div className="w-full">
                                <label htmlFor="guests" className="block text-gray-700">Số lượng khách</label>
                                <input
                                    id="guests"
                                    name="guests"
                                    type="number"
                                    min="0"
                                    className="block w-full mt-1 rounded-md border border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formik.values.guests}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.guests && formik.errors.guests ? (
                                    <div className="text-primary">{formik.errors.guests}</div>
                                ) : null}
                            </div>
                            <div className="w-full">
                                <label htmlFor="bedrooms" className="block text-gray-700">Số lượng phòng</label>
                                <input
                                    id="bedrooms"
                                    name="bedrooms"
                                    type="number"
                                    min="0"
                                    className="block w-full mt-1 rounded-md border border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formik.values.bedrooms}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.bedrooms && formik.errors.bedrooms ? (
                                    <div className="text-primary">{formik.errors.bedrooms}</div>
                                ) : null}
                            </div>
                            <div className="w-full">
                                <label htmlFor="beds" className="block text-gray-700">Số lượng giường</label>
                                <input
                                    id="beds"
                                    name="beds"
                                    type="number"
                                    min="0"
                                    className="block w-full mt-1 rounded-md border border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formik.values.beds}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.beds && formik.errors.beds ? (
                                    <div className="text-primary">{formik.errors.beds}</div>
                                ) : null}
                            </div>
                            <div className="w-full">
                                <label htmlFor="bathrooms" className="block text-gray-700">Số lượng phòng tắm</label>
                                <input
                                    id="bathrooms"
                                    name="bathrooms"
                                    type="number"
                                    min="0"
                                    className="block w-full mt-1 rounded-md border border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formik.values.bathrooms}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.bathrooms && formik.errors.bathrooms ? (
                                    <div className="text-primary">{formik.errors.bathrooms}</div>
                                ) : null}
                            </div>
                        </div>
                        <div className="mb-4 w-full">
                            <label htmlFor="utilities" className="block text-gray-700">Tiện ích</label>
                            <Select
                                id="utilities"
                                name="utilities"
                                isMulti
                                options={utilitiesOptions}
                                components={animatedComponents}
                                closeMenuOnSelect={false}
                                onChange={handleUtilitiesChange}
                                value={utilitiesOptions.filter(option => formik.values.utilities.includes(option.value))}
                                placeholder='Thêm tiện ích'
                            />

                            {formik.touched.utilities && formik.errors.utilities ? (
                                <div className="text-primary">{formik.errors.utilities}</div>
                            ) : null}
                        </div>
                        <div className="flex items-center space-x-4 w-full mb-4">
                            <div className="w-full">
                                <label htmlFor="checkIn" className="block text-gray-700">Thời gian nhận phòng</label>
                                <Select
                                    id="checkIn"
                                    name="checkIn"
                                    options={timeOptions}
                                    value={timeOptions.find(option => option.value === formik.values.checkIn) || null}
                                    onChange={handleCheckInChange}
                                    placeholder="Chọn thời gian nhận phòng"
                                />
                                {formik.touched.checkIn && formik.errors.checkIn ? (
                                    <div className="text-primary">{formik.errors.checkIn}</div>
                                ) : null}
                            </div>
                            <div className="w-full">
                                <label htmlFor="categoryId" className="block text-gray-700">Thời gian trả phòng</label>
                                <Select
                                    id="checkOut"
                                    name="checkOut"
                                    options={timeOptions}
                                    value={timeOptions.find(option => option.value === formik.values.checkOut) || null}
                                    onChange={handleCheckOutChange}
                                    placeholder="Chọn thời gian trả phòng"
                                />
                                {formik.touched.checkOut && formik.errors.checkOut ? (
                                    <div className="text-primary">{formik.errors.checkOut}</div>
                                ) : null}
                            </div>
                        </div>
                        <div className="mb-4 w-full" data-color-mode="light">
                            <label htmlFor="description" className="block text-gray-700">Mô tả</label>
                            <MDEditor
                                value={formik.values.description}
                                onChange={(value) => formik.setFieldValue('description', value ?? '')}
                                height={500}
                                previewOptions={{
                                    rehypePlugins: [[rehypeSanitize]],
                                }}
                            />
                            {formik.touched.description && formik.errors.description ? (
                                <div className="text-primary">{formik.errors.description}</div>
                            ) : null}
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

}

export default EditProduct;