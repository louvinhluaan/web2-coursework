import Vue from 'vue';
import Router from 'vue-router';
import Responses from './views/Responses.vue';
import New from './views/New.vue';
import Show from './views/Show.vue';
import Edit from './views/Edit.vue';
import Test from './views/Test.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    linkActiveClass: 'active',
    routes: [
        {
            path: '/',
            redirect: '/responses'
        },
        {
            path: '/responses',
            name: 'responses',
            component: Responses
        },
        {
            path: '/responses/new',
            name: 'new-response',
            component: New
        },
        {
            path: '/responses/:id',
            name: 'show-response',
            component: Show
        },
        {
            path: '/responses/:id/edit',
            name: 'edit-response',
            component: Edit
        },
        {
            path: '/test',
            name: 'test',
            component: Test
        },
    ]
})