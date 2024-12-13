// firebase/firestore.js
const { Firestore } = require('@google-cloud/firestore');

// Inisialisasi Firestore dengan projectId dan kredensial
const firestore = new Firestore({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,  // Ganti dengan ID project Anda
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,  // Path ke file kredensial
});

module.exports = firestore;
