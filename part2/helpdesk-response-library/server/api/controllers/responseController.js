const mongoose = require('mongoose');
const Response = mongoose.model('Responses');

// GET /responses — Get all active responses for non-admin
exports.getAllResponses = async (req, res) => {
    try {
        const query = req.query.all === 'true' ? {} : { status: 'active' };
        const responses = await Response.find(query);
        res.json(responses);
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

// POST /responses — Create a new response
exports.createResponse = async (req, res) => {
    try {
        const newResponse = new Response(req.body);
        const response = await newResponse.save();
        res.json(response);
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

// GET /responses/:responseId — Get a single response by ID
exports.getResponseById = async (req, res) => {
    try {
        const response = await Response.findById(req.params.responseId);
        if (!response) {
            return res.status(404).json({ message: 'Response not found.' });
        }
        res.json(response);
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

// PUT /responses/:responseId — Update a response
exports.updateResponse = async (req, res) => {
    try {
        const response = await Response.findOneAndUpdate(
            { _id: req.params.responseId },
            req.body,
            { new: true }
        );
        if (!response) {
            return res.status(404).json({ message: 'Response not found.' });
        }
        res.json(response);
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

// PUT /responses/:responseId/status — Update response status (Admin Only)
exports.updateResponseStatus = async (req, res) => {
    try {
        const allowedStatus = ['active', 'inactive'];
        if (!allowedStatus.includes(req.body.status)) {
            return res.status(400).json({ message: 'Invalid status.' });
        }

        const response = await Response.findByIdAndUpdate(
            req.params.responseId,
            { status: req.body.status },
            { new: true, runValidators: true }
        );
        if (!response) {
            return res.status(404).json({ message: 'Response not found.' });
        }
        res.json({
            message: 'Response status updated successfully.',
            response,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};

// DELETE /responses/:responseId — Soft delete a response
exports.deleteResponse = async (req, res) => {
    try {
        const response = await Response.findByIdAndUpdate(
            req.params.responseId,
            { status: 'inactive' },
            { new: true, runValidators: true }
        );
        if (!response) {
            return res.status(404).json({ message: 'Response not found.' });
        }
        res.json({
            message: 'Response successfully deleted.',
            _id: response._id,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error.', error: err.message });
    }
};