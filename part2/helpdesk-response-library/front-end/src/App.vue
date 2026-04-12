<template>
  <div id="app">
    <!-- Navbar -->
    <div v-if="isLoggedIn" class="ui inverted segment navbar">
      <div class="ui container">
        <div class="ui large secondary inverted pointing menu" style="align-items: center;">
          <div class="header item" style="padding: 0 10px 0 0; border: none; align-self: center;">
            <img src="/logo.png" alt="App Logo" style="height: 40px; object-fit: contain;">
          </div>
          <router-link to="/responses" exact class="item" style="border: none;">
            <i class="comment outline icon"></i> Responses
          </router-link>
          <router-link to="/tickets" class="item">
            <i class="ticket icon"></i> My Tickets
          </router-link>
          <router-link to="/quiz" class="item">
            <i class="graduation cap icon"></i> Training Quiz
          </router-link>
          <router-link v-if="isAdmin" to="/admin" class="item">
            <i class="dashboard icon"></i> Dashboard
          </router-link>

          <!-- Right side: user dropdown -->
          <div class="right menu">
            <div class="ui dropdown item user-dropdown" :class="{ active: showDropdown }" @click.stop="showDropdown = !showDropdown" v-click-outside="closeDropdown">
              <i class="user circle icon"></i>
              <span>{{ currentUser.fullName }}</span>
              <span class="ui mini label" :class="isAdmin ? 'red' : 'blue'" style="margin-left: 8px; text-transform: capitalize;">
                {{ currentUser.role }}
              </span>
              <i class="dropdown icon"></i>
              <div class="menu" :style="showDropdown ? 'display: block !important' : 'display: none !important'">
                <router-link to="/profile" class="item" @click.native="showDropdown = false">
                  <i class="user icon"></i> Profile
                </router-link>
                <div class="divider"></div>
                <a class="item" @click="onLogout">
                  <i class="sign out alternate icon"></i> Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="ui container" style="margin-top: 20px;">
      <flash-message class="myFlash"></flash-message>
      <div class="ui one column grid">
        <div class="column">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from './helpers/auth';

export default {
  name: 'app',
  directives: {
    'click-outside': {
      bind(el, binding) {
        el._clickOutside = (e) => {
          if (!el.contains(e.target)) {
            binding.value();
          }
        };
        document.addEventListener('click', el._clickOutside);
      },
      unbind(el) {
        document.removeEventListener('click', el._clickOutside);
      },
    },
  },
  data() {
    return {
      isLoggedIn: auth.isLoggedIn(),
      currentUser: auth.getUser() || {},
      showDropdown: false,
    };
  },
  computed: {
    isAdmin() {
      return this.currentUser && this.currentUser.role === 'admin';
    },
  },
  watch: {
    // Update auth state when route changes (after login/logout)
    '$route'() {
      this.isLoggedIn = auth.isLoggedIn();
      this.currentUser = auth.getUser() || {};
    },
  },
  methods: {
    closeDropdown() {
      this.showDropdown = false;
    },
    onLogout() {
      this.showDropdown = false;
      auth.logout();
      this.isLoggedIn = false;
      this.currentUser = {};
      this.$router.push('/login');
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.myFlash {
  width: 250px;
  margin: 10px;
  position: absolute;
  top: 50px;
  right: 0;
}

.ui.inverted.segment.navbar {
  border-radius: 0;
  margin-bottom: 2em;
}

/* User Dropdown */
.user-dropdown {
  font-weight: 500;
  cursor: pointer;
  position: relative !important;
  max-width: 250px;
}
.user-dropdown > span:first-of-type {
  display: inline-block;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
.user-dropdown .menu {
  left: auto !important;
  right: 0 !important;
  min-width: 160px;
}
.user-dropdown .menu .item {
  color: rgba(0,0,0,.87) !important;
}

/* Page Headers */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
}
.page-header h1 {
  margin: 0;
}

/* Tables */
.ui.table {
  font-size: 1.2em;
}
.ui.table td {
  vertical-align: middle !important;
}
.ui.table td button.ui.button {
  margin-top: 0 !important;
  display: inline-block !important;
}
.truncate-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Custom Modals (Dimmers) */
.ui.dimmer.custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.ui.dimmer.custom:not(.active) {
  display: none;
}
.ui.dimmer.custom .modal-content {
  width: 700px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
}
.ui.dimmer.custom .modal-content .ui.segment {
  margin: 0;
}
.ui.dimmer.custom .modal-actions {
  margin-top: 1em;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.ui.dimmer.custom .modal-content input,
.ui.dimmer.custom .modal-content textarea {
  width: 100% !important;
}

/* Auth Pages (Login / Register) */
.auth-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('../public/background.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.myFlash {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: 90%;
  max-width: 600px;
}
.auth-container {
  width: 100%;
  max-width: 420px;
}
.auth-container .ui.segment {
  padding: 2.5em 2em;
}
.center-text {
  text-align: center;
  margin-top: 0.5em;
}

/* Form Wrappers */
.form-wrapper {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
.form-wrapper .ui.labeled.input {
  margin-bottom: 1em;
}
.form-wrapper .ui.labeled.input > .ui.label {
  min-width: 140px;
  justify-content: flex-start;
}
</style>