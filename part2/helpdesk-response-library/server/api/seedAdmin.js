const mongoose = require('mongoose');
const User = mongoose.model('Users');

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ username: 'admin' });
        if (!adminExists) {
            const admin = new User({
                username: 'admin',
                email: 'admin@helpdesk.com',
                fullName: 'System Administrator',
                password: 'admin123',
                role: 'admin',
            });
            await admin.save();
            console.log('Default admin account created');
        } else {
            console.log('Admin account already exists, skipping seed.');
        }
    } catch (err) {
        console.error('Error seeding admin account:', err.message);
    }
};

module.exports = seedAdmin;
