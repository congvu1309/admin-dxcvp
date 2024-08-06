import { ProductModel } from '@/models/product';
import axios from '../lib/axios';

export const createNewProductApi = (payload: ProductModel) => axios.post(`/api/create-new-product`, payload);

export const getAllProductApiByUserId = (userId: number) => axios.get(`/api/get-all-product-by-userId?userId=${userId}`);

export const getProductByIdApi = (productId: number) => axios.get(`/api/get-product-by-id?id=${productId}`);

