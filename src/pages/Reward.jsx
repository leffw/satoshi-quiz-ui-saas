import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { useSearchParams } from "react-router-dom"

const RewardScreen = () => {
  const [ lnurl, setLnurl ] = useState("lightning:LNURL");
  const [ redirectURL, setRedirectURL ] = useState();
  const query = useSearchParams()[0]
  const score = query.get("score")
  const email = query.get("email")
  const classroom = query.get("classroom")

  return (
    <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
      }}
    >
      <h3> Pontos: {score}</h3>
      <QRCode 
        value={lnurl} 
        size={256} 
        viewBox={`0 0 256 256`}
        bgColor='#371272' 
        fgColor='white'
        href={lnurl}
      />
      <p style={{width: "50%"}}>
        Escaneie O QRCode com sua 
        Carteira Lightning para receber 
        sats.
      </p>
      <button style={{width: "50%"}}>
        Próxima Aula!
      </button>
    </div>
  );
};

export default RewardScreen;