const mongoose = require('mongoose');

const { Schema } = mongoose;

const quizResultSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: 'User ID cannot be blank'
        },
        userFullName: {
            type: String,
            required: 'User Full Name is required'
        },
        quiz_id: {
            type: String,
            required: 'Quiz ID is required'
        },
        score: {
            type: Number,
            required: 'Score is required'
        },
        total_questions: {
            type: Number,
            required: 'Total Questions is required',
            default: 10
        },
        time_elapsed_ms: {
            type: Number,
            required: 'Time Elapsed (ms) is required'
        },
        created_date: {
            type: Date,
            default: Date.now
        }
    },
    { collection: 'quiz_results' }
);

module.exports = mongoose.model('QuizResult', quizResultSchema);
