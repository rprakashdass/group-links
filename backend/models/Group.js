
const { timeStamp } = require('console');
const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    groupUrl : {
        type: String,
        required: true,
        unique: true
    },
    chats: [{
        senderName: {
            type: String,
            required: false,
            default: "Anonymous"
        },
        message: {
            type: String
        },
        timeStamp: {
            type: Date,
            default: Date.now
        }
    }],
    adminOnlyChat : {
        type: Boolean,
        default: false
    },
    visits: {
        type: Number,
        required: false,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Group', groupSchema);