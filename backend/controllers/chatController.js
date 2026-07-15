const Message = require('../models/Message');
const aiService = require('../aiService');
const client = require('prom-client');

// Use default registry
const messagesTotal = new client.Counter({
  name: 'brainbytes_messages_total',
  help: 'Total number of messages sent in BrainBytes',
  labelNames: ['sender', 'category'],
  registers: [client.register]
});

const aiResponseDuration = new client.Histogram({
  name: 'brainbytes_ai_response_duration_seconds',
  help: 'Time taken for the AI tutor to generate a response',
  buckets: [0.5, 1, 2, 5, 10, 15],
  registers: [client.register]
});

const activeSessions = new client.Gauge({
  name: 'brainbytes_active_sessions',
  help: 'Number of currently active BrainBytes chat sessions',
  registers: [client.register]
});
exports.sendMessage = async (req, res) => {
  console.log('sendMessage called!');
  try {
    const { message, sessionId, category } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const chatSessionId = sessionId || Date.now().toString();
    activeSessions.inc();

    const userMessage = new Message({
      text: message,
      sender: 'user',
      sessionId: chatSessionId,
      category: category,
      status: 'Read',
      timestamp: new Date()
    });
    await userMessage.save();

    messagesTotal.inc({ sender: 'user', category: category || 'General' });

    let aiResult;
    const endTimer = aiResponseDuration.startTimer();
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      const aiResultPromise = aiService.generateResponse(message, category);
      aiResult = await Promise.race([aiResultPromise, timeoutPromise]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      aiResult = {
        category: 'error',
        response: "I'm sorry, but I couldn't process your request in time. Please try again with a simpler question."
      };
    } finally {
      endTimer();
    }

    const aiMessage = new Message({
      text: aiResult.response,
      sender: 'ai',
      sessionId: chatSessionId,
      category: category,
      status: 'Read',
      timestamp: new Date()
    });
    await aiMessage.save();

    messagesTotal.inc({ sender: 'ai', category: category || 'General' });
    activeSessions.dec();

    res.status(200).json({
      userMessage,
      aiMessage,
      sessionId: chatSessionId,
      category: aiResult.category
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ error: 'An error occurred while processing your message' });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const messages = await Message.find({ sessionId })
      .sort({ timestamp: 1 })
      .limit(100);

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    res.status(500).json({ error: 'An error occurred while retrieving chat history' });
  }
};