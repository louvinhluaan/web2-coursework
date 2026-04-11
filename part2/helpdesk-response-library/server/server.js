require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Models
global.Response = require('./api/models/responseModel');
require('./api/models/userModel');
require('./api/models/ticketModel');

// Routes
const responseRoutes = require('./api/routes/responseRoutes');
const authRoutes = require('./api/routes/authRoutes');
const adminRoutes = require('./api/routes/adminRoutes');
const ticketRoutes = require('./api/routes/ticketRoutes');

// Seed
const seedAdmin = require('./api/seedAdmin');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => {
        console.log("MongoDB connected");
        // Seed default admin account on first startup
        seedAdmin();
    })
    .catch(err => console.log(err));

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

authRoutes(app);
responseRoutes(app);
adminRoutes(app);
ticketRoutes(app);

app.listen(port);
app.use((req, res) => {
    res.status(404).send({ url: `${req.originalUrl} not found` });
});
console.log(`Server started on port ${port}`);