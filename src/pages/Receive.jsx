import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import Backend from "../lib/backend";
import QRCode from 'react-qr-code';

const Receive = () => {
    const [ invoice, setInvoice ] = useState("");
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();
    const backend = new Backend();

    useEffect(() => {
        backend.createInvoice().then((data) => {
            setLoading(false);
            setInvoice(data.data.invoice);
        }).catch((e) => {
          if (e.response.status === 401) {
            navigate("/login")
          }
        })
    }, [])

    if (loading === true) {
      return (
        <div>

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
          }}
        >
          <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
          >
            <a href={`lightning:${invoice}`}>
              <QRCode 
                value={`lightning:${invoice}`} 
                size={256} 
                viewBox={`0 0 256 256`}
                bgColor='transparent' 
                fgColor='white'
              />
            </a>
            <input value={invoice} style={{width: 256, background: "transparent", color: "white", padding: 10}}/>
            <button style={{marginTop: "5%", height: 40}} onClick={() => navigate("/")}>
                Ir para a página inicial
            </button>
          </div>
        </div>
    );
}

export default Receive;
