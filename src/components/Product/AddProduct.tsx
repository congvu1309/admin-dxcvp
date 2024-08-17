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
import { useEffect, useState } from 'react';
import { CategoryModel } from '@/models/category';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import Select, { MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import { NumericFormat } from 'react-number-format';
import { createNewProductApi } from '@/api/product';
import CommonUtils from '@/utils/CommonUtils';
import { UtilitiesModel } from '@/models/utilities';
import { getAllUtilitiesApi } from '@/api/utilities';
import { TIME_TS } from '@/constant/time';
import { provincesWithDistricts } from '@/constant/location';

const animatedComponents = makeAnimated();

const AddProduct = () => {

    const { user, loading } = useAuth();
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [utilities, setUtilities] = useState<UtilitiesModel[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<{ value: string; label: string } | null>(null);

    useEffect(() => {

        if (user) {
            formik.setValues({
                ...initialFormData,
                userId: user.id,
            });
        }

        if (user?.role === 'R2') {
            const fetchCategoryData = async () => {
                try {
                    const response = await getAllCategoryApi();
                    setCategories(response.data);
                } catch (error) {
                    console.error('Failed to fetch category data', error);
                    toast.error('Failed to fetch category data');
                }
            };

            const fetchUtilitiesData = async () => {
                try {
                    const response = await getAllUtilitiesApi();
                    setUtilities(response.data);
                } catch (error) {
                    console.error('Failed to fetch Utilities data', error);
                    toast.error('Failed to fetch setUtilities data');
                }
            };

            fetchCategoryData();
            fetchUtilitiesData();
        }

    }, [user, user?.role]);

    const initialFormData = {
        userId: 0,
        title: '',
        provinces: '',
        districts: '',
        price: '',
        categoryId: '',
        guests: '',
        bedrooms: '',
        beds: '',
        bathrooms: '',
        utilities: [] as string[],
        checkIn: '',
        checkOut: '',
        description: '',
        images: [] as (string | ArrayBuffer | null)[],
        previewImgURLs: [] as string[],
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Vui lòng nhập thông tin!'),
        provinces: Yup.string().required('Vui lòng chọn tỉnh/thành phố!'),
        districts: Yup.string().required('Vui lòng chọn quận/huyện!'),
        price: Yup.string().required('Vui lòng nhập thông tin!'),
        guests: Yup.number().required('Vui lòng nhập thông tin!'),
        bedrooms: Yup.number().required('Vui lòng nhập thông tin!'),
        beds: Yup.number().required('Vui lòng nhập thông tin!'),
        bathrooms: Yup.number().required('Vui lòng nhập thông tin!'),
        checkIn: Yup.string().required('Vui lòng chọn thời gian nhận phòng!'),
        checkOut: Yup.string().required('Vui lòng chọn thời gian trả phòng!'),
        description: Yup.string().required('Vui lòng nhập thông tin!'),
    });

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

    const provincesOptions = provincesWithDistricts.map(provinces => ({
        value: provinces.id.toString(),
        label: provinces.name,
        districts: provinces.districts
    }));

    const handleProvincesChange = (selectedOption: { value: string; label: string } | null) => {
        setSelectedProvince(selectedOption);
        formik.setFieldValue('provinces', selectedOption ? selectedOption.label : '');
    };
    const districtsOptions = selectedProvince
        ? provincesWithDistricts.find(province => province.id === selectedProvince.value)?.districts.map(district => ({
            value: district,
            label: district
        })) || []
        : [];

    const handleDistrictsChange = (selectedOption: { value: string; label: string } | null) => {
        formik.setFieldValue('districts', selectedOption ? selectedOption.label : '');
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
        mutationFn: (data: typeof initialFormData) => createNewProductApi(data as any),
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

    if (!loading && user?.role === 'R2') {
        return (
            <>
                <div className="flex items-center pb-5">
                    <Link href={ROUTE.PRODUCT} className="p-1.5">
                        <ArrowLeft className="h-8 w-8" />
                    </Link>
                    <div className="flex flex-1 justify-center pr-36">
                        <span className="text-2xl font-semibold">Tạo dịch vụ mới</span>
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
                        <div className="flex items-center space-x-4 w-full mb-4">
                            <div className="w-full">
                                <label htmlFor="provinces" className="block text-gray-700">Chọn tỉnh/thành phố</label>
                                <Select
                                    id='provinces'
                                    className=''
                                    value={provincesOptions.find(option => option.label === formik.values.provinces) || null}
                                    onChange={(option) => handleProvincesChange(option as any)}
                                    options={provincesOptions}
                                    placeholder='Chọn tỉnh/thành phố'
                                />
                                {formik.touched.provinces && formik.errors.provinces ? (
                                    <div className="text-primary">{formik.errors.provinces}</div>
                                ) : null}
                            </div>
                            <div className="w-full">
                                <label htmlFor="districts" className="block text-gray-700">Chọn quận/huyện</label>
                                <Select
                                    id='districts'
                                    className=''
                                    value={districtsOptions.find(option => option.value === formik.values.districts) || null}
                                    onChange={(option) => handleDistrictsChange(option as any)}
                                    options={districtsOptions}
                                    placeholder='Chọn quận/huyện'
                                />
                                {formik.touched.districts && formik.errors.districts ? (
                                    <div className="text-primary">{formik.errors.districts}</div>
                                ) : null}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 w-full mb-4">
                            <div className="w-full">
                                <label htmlFor="price" className="block text-gray-700 ">Giá/đêm</label>
                                <div className="relative">
                                    <NumericFormat
                                        id="price"
                                        name="price"
                                        className="block w-full mt-1 rounded-md border border-gray-300 py-2 px-4 bg-white shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formik.values.price}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        allowLeadingZeros
                                        allowNegative={false}
                                        thousandsGroupStyle="none"
                                        thousandSeparator=","
                                    />
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">VND</span>
                                </div>
                                {formik.touched.price && formik.errors.price ? (
                                    <div className="text-primary">{formik.errors.price}</div>
                                ) : null}
                            </div>
                            <div className="w-full">
                                <label htmlFor="categoryId" className="block text-gray-700">Danh mục</label>
                                <Select
                                    id='categoryId'
                                    className=''
                                    value={categoryOptions.find(option => option.value === formik.values.categoryId) || null}
                                    onChange={(option) => handleCategoryChange(option as any)}
                                    options={categoryOptions}
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
                                defaultValue={utilitiesOptions.filter(option => formik.values.utilities.includes(option.value))}
                                placeholder=' Thêm tiện ích'
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
};

export default AddProduct;