import axios from 'axios';
import Vue from 'vue';
import VueFlashMessage from 'vue-flash-message';
import 'vue-flash-message/dist/vue-flash-message.min.css';
import { auth } from './auth';
import router from '../router';

Vue.use(VueFlashMessage, {
    messageOptions: {
        timeout: 3000,
        pauseOnInteract: true,
    }
});

const vm = new Vue();
const baseURL = 'http://localhost:3000/responses/';

// Create axios instance with auth header
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
    const token = auth.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 responses globally → redirect to login
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

export const api = {
    getResponse: handleError(async id => {
        const res = await axiosInstance.get(baseURL + id);
        return res.data;
    }),
    getResponses: handleError(async () => {
        const res = await axiosInstance.get(baseURL);
        return res.data;
    }),
    getAllResponses: handleError(async () => {
        const res = await axiosInstance.get(baseURL + '?all=true');
        return res.data;
    }),
    createResponse: handleError(async payload => {
        const res = await axiosInstance.post(baseURL, payload);
        return res.data;
    }),
    updateResponse: handleError(async payload => {
        const res = await axiosInstance.put(baseURL + payload._id, payload);
        return res.data;
    }),
    deleteResponse: handleError(async id => {
        const res = await axiosInstance.delete(baseURL + id);
        return res.data;
    }),
    updateResponseStatus: handleError(async (id, status) => {
        const res = await axiosInstance.put(baseURL + id + '/status', { status });
        return res.data;
    }),
}

const ticketURL = 'http://localhost:3000/tickets/';

export const ticketApi = {
    createTicket: handleError(async payload => {
        const res = await axiosInstance.post(ticketURL, payload);
        return res.data;
    }),
    getMyTickets: handleError(async () => {
        const res = await axiosInstance.get(ticketURL + 'mytickets');
        return res.data;
    }),
    getTicketById: handleError(async id => {
        const res = await axiosInstance.get(ticketURL + id);
        return res.data;
    }),
}

const quizURL = 'http://localhost:3000/quiz-results/';

export const quizApi = {
    submitQuizResult: handleError(async payload => {
        const res = await axiosInstance.post(quizURL, payload);
        return res.data;
    }),
    getLeaderboard: handleError(async quizId => {
        const res = await axiosInstance.get(quizURL + quizId + '/leaderboard');
        return res.data;
    })
};