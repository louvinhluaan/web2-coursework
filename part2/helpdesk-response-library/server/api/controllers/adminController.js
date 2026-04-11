const mongoose = require('mongoose');
const Response = mongoose.model('Responses');
const User = mongoose.model('Users');
const Ticket = mongoose.model('Tickets');

// GET /admin/stats
exports.getStats = async (req, res) => {
    try {
        const [
            totalResponses,
            activeResponses,
            inactiveResponses,
            totalUsers,
            totalStaff,
            totalAdmins,
            openTickets,
            totalTickets,
        ] = await Promise.all([
            Response.countDocuments({}),
            Response.countDocuments({ status: 'active' }),
            Response.countDocuments({ status: 'inactive' }),
            User.countDocuments({}),
            User.countDocuments({ role: 'staff' }),
            User.countDocuments({ role: 'admin' }),
            Ticket.countDocuments({ status: 'open' }),
            Ticket.countDocuments({}),
        ]);

        res.json({
            responses: { total: totalResponses, active: activeResponses, inactive: inactiveResponses },
            users: { total: totalUsers, staff: totalStaff, admins: totalAdmins },
            tickets: { total: totalTickets, open: openTickets },
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

// GET /admin/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ created_date: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

// PUT /admin/users/:id
exports.updateUser = async (req, res) => {
    try {
        const { fullName, email, role } = req.body;
        const updateData = {};

        if (fullName) updateData.fullName = fullName;
        if (email) updateData.email = email;
        if (role && ['admin', 'staff'].includes(role)) updateData.role = role;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json({
            message: 'User updated successfully.',
            user,
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email already exists.' });
        }
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};
