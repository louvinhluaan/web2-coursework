<template>
  <div>
    <h1>Admin Dashboard</h1>

    <!-- Stats Cards -->
    <div class="ui four statistics">
      <div class="statistic">
        <div class="value">{{ stats.responses.total }}</div>
        <div class="label">Total Responses</div>
      </div>
      <div class="statistic green">
        <div class="value">{{ stats.responses.active }}</div>
        <div class="label">Active</div>
      </div>
      <div class="statistic">
        <div class="value">{{ stats.users.total }}</div>
        <div class="label">Total Users</div>
      </div>
      <div class="statistic orange">
        <div class="value">{{ stats.tickets.open }}</div>
        <div class="label">Open Tickets</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="ui top attached tabular menu" style="margin-top: 2em;">
      <a class="item" :class="{ active: activeTab === 'staff' }" @click="activeTab = 'staff'">
        <i class="users icon"></i> Staff Management
      </a>
      <a class="item" :class="{ active: activeTab === 'responses' }" @click="activeTab = 'responses'">
        <i class="comments icon"></i> Responses
      </a>
      <a class="item" :class="{ active: activeTab === 'tickets' }" @click="activeTab = 'tickets'">
        <i class="ticket icon"></i> Tickets
        <span v-if="stats.tickets.open > 0" class="ui mini red circular label" style="margin-left: 6px;">
          {{ stats.tickets.open }}
        </span>
      </a>
    </div>

    <!-- Responses Tab -->
    <div class="ui bottom attached segment" v-show="activeTab === 'responses'">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 1em;">
        <div class="ui icon input" style="width: 100%; max-width: 400px;">
          <input type="text" v-model="responseSearchQuery" placeholder="Search responses...">
          <i class="search icon"></i>
        </div>
      </div>
      <table class="ui celled compact table">
        <thead>
          <tr>
            <th>Issue Code</th>
            <th>Response</th>
            <th>Category</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="res in filteredAdminResponses" :key="res._id">
            <td>{{ res.issue_code }}</td>
            <td class="truncate-cell" :title="res.response">{{ res.response }}</td>
            <td style="text-transform: capitalize;">{{ formatCategory(res.category) }}</td>
            <td style="text-transform: capitalize;">
              <span style="text-transform: capitalize;" class="ui mini label" :class="res.status === 'active' ? 'green' : 'grey'">
                {{ res.status }}
              </span>
            </td>
            <td>{{ formatDate(res.created_date) }}</td>
            <td class="center aligned">
              <button class="ui mini button" :class="res.status === 'active' ? 'red' : 'green'" @click="toggleResponseStatus(res)">
                <i :class="res.status === 'active' ? 'ban icon' : 'check icon'"></i>
                {{ res.status === 'active' ? 'Deactivate' : 'Activate' }}
              </button>
            </td>
          </tr>
          <tr v-if="responses.length === 0">
            <td colspan="6" class="center aligned">No responses found.</td>
          </tr>
          <tr v-if="responses.length > 0 && filteredAdminResponses.length === 0">
            <td colspan="6" class="center aligned" style="padding: 2em; color: grey;">
              No matching responses found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Staff Tab -->
    <div class="ui bottom attached segment" v-show="activeTab === 'staff'">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 1em;">
        <div class="ui icon input" style="width: 100%; max-width: 400px;">
          <input type="text" v-model="staffSearchQuery" placeholder="Search staff...">
          <i class="search icon"></i>
        </div>
      </div>
      <table class="ui celled compact table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user._id">
            <td class="truncate-cell" :title="user.username">{{ user.username }}</td>
            <td class="truncate-cell" :title="user.fullName">{{ user.fullName }}</td>
            <td class="truncate-cell" :title="user.email">{{ user.email }}</td>
            <td style="text-transform: capitalize;">
              <span class="ui mini label" style="text-transform: capitalize;" :class="user.role === 'admin' ? 'red' : 'blue'">
                {{ user.role }}
              </span>
            </td>
            <td style="text-transform: capitalize;">
              <span class="ui mini label" :class="user.status === 'active' ? 'green' : 'grey'">
                {{ user.status || 'active' }}
              </span>
            </td>
            <td>{{ formatDate(user.created_date) }}</td>
            <td class="center aligned">
              <button class="ui mini primary button" @click="openEditModal(user)">
                <i class="edit icon"></i> Edit
              </button>
              <button class="ui mini button" :class="(!user.status || user.status === 'active') ? 'red' : 'green'" @click="toggleUserStatus(user)">
                <i :class="(!user.status || user.status === 'active') ? 'ban icon' : 'check icon'"></i>
                {{ (!user.status || user.status === 'active') ? 'Deactivate' : 'Activate' }}
              </button>
            </td>
          </tr>
          <tr v-if="users.length > 0 && filteredUsers.length === 0">
            <td colspan="6" class="center aligned" style="padding: 2em; color: grey;">
              No matching staff members found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Tickets Tab -->
    <div class="ui bottom attached segment" v-show="activeTab === 'tickets'">
      <div style="display: flex; justify-content: flex-end; margin-bottom: 1em;">
        <div class="ui icon input" style="width: 100%; max-width: 400px;">
          <input type="text" v-model="ticketSearchQuery" placeholder="Search tickets...">
          <i class="search icon"></i>
        </div>
      </div>
      <table class="ui celled compact table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Category</th>
            <th>Submitted By</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in filteredAdminTickets" :key="ticket._id">
            <td class="truncate-cell" :title="ticket.subject">{{ ticket.subject }}</td>
            <td style="text-transform: capitalize;">{{ formatCategory(ticket.category) }}</td>
            <td class="truncate-cell" :title="ticket.submitted_by ? ticket.submitted_by.fullName : ''">
              {{ ticket.submitted_by ? ticket.submitted_by.fullName : 'Unknown' }}
            </td>
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
              <button v-if="ticket.status !== 'deleted'" class="ui mini red button" @click="deleteTicket(ticket)">
                <i class="trash icon"></i> Delete
              </button>
              <button v-else class="ui mini green button" @click="restoreTicket(ticket)">
                <i class="undo icon"></i> Restore
              </button>
            </td>
          </tr>
          <tr v-if="tickets.length === 0">
            <td colspan="6" class="center aligned">No tickets found.</td>
          </tr>
          <tr v-if="tickets.length > 0 && filteredAdminTickets.length === 0">
            <td colspan="6" class="center aligned" style="padding: 2em; color: grey;">
              No matching tickets found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Delete Confirmation Modal -->
    <div class="ui dimmer modals page transition visible active" v-if="showDeleteTicketModal" @click.self="cancelDeleteTicket" style="display: flex !important; align-items: center; justify-content: center;">
      <div class="ui mini modal transition visible active" @click.stop style="display: block !important; position: relative;">
        <div class="header">
          Confirm Deletion
        </div>
        <div class="content">
          <p>Are you sure you want to delete this ticket?</p>
        </div>
        <div class="actions">
          <button class="ui button" @click="cancelDeleteTicket">
            Cancel
          </button>
          <button class="ui negative button" @click="confirmDeleteTicket">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div class="ui dimmer custom" :class="{ active: showEditModal }" @click.self="showEditModal = false">
      <div class="modal-content" @click.stop>
        <div class="ui segment">
          <h3 class="ui header">
            <i class="edit icon"></i> Edit User: {{ editUser.username }}
          </h3>
          <div v-if="editError" class="ui negative message">
            <p>{{ editError }}</p>
          </div>
          <div v-if="editSuccess" class="ui positive message">
            <p>{{ editSuccess }}</p>
          </div>
          <form class="ui form" @submit.prevent="onSaveUser">
            <div class="field">
              <label>Full Name</label>
              <input type="text" v-model="editUser.fullName" maxlength="150" />
            </div>
            <div class="field">
              <label>Email</label>
              <input type="email" v-model="editUser.email" maxlength="254" />
            </div>
            <div class="field">
              <label>Role</label>
              <select class="ui dropdown" v-model="editUser.role">
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="modal-actions">
              <button class="ui primary button" type="submit">
                <i class="save icon"></i> Save
              </button>
              <button class="ui button" type="button" @click="showEditModal = false">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- View Ticket Modal -->
    <div class="ui dimmer custom" :class="{ active: showTicketModal }" @click.self="showTicketModal = false">
      <div class="modal-content modal-large" @click.stop>
        <div class="ui segment">
          <h3 class="ui header">
            <i class="ticket icon"></i> Ticket Details
          </h3>
          <div v-if="ticketError" class="ui negative message">
            <p>{{ ticketError }}</p>
          </div>
          <div v-if="ticketSuccess" class="ui positive message">
            <p>{{ ticketSuccess }}</p>
          </div>

          <div class="ui form">
            <div class="field">
              <label>Subject</label>
              <input type="text" readonly :value="viewTicket.subject" />
            </div>
            <div class="field">
              <label>Message</label>
              <textarea readonly :value="viewTicket.message" rows="4"></textarea>
            </div>
            <div class="two fields">
              <div class="field">
                <label>Category</label>
                <input type="text" readonly :value="formatCategory(viewTicket.category)" style="text-transform: capitalize;" />
              </div>
              <div class="field">
                <label>Submitted By</label>
                <input type="text" readonly :value="viewTicket.submitted_by ? viewTicket.submitted_by.fullName : ''" />
              </div>
            </div>
            <div class="field">
              <label>Status</label>
              <select class="ui dropdown" v-model="ticketStatus">
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
                <option value="deleted">Deleted</option>
              </select>
            </div>
            <div class="field">
              <label>Admin Reply</label>
              <textarea v-model="ticketReply" rows="3" maxlength="2000" placeholder="Write a reply..."></textarea>
            </div>
            <div class="modal-actions">
              <button class="ui teal button" type="button" @click="onUpdateTicket">
                <i class="save icon"></i> Update Ticket
              </button>
              <button class="ui button" type="button" @click="showTicketModal = false">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { adminApi } from '../../helpers/admin';
