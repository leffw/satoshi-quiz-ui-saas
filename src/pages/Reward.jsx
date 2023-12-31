import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import QRCode from 'react-qr-code';
import Backend from "../lib/backend";

const RewardScreen = () => {
  const [ lnurl, setLnurl ] = useState("");
  const { id } = useParams();
  const query = useSearchParams()[0]

  const points = query.get("points")
  const reward = query.get("reward")
  const user = query.get("user")
  const background = query.get('bg');
  const navigate = useNavigate()
  const backend = new Backend()

  useEffect(() => {
    backend.createReward(id, user, points).then((data) => {
      setLnurl(`lightning:${data.data.lnurl}`)
    })
  }, []);

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
      <div>
        
      </div>
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}
      >
        <p style={{width: "90%", fontWeight: "bold"}}>
          🏆 Parabéns! Você ganhou {reward} sats de recompensa!
        </p>
        <a href={lnurl}>
          <QRCode 
            value={lnurl} 
            size={256} 
            viewBox={`0 0 256 256`}
            bgColor='#1F1338' 
            fgColor='white'
          />
        </a>

        <p style={{width: "50%"}}>
          Escaneie o QRCode com sua Carteira Lightning!
        </p>
      </div>
    </div>
  );
};

export default RewardScreen;