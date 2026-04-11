<template>
  <div class="form-wrapper">
    <div class="page-header">
      <h1>My Profile</h1>
    </div>

    <div class="ui segment">
      <div class="ui form">
        <div class="ui labeled input fluid">
          <div class="ui label">Username</div>
          <input type="text" readonly :value="user.username" />
        </div>
        <div class="ui labeled input fluid">
          <div class="ui label">Full Name</div>
          <input type="text" readonly :value="user.fullName" />
        </div>
        <div class="ui labeled input fluid">
          <div class="ui label">Email</div>
          <input type="text" readonly :value="user.email" />
        </div>
        <div class="ui labeled input fluid">
          <div class="ui label">Role</div>
          <input type="text" readonly :value="capitalizeRole" style="text-transform: capitalize;" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '../../helpers/auth';

export default {
  name: 'profile',
  data() {
    return {
      user: auth.getUser() || {},
    };
  },
  computed: {
    capitalizeRole() {
      if (!this.user.role) return '';
      return this.user.role.charAt(0).toUpperCase() + this.user.role.slice(1);
    },
  },
};
</script>

