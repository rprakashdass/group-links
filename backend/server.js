require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

// env
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// routers
const GroupRouter = require('./routes/groupRoutes');

app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173", 'http://g.rprakashdass.in'
]
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
app.use('/group', GroupRouter);

// db connect
mongoose.connect(MONGO_URI)
    .then( res => console.log("DB connected"))
    .catch( err => console.error(err))

app.listen(PORT, (req, res) => {
    console.log("Server is listening to " + PORT);
})