const e = require('express');
const { response } = require('express');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ResponseSchema = new Schema(
    {
        issue_code: {
            type: String,
            required: true,
            unique: true,
            // index: true,
        },
        response: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["general", "technical", "billing", "account", "other"],
            default: "general",
            lowercase: true,
            index: true,
        },
        created_date: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
            lowercase: true,
            index: true,
        },
    },
    { collection: 'responses' },
);

module.exports = mongoose.model('Responses', ResponseSchema);