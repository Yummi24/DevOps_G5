const mongoose = require('mongoose');

const learningMaterialSchema = new mongoose.Schema({

  subject: {
    type: String,
    required: true
  },

  topic: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model(
  'LearningMaterial',
  learningMaterialSchema
);