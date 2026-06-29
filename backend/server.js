require('dotenv').config();

const app = require('./app');

const mongoose = require('mongoose');
const aiService = require('./aiService');


const PORT = process.env.PORT || 3000;



// Initialize AI model
aiService.initializeAI();

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/brainbytes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
