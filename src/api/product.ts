import { ProductModel } from '@/models/product';
import axios from '../lib/axios';

export const createNewProductApi = (payload: ProductModel) => axios.post(`/api/create-new-product`, payload);

export const getAllProductApi = () => axios.get(`/api/get-all-product`);
