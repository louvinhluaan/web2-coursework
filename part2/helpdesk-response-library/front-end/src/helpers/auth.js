import axios from 'axios';

const baseURL = 'http://localhost:3000/auth/';

export const auth = {
    async login(username, password) {
        const res = await axios.post(baseURL + 'login', { username, password });
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return res.data;
    },

    async register(payload) {
        const res = await axios.post(baseURL + 'register', payload);
        return res.data;
    },

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

    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'admin';
    },
};
