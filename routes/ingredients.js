const express = require('express');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');
const Ingredient = require('../models/ingredient'); // Pastikan path ke model benar
const router = express.Router();

// Create a new ingredient
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { name, quantity } = req.body;
  const ingredient = new Ingredient({ name, quantity });
  try {
    const newIngredient = await ingredient.save();
    res.status(201).json(newIngredient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Bulk insert ingredients
router.post('/bulk', authenticateToken, isAdmin, async (req, res) => {
    const ingredients = req.body.ingredients;
  
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ message: 'Ingredients should be an array' });
    }
  
    try {
      // Simpan banyak bahan sekaligus dengan insertMany()
      const newIngredients = await Ingredient.insertMany(ingredients);
  
      res.status(201).json(newIngredients);  // Kembalikan bahan yang baru saja disimpan
    } catch (err) {
      res.status(500).json({ message: 'Failed to insert ingredients', error: err.message });
    }
  });

// Get all ingredients (tambahkan ini untuk pengujian GET)
// GET Semua Ingredients (Untuk User)
router.get('/', authenticateToken, async (req, res) => {
    try {
      const ingredients = await Ingredient.find();
      res.json({ ingredients });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Update an ingredient by ID (PUT)
router.put('/:id',authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, quantity } = req.body;
  
    try {
      const updatedIngredient = await Ingredient.findByIdAndUpdate(
        id,
        { name, quantity },
        { new: true, runValidators: true } // Kembalikan dokumen yang diperbarui dan validasi input
      );
  
      if (!updatedIngredient) {
        return res.status(404).json({ message: 'Ingredient not found' });
      }
  
      res.json(updatedIngredient);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Delete an ingredient by ID (DELETE)
  router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedIngredient = await Ingredient.findByIdAndDelete(id);
  
      if (!deletedIngredient) {
        return res.status(404).json({ message: 'Ingredient not found' });
      }
  
      res.json({ message: 'Ingredient deleted successfully', ingredient: deletedIngredient });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

module.exports = router;
