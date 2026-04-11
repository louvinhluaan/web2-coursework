const mongoose = require('mongoose');
const Ticket = mongoose.model('Tickets');

// POST /tickets — Create a new ticket
exports.createTicket = async (req, res) => {
    try {
        const { subject, message, category } = req.body;

        if (!subject || !message) {
            return res.status(400).json({ message: 'Subject and message are required.' });
        }

        const ticket = new Ticket({
            subject,
            message,
            category: category || 'other',
            submitted_by: req.user.id,
        });

        const savedTicket = await ticket.save();
        const populated = await Ticket.findById(savedTicket._id).populate('submitted_by', 'username fullName email');

        res.status(201).json({
            message: 'Ticket created successfully.',
            ticket: populated,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

// GET /tickets/mytickets — Get tickets submitted by current user
exports.getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ submitted_by: req.user.id })
            .populate('submitted_by', 'username fullName')
            .sort({ created_date: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

// GET /tickets — Get all tickets (admin only)
exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({})
            .populate('submitted_by', 'username fullName email')
            .sort({ created_date: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

// GET /tickets/:id — Get ticket by ID
exports.getTicketById = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('submitted_by', 'username fullName email');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found.' });
        }

        // Staff can only view their own tickets
        if (req.user.role !== 'admin' && ticket.submitted_by._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied.' });
        }

        res.json(ticket);
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

// PUT /tickets/:id/status — Update ticket status + reply (admin only)
exports.updateTicketStatus = async (req, res) => {
    try {
        const { status, admin_reply } = req.body;
        const allowedStatus = ['open', 'in_progress', 'resolved', 'closed'];

        if (status && !allowedStatus.includes(status)) {
            return res.status(400).json({ message: 'Invalid status.' });
        }

        const updateData = { updated_date: Date.now() };
        if (status) updateData.status = status;
        if (admin_reply !== undefined) updateData.admin_reply = admin_reply;

        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('submitted_by', 'username fullName email');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found.' });
        }

        res.json({
            message: 'Ticket updated successfully.',
            ticket,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};
