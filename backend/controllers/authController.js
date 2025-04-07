// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email or username already in use.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    return res.status(201).json({
      message: 'User created successfully.',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      }
    });
  } catch (err) {
    console.error('Create User Error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { createUser };