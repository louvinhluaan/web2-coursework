const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('Users');

// POST /auth/register
exports.register = async (req, res) => {
    try {
        const { username, email, fullName, password, role } = req.body;

        // Check if username already exists
        const existingUser = await User.findOne({ 
            $or: [{ username }, { email }] 
        });
        if (existingUser) {
            const field = existingUser.username === username ? 'Username' : 'Email';
            return res.status(400).json({ message: `${field} already exists.` });
        }

        // Only an admin can create another admin
        let assignedRole = 'staff';
        if (role === 'admin') {
            if (req.user && req.user.role === 'admin') {
                assignedRole = 'admin';
            }
            // Otherwise silently default to staff
        }

        const newUser = new User({
            username,
            email,
            fullName,
            password,
            role: assignedRole,
        });

        const savedUser = await newUser.save();
        res.status(201).json({
            message: 'User registered successfully.',
            user: {
                _id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                fullName: savedUser.fullName,
                role: savedUser.role,
            },
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Username or email already exists.' });
        }
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

// POST /auth/login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful.',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

// GET /auth/profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};
