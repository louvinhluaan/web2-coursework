const quizController = require('../controllers/quizController');
const { verifyToken } = require('../middleware/authMiddleware');

module.exports = app => {
    app.route('/api/quiz-results')
       .post(verifyToken, quizController.submit_result);
       
    app.route('/api/quiz-results/:quizId/leaderboard')
       .get(verifyToken, quizController.get_leaderboard);
};
