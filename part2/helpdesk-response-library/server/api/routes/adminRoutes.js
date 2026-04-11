const adminController = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

module.exports = (app) => {
    app.route('/admin/stats')
        .get(verifyToken, isAdmin, adminController.getStats);

    app.route('/admin/users')
        .get(verifyToken, isAdmin, adminController.getAllUsers);

    app.route('/admin/users/:id')
        .put(verifyToken, isAdmin, adminController.updateUser);
};
