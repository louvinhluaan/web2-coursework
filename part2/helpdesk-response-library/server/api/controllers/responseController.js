const { response } = require('express');
const mongoose = require('mongoose');
const Response = mongoose.model('Responses');

exports.getAllResponses = (req, res) => {
    // If request has query ?all=true from Admin, get all. Otherwise, get only active responses
    // Response.find({}, (err, responses) => {
    const query = req.query.all === 'true' ? {} : { status: 'active' };
    
    Response.find(query, (err, responses) => {
        if (err) res.send(err);
        res.json(responses);
    });
};

exports.createResponse = (req, res) => {
    const newResponse = new Response(req.body);
    newResponse.save((err, response) => {
        if (err) res.send(err);
        res.json(response);
    });
};

exports.getResponseById = (req, res) => {
    Response.findById(req.params.responseId, (err, response) => {
        if (err) res.send(err);
        res.json(response);
    });
};

exports.updateResponse = (req, res) => {
    Response.findOneAndUpdate(
        { _id: req.params.responseId },
        req.body,
        { new: true },
        (err, response) => {
            if (err) res.send(err);
            res.json(response);
        }
    );
};

// Admin Only
exports.updateResponseStatus = (req, res) => {
    try {
        const allowedStatus = ["active", "inactive"];
        if (!allowedStatus.includes(req.body.status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        Response.findByIdAndUpdate(
            req.params.responseId,
            { status: req.body.status },
            { new: true, runValidators: true },
            (err, response) => {
                if (err) res.send(err);
                res.json({
                    message: 'Response status updated successfully',
                    response: response,
                });
            }
        );
    } catch (err) {
        res.status(500).send(err);
    }
};

// Soft Delete
exports.deleteResponse = (req, res) => {
    Response.findByIdAndUpdate(
        req.params.responseId,
        { status: 'inactive' },
        { new: true, runValidators: true },
        (err, response) => {
            if (err) return res.status(500).send(err);
            if (!response) {
                return res.status(404).json({ message: "Response not found" });
            }
            res.json({ 
                message: 'Response successfully deleted (soft delete)',
                _id: response._id,
            });
        }
    );

    //     Response.remove({ _id: req.params.responseId }, (err, response) => {
    //     if (err) res.send(err);
    //     res.json({ 
    //         message: 'Response successfully deleted',
    //         _id: req.params.responseId,
    //     });
    // });
};