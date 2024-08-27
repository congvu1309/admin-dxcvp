import axios from '@/lib/axios';
import { ScheduleModel } from '@/models/schedule';

export const getAllScheduleByUserId = () => axios.get(`/api/get-all-schedule-by-userId`);

export const getAllScheduleById = (scheduleId: number) => axios.get(`/api/get-all-schedule-by-userId?scheduleId=${scheduleId}`);

export const updateScheduleApi = (payload: ScheduleModel) => axios.post(`/api/update-schedule`, payload);


