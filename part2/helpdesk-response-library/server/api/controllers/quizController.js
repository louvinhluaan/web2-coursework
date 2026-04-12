const mongoose = require('mongoose');
const QuizResult = mongoose.model('QuizResult');
const User = mongoose.model('Users');

// POST /quiz-results — Submit a quiz result
exports.submitResult = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const newResult = new QuizResult({
            user_id: req.user.id,
            userFullName: user.fullName,
            quiz_id: req.body.quiz_id,
            score: req.body.score,
            total_questions: req.body.total_questions || 10,
            time_elapsed_ms: req.body.time_elapsed_ms
        });

        const result = await newResult.save();
        res.status(201).json({ message: 'Quiz result saved successfully.', result });
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

// GET /quiz-results/:quizId/leaderboard — Get top 10 unique players
exports.getLeaderboard = async (req, res) => {
    try {
        const quizId = req.params.quizId;

        const leaderboard = await QuizResult.aggregate([
            { $match: { quiz_id: quizId } },
            // Sort initially so the first document in the group is the best attempt
            { $sort: { score: -1, time_elapsed_ms: 1 } },
            // Group by user_id to ensure unique players, taking their best score
            {
                $group: {
                    _id: "$user_id",
                    userFullName: { $first: "$userFullName" },
                    score: { $first: "$score" },
                    time_elapsed_ms: { $first: "$time_elapsed_ms" },
                    created_date: { $first: "$created_date" }
                }
            },
            // Sort the grouped results globally to make the leaderboard
            { $sort: { score: -1, time_elapsed_ms: 1 } },
            // Limit to Top 10
            { $limit: 10 }
        ]);

        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};
