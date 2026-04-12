<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="ui segment">
        <h2 class="ui header center aligned" style="display: block !important; margin-bottom: 20px;">
          <img src="/logo.png" alt="Helpdesk Logo" style="width: 85px; display: block; margin: 0 auto 15px auto;" />
          <div class="content">
            Register
            <div class="sub header" style="margin-top: 10px;">Create a new account</div>
          </div>
        </h2>

        <div class="ui divider"></div>

        <div v-if="error" class="ui negative message">
          <i class="close icon" @click="error = ''"></i>
          <p>{{ error }}</p>
        </div>

        <div v-if="success" class="ui positive message">
          <p>{{ success }}</p>
        </div>

        <form class="ui form" :class="{ loading: isLoading }" @submit.prevent="onRegister">
          <div class="field" :class="{ error: !fullName && submitted }">
            <label>Full Name</label>
            <div class="ui left icon input">
              <i class="id card icon"></i>
              <input
                id="register-fullname"
                type="text"
                placeholder="Enter full name"
                v-model="fullName"
                maxlength="150"
              />
            </div>
          </div>

          <div class="field" :class="{ error: !username && submitted }">
            <label>Username</label>
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input
                id="register-username"
                type="text"
                placeholder="Enter username"
                v-model="username"
                maxlength="30"
              />
            </div>
          </div>

          <div class="field" :class="{ error: !email && submitted }">
            <label>Email</label>
            <div class="ui left icon input">
              <i class="mail icon"></i>
              <input
                id="register-email"
                type="email"
                placeholder="Enter email"
                v-model="email"
                maxlength="254"
              />
            </div>
          </div>

          <div class="field" :class="{ error: !password && submitted }">
            <label>Password</label>
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input
                id="register-password"
                type="password"
                placeholder="Enter password (min 6 characters)"
                v-model="password"
              />
            </div>
          </div>

          <div class="field" :class="{ error: !confirmPassword && submitted }">
            <label>Confirm Password</label>
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input
                id="register-confirm-password"
                type="password"
                placeholder="Confirm password"
                v-model="confirmPassword"
              />
            </div>
          </div>

          <button id="register-submit" class="ui teal button fluid" type="submit">
            <i class="user plus icon"></i> Register
          </button>
        </form>

        <div class="ui divider"></div>

        <p class="center-text">
          Already have an account?
          <router-link to="/login">Login here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '../../helpers/auth';

export default {
  name: 'register',
  data() {
    return {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: '',
      success: '',
      isLoading: false,
      submitted: false,
    };
  },
  methods: {
    async onRegister() {
      this.submitted = true;
      this.error = '';
      this.success = '';

      if (!this.fullName || !this.username || !this.email || !this.password || !this.confirmPassword) {
        this.error = 'Please fill in all fields.';
        return;
      }

      if (this.password.length < 6) {
        this.error = 'Password must be at least 6 characters.';
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match.';
        return;
      }

      // Basic email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.error = 'Please enter a valid email address.';
        return;
      }

      this.isLoading = true;
      try {
        await auth.register({
          fullName: this.fullName,
          username: this.username,
          email: this.email,
          password: this.password,
        });
        this.success = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.$router.push('/login');
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

