import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.title}>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button style={styles.button} onClick={handleSubmit}>Register</button>
        <p style={styles.link}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
  box: { background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '350px', display: 'flex', flexDirection: 'column', gap: '15px' },
  title: { textAlign: 'center', marginBottom: '10px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px' },
  button: { padding: '10px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  error: { color: 'red', textAlign: 'center' },
  link: { textAlign: 'center', fontSize: '14px' }
};

export default Register;