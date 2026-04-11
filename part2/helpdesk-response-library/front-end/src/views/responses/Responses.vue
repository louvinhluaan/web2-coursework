<template>
    <div>
        <div class="page-header">
            <h1>Responses</h1>
            <router-link v-if="isAdmin" to="/responses/new" class="ui primary button">
                <i class="plus circle icon"></i> New Response
            </router-link>
        </div>
        <table id="responses" class="ui celled compact table">
            <thead>
                <tr>
                    <th>Issue Code</th>
                    <th class="eight wide">Response</th>
                    <th>Category</th>
                    <th :colspan="isAdmin ? 3 : 1"></th>
                </tr>
            </thead>
            <tr v-for="(response, i) in responses" :key="i">
                <td>{{ response.issue_code }}</td>
                <td class="response-content">{{ response.response }}</td>
                <td style="text-transform: capitalize;">{{ response.category }}</td>
                <td width="75" class="center aligned">
                <router-link :to="{ name: 'show-response', params: { id: response._id }}">Show</router-link></td>
                <td v-if="isAdmin" width="75" class="center aligned">
                <router-link :to="{ name: 'edit-response', params: { id: response._id }}">Edit</router-link></td>
                <td v-if="isAdmin" width="75" class="center aligned" @click.prevent="onDelete(response._id)">
                    <a :href="`/responses/${response._id}`">Delete</a></td>
            </tr>
            
        </table>
    </div>
</template>

<script>
import { api } from '../../helpers/helpers';
import { auth } from '../../helpers/auth';

export default {
    name: 'responses',
    data() {
        return {
            responses: []
        }
    },
    computed: {
        isAdmin() {
            return auth.isAdmin();
        }
    },
    async mounted() {
        this.responses = await api.getResponses();
    },
    methods: {
        async onDelete(id) {
            const sure = window.confirm('Are you sure you want to delete this response?');
            if (!sure) return;
            await api.deleteResponse(id);
            this.flash('Response deleted successfully!', 'success');
            const newResponses = this.responses.filter(r => r._id !== id);
            this.responses = newResponses;
        }
    },
}
</script>

<style scoped>
.response-content {
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.5;
}
</style>