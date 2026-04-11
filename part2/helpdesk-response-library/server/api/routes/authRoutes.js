const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

module.exports = (app) => {
    app.route('/auth/register')
        .post(authController.register);

    app.route('/auth/login')
        .post(authController.login);

    app.route('/auth/profile')
        .get(verifyToken, authController.getProfile);
};
