<template>
  <div class="form-wrapper" style="max-width: 900px;">
    <div class="page-header" style="margin-bottom: 2em;">
      <div>
        <h1 style="display: inline-block; margin-right: 15px;">Quiz Lobby</h1>
        <button class="ui mini basic button" @click="$router.push('/quiz')">
          <i class="left arrow icon"></i> Back to Hub
        </button>
      </div>
    </div>
    
    <div class="ui stackable grid">
      <!-- Quiz Info Section -->
      <div class="eight wide column">
        <div class="ui segment" style="height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 2em;">
          <div>
            <h2 class="ui header">Issue Code Mastery</h2>
            <p style="font-size: 1.1em; color: #555; line-height: 1.6em; margin-top: 1em;">
              Test your knowledge by matching Issue Codes to exact Response content and vice versa. 
              Only the sharpest Helpdesk staff make it to the top!
            </p>
            <div class="ui list" style="margin-top: 2em; line-height: 2em; color: grey;">
                <div class="item"><i class="stopwatch icon"></i> Speed matters for ranking</div>
                <div class="item"><i class="tasks icon"></i> 10 questions per run</div>
                <div class="item"><i class="trophy icon"></i> Personal best score saved</div>
            </div>
          </div>
          <div style="margin-top: 2em;">
            <button class="ui massive primary fluid button" @click="$router.push('/quiz/play')">
              <i class="play icon"></i> Start Quiz
            </button>
          </div>
        </div>
      </div>

      <!-- Leaderboard Section -->
      <div class="eight wide column">
        <div class="ui segment">
          <h3 class="ui header"><i class="list ol icon"></i>Leaderboard</h3>
          <div v-if="loadingBoard" class="ui active inverted dimmer">
            <div class="ui loader"></div>
          </div>
          <table class="ui very basic table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(entry, index) in leaderboard" :key="index" :class="{'positive': index === 0}">
                <td>
                  <div class="ui ribbon label" :class="{'yellow': index === 0, 'grey': index === 1, 'brown': index === 2}" v-if="index < 3">
                    #{{ index + 1 }}
                  </div>
                  <span v-else style="padding-left: 10px;">#{{ index + 1 }}</span>
                </td>
                <td style="font-weight: bold; max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" :title="entry.userFullName">
                  {{ entry.userFullName }}
                </td>
                <td style="white-space: nowrap;">{{ entry.score }} / 10</td>
                <td style="white-space: nowrap;">{{ formatTime(entry.time_elapsed_ms) }}</td>
              </tr>
              <tr v-if="!loadingBoard && leaderboard.length === 0">
                <td colspan="4" class="center aligned" style="color: grey; padding: 2em;">No scores yet! Be the first!</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { quizApi } from '../../helpers/helpers';

export default {
  name: 'quiz-details',
  data() {
    return {
      leaderboard: [],
      loadingBoard: true
    };
  },
  async mounted() {
    try {
      this.leaderboard = await quizApi.getLeaderboard('issue-code-mastery') || [];
    } catch (e) {
      console.error(e);
    } finally {
      this.loadingBoard = false;
    }
  },
  methods: {
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
