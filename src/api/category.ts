import axios from '../lib/axios';
import { CategoryModel } from '@/models/category';

export const createNewCategoryApi = (payload: CategoryModel) => axios.post(`/api/create-new-category`, payload);

export const getAllCategoryApi = () => axios.get(`/api/get-all-category`);

export const getCategoryByIdApi = (categoryId: number) => axios.get(`/api/get-category-by-id?id=${categoryId}`);

export const updateCategoryApi = (payload: CategoryModel) => axios.post(`/api/update-category`, payload);

export const deleteCategoryByIdApi = (categoryId: number) => 
    axios.delete(`/api/delete-category-by-id?id=${categoryId}`);