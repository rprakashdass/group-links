const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    groupUrl: {
        type: String,
        required: true,
        unique: true,
    },
    chats: [{
        senderName: {
            type: String,
            required: false,
            default: "Anonymous",
        },
        message: {
            type: String,
        },
        timeStamp: {
            type: Date,
            default: Date.now,
        },
    }],
    adminOnlyChat: {
        type: Boolean,
        default: false,
    },
    visits: {
        type: Number,
        required: false,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: false,
    },
    autoDeleteAfter: {
        type: Number, // Time in hours after which the group will be deleted
        required: false,
        default: null, // Null means no auto-delete
    },
    usersVisited: [{
        ipAddress: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Optional reference to a registered user
            required: false,
        },
        visitTime: {
            type: Date,
            default: Date.now,
        },
    }],
    groupType: {
        type: String,
        enum: ['strict', 'link-only'], // 'strict' requires registration, 'link-only' allows unregistered users
        required: true,
        default: 'strict',
    },
});

groupSchema.methods.shouldAutoDelete = function () {
    if (this.autoDeleteAfter) {
        const expirationTime = new Date(this.createdAt);
        expirationTime.setHours(expirationTime.getHours() + this.autoDeleteAfter);
        return new Date() > expirationTime;
    }
    return false;
};

module.exports = mongoose.model('Group', groupSchema);