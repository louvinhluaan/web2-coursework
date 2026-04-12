const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TicketSchema = new Schema(
    {
        subject: {
            type: String,
            required: true,
            trim: true,
            maxlength: [200, 'Subject cannot exceed 200 characters'],
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxlength: [2000, 'Message cannot exceed 2000 characters'],
        },
        category: {
            type: String,
            enum: ["info_update", "bug_report", "feature_request", "other"],
            default: "other",
            lowercase: true,
        },
        status: {
            type: String,
            enum: ["open", "in_progress", "resolved", "closed", "deleted"],
            default: "open",
            lowercase: true,
            index: true,
        },
        submitted_by: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        admin_reply: {
            type: String,
            trim: true,
            maxlength: [2000, 'Reply cannot exceed 2000 characters'],
        },
        created_date: {
            type: Date,
            default: Date.now,
        },
        updated_date: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: 'tickets' },
);

module.exports = mongoose.model('Tickets', TicketSchema);
