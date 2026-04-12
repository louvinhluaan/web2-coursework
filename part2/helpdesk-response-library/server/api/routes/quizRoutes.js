const quizController = require('../controllers/quizController');
const { verifyToken } = require('../middleware/authMiddleware');

module.exports = (app) => {
    app.route('/quiz-results')
        .post(verifyToken, quizController.submitResult);

    app.route('/quiz-results/:quizId/leaderboard')
        .get(verifyToken, quizController.getLeaderboard);
};
