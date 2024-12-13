const jwt = require('jsonwebtoken');
const SECRET_KEY = 'Iyansatya07'; // Ganti dengan secret key Anda
const firestore = require('../config/firestore'); // Impor firestore

// Middleware untuk memverifikasi token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Ambil token dari header Authorization
  
  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user; // Simpan data user dari token ke dalam request
    next();  // Lanjutkan ke route yang diminta
  });
};

// Middleware untuk memeriksa apakah user adalah admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You do not have permission to perform this action' });
  }
  next();
};


    // Ambil informasi lebih lanjut tentang pengguna dari Firestore menggunakan ID
    const userRef = firestore.collection('users').doc(decoded.id.toString());
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'User not found in Firestore' });
    }

    // Menambahkan data Firestore pengguna ke req.user
    req.user.firestoreData = doc.data(); 


module.exports = { authenticateToken, isAdmin };
