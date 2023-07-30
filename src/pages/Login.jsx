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
        setLoading(false);
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
      maxWidth: "450px",
      width: 350,
      margin: "0 auto",
      padding: "20px",
    }}>
      <h2>Entrar</h2>
      <label style={{ alignSelf: "flex-start" }}>* Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%" }}
      />
      <label style={{ alignSelf: "flex-start" }}>* Senha:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%" }}
      />
      <button
        onClick={handleLogin}
        disabled={!isValidEmail(email) || !isValidPassword(password)}
        style={{ width: "105%" }}
      >
        Entrar
      </button>
      <button
        onClick={() => navigate("/signup")}
        style={{
          fontSize: 14,
          background: "transparent",
          color: "white",
          width: "105%",
        }}
      >
        Criar conta
      </button>
    </div>
  );
};

export default Login;
