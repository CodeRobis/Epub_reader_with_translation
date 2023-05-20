import React, { useState } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

function Registration({ toggleShowLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error message
    console.log(auth);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Registration successful, redirect to the app or show success message
      alert('Registration successful!');
      setEmail('');
      setPassword('');
    } catch (error) {
      // Handle registration errors
      setError(error.message);
    }
  };

  return (
    <div className="registration">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
      <button onClick={toggleShowLogin}>
        {toggleShowLogin ? 'Register' : 'Login'}
      </button>
    </div>
  );
}

export default Registration;
