<template>
    <div>
        <h1>Create New Response</h1>
        <response-form @createOrUpdate="createOrUpdate"></response-form>
    </div>
</template>

<script>
import ResponseForm from '../components/ResponseForm.vue';
import { api } from '../helpers/helpers';

export default {
    name: 'new-response',
    components: {
        'response-form': ResponseForm
    },
    methods: {
        createOrUpdate: async function(response) {
            const res = await api.createResponse(response);
            this.flash('Response created successfully!', 'success');
            this.$router.push(`/responses/${res._id}`);
        }
    }
};
</script>