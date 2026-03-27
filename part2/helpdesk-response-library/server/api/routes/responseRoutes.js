const helpdeskResponseLibrary = require('../controllers/responseController');
module.exports = (app) => {
    app
        .route('/responses')
        .get(helpdeskResponseLibrary.getAllResponses)
        .post(helpdeskResponseLibrary.createResponse);
        
    app
        .route('/responses/:responseId')
        .get(helpdeskResponseLibrary.getResponseById)
        .put(helpdeskResponseLibrary.updateResponse)
        .delete(helpdeskResponseLibrary.deleteResponse);

    app.route('/responses/:responseId/status')
        .put(helpdeskResponseLibrary.updateResponseStatus);
};