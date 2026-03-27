<template>
    <div>
        <h1>Responses</h1>
        <table id="responses" class="ui celled compact table">
            <thead>
                <tr>
                    <th>Issue Code</th>
                    <th class="six wide">Response</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th colspan="3"></th>
                </tr>
            </thead>
            <tr v-for="(response, i) in responses" :key="i">
                <td>{{ response.issue_code }}</td>
                <td>{{ response.response }}</td>
                <td style="text-transform: capitalize;">{{ response.category }}</td>
                <td style="text-transform: capitalize;">{{ response.status }}</td>
                <td width="75" class="center aligned">
                <router-link :to="{ name: 'show-response', params: { id: response._id }}">Show</router-link></td>
                <td width="75" class="center aligned">
                <router-link :to="{ name: 'edit-response', params: { id: response._id }}">Edit</router-link></td>
                <td width="75" class="center aligned" @click.prevent="onDelete(response._id)">
                    <a :href="`/responses/${response._id}`">Delete</a></td>
            </tr>
            
        </table>
    </div>
</template>

<script>
import { api } from '../helpers/helpers';

export default {
    name: 'responses',
    data() {
        return {
            responses: []
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