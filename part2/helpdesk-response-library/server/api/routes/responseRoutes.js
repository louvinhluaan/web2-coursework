const responseController = require('../controllers/responseController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

module.exports = (app) => {
    app
        .route('/responses')
        .get(verifyToken, responseController.getAllResponses)
        .post(verifyToken, isAdmin, responseController.createResponse);
        
    app
        .route('/responses/:responseId')
        .get(verifyToken, responseController.getResponseById)
        .put(verifyToken, isAdmin, responseController.updateResponse)
        .delete(verifyToken, isAdmin, responseController.deleteResponse);

    app.route('/responses/:responseId/status')
        .put(verifyToken, isAdmin, responseController.updateResponseStatus);
};