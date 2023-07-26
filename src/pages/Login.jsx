import React, { useState } from 'react';
import firebase from '../services/firebase';
import { setCredentials } from '../services/credentials';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  const handleLogin = () => {
    if (!isValidEmail(email)) {
      alert('Please enter a valid email.');
      return;
    }

    if (!isValidPassword(password)) {
      alert('The password must have at least 8 digits.');
      return;
    }

    setLoading(true);

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((data) => {
        const user = data.user;
        user.getIdToken().then((token) => {
          setCredentials(token)
          navigate('/');
        });
      })
      .catch((error) => {
        alert('Error logging in. Check your email and password.');
      });
  };

  if (loading === true) {
    return (
      <div>
        
      </div>
    )
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 15,
      width: 350,
      justifyContent: "flex-start"
    }}>
      <h2>Login</h2>
      <label style={{ alignSelf: "flex-start" }}>* Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label style={{ alignSelf: "flex-start" }}>* Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} disabled={!isValidEmail(email) || !isValidPassword(password)}>
        Login
      </button>
      <button onClick={() => navigate("/signup")} style={{fontSize: 14, background: "transparent", color: "white"}}>
        Create Account
      </button>
    </div>
  );
};

export default Login;
