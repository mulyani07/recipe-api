const express = require('express');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');
const Recipe = require('../models/recipe');
const Ingredient = require('../models/ingredient');
const Instruction = require('../models/instruction');
const router = express.Router();

// GET Semua Resep (Untuk User)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const recipes = await Recipe.find()
    .populate({
      path: 'ingredientIds',
      select: 'name quantity -_id', // Menampilkan field name dan quantity, sembunyikan _id
    })
    .populate({
      path: 'instructionIds',
      select: 'step -_id', // Menampilkan field step, sembunyikan _id
    });

    // Format respons agar lebih mudah dibaca
    const formattedRecipes = recipes.map((recipe) => ({
      id: recipe._id, // Menambahkan ID resep
      title: recipe.title,
      ingredients: recipe.ingredientIds, // Detail ingredients
      instructions: recipe.instructionIds, // Detail instructions
      createdAt: recipe.createdAt,
    }));

    res.json({ recipes: formattedRecipes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new recipe by combining ingredients and instructions
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { title, ingredientIds, instructionIds } = req.body;
  
  try {
    // Membuat resep baru
    const recipe = new Recipe({
      title,
      ingredientIds,
      instructionIds,
    });

    await recipe.save();

    // Populating ingredientIds dan instructionIds dengan data terkait
    const populatedRecipe = await Recipe.findById(recipe._id)
      .populate({
        path: 'ingredientIds',
        select: 'name quantity -_id',  // Pilih field name dan quantity, hilangkan _id
      })
      .populate({
        path: 'instructionIds',
        select: 'steps -_id',  // Pilih field steps, hilangkan _id
      });

    res.status(201).json({
      message: 'Recipe created successfully',
      recipe: {
        id: populatedRecipe._id, // Menambahkan ID resep
        title: populatedRecipe.title,
        ingredients: populatedRecipe.ingredientIds,
        instructions: populatedRecipe.instructionIds,
        createdAt: populatedRecipe.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT Resep (Hanya untuk Admin)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { title, ingredientIds, instructionIds } = req.body;

  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { title, ingredientIds, instructionIds },
      { new: true }
    );

    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    res.json({ message: 'Recipe updated successfully', recipe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE Resep (Hanya untuk Admin)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

