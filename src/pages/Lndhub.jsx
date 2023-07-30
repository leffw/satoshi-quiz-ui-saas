import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Backend from "../lib/backend";

const SetupLndhub = () => {
  const [ lndhubURL, setLndhubURL ] = useState('');
  const [ lndhubUsername, setLndhubUsername ] = useState('');
  const [ lndhubPassword, setLndhubPassword ] = useState('');
  const [ lndhubBaseURL, setLndhubBaseURL ] = useState('');
  const [ loading, setLoading] = useState(false);
  const backend = new Backend()

  const navigate = useNavigate();

  const isValidLndhubURL = (url) => {
    const lndhubURLRegex = /^lndhub:\/\/[0-9a-fA-F]+:[0-9a-fA-F]+@[a-zA-Z0-9.-]+$/;
    return lndhubURLRegex.test(url);
  };

  const handleInputString = (inputString) => {
    setLndhubURL(inputString);
    if (inputString && String(inputString).includes("lndhub://") === true) {
      var inputString = inputString.replaceAll("lndhub://", "")
      
      const username = inputString.split(":")[0]
      const password = inputString.split(":")[1].split("@")[0];
      const baseURL = inputString.split("@")[1]
    
      setLndhubUsername(username);
      setLndhubPassword(password);
      setLndhubBaseURL(`https://${baseURL}`);
      console.log(lndhubBaseURL)
    }
  };

  const handleLndhub = async () => {
    setLoading(true);
    backend.setupLndhub(
      lndhubBaseURL,
      lndhubUsername,
      lndhubPassword
    ).then(() => {
      navigate("/setup/memberstack")
    }).catch((e) => {
      if (e.response.status === 400) {
        alert(e.response.data.detail);
      } else if (e.response.status === 401) {
        navigate("/login")
      } else {
        navigate("/setup/memberstack")
      }
      setLoading(false);
    })
  }

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
      <p> * Lndhub </p>
      <input
        placeholder='lndhub://9269208a410a4788:60e1cf3d8f304ca7@ln.getalby.com'
        style={{ width: "95%" }}
        value={lndhubURL}
        onChange={(e) => handleInputString(e.target.value)}
      />
      <button onClick={handleLndhub} disabled={!isValidLndhubURL(lndhubURL)}>
        Salvar e continuar
      </button>
    </div>
  );
};

export default SetupLndhub;