import { api } from '../../helpers/helpers';
import { auth } from '../../helpers/auth';

export default {
  name: 'admin-dashboard',
  data() {
    return {
      activeTab: 'staff',
      stats: {
        responses: { total: 0, active: 0, inactive: 0 },
        users: { total: 0, staff: 0, admins: 0 },
        tickets: { total: 0, open: 0 },
      },
      users: [],
      tickets: [],
      responses: [],
      staffSearchQuery: '',
      responseSearchQuery: '',
      ticketSearchQuery: '',
      // Edit user modal
      showEditModal: false,
      editUser: {},
      editError: '',
      editSuccess: '',
      // Ticket modal
      showTicketModal: false,
      viewTicket: {},
      ticketStatus: 'open',
      ticketReply: '',
      ticketError: '',
      ticketSuccess: '',
      // Ticket delete modal
      showDeleteTicketModal: false,
      ticketToDelete: null,
    };
  },
  computed: {
    filteredUsers() {
      if (!this.staffSearchQuery) return this.users;
      const query = this.staffSearchQuery.toLowerCase();
      return this.users.filter(u => 
        (u.username && u.username.toLowerCase().includes(query)) ||
        (u.fullName && u.fullName.toLowerCase().includes(query)) ||
        (u.email && u.email.toLowerCase().includes(query))
      );
    },
    filteredAdminResponses() {
      if (!this.responseSearchQuery) return this.responses;
      const query = this.responseSearchQuery.toLowerCase();
      return this.responses.filter(r => 
        (r.issue_code && r.issue_code.toLowerCase().includes(query)) ||
        (r.response && r.response.toLowerCase().includes(query)) ||
        (r.category && r.category.toLowerCase().includes(query))
      );
    },
    filteredAdminTickets() {
      if (!this.ticketSearchQuery) return this.tickets;
      const query = this.ticketSearchQuery.toLowerCase();
      return this.tickets.filter(t => 
        (t.subject && t.subject.toLowerCase().includes(query)) ||
        (t.category && t.category.toLowerCase().replace(/_/g, ' ').includes(query))
      );
    }
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      try {
        this.stats = await adminApi.getStats();
        this.users = await adminApi.getAllUsers();
        this.tickets = await adminApi.getAllTickets();
        this.responses = await api.getAllResponses();
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    },
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
      const colors = { open: 'green', in_progress: 'yellow', resolved: 'blue', closed: 'grey', deleted: 'red' };
      return colors[status] || 'grey';
    },

    // Toggle Response Status
    async toggleResponseStatus(res) {
      const newStatus = res.status === 'active' ? 'inactive' : 'active';
      try {
        await api.updateResponseStatus(res._id, newStatus);
        res.status = newStatus;
        this.stats = await adminApi.getStats();
      } catch (err) {
        console.error('Failed to update status', err);
      }
    },

    // Toggle User Status
    async toggleUserStatus(user) {
      const newStatus = (!user.status || user.status === 'active') ? 'inactive' : 'active';
      try {
        await adminApi.updateUser(user._id, { status: newStatus });
        user.status = newStatus;
        this.stats = await adminApi.getStats();
      } catch (err) {
        console.error('Failed to update user status', err);
      }
    },

    // Delete / Restore Ticket directly
    deleteTicket(ticket) {
      this.ticketToDelete = ticket;
      this.showDeleteTicketModal = true;
    },
    cancelDeleteTicket() {
      this.showDeleteTicketModal = false;
      this.ticketToDelete = null;
    },
    async confirmDeleteTicket() {
      if (!this.ticketToDelete) return;
      const ticket = this.ticketToDelete;
      this.showDeleteTicketModal = false;
      try {
        await adminApi.updateTicketStatus(ticket._id, { status: 'deleted' });
        ticket.status = 'deleted';
        this.stats = await adminApi.getStats();
      } catch (err) {
        console.error('Failed to delete ticket', err);
      }
      this.ticketToDelete = null;
    },
    async restoreTicket(ticket) {
      try {
        await adminApi.updateTicketStatus(ticket._id, { status: 'open' });
        ticket.status = 'open';
        this.stats = await adminApi.getStats();
      } catch (err) {
        console.error('Failed to restore ticket', err);
      }
    },

    // Edit user
    openEditModal(user) {
      this.editUser = { ...user };
      this.editError = '';
      this.editSuccess = '';
      this.showEditModal = true;
    },
    async onSaveUser() {
      this.editError = '';
      this.editSuccess = '';
      try {
        const result = await adminApi.updateUser(this.editUser._id, {
          fullName: this.editUser.fullName,
          email: this.editUser.email,
          role: this.editUser.role,
        });
        this.editSuccess = result.message;
        // Refresh data
        this.users = await adminApi.getAllUsers();
        this.stats = await adminApi.getStats();
        
        // Update localStorage and sync all components
        const currentUser = auth.getUser();
        if (currentUser && currentUser._id === this.editUser._id) {
          await auth.refreshUser();
        }
        
        setTimeout(() => { this.showEditModal = false; }, 1000);
      } catch (err) {
        this.editError = err.response ? err.response.data.message : 'An error occurred.';
      }
    },

    // Ticket
    openTicketModal(ticket) {
      this.viewTicket = { ...ticket };
      this.ticketStatus = ticket.status;
      this.ticketReply = ticket.admin_reply || '';
      this.ticketError = '';
      this.ticketSuccess = '';
      this.showTicketModal = true;
    },
    async onUpdateTicket() {
      this.ticketError = '';
      this.ticketSuccess = '';
      try {
        const result = await adminApi.updateTicketStatus(this.viewTicket._id, {
          status: this.ticketStatus,
          admin_reply: this.ticketReply,
        });
        this.ticketSuccess = result.message;
        this.tickets = await adminApi.getAllTickets();
        this.stats = await adminApi.getStats();
        setTimeout(() => { this.showTicketModal = false; }, 1000);
      } catch (err) {
        this.ticketError = err.response ? err.response.data.message : 'An error occurred.';
      }
    },
  },
};
</script>

<style scoped>
.ui.statistics {
  margin-bottom: 1em;
}
/* Override global CSS bleed from App.vue */
.ui.statistics .statistic > .label {
  width: auto !important;
  margin: 0 auto !important;
  text-align: center;
}
</style>
