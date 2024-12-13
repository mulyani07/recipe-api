const jwt = require('jsonwebtoken');
const firestore = require('../config/firestore'); // Impor firestore
const SECRET_KEY = 'Iyansatya07';

module.exports = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Token is required' });

  try {
    // Verifikasi token
    const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY);
    req.user = decoded; // Menyimpan informasi token yang terverifikasi di req.user

    // Ambil informasi lebih lanjut tentang pengguna dari Firestore menggunakan ID
    const userRef = firestore.collection('users').doc(decoded.id.toString());
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'User not found in Firestore' });
    }

    // Menambahkan data Firestore pengguna ke req.user
    req.user.firestoreData = doc.data(); 

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};


