const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware'); // Mengimpor middleware
const router = express.Router();

const SECRET_KEY = 'Iyansatya07'; // Ganti dengan secret key Anda

// Register
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  
  // Pastikan role default adalah 'user' jika tidak ada role yang diberikan
  const userRole = role || 'user';

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

   // Membuat user dengan role yang dipilih
    const user = new User({
      username,
      email,
      password,
      role: userRole, // Menetapkan role ke user
    });

    // Menyimpan user
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id, // Tambahkan ID pengguna
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role},
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id, // Tambahkan ID pengguna
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET User (Authenticated route)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT User (Update user data)
router.put('/profile', authenticateToken, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (password) {
      // Encrypt password before saving
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Update username and email if provided
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE User (Delete user account)
router.delete('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;


