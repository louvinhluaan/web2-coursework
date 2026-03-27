<template>
    <div>
      <h1>Show Response</h1>
  
      <div class="ui labeled input fluid">
        <div class="ui label">
           Issue Code
        </div>
        <input type="text" readonly  :value="response.issue_code"/>
      </div>
      <div class="ui labeled input fluid">
        <div class="ui label">
           Response
        </div>
        <input type="text" readonly  :value="response.response"/>
      </div>
      <div class="ui labeled input fluid">
        <div class="ui label" >
           Category
        </div>
        <input type="text" style="text-transform: capitalize;" readonly  :value="response.category"/>
      </div>
      <div class="ui labeled input fluid">
        <div class="ui label">
           Status
        </div>
        <input type="text" style="text-transform: capitalize;" readonly  :value="response.status"/>
      </div>
      <div class="ui labeled input fluid">
        <div class="ui label">
           Created Date
        </div>
        <input type="text" readonly  :value="formatDate(response.created_date)"/>
      </div>
      <div class="actions">
        <router-link :to="{ name: 'edit-response', params: { id: this.$route.params.id }}">
          Edit response
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { api } from '../helpers/helpers';

  export default {
    name: 'show',
    data() {
        return {
            response: ''
        }
    },
    async mounted() {
        this.response = await api.getResponse(this.$route.params.id);
    },
    methods: {
        formatDate(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
        }
    }
  }
  </script>
  
  <style scoped>
  .actions a {
    display: block;
    text-decoration: underline;
    margin: 20px 10px;
  }
  </style>