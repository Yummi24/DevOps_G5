const express = require('express');
const router = express.Router();

const User = require('../models/User');


// CREATE USER
router.post('/', async (req, res) => {
  try {

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      preferredSubjects: req.body.preferredSubjects
    });

    await user.save();

    res.status(201).json(user);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// GET ALL USERS
router.get('/', async (req, res) => {
  try {

    const users = await User.find();

    res.json(users);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET ONE USER
router.get('/:id', async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE USER
router.put('/:id', async (req, res) => {
  try {

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedUser);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// DELETE USER
router.delete('/:id', async (req, res) => {
  try {

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: 'User deleted successfully'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;