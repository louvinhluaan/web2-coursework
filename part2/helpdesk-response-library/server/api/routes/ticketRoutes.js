const ticketController = require('../controllers/ticketController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

module.exports = (app) => {
    app.route('/tickets')
        .post(verifyToken, ticketController.createTicket)
        .get(verifyToken, isAdmin, ticketController.getAllTickets);

    app.route('/tickets/mytickets')
        .get(verifyToken, ticketController.getMyTickets);

    app.route('/tickets/:id')
        .get(verifyToken, ticketController.getTicketById);

    app.route('/tickets/:id/status')
        .put(verifyToken, isAdmin, ticketController.updateTicketStatus);
};
