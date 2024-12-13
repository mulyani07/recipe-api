const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredientIds: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true }
  ],
  instructionIds: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Instruction', required: true }
  ],
  createdAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;