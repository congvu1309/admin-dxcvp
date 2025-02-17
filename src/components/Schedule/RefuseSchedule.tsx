'use client';

import { ROUTE } from '@/constant/enum';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/16/solid';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { updateScheduleApi } from '@/api/schedule';

interface RefuseSchdeduleProps {
    openRefuse: boolean;
    setOpenRefuse: React.Dispatch<React.SetStateAction<boolean>>;
    scheduleIdToRefuse: number | null;
    scheduleStatusToRefuse: string | null;
}

const RefuseSchdedule: React.FC<RefuseSchdeduleProps> = ({ openRefuse, setOpenRefuse, scheduleIdToRefuse, scheduleStatusToRefuse }) => {

    useEffect(() => {
        if (openRefuse && scheduleIdToRefuse !== null && scheduleStatusToRefuse !== null) {
            formik.setValues({
                id: scheduleIdToRefuse,
                status: scheduleStatusToRefuse === 'pending' ? 'refuse' : 'canceled',
            });
        }
    }, [openRefuse, scheduleIdToRefuse, scheduleStatusToRefuse]);


    const initialFormData = {
        id: 0,
        status: ''
    };

    const mutation = useMutation({
        mutationFn: (data: typeof initialFormData) => updateScheduleApi(data as any),
        onSuccess: (data: any) => {
            if (data.status === 0) {
                toast.success('Thành công!');
                setOpenRefuse(false);
                setTimeout(() => {
                    window.location.href = ROUTE.SCHEDULE;
                }, 1500);
            } else if (data.status === 1) {
                toast.error('Thất bại!');
            }
        },
        onError: (error: any) => {
            console.error('Update failed', error.response?.data);
            toast.error('Update failed');
        },
    });

    const formik = useFormik({
        initialValues: initialFormData,
        onSubmit: (values) => {
            mutation.mutate(values);
        },
    });

    return (
        <>
            <Dialog open={openRefuse} onClose={() => setOpenRefuse(false)} className='relative z-10'>
                <DialogBackdrop
                    transition
                    className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in'
                />
                <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                    <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                        <DialogPanel
                            transition
                            className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95'
                        >
                            <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                                <div className='sm:flex sm:items-center'>
                                    <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                                        <ExclamationTriangleIcon aria-hidden='true' className='h-6 w-6 text-red-600' />
                                    </div>
                                    <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                                        <DialogTitle as='h3' className='text-xl font-semibold leading-6 text-gray-900'>
                                            Bạn chắn chằn {scheduleStatusToRefuse === 'pending' ? 'từ chối' : 'hủy'} yêu cầu này!
                                        </DialogTitle>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                                <button
                                    type='button'
                                    onClick={() => formik.handleSubmit()}
                                    className='inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto'
                                >
                                    Đồng ý
                                </button>
                                <button
                                    type='button'
                                    data-autofocus
                                    onClick={() => setOpenRefuse(false)}
                                    className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                                >
                                    Đóng
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default RefuseSchdedule;
