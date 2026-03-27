<template>
    <div>
        <h1>Edit Response</h1>
        <response-form @createOrUpdate="createOrUpdate" :response=this.response></response-form>
    </div>
</template>


<script>
import ResponseForm from '../components/ResponseForm.vue';
import { api } from '../helpers/helpers';

export default {
    name: 'edit',
    components: {
        'response-form': ResponseForm
    },
    data: function() {
        return {
            response: {}
        };
    },
    async mounted() {
        this.response = await api.getResponse(this.$route.params.id);
    },
    methods: {
        createOrUpdate: async function(response) {
            await api.updateResponse(response);
            this.flash('Response updated successfully!', 'success');
            this.$router.push(`/responses/${response._id}`);
        }
    }
}
</script>