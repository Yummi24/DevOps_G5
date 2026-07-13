import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
  const [error, setError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('General');
  const [sessionId, setSessionId] = useState('');
  const messageEndRef = useRef(null);
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [profile, setProfile] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);

useEffect(() => {
  const stored = localStorage.getItem('userProfile');

  if (!stored) {
    router.replace('/profile');
    return;
  }

  const parsed = JSON.parse(stored);
  setProfile(parsed);

  if (parsed.preferredSubjects?.length > 0) {
    setAvailableSubjects(parsed.preferredSubjects);
    setSelectedSubject(parsed.preferredSubjects[0]);
  }

  setCheckingAuth(false);
}, [router]);



  const fetchDashboardData = async () => {
  try {

    const response = await axios.get(
      `${API_URL}/api/chat/history/${sessionId}`
    );

    setRecentActivity(response.data.messages);

    setMessageCount(response.data.messages.length);

  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
  };

  // Fetch messages from the API
  const fetchMessages = async (sid) => {
    try {
      const response = await axios.get(
  `${API_URL}/api/chat/history/${sid}`);    
      setMessages(response.data.messages);
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

    await axios.post(`${API_URL}/api/users`, {
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
    
    if (!navigator.onLine) {
      setError('No internet connection.');
      return;
    }

    if (!newMessage.trim()) return;
    
    try {
      setError('');
      setIsTyping(true); // Show typing indicator
      const userMsg = newMessage;
      setNewMessage('');
      
      // Optimistically add user message to UI
      const tempUserMsg = {
        _id: Date.now().toString(),
        text: userMsg,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, tempUserMsg]);
      
      // Send to backend and get AI response
      const response = await axios.post(
         `${API_URL}/api/chat/send`,
          {
              message: userMsg,
              sessionId: sessionId,
              category: selectedSubject
          }
        );
      
      // Replace the temporary message with the actual one and add AI response
      setMessages(prev => {
        // Filter out the temporary message
        const filteredMessages = prev.filter(msg => msg._id !== tempUserMsg._id);
        // Add the real messages from the API
        return [...filteredMessages, response.data.userMessage, response.data.aiMessage];
      });

      // Refresh dashboard stats after a successful send
      fetchDashboardData();
    } catch (error) {
      console.error('Error posting message:', error);
      // Show error in chat

      setError('Failed to send message.');

      setMessages(prev => [...prev, {
        _id: Date.now().toString(),
        text: "Sorry, I couldn't process your request. Please try again later.",
        sender: 'ai',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
  // Always start a brand new session on page load (no persistence)
  const newSessionId = crypto.randomUUID();

  setSessionId(newSessionId);
  setMessages([]);
  setLoading(false);
}, []);

useEffect(() => {
  if (sessionId) {
    fetchDashboardData();
  }
}, [sessionId]);

useEffect(() => {

  const handleOffline = () => {
    alert('You are offline');
  };

  window.addEventListener(
    'offline',
    handleOffline
  );

  const stored = localStorage.getItem('userProfile');

  if (stored) {
    setProfile(JSON.parse(stored));
  }

  return () => {
    window.removeEventListener(
      'offline',
      handleOffline
    );
  };

  

  }, []);

  if (checkingAuth) return <p>Checking authentication...</p>;


    return (
  <div style={{
    minHeight: '100vh',
    backgroundColor: '#daf3f8',
    margin: 0,
    padding: '20px',
    fontFamily: 'Nunito, sans-serif'
  }}>
        <h1 style={{ textAlign: 'center', color: '#333' }}>BrainBytes AI Tutor</h1>
        {profile && (
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
      <h3 style={{ fontSize: '20px', fontWeight: 600 }}> Welcome, {profile.name}!</h3>
      <p style={{ fontSize: '16px' }}>
    <strong>Email:</strong> {profile.email}
  </p>

  <p style={{ fontSize: '16px' }}>
    <strong>Subjects:</strong>{' '}
    {Array.isArray(profile.preferredSubjects)
      ? profile.preferredSubjects.join(', ')
      : profile.preferredSubjects}
  </p>
    </div>
  )}


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

      <h2 style={{ fontSize: '20px', fontWeight: 600 }}> Learning Dashboard</h2>

      <p>
        <strong> Total Messages:</strong> {messageCount}
      </p>

      <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Recent Learning Activity</h3>

      {recentActivity.length === 0 ? (
        <p>No recent activity.</p>
      ) : (
        <ul style={{ paddingLeft: '20px', fontSize: '16px' }}>
      {recentActivity
        .slice(-5)
        .reverse()
        .map((activity) => (
          <li key={activity._id} style={{ marginBottom: '10px' }}>
            <strong>
              {activity.sender === 'user' ? 'You' : 'AI Tutor'}
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
                      backgroundColor: message.sender === 'user' ? '#e3f2fd' : '#e8f5e9',
                      color: '#333',
                      borderRadius: '12px',
                      maxWidth: '80%',
                      wordBreak: 'break-word',
                      marginLeft: message.sender === 'user' ? 'auto' : '0',
                      marginRight: message.sender === 'user' ? '0' : 'auto',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ margin: '0 0 5px 0', lineHeight: '1.5' }}>
                      <ReactMarkdown>
                        {message.text}
                      </ReactMarkdown>
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#666',
                      textAlign: message.sender === 'user' ? 'right' : 'left'
                    }}>
                      {message.sender === 'user' ? 'You' : 'AI Tutor'}
                        •
                        {new Date(message.timestamp).toLocaleTimeString()}
                        •
                        {message.status}
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
   {availableSubjects.length > 0 ? (
  availableSubjects.map((subject) => (
    <option key={subject} value={subject}>
      {subject}
    </option>
  ))
) : (
  <>
    <option value="General">General</option>
    <option value="Math">Math</option>
    <option value="Science">Science</option>
    <option value="History">History</option>
    <option value="Programming">Programming</option>
    <option value="English">English</option>
  </>
  )}
  </select>
</div>

        {error && (
          <div
            style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '10px'
            }}
          >
            {error}
          </div>
        )}
      
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
