require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const materialRoutes = require('./routes/materialRoutes');
const chatRoutes = require('./routes/chatRoutes');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const aiService = require('./aiService');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/api/users', userRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/chat', chatRoutes);

// API Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the BrainBytes API' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});


// Initialize AI model
aiService.initializeAI();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://mongo:27017/brainbytes', {
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
