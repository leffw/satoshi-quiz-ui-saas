import React, { useState } from 'react';
import firebase from '../services/firebase';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
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

  const handleSignup = () => {
    if (!isValidEmail(email)) {
      return;
    }

    if (!isValidPassword(password)) {
      return;
    }

    setLoading(true);

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((data) => {
        const user = data.user;
        user.getIdToken().then((token) => {
          sessionStorage.setItem('token', token);
          navigate("/setup/lndhub");
        });
      })
      .catch((error) => {
        alert("This account already exists.");
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
      <h2>Signup</h2>
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
      <button onClick={handleSignup} disabled={!isValidEmail(email) || !isValidPassword(password)}>
        Signup
      </button>
      <button onClick={() => navigate("/login")} style={{fontSize: 14, background: "transparent", color: "white"}}>
        Login Account
      </button>
    </div>
  );
};

export default Signup;
