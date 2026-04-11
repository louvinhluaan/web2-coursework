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

export const adminApi = {
    // Stats
    async getStats() {
        const res = await axiosInstance.get(baseURL + 'admin/stats');
        return res.data;
    },

    // Users
    async getAllUsers() {
        const res = await axiosInstance.get(baseURL + 'admin/users');
        return res.data;
    },

    async updateUser(id, payload) {
        const res = await axiosInstance.put(baseURL + 'admin/users/' + id, payload);
        return res.data;
    },

    // Tickets (admin view)
    async getAllTickets() {
        const res = await axiosInstance.get(baseURL + 'tickets');
        return res.data;
    },

    async updateTicketStatus(id, payload) {
        const res = await axiosInstance.put(baseURL + 'tickets/' + id + '/status', payload);
        return res.data;
    },
};
