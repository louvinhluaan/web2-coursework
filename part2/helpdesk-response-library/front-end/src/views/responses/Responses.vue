<template>
    <div>
        <div class="page-header">
            <h1>Responses</h1>
            <router-link v-if="isAdmin" to="/responses/new" class="ui primary button">
                <i class="plus circle icon"></i> New Response
            </router-link>
        </div>
        <div style="display: flex; justify-content: flex-end; margin-bottom: 1em;">
            <div class="ui icon input" style="width: 100%; max-width: 400px;">
                <input type="text" v-model="searchQuery" placeholder="Search responses by code or keywords...">
                <i class="search icon"></i>
            </div>
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
            <tr v-for="(response, i) in filteredResponses" :key="response._id || i">
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
            <tr v-if="filteredResponses.length === 0">
                <td :colspan="isAdmin ? 6 : 4" class="center aligned" style="padding: 2em; color: grey;">
                  No matching responses found.
                </td>
            </tr>
        </table>

        <!-- Delete Confirmation Modal -->
        <div class="ui dimmer modals page transition visible active" v-if="showDeleteModal" @click.self="cancelDelete" style="display: flex !important; align-items: center; justify-content: center;">
            <div class="ui mini modal transition visible active" @click.stop style="display: block !important; position: relative;">
                <div class="header">
                    Confirm Deletion
                </div>
                <div class="content">
                    <p>Are you sure you want to delete this response?</p>
                </div>
                <div class="actions">
                    <button class="ui button" @click="cancelDelete">
                        Cancel
                    </button>
                    <button class="ui negative button" @click="confirmDelete">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { api } from '../../helpers/helpers';
import { auth } from '../../helpers/auth';

export default {
    name: 'responses',
    data() {
        return {
            responses: [],
            searchQuery: '',
            showDeleteModal: false,
            responseToDelete: null
        }
    },
    computed: {
        isAdmin() {
            return auth.isAdmin();
        },
        filteredResponses() {
            if (!this.searchQuery) return this.responses;
            const query = this.searchQuery.toLowerCase();
            return this.responses.filter(r => 
                (r.issue_code && r.issue_code.toLowerCase().includes(query)) ||
                (r.response && r.response.toLowerCase().includes(query)) ||
                (r.category && r.category.toLowerCase().includes(query))
            );
        }
    },
    async mounted() {
        this.responses = await api.getResponses();
    },
    methods: {
        onDelete(id) {
            this.responseToDelete = id;
            this.showDeleteModal = true;
        },
        cancelDelete() {
            this.showDeleteModal = false;
            this.responseToDelete = null;
        },
        async confirmDelete() {
            if (!this.responseToDelete) return;
            const id = this.responseToDelete;
            this.showDeleteModal = false;
            
            try {
                await api.deleteResponse(id);
                this.flash('Response deleted successfully!', 'success');
                const newResponses = this.responses.filter(r => r._id !== id);
                this.responses = newResponses;
            } catch (err) {
                this.flash('Error deleting response.', 'error');
            }
            this.responseToDelete = null;
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