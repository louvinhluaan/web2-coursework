<template>
  <div class="form-wrapper" style="max-width: 700px;">
    <div class="page-header">
      <div>
        <h1 style="display: inline-block; margin-right: 15px;">Issue Code Mastery</h1>
        <button class="ui mini basic button" @click="$router.push('/quiz')"><i class="left arrow icon"></i> Back</button>
      </div>
      <div v-if="gameState !== 'loading' && gameState !== 'error'" class="ui label large teal">
        Score: {{ score }} / 10
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="gameState === 'loading'" class="ui active inverted dimmer">
      <div class="ui text loader">Loading Training Data...</div>
    </div>

    <!-- Error State -->
    <div v-if="gameState === 'error'" class="ui negative message">
      <div class="header">Unable to start quiz</div>
      <p>{{ errorMessage }}</p>
      <button class="ui button" @click="$router.push('/quiz')">Back to Training Hub</button>
    </div>

    <!-- Submitting State -->
    <div v-if="gameState === 'submitting'" class="ui active inverted dimmer">
      <div class="ui text loader">Saving your score...</div>
    </div>

    <!-- Completed State -->
    <div v-if="gameState === 'completed'" class="ui segment center aligned" style="padding: 3em;">
      <div class="ui icon header">
        <i class="trophy icon yellow massive"></i>
        <div class="content" style="margin-top: 15px;">Quiz Completed!</div>
      </div>
      <h2 style="font-size: 3rem; margin-top: 10px;">{{ score }} / 10</h2>
      <p style="color: grey; font-size: 1.2em;">Time: {{ formatTime(timeElapsed) }}</p>
      
      <div style="margin-top: 2em;">
        <button class="ui primary large button" @click="startQuiz"><i class="redo icon"></i> Play Again</button>
        <button class="ui large button" @click="$router.push('/quiz/issue-code-mastery/details')"><i class="list icon"></i> View Leaderboard</button>
      </div>
    </div>

    <!-- Playing State -->
    <div v-if="gameState === 'playing'">
      <!-- Progress Bar -->
      <div class="ui tiny progress success" :data-percent="((questionIndex) / 10) * 100">
        <div class="bar" :style="{ width: ((questionIndex) / 10) * 100 + '%' }"></div>
      </div>
      
      <div class="ui cards" style="width: 100%; justify-content: center; margin-bottom: 1.5em;">
        <div class="card fluid" style="margin: 0;">
          <div class="content center aligned" style="padding: 1.5em;">
            <div class="meta" style="margin-bottom: 0.5em;">Question {{ questionIndex + 1 }} of 10</div>
            
            <div v-if="questionFormat === 'ask_response'">
              <h3 class="ui header grey">Which response matches the Issue Code:</h3>
              <h2 class="ui header blue" style="margin-top: 0.5em; word-wrap: break-word;">{{ currentQuestion.issue_code }}</h2>
            </div>
            
            <div v-if="questionFormat === 'ask_issue_code'">
              <h3 class="ui header grey">What is the Issue Code for this Response:</h3>
              <div class="ui message blue">
                <p style="white-space: pre-wrap; word-break: break-word; text-align: left; font-size: 1.05em; line-height: 1.4">{{ currentQuestion.response }}</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      <div class="ui stackable two column grid">
        <div class="column" v-for="(option, idx) in currentOptions" :key="idx">
          <div 
            class="ui segment option-card" 
            :class="{ 
              'selected': selectedAnswer === idx, 
              'correct': feedbackState !== 'idle' && option._id === currentQuestion._id,
              'wrong': feedbackState !== 'idle' && selectedAnswer === idx && option._id !== currentQuestion._id,
              'disabled': feedbackState !== 'idle'
            }"
            @click="selectOption(idx)"
          >
            <!-- Option text depends on format -->
            <div v-if="questionFormat === 'ask_response'" class="option-content pre-wrap">{{ option.response }}</div>
            <div v-if="questionFormat === 'ask_issue_code'" class="option-content huge-text">{{ option.issue_code }}</div>
            
            <!-- Feedback Icon -->
            <i v-if="feedbackState !== 'idle' && option._id === currentQuestion._id" class="check circle icon green massive status-icon"></i>
            <i v-if="feedbackState !== 'idle' && selectedAnswer === idx && option._id !== currentQuestion._id" class="times circle icon red massive status-icon"></i>
          </div>
        </div>
      </div>

      <div v-if="feedbackState !== 'idle'" class="ui center aligned basic segment" style="margin-top: 2em;">
        <h2 v-if="feedbackState === 'correct'" class="ui green header">Correct!</h2>
        <h2 v-if="feedbackState === 'wrong'" class="ui red header">Incorrect!</h2>
        <button class="ui huge primary button" @click="nextQuestion">
          {{ questionIndex === 9 ? 'Finish Quiz' : 'Next Question' }} <i class="right arrow icon"></i>
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import { api, quizApi } from '../../helpers/helpers';

export default {
  name: 'quiz',
  data() {
    return {
      gameState: 'loading', // 'loading', 'error', 'playing', 'completed'
      errorMessage: '',
      allResponses: [],
      
      score: 0,
      questionIndex: 0,
      
      currentQuestion: null,
      questionFormat: 'ask_response', // 'ask_response' or 'ask_issue_code'
      currentOptions: [],
      
      selectedAnswer: null,
      feedbackState: 'idle', // 'idle', 'correct', 'wrong'
      startTime: 0,
      timeElapsed: 0
    };
  },
  async mounted() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const rawResponses = await api.getResponses();
        this.allResponses = rawResponses;
        
        if (this.allResponses.length < 4) {
          this.gameState = 'error';
          this.errorMessage = 'You need at least 4 responses stored in the library to play the quiz!';
          return;
        }
        
        this.startQuiz();
      } catch (err) {
        this.gameState = 'error';
        this.errorMessage = 'Failed to load data for the quiz. Is the server running?';
      }
    },
    startQuiz() {
      this.score = 0;
      this.questionIndex = 0;
      this.gameState = 'playing';
      this.startTime = Date.now();
      this.generateQuestion();
    },
    generateQuestion() {
      this.selectedAnswer = null;
      this.feedbackState = 'idle';
      
      // Randomly pick question vs answer format
      this.questionFormat = Math.random() > 0.5 ? 'ask_response' : 'ask_issue_code';
      
      // Pick 1 target question
      const targetObj = this.allResponses[Math.floor(Math.random() * this.allResponses.length)];
      this.currentQuestion = targetObj;
      
      // Pick 3 distractors
      const distractors = [];
      while (distractors.length < 3) {
        const candidate = this.allResponses[Math.floor(Math.random() * this.allResponses.length)];
        if (candidate._id !== targetObj._id && !distractors.find(d => d._id === candidate._id)) {
          distractors.push(candidate);
        }
      }
      
      // Mix and shuffle
      const rawOptions = [targetObj, ...distractors];
      this.currentOptions = rawOptions.sort(() => Math.random() - 0.5);
    },
    selectOption(idx) {
      if (this.feedbackState !== 'idle') return; // Lockdown if already answered
      
      this.selectedAnswer = idx;
      const chosenOption = this.currentOptions[idx];
      
      if (chosenOption._id === this.currentQuestion._id) {
        this.feedbackState = 'correct';
        this.score++;
      } else {
        this.feedbackState = 'wrong';
      }
    },
    async nextQuestion() {
      if (this.questionIndex >= 9) {
        const endTime = Date.now();
        this.timeElapsed = endTime - this.startTime;
        await this.submitAndLoadLeaderboard(this.timeElapsed);
      } else {
        this.questionIndex++;
        this.generateQuestion();
      }
    },
    async submitAndLoadLeaderboard(timeMs) {
      this.gameState = 'submitting';
      try {
        await quizApi.submitQuizResult({
          quiz_id: 'issue-code-mastery',
          score: this.score,
          total_questions: 10,
          time_elapsed_ms: timeMs
        });
      } catch (err) {
        console.error("Leaderboard error", err);
      }
      this.gameState = 'completed';
    },
    formatTime(ms) {
      if (!ms) return '0s';
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    }
  }
};
</script>

<style scoped>
.option-card {
  cursor: pointer;
  min-height: 80px;
  padding: 15px !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s ease-in-out;
  border: 2px solid transparent !important;
}
.option-card:hover:not(.disabled) {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
  border-color: #2185d0 !important;
}
.option-card.selected {
  border-color: #2185d0 !important;
  background-color: #f3f9fd;
}
.option-card.correct {
  border-color: #21ba45 !important;
  background-color: #fcfff5;
}
.option-card.wrong {
  border-color: #db2828 !important;
  background-color: #fff6f6;
  opacity: 0.7;
}
.option-card.disabled {
  cursor: default;
}
.option-content {
  width: 100%;
  text-align: center;
  font-size: 1em;
  font-weight: 500;
}
.pre-wrap {
  white-space: pre-wrap;
  word-break: break-word;
  text-align: center;
}
.huge-text {
  font-size: 1.3em;
  color: #2c3e50;
  word-break: break-word;
}
.status-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.2;
  z-index: 0;
  pointer-events: none;
}
.option-content {
  z-index: 1;
}
</style>
