require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const http = require('http');

// Environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Routers
const GroupRouter = require('./routes/groupRoutes');
const UserRouter = require('./routes/userRoutes');
const AuthRouter = require('./routes/authRoutes');

// Initialize Express app
const app = express();

// CORS configuration
const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS || '[]');
const allowedFrontendOrigin = JSON.parse(process.env.ALLOWED_FRONTEND_ORIGINS || '[]');
app.use(cors({
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["POST", "PUT", "GET", "DELETE", "OPTIONS"],
    credentials: true,
}));

app.use(express.json());
// Routes
app.get('/', (req, res) => {
    res.send('Working fine');
});
app.use('/groups', GroupRouter);
app.use('/users', UserRouter);
app.use('/auth', AuthRouter);

// Database connection
mongoose.connect(MONGO_URI)
    .then(() => console.log("DB connected"))
    .catch(err => console.error("DB connection error:", err));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            if (allowedFrontendOrigin.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ["GET", "POST"],
        credentials: true,
    },
});

// WebSocket connection handling
io.on("connection", (socket) => {
    console.log("User connected: ", socket.id);

    socket.on("joinGroup", (groupUrl) => {
        socket.join(groupUrl);
        console.log(`User ${socket.id} joined group: ${groupUrl}`);
    })

    socket.on("leaveGroup", (groupUrl) => {
        socket.leave(groupUrl);
        console.log(`User ${socket.id} leaved from group: ${groupUrl}`);
    })

    socket.on('sendMessage', ({ groupUrl, message }) => {
        console.log(`Message sent to group ${groupUrl}:`, message);
        io.to(groupUrl).emit('newMessage', message);
    });

    socket.on('recieveMessage', (data) => {
        const { groupUrl, ...msg } = data;
        io.to(groupUrl).emit('message', msg);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
    });
});

server.listen(PORT || 3000, () => {
console.log(`Server running on port ${PORT}`);
});