require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const aiService = require('./aiService');
const client = require('prom-client');

const PORT = process.env.PORT || 3000;

// --- Prometheus Metrics Setup ---
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Counter — total messages sent (tracks user vs AI messages and subject category)
const messagesTotal = new client.Counter({
  name: 'brainbytes_messages_total',
  help: 'Total number of messages sent in BrainBytes',
  labelNames: ['sender', 'category'],
  registers: [register]
});

// Histogram — AI response time in seconds
const aiResponseDuration = new client.Histogram({
  name: 'brainbytes_ai_response_duration_seconds',
  help: 'Time taken for the AI tutor to generate a response',
  buckets: [0.5, 1, 2, 5, 10, 15],
  registers: [register]
});

// Gauge — active chat sessions currently open
const activeSessions = new client.Gauge({
  name: 'brainbytes_active_sessions',
  help: 'Number of currently active BrainBytes chat sessions',
  registers: [register]
});

// Expose metrics to Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Export metrics so controllers can use them
module.exports.messagesTotal = messagesTotal;
module.exports.aiResponseDuration = aiResponseDuration;
module.exports.activeSessions = activeSessions;

// --- Initialize AI model ---
aiService.initializeAI();

// --- Connect to MongoDB ---
mongoose.connect(process.env.MONGO_URL || 'mongodb://mongo:27017/brainbytes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

// --- Start the server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});
