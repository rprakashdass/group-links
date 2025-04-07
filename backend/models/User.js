const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the User schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  groupsCreated: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Group', // Assuming there is a Group model
    },
  ],
  groupsVisited: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Group', // Assuming there is a Group model
    },
  ],
}, { timestamps: true });

// Create and export the User model
const User = mongoose.model('User', UserSchema);
module.exports = User;