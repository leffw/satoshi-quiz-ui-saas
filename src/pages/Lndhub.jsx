import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Backend from "../lib/backend";

const SetupLndhub = () => {
  const [ lndhubURL, setLndhubURL ] = useState('');
  const [ lndhubUsername, setLndhubUsername ] = useState('');
  const [ lndhubPassword, setLndhubPassword ] = useState('');
  const [ loading, setLoading] = useState(false);
  const backend = new Backend()

  const navigate = useNavigate();

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleLndhub = async () => {
    setLoading(true);
    backend.setupLndhub(
      lndhubURL,
      lndhubUsername,
      lndhubPassword
    ).then(() => {
      navigate("/setup/memberstack")
    }).catch((e) => {
      if (e.response.status === 401) {
        navigate("/login")
      } else {
        navigate("/setup/memberstack")
      }
    })
  }

  const isInputValid = (inputValue) => {
    return inputValue.length >= 6;
  };

  const isFormValid = () => {
    return isValidURL(lndhubURL) && isInputValid(lndhubUsername) && isInputValid(lndhubPassword);
  };

  if (loading === true) {
    return (
      <div>
        
      </div>
    )
  }

  return (
    <div style={{
      color: 'white',
      borderRadius: '8px',
      width: 450,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "5%",
      gap: 10
    }}>
      <h2 style={{ alignSelf: "center" }}> Lndhub Provider </h2>
      <p> * Lndhub URL </p>
      <input
        placeholder='https://ln.getalby.com'
        style={{ width: "95%" }}
        value={lndhubURL}
        onChange={(e) => setLndhubURL(e.target.value)}
      />
      <p> * Lndhub Username </p>
      <input
        placeholder='60e1cf3d8f304ca7'
        style={{ width: "95%" }}
        value={lndhubUsername}
        onChange={(e) => setLndhubUsername(e.target.value)}
      />
      <p> * Lndhub Password </p>
      <input
        placeholder='9269208a410a4788'
        style={{ width: "95%" }}
        value={lndhubPassword}
        onChange={(e) => setLndhubPassword(e.target.value)}
      />
      <button onClick={handleLndhub} disabled={!isFormValid()}>
        Salvar e continuar
      </button>
    </div>
  );
};

export default SetupLndhub;
