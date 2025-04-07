const express = require('express');
const Group = require('../models/Group');
const router = express.Router();

// Get group details by groupUrl
router.get('/:groupUrl', async (req, res) => {
    try {
        const group = await Group.findOne({ groupUrl: req.params.groupUrl }).populate('admin', 'username email');
        if (!group) {
            return res.status(404).json({ message: "No group found!" });
        }
        res.status(200).json(group);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Check if a group exists by groupUrl
router.get('/exists/:groupUrl', async (req, res) => {
    try {
        const group = await Group.findOne({ groupUrl: req.params.groupUrl });
        if (!group) {
            return res.status(202).send(false);
        }
        return res.status(200).send(group);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Add a group to the user's visited groups
router.post('/:userId/visit/:groupId', async (req, res) => {
    try {
        const { userId, groupId } = req.params;

        const group = await Group.findById(groupId);

        if (!user || !group) {
            return res.status(404).json({ message: "User or Group not found!" });
        }

        // Add the group to the user's visited groups if not already present
        if (!user.groupsVisited.includes(groupId)) {
            user.groupsVisited.push(groupId);
            await user.save();
        }

        res.status(200).json({ message: "Group added to user's visited groups." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



// Create a new group
router.post('/create-group', async (req, res) => {
    try {
        const { name, groupUrl, adminId, adminOnlyChat, autoDeleteAfter, groupType } = req.body;

        // Check if the group URL already exists
        const group = await Group.findOne({ groupUrl });
        if (group) {
            return res.status(400).json({ message: "Group URL already exists. Choose a different one." });
        }

        // Create a new group
        const newGroup = new Group({
            name,
            groupUrl,
            admin: adminId,
            adminOnlyChat,
            autoDeleteAfter,
            groupType,
            chats: [],
        });

        await newGroup.save();
        res.status(201).json({ message: "Group created successfully", group: newGroup });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Send a message to a group
router.post('/:groupUrl/send-message', async (req, res) => {
    try {
        const { senderName, message } = req.body;
        const groupUrl = req.params.groupUrl;

        const group = await Group.findOne({ groupUrl });
        if (!group) {
            return res.status(404).json({ message: "Group URL doesn't exist.", groupUrl });
        }

        // Check if admin-only chat is enabled
        if (group.adminOnlyChat && senderName !== group.admin.username) {
            return res.status(403).json({ message: "Only the admin can send messages in this group." });
        }

        group.chats.push({ senderName, message });
        await group.save();

        const lastChat = group.chats.at(-1);
        res.status(200).json(lastChat);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Check if a group should be auto-deleted
router.get('/:groupUrl/should-auto-delete', async (req, res) => {
    try {
        const group = await Group.findOne({ groupUrl });
        if (!group) {
            return res.status(404).json({ message: "Group URL doesn't exist.", groupUrl });
        }

        const shouldDelete = group.shouldAutoDelete();
        res.status(200).json({ shouldDelete });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get groups visited by a user
router.get('/visited/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Find groups where the user has visited
        const groups = await Group.find({ 'usersVisited.userId': userId });
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// Get groups created by a user
router.get('/created/:adminId', async (req, res) => {
    try {
        const { adminId } = req.params;

        // Find groups where the user is the admin
        const groups = await Group.find({ admin: adminId });
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;