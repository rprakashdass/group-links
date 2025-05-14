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
      ref: 'Group',
    },
  ],
  groupsVisited: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
  ],
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;