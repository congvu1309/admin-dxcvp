import axios from '../lib/axios';
import { UtilitiesModel } from '@/models/utilities';

export const createNewUtilitiesApi = (payload: UtilitiesModel) => axios.post(`/api/create-new-utilities`, payload);

export const getAllUtilitiesApi = () => axios.get(`/api/get-all-utilities`);

export const getUtilitiesByIdApi = (utilitiesId: number) => axios.get(`/api/get-utilities-by-id?id=${utilitiesId}`);

export const updateUtilitiesApi = (payload: UtilitiesModel) => axios.post(`/api/update-utilities`, payload);

export const deleteUtilitiesByIdApi = (utilitiesId: number) =>
    axios.delete(`/api/delete-utilities-by-id?id=${utilitiesId}`);
