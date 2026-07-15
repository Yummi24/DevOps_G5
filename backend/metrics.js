const client = require('prom-client');

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const messagesTotal = new client.Counter({
  name: 'brainbytes_messages_total',
  help: 'Total number of messages sent in BrainBytes',
  labelNames: ['sender', 'category'],
  registers: [register]
});

const aiResponseDuration = new client.Histogram({
  name: 'brainbytes_ai_response_duration_seconds',
  help: 'Time taken for the AI tutor to generate a response',
  buckets: [0.5, 1, 2, 5, 10, 15],
  registers: [register]
});

const activeSessions = new client.Gauge({
  name: 'brainbytes_active_sessions',
  help: 'Number of currently active BrainBytes chat sessions',
  registers: [register]
});

module.exports = { register, messagesTotal, aiResponseDuration, activeSessions };