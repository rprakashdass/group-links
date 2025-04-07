require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();

// Environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Routers
const GroupRouter = require('./routes/groupRoutes');
const UserRouter = require('./routes/userRoutes');
const AuthRouter = require('./routes/authRoutes'); // Assuming you have an auth router

// Middleware
app.use(express.json());

// CORS configuration
const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS || '[]');
app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["POST", "PUT", "GET", "DELETE"],
    credentials: true,
}));

// Routes
app.use('/groups', GroupRouter);
app.use('/users', UserRouter);
app.use('/auth', AuthRouter); // For authentication-related routes

// Database connection
mongoose.connect(MONGO_URI)
    .then(() => console.log("DB connected"))
    .catch(err => console.error("DB connection error:", err));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});