<template>
  <div class="form-wrapper" style="max-width: 1000px;">
    <div class="page-header" style="margin-bottom: 2em; display: flex; flex-direction: column; align-items: flex-start;">
      <h1>Training Hub</h1>
      <p style="color: grey; margin-top: 5px;">Select a module to test your knowledge</p>
    </div>

    <div class="ui three stackable cards" style="margin-top: 1em;">
      
      <!-- Active Quiz: Issue Code Mastery -->
      <div class="card">
        <div class="content">
          <div class="header">Issue Code Mastery</div>
          <div class="meta" style="margin-top: 0.5em;">
            <span class="ui green mini label">Active</span>
          </div>
          <div class="description" style="margin-top: 1em; min-height: 80px;">
            Test your knowledge by matching Issue Codes to exact Response content and vice versa. 
          </div>
        </div>
        <div class="ui bottom attached primary button" style="background-color: #2185d0; color: white;" tabindex="0" @click="$router.push('/quiz/play')">
          <i class="play icon"></i>
          Start Quiz
        </div>
      </div>

      <!-- Under Construction -->
      <div class="card">
        <div class="content">
          <div class="header">Categorization Basics</div>
          <div class="meta" style="margin-top: 0.5em;">
             <span class="ui orange mini label">Coming Soon</span>
          </div>
          <div class="description" style="margin-top: 1em; color: grey; min-height: 80px;">
            Practice assigning the correct logical Categories to abstract user help requests.
          </div>
        </div>
        <div class="ui bottom attached disabled button">
          <i class="lock icon"></i>
          Locked
        </div>
      </div>

      <!-- Under Construction -->
      <div class="card">
        <div class="content">
          <div class="header">Support Scenarios</div>
          <div class="meta" style="margin-top: 0.5em;">
             <span class="ui orange mini label">Coming Soon</span>
          </div>
          <div class="description" style="margin-top: 1em; color: grey; min-height: 80px;">
            Read simulated user ticket messages and prescribe the perfect response text template.
          </div>
        </div>
        <div class="ui bottom attached disabled button">
          <i class="lock icon"></i>
          Locked
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'quiz-dashboard'
};
</script>

<style scoped>
.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
  transition: transform 0.2s ease-in-out;
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}
</style>
