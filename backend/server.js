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
app.use(cors());
// app.use('/', (req, res) => {
//     res.send("Group links is working!!")
// })
app.use('/group', GroupRouter);

// db connect
mongoose.connect(MONGO_URI)
    .then( res => console.log("DB connected"))
    .catch( err => console.error(err))

app.listen(PORT, (req, res) => {
    console.log("Server is listening to " + PORT);
})