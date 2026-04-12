<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="ui segment">
        <h2 class="ui header center aligned" style="display: block !important; margin-bottom: 20px;">
          <img src="/logo.png" alt="Helpdesk Logo" style="width: 85px; display: block; margin: 0 auto 15px auto;" />
          <div class="content">
            Login
            <div class="sub header" style="margin-top: 10px;">Helpdesk Response Library</div>
          </div>
        </h2>

        <div class="ui divider"></div>

        <div v-if="error" class="ui negative message">
          <i class="close icon" @click="error = ''"></i>
          <p>{{ error }}</p>
        </div>

        <form class="ui form" :class="{ loading: isLoading }" @submit.prevent="onLogin">
          <div class="field" :class="{ error: !username && submitted }">
            <label>Username</label>
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input
                id="login-username"
                type="text"
                placeholder="Enter username"
                v-model="username"
              />
            </div>
          </div>

          <div class="field" :class="{ error: !password && submitted }">
            <label>Password</label>
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input
                id="login-password"
                type="password"
                placeholder="Enter password"
                v-model="password"
              />
            </div>
          </div>

          <button id="login-submit" class="ui primary button fluid" type="submit">
            <i class="sign in alternate icon"></i> Login
          </button>
        </form>

        <div class="ui divider"></div>

        <p class="center-text">
          Don't have an account?
          <router-link to="/register">Register here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '../../helpers/auth';

export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: '',
      error: '',
      isLoading: false,
      submitted: false,
    };
  },
  methods: {
    async onLogin() {
      this.submitted = true;
      this.error = '';

      if (!this.username || !this.password) {
        this.error = 'Please fill in all fields.';
        return;
      }

      this.isLoading = true;
      try {
        await auth.login(this.username, this.password);
        this.$router.push('/responses');
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

