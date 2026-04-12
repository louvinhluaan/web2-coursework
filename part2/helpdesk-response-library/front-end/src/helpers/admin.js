import axios from 'axios';
import { auth } from './auth';
import router from '../router';

const baseURL = 'http://localhost:3000/';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
    const token = auth.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            auth.logout();
            router.push('/login');
        }
        return Promise.reject(error);
    }
);

const handleError = fn => (...params) =>
    fn(...params).catch(error => {
        if (error.response) {
            vm.flash(`${error.response.status}: ${error.response.statusText}`, 'error');
        }
    });

export const adminApi = {
    // Stats
    getStats: handleError(async () => {
        const res = await axiosInstance.get(baseURL + 'admin/stats');
        return res.data;
    }),

    // Users
    getAllUsers: handleError(async () => {
        const res = await axiosInstance.get(baseURL + 'admin/users');
        return res.data;
    }),

    updateUser: handleError(async (id, payload) => {
        const res = await axiosInstance.put(baseURL + 'admin/users/' + id, payload);
        return res.data;
    }),

    // Tickets (admin view)
    getAllTickets: handleError(async () => {
        const res = await axiosInstance.get(baseURL + 'tickets');
        return res.data;
    }),

    updateTicketStatus: handleError(async (id, payload) => {
        const res = await axiosInstance.put(baseURL + 'tickets/' + id + '/status', payload);
        return res.data;
    }),
};
