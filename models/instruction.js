const mongoose = require('mongoose');

const instructionSchema = new mongoose.Schema({
  steps: {
    type: [String], // Array of strings untuk menyimpan langkah-langkah
    required: true, // Harus ada
  },
});

module.exports = mongoose.model('Instruction', instructionSchema);
