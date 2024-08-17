import { ProductModel } from '@/models/product';
import axios from '../lib/axios';

export const createNewProductApi = (payload: ProductModel) => axios.post(`/api/create-new-product`, payload);

export const getAllProductApi = (userId: number) => axios.get(`/api/get-all-product?userId=${userId}`);

export const getProductByIdApi = (productId: number) => axios.get(`/api/get-product-by-id?id=${productId}`);

export const updateProductApi = (payload: ProductModel) => axios.post(`/api/update-product`, payload);

export const deleteProductByIdApi = (productId: number) => axios.delete(`/api/delete-product-by-id?id=${productId}`);
