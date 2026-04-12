const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
            maxlength: [30, 'Username cannot exceed 30 characters'],
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            maxlength: [254, 'Email cannot exceed 100 characters'],
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            maxlength: [150, 'Full name cannot exceed 50 characters'],
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "staff"],
            default: "staff",
            lowercase: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
            lowercase: true,
            index: true,
        },
        created_date: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: 'users' },
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Users', UserSchema);
