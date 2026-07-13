import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Profile() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferredSubjects, setPreferredSubjects] = useState([]);

  const subjects = [
    'General',
    'Math',
    'Science',
    'History',
    'Programming',
    'English'
  ];

  const handleCheckboxChange = (subject) => {
    if (preferredSubjects.includes(subject)) {
      setPreferredSubjects(preferredSubjects.filter(s => s !== subject));
    } else {
      setPreferredSubjects([...preferredSubjects, subject]);
    }
  };

  const saveProfile = () => {
    const profile = {
      name,
      email,
      preferredSubjects
    };

    localStorage.setItem('userProfile', JSON.stringify(profile));

    router.push('/');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: '#daf3f8',
        padding: '20px'
      }}
>
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          fontFamily: 'Nunito, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <h2 style={{ textAlign: 'center', fontSize: '30px' }}>
          User Profile
        </h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        />

        <div>
          <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>
            Preferred Subjects
          </p>

          {subjects.map((subject) => (
            <label
              key={subject}
              style={{
                display: 'block',
                marginBottom: '6px',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={preferredSubjects.includes(subject)}
                onChange={() => handleCheckboxChange(subject)}
              />{' '}
              {subject}
            </label>
          ))}
        </div>

        <button
          onClick={saveProfile}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#2196f3',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}