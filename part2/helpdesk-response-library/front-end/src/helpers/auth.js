import axios from 'axios';
import { handleError } from './errorHandler';


const baseURL = 'http://localhost:3000/auth/';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});



export const auth = {
    async login(username, password) {
        const res = await axios.post(baseURL + 'login', { username, password });
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return res.data;
    },

    register: handleError(async (payload) => {
        const res = await axios.post(baseURL + 'register', payload);
        return res.data;
    }),

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    isLoggedIn() {
        return !!localStorage.getItem('token');
    },

    getToken() {
        return localStorage.getItem('token');
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    updateUser(userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event('user-updated'));
    },

    refreshUser: handleError(async () => {
        const res = await axiosInstance.get(baseURL + 'profile');
        const user = res.data;
        auth.updateUser(user);
        return user;
    }),

    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'admin';
    },
};
