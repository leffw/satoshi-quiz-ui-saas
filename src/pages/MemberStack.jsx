import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Backend from "../lib/backend";

const MemberStack = () => {
  const [ memberStackAPIKey, setMemberStackAPIKey ] = useState('');
  const [ loading, setLoading ] = useState(false);
  const navigate = useNavigate();

  const handleMemberStack= async () => {
    const backend = new Backend()
    setLoading(true);
    backend.setupMemberStack(
      memberStackAPIKey
    ).then(() => {
      navigate("/")
    }).catch((e) => {
      if (e.response.status === 401) {
        navigate("/login")
      } else {
        navigate("/")
      }
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
      <h2 style={{ alignSelf: "center" }}> MemberStack </h2>
      <p> * MemberStack API Key </p>
      <input
        placeholder='6deb47c2ca2d742dc23c9780fb7f2b16'
        style={{ width: "95%" }}
        value={memberStackAPIKey}
        onChange={(e) => setMemberStackAPIKey(e.target.value)}
      />
      <button onClick={handleMemberStack} disabled={memberStackAPIKey.length < 6}>
        Salvar e continuar
      </button>
      <button 
        onClick={() => navigate("/")} 
        style={{ backgroundColor: "transparent" }}
      >
        Pular
      </button>
    </div>
  );
};

export default MemberStack;
