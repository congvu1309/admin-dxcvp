// axios-instance.js
import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.BACKEND_URL ?? 'http://localhost:3100',
});

instance.interceptors.response.use(
    (response) => {
        const { data } = response;

        return data;
    },
    (error) => {
        return new Error(error);
    }
);

export default instance;
