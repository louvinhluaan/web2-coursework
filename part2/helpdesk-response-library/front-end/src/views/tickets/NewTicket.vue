<template>
  <div class="form-wrapper">
    <div class="page-header">
      <h1>New Ticket</h1>
    </div>

    <div class="ui segment">
      <div v-if="error" class="ui negative message">
        <i class="close icon" @click="error = ''"></i>
        <p>{{ error }}</p>
      </div>
      <div v-if="success" class="ui positive message">
        <p>{{ success }}</p>
      </div>

      <form class="ui form" :class="{ loading: isLoading }" @submit.prevent="onSubmit">
        <div class="field" :class="{ error: !subject && submitted }">
          <label>Subject</label>
          <input
            id="ticket-subject"
            type="text"
            placeholder="Brief description of your request"
            v-model="subject"
            maxlength="200"
          />
        </div>
        <div class="field" :class="{ error: !category && submitted }">
          <label>Category</label>
          <select id="ticket-category" v-model="category">
            <option value="info_update">Info Update</option>
            <option value="bug_report">Bug Report</option>
            <option value="feature_request">Feature Request</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="field" :class="{ error: !message && submitted }">
          <label>Message</label>
          <textarea
            id="ticket-message"
            placeholder="Describe your request in detail..."
            v-model="message"
            rows="5"
            maxlength="2000"
          ></textarea>
        </div>
        <button id="ticket-submit" class="ui teal button" type="submit">
          <i class="paper plane icon"></i> Submit Ticket
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ticketApi } from '../../helpers/helpers';

export default {
  name: 'new-ticket',
  data() {
    return {
      subject: '',
      category: 'other',
      message: '',
      error: '',
      success: '',
      isLoading: false,
      submitted: false,
    };
  },
  methods: {
    async onSubmit() {
      this.submitted = true;
      this.error = '';
      this.success = '';

      if (!this.subject || !this.message) {
        this.error = 'Subject and message are required.';
        return;
      }

      this.isLoading = true;
      try {
        await ticketApi.createTicket({
          subject: this.subject,
          category: this.category,
          message: this.message,
        });
        this.success = 'Ticket submitted successfully! Redirecting...';
        setTimeout(() => {
          this.$router.push('/tickets');
        }, 1500);
      } catch (err) {
        if (err.response && err.response.data) {
          this.error = err.response.data.message;
        } else {
          this.error = 'An error occurred. Please try again.';
        }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

