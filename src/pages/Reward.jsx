import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import QRCode from 'react-qr-code';
import Backend from "../lib/backend";

const RewardScreen = () => {
  const [ redirectURL, setRedirectURL ] = useState();
  const [ lnurl, setLnurl ] = useState(null);
  const { id } = useParams();
  const query = useSearchParams()[0]

  const answers = query.get("answers")
  const reward = query.get("reward")
  const user = query.get("user")
  const background = query.get('bg');
  const navigate = useNavigate()
  const backend = new Backend()

  useEffect(() => {
    backend.createReward(id, user, answers).then((data) => {
      setLnurl(`lightning:${data.data.lnurl}`)
    })
  }, []);
  
  if (!lnurl) {
    return (
      <div>
        <h3>🏆 Parabéns! Você ganhou {reward} sats de recompensa!</h3>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: background,
      }}
    >
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}
      >
        <a href={lnurl} target='#'>
          <QRCode 
            value={lnurl} 
            size={256} 
            viewBox={`0 0 256 256`}
            bgColor='#371272' 
            fgColor='white'
          />
        </a>

        <p style={{width: "50%"}}>
          Escaneie O QRCode com sua 
          Carteira Lightning!
        </p>
      </div>
    </div>
  );
};

export default RewardScreen;