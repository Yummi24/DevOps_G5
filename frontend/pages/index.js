import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Home() {
  const [recentActivity, setRecentActivity] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferredSubjects, setPreferredSubjects] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('General');
  const messageEndRef = useRef(null);

  const fetchDashboardData = async () => {
  try {

    const response = await axios.get(
      'http://localhost:3000/api/messages'
    );

    setRecentActivity(response.data);

    setMessageCount(response.data.length);

  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
};

  // Fetch messages from the API
  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/messages');
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const saveProfile = async () => {
  try {

    const subjectsArray = preferredSubjects
      .split(',')
      .map(subject => subject.trim());

    await axios.post('http://localhost:3000/api/users', {
      name,
      email,
      preferredSubjects: subjectsArray
    });

    alert('Profile saved successfully!');

  } catch (error) {
    console.error('Error saving profile:', error);
    alert('Failed to save profile');
  }
};

  // Submit a new message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      setIsTyping(true); // Show typing indicator
      const userMsg = newMessage;
      setNewMessage('');
      
      // Optimistically add user message to UI
      const tempUserMsg = {
        _id: Date.now().toString(),
        text: userMsg,
        isUser: true,
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempUserMsg]);
      
      // Send to backend and get AI response
      const response = await axios.post(
          'http://localhost:3000/api/messages',
          {
            text: userMsg,
            subject: selectedSubject
          }
        );
      
      // Replace the temporary message with the actual one and add AI response
      setMessages(prev => {
        // Filter out the temporary message
        const filteredMessages = prev.filter(msg => msg._id !== tempUserMsg._id);
        // Add the real messages from the API
        return [...filteredMessages, response.data.userMessage, response.data.aiMessage];
      });
    } catch (error) {
      console.error('Error posting message:', error);
      // Show error in chat
      setMessages(prev => [...prev, {
        _id: Date.now().toString(),
        text: "Sorry, I couldn't process your request. Please try again later.",
        isUser: false,
        createdAt: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load messages on component mount
  useEffect(() => {
      fetchMessages();
      fetchDashboardData();
    }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Nunito, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>BrainBytes AI Tutor</h1>

      <div
  style={{
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}
>


  

  <h2>User Profile</h2>

  <input
    type="text"
    placeholder="Name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    style={{
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '8px',
      border: '1px solid #ccc'
    }}
  />

  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    style={{
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '8px',
      border: '1px solid #ccc'
    }}
  />

  <input
    type="text"
    placeholder="Preferred Subjects (comma separated)"
    value={preferredSubjects}
    onChange={(e) => setPreferredSubjects(e.target.value)}
    style={{
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '8px',
      border: '1px solid #ccc'
    }}
  />

  <button
    onClick={saveProfile}
    style={{
      padding: '12px 20px',
      backgroundColor: '#4caf50',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer'
    }}
  >
    Save Profile
  </button>

</div>


{/* DASHBOARD */}
<div
  style={{
    border: '1px solid #ddd',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}
>

  <h2>Learning Dashboard</h2>

  <p>
    <strong>Total Messages:</strong> {messageCount}
  </p>

  <h3>Recent Learning Activity</h3>

  {recentActivity.length === 0 ? (
    <p>No recent activity.</p>
  ) : (
    <ul style={{ paddingLeft: '20px' }}>
      {recentActivity
        .slice(-5)
        .reverse()
        .map((activity) => (
          <li key={activity._id} style={{ marginBottom: '10px' }}>

            <strong>
              {activity.isUser ? 'You' : 'AI Tutor'}
            </strong>

            : {activity.text}

          </li>
        ))}
    </ul>
  )}

</div>


<div 
  style={{ 
    border: '1px solid #ddd',
    borderRadius: '12px',
    height: '500px',
    overflowY: 'auto',
    padding: '16px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}
>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>Loading conversation history...</p>
          </div>
        ) : (
          <div>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <h3>Welcome to BrainBytes AI Tutor!</h3>
                <p>Ask me any question about math, science, or history.</p>
              </div>
            ) : (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {messages.map((message) => (
                  <li 
                    key={message._id} 
                    style={{ 
                      padding: '12px 16px', 
                      margin: '8px 0', 
                      backgroundColor: message.isUser ? '#e3f2fd' : '#e8f5e9',
                      color: '#333',
                      borderRadius: '12px',
                      maxWidth: '80%',
                      wordBreak: 'break-word',
                      marginLeft: message.isUser ? 'auto' : '0',
                      marginRight: message.isUser ? '0' : 'auto',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ margin: '0 0 5px 0', lineHeight: '1.5' }}>{message.text}</div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#666',
                      textAlign: message.isUser ? 'right' : 'left'
                    }}>
                      {message.isUser ? 'You' : 'AI Tutor'} • {new Date(message.createdAt).toLocaleTimeString()}
                    </div>
                  </li>
                ))}
                {isTyping && (
                  <li 
                    style={{ 
                      padding: '12px 16px', 
                      margin: '8px 0', 
                      backgroundColor: '#e8f5e9',
                      color: '#333',
                      borderRadius: '12px',
                      maxWidth: '80%',
                      marginLeft: '0',
                      marginRight: 'auto',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ margin: '0' }}>AI tutor is typing...</div>
                  </li>
                )}
                <div ref={messageEndRef} />
              </ul>
            )}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
  <label style={{ marginRight: '10px', fontWeight: 'bold' }}>
    Select Subject:
  </label>

  <select
    value={selectedSubject}
    onChange={(e) => setSelectedSubject(e.target.value)}
    style={{
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #ccc'
    }}
  >
    <option value="General">General</option>
    <option value="Math">Math</option>
    <option value="Science">Science</option>
    <option value="History">History</option>
    <option value="Programming">Programming</option>
    <option value="English">English</option>
  </select>
</div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Ask a question..."
          style={{ 
            flex: '1', 
            padding: '14px 16px',
            borderRadius: '12px 0 0 12px',
            border: '1px solid #ddd',
            fontSize: '16px',
            outline: 'none'
          }}
          disabled={isTyping}
        />
        <button 
          type="submit" 
          style={{ 
            padding: '14px 24px',
            backgroundColor: isTyping ? '#90caf9' : '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '0 12px 12px 0',
            fontSize: '16px',
            cursor: isTyping ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s'
          }}
          disabled={isTyping}
        >
          {isTyping ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
