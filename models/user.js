const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    minlength: [3, 'Username should be at least 3 characters'],
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'], // Regex untuk validasi email
  },
  password: { 
    type: String, 
    required: true,
    minlength: [6, 'Password should be at least 6 characters'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user' // default ke user
  },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook untuk hashing password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err); // Menangani error dalam proses hashing
  }
});

module.exports = mongoose.model('User', userSchema);