import Vue from 'vue';
import VueFlashMessage from 'vue-flash-message';
import 'vue-flash-message/dist/vue-flash-message.min.css';

Vue.use(VueFlashMessage, {
    messageOptions: {
        timeout: 3000,
        pauseOnInteract: true,
    }
});

const vm = new Vue();

export const handleError = fn => (...params) =>
    fn(...params).catch(error => {
        if (error.response) {
            vm.flash(`${error.response.status}: ${error.response.statusText}`, 'error');
        }
        return Promise.reject(error);
    });
