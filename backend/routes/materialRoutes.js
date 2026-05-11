const express = require('express');
const router = express.Router();

const LearningMaterial = require('../models/LearningMaterial');


// CREATE MATERIAL
router.post('/', async (req, res) => {
  try {

    const material = new LearningMaterial({
      subject: req.body.subject,
      topic: req.body.topic,
      content: req.body.content
    });

    await material.save();

    res.status(201).json(material);

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
});


// GET ALL MATERIALS
router.get('/', async (req, res) => {
  try {

    const materials = await LearningMaterial.find();

    res.json(materials);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


// GET MATERIALS BY SUBJECT
router.get('/subject/:subject', async (req, res) => {
  try {

    const materials = await LearningMaterial.find({
      subject: req.params.subject
    });

    res.json(materials);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;