const helpdeskResponseLibrary = require('../controllers/responseController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

module.exports = (app) => {
    app
        .route('/responses')
        .get(verifyToken, helpdeskResponseLibrary.getAllResponses)
        .post(verifyToken, isAdmin, helpdeskResponseLibrary.createResponse);
        
    app
        .route('/responses/:responseId')
        .get(verifyToken, helpdeskResponseLibrary.getResponseById)
        .put(verifyToken, isAdmin, helpdeskResponseLibrary.updateResponse)
        .delete(verifyToken, isAdmin, helpdeskResponseLibrary.deleteResponse);

    app.route('/responses/:responseId/status')
        .put(verifyToken, isAdmin, helpdeskResponseLibrary.updateResponseStatus);
};