import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useSearchParams, redirect, useNavigate } from "react-router-dom"
import { request } from 'graphql-request';
import axios from 'axios';

const RewardScreen = () => {
  const [ lnurl, setLnurl ] = useState("lightning:LNURL");
  const [ redirectURL, setRedirectURL ] = useState();
  const query = useSearchParams()[0]
  const score = query.get("score")
  const email = query.get("email")
  const answers = query.get("answers")
  const classroom = query.get("classroom")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchClassroom = async () => {
      const { classrooms } = (await request(
        import.meta.env.VITE_CMS_URL,
        `
        {
          classrooms(where: {classroom: "${classroom}"}) {
            nextClassroom
          }
        }        
      `
      ));
      setRedirectURL(classrooms[0].nextClassroom)
    };
    const createReward = async () => {
      const data = { answers: answers }
      const headers = { "X-EMAIL": email }
      
      axios.post(import.meta.env.VITE_SATOSHI_URL + `/api/v1/reward/${classroom}`, data, { headers: headers })
      .then((response) => {
        setLnurl(response.data.lnurl);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
    fetchClassroom();
    createReward();
  }, []);

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
      <button style={{width: "50%"}} onClick={() => {
        window.open(redirectURL, "_self")
      }}>
        Próxima Aula!
      </button>
    </div>
  );
};

export default RewardScreen;