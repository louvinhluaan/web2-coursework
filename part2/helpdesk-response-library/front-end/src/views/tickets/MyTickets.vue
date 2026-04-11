<template>
  <div>
    <div class="page-header">
      <h1>My Tickets</h1>
      <router-link to="/tickets/new" class="ui teal button">
        <i class="plus circle icon"></i> New Ticket
      </router-link>
    </div>

    <table class="ui celled compact table">
      <thead>
        <tr>
          <th class="six wide">Subject</th>
          <th class="three wide">Category</th>
          <th class="two wide">Status</th>
          <th class="three wide">Date</th>
          <th class="two wide">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ticket in tickets" :key="ticket._id">
          <td class="truncate-cell" :title="ticket.subject">{{ ticket.subject }}</td>
          <td style="text-transform: capitalize;">{{ formatCategory(ticket.category) }}</td>
          <td>
            <span class="ui mini label" :class="statusColor(ticket.status)" style="text-transform: capitalize;">
              {{ formatStatus(ticket.status) }}
            </span>
          </td>
          <td>{{ formatDate(ticket.created_date) }}</td>
          <td class="center aligned">
            <button class="ui mini teal button" @click="openTicketModal(ticket)">
              <i class="eye icon"></i> View
            </button>
          </td>
        </tr>
        <tr v-if="tickets.length === 0">
          <td colspan="5" class="center aligned">
            No tickets yet. 
            <router-link to="/tickets/new">Create one</router-link>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- View Ticket Modal -->
    <div class="ui dimmer custom" :class="{ active: showTicketModal }" @click.self="showTicketModal = false">
      <div class="modal-content" @click.stop>
        <div class="ui segment">
          <h3 class="ui header">
            <i class="ticket icon"></i> Ticket Details
          </h3>
          <div class="ui form">
            <div class="field">
              <label>Subject</label>
              <input type="text" readonly :value="viewTicket.subject" />
            </div>
            <div class="field">
              <label>Message</label>
              <textarea readonly :value="viewTicket.message" rows="3"></textarea>
            </div>
            <div class="two fields">
              <div class="field">
                <label>Category</label>
                <input type="text" readonly :value="formatCategory(viewTicket.category)" style="text-transform: capitalize;" />
              </div>
              <div class="field">
                <label>Status</label>
                <input type="text" readonly :value="formatStatus(viewTicket.status)" style="text-transform: capitalize;" />
              </div>
            </div>
            <div class="field">
              <label>Admin Reply</label>
              <textarea readonly :value="viewTicket.admin_reply || '—'" rows="5" class="reply-content-modal"></textarea>
            </div>
            <div class="modal-actions">
              <button class="ui button" type="button" @click="showTicketModal = false">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ticketApi } from '../../helpers/helpers';

export default {
  name: 'my-tickets',
  data() {
    return {
      tickets: [],
      showTicketModal: false,
      viewTicket: {},
    };
  },
  async mounted() {
    this.tickets = await ticketApi.getMyTickets() || [];
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    },
    formatCategory(cat) {
      if (!cat) return '';
      return cat.replace(/_/g, ' ');
    },
    formatStatus(status) {
      if (!status) return '';
      return status.replace(/_/g, ' ');
    },
    statusColor(status) {
      const colors = { open: 'green', in_progress: 'yellow', resolved: 'blue', closed: 'grey' };
      return colors[status] || 'grey';
    },
    openTicketModal(ticket) {
      this.viewTicket = { ...ticket };
      this.showTicketModal = true;
    },
  },
};
</script>

<style scoped>
.reply-content-modal {
  white-space: pre-wrap !important;
  word-break: break-word !important;
}
</style>
