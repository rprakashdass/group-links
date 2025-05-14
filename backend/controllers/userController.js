const User = require('../models/User');

const getUserGroups = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('groupsVisited');

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ groups: user.groupsVisited });
  } catch (err) {
    console.error("Error fetching groups:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getUserGroups };