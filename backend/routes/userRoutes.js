const express = require('express');
const User = require('../models/User');
const Group = require('../models/Group');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { createUser } = require('../controllers/authController');
const { getUserGroups } = require("../controllers/userController");
const linkPreviewController = require('../controllers/linkPreviewController');

// Place link preview route FIRST
router.get('/link-preview', linkPreviewController.getLinkPreview);

// Get user details by user ID
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('groupsCreated groupsVisited', 'name groupUrl');
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post('/create-group', async (req, res) => {
    const { name, groupUrl, admin, adminOnlyChat, autoDeleteAfter, groupType } = req.body;

    if (!admin) {
        return res.status(400).json({ message: 'Admin ID is required.' });
    }

    try {
        const group = new Group({
            name,
            groupUrl,
            admin,
            adminOnlyChat,
            autoDeleteAfter,
            groupType,
        });

        const user = await User.findById(admin);
        user.groupsCreated = group;

        await group.save();
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


// Get all groups created by a user
router.get('/:userId/groups-created', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('groupsCreated', 'name groupUrl');
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json(user.groupsCreated);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Get all groups visited by a user
router.get('/:userId/groups-visited', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('groupsVisited', 'name groupUrl');
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        res.status(200).json(user.groupsVisited);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// POST /users/:userId/visit/:groupId
router.post('/:userId/visit/:groupId', async (req, res) => {
    try {
        const { userId, groupId } = req.params;

        const user = await User.findById(userId);
        const group = await Group.findById(groupId);

        if (!user || !group) {
            return res.status(404).json({ message: "User or Group not found!" });
        }

        if (!user.groupsVisited.includes(groupId)) {
            user.groupsVisited.push(groupId);
            await user.save();
        }

        res.status(200).json({ message: "Group added to user's visited groups." });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post('/create-user', createUser);
router.get("/:userId/groups", getUserGroups);

module.exports = router;