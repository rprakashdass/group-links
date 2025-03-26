const express = require('express');
const Group = require('../models/Group');
const router = express.Router();

router.get('/:groupUrl', async (req, res) => {
    try {
        const group = await Group.findOne({ groupUrl: req.params.groupUrl });
        if (!group) {
            return res.status(404).json({ message: "No group found!" });
        }
        res.status(200).json(group);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.post('/create-group', async (req, res) => {
    try{
        const { name, groupUrl } = req.body;
        const group = await Group.findOne({groupUrl});
        if(group){
            return res.status(404).json({message: "Group Url already exists. Choose a different one."})
        }
        const newGroup = new Group({
            name, groupUrl, chats: []
        })
        await newGroup.save();
        res.status(201).json({ message: "Group created successfully", group: newGroup });
    } catch (error){
        res.status(500).json({message: "Server error", error: error.message})
    }
})

router.post('/:groupUrl/send-message', async (req, res) => {
    try{
        const { senderName, message } = req.body;
        const group = await Group.findOne({ groupUrl: req.params.groupUrl });
        if(!group){
            return res.status(400).json({message: "Group Url does'nt exists."})
        }
        group.chats.push({senderName, message});
        await group.save();
        res.status(200).json({ message: "Message sent!", chat: group.chats });
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
})

module.exports = router;