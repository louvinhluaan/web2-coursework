import Vue from 'vue';
import Router from 'vue-router';
import { auth } from './helpers/auth';

import Responses from './views/responses/Responses.vue';
import New from './views/responses/New.vue';
import Show from './views/responses/Show.vue';
import Edit from './views/responses/Edit.vue';
import QuizDashboard from './views/responses/QuizDashboard.vue';
import Quiz from './views/responses/Quiz.vue';
import Login from './views/identity/Login.vue';
import Register from './views/identity/Register.vue';
import Profile from './views/identity/Profile.vue';
import AdminDashboard from './views/admin/AdminDashboard.vue';
import NewTicket from './views/tickets/NewTicket.vue';
import MyTickets from './views/tickets/MyTickets.vue';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    linkActiveClass: 'active',
    routes: [
        {
            path: '/',
            redirect: '/responses'
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: { guest: true }
        },
        {
            path: '/register',
            name: 'register',
            component: Register,
            meta: { guest: true }
        },
        {
            path: '/responses',
            name: 'responses',
            component: Responses,
            meta: { requiresAuth: true }
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
            meta: { requiresAuth: true }
        },
        {
            path: '/admin',
            name: 'admin-dashboard',
            component: AdminDashboard,
            meta: { requiresAuth: true, adminOnly: true }
        },
        {
            path: '/tickets',
            name: 'my-tickets',
            component: MyTickets,
            meta: { requiresAuth: true }
        },
        {
            path: '/tickets/new',
            name: 'new-ticket',
            component: NewTicket,
            meta: { requiresAuth: true }
        },
        {
            path: '/responses/new',
            name: 'new-response',
            component: New,
            meta: { requiresAuth: true, adminOnly: true }
        },
        {
            path: '/responses/:id',
            name: 'show-response',
            component: Show,
            meta: { requiresAuth: true }
        },
        {
            path: '/responses/:id/edit',
            name: 'edit-response',
            component: Edit,
            meta: { requiresAuth: true, adminOnly: true }
        },
        {
            path: '/quiz',
            name: 'quiz-dashboard',
            component: QuizDashboard,
            meta: { requiresAuth: true }
        },
        {
            path: '/quiz/play',
            name: 'quiz',
            component: Quiz,
            meta: { requiresAuth: true }
        },
    ]
});

// Navigation guard
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!auth.isLoggedIn()) {
            next({ path: '/login' });
        } else if (to.matched.some(record => record.meta.adminOnly) && !auth.isAdmin()) {
            next({ path: '/responses' });
        } else {
            next();
        }
    } else if (to.matched.some(record => record.meta.guest)) {
        if (auth.isLoggedIn()) {
            next({ path: '/responses' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;