const express = require('express');
const Instruction = require('../models/instruction');
const router = express.Router();

// Create a new instruction
router.post('/', async (req, res) => {
  const { step, description } = req.body;
  const instruction = new Instruction({ step, description });
  try {
    const newInstruction = await instruction.save();
    res.status(201).json(newInstruction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create multiple instructions (bulk)
router.post('/bulk', async (req, res) => {
    try {
      const instructions = req.body; // Array of instructions
      if (!Array.isArray(instructions) || instructions.length === 0) {
        return res.status(400).json({ message: 'Request body must be an array of instructions.' });
      }
  
      const savedInstructions = await Instruction.insertMany(instructions);
      res.status(201).json({ message: 'Instructions added successfully!', data: savedInstructions });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Get all instructions
  router.get('/', async (req, res) => {
    try {
      const instructions = await Instruction.find();
      res.json(instructions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Get a single instruction by ID
  router.get('/:id', async (req, res) => {
    try {
      const instruction = await Instruction.findById(req.params.id);
      if (!instruction) {
        return res.status(404).json({ message: 'Instruction not found' });
      }
      res.json(instruction);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Update an instruction
  router.put('/:id', async (req, res) => {
    try {
      const { step, description } = req.body;
      const updatedInstruction = await Instruction.findByIdAndUpdate(
        req.params.id,
        { step, description },
        { new: true }
      );
  
      if (!updatedInstruction) {
        return res.status(404).json({ message: 'Instruction not found' });
      }
  
      res.json(updatedInstruction);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Delete an instruction
  router.delete('/:id', async (req, res) => {
    try {
      const deletedInstruction = await Instruction.findByIdAndDelete(req.params.id);
      if (!deletedInstruction) {
        return res.status(404).json({ message: 'Instruction not found' });
      }
  
      res.json({ message: 'Instruction deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

module.exports = router;
