require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const aiService = require('./aiService');
const client = require('prom-client');

const PORT = process.env.PORT || 3000;

client.collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

aiService.initializeAI();

mongoose.connect(process.env.MONGO_URL || 'mongodb://mongo:27017/brainbytes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});