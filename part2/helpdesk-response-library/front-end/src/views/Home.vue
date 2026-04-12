<template>
  <div>
    <!-- Banner -->
    <div class="ui inverted center aligned segment hero-banner">
      <h1 class="ui inverted header">
        Welcome to Helpdesk Response Library
        <div class="sub header">Empowering support agents with quick access to standard responses.</div>
      </h1>
      <button class="ui primary large button" @click="goTo('/responses')">
        Explore Responses <i class="right arrow icon"></i>
      </button>
    </div>

    <!-- Main Content -->
    <div class="ui stackable two column grid" style="margin-top: 1em;">
      <!-- Left Column: About -->
      <div class="column">
        <div class="ui segment about-segment">
          <h2 class="ui header">
            <i class="info circle icon"></i>
            <div class="content">
              About The Platform
            </div>
          </h2>
          <p>
            The Helpdesk Response Library is designed to provide quick and easy access to standard responses for various helpdesk queries. 
            By utilizing our centralized repository, agents can provide consistent, accurate and timely support to users without reinventing the wheel for every ticket.
          </p>
          <p>
            Whether you are an administrator managing system data or an agent aiming to boost your resolution speed, this tool is built to streamline your workflow and support your continuous learning.
          </p>
        </div>
      </div>

      <!-- Right Column: Quick Links / Features -->
      <div class="column">
        <div class="ui segment">
          <h2 class="ui header">
            <i class="bolt icon"></i>
            <div class="content">
              Quick Highlights
            </div>
          </h2>
          <div class="ui relaxed divided list">
            <div class="item">
              <i class="large archive middle aligned icon text-primary"></i>
              <div class="content">
                <a class="header" @click="goTo('/responses')">Centralized Responses</a>
                <div class="description">Browse and search approved templates for common IT and support issues.</div>
              </div>
            </div>
            <div class="item">
              <i class="large graduation cap middle aligned icon text-primary"></i>
              <div class="content">
                <a class="header" @click="goTo('/quiz')">Interactive Training</a>
                <div class="description">Test your knowledge and stay sharp with our categorized quizzes.</div>
              </div>
            </div>
            <div class="item">
              <i class="large ticket middle aligned icon text-primary"></i>
              <div class="content">
                <a class="header" @click="goTo('/tickets')">My Tickets</a>
                <div class="description">Keep track of your assigned support requests efficiently.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'home',
  methods: {
    goTo(route) {
      if (this.$route.path !== route) {
        this.$router.push(route);
      }
    }
  }
};
</script>

<style scoped>
.hero-banner {
  padding: 4em 2em;
  background-color: #2c3e50;
  border-radius: 8px;
  background-image: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  margin-bottom: 2em;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.hero-banner h1.header {
  font-size: 2.5em;
  margin-bottom: 1em;
}

.hero-banner .sub.header {
  font-size: 0.6em;
  margin-top: 0.5em;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.4;
}

.about-segment {
  height: 100%;
}

.about-segment p {
  font-size: 1.1em;
  line-height: 1.6;
  color: #444;
}

.text-primary {
  color: #2185d0 !important;
}

.ui.list .item {
  display: flex !important;
  align-items: flex-start;
  padding: 1.2em 0;
}

.ui.list .item i.icon {
  flex-shrink: 0;
  width: 40px !important;
  text-align: center;
  margin-right: 10px;
  line-height: 1.2;
}

.ui.list .item .content {
  flex-grow: 1;
  padding-left: 0 !important;
}

.ui.list .item .header {
  font-size: 1.2em;
  cursor: pointer;
  color: #2185d0;
  transition: color 0.2s ease;
  margin-bottom: 0.2em;
  display: inline-block;
}

.ui.list .item .header:hover {
  color: #1678c2;
  text-decoration: underline;
}

.ui.list .item .description {
  margin-top: 0.4em;
  color: #666;
  font-size: 1.05em;
}
</style>

