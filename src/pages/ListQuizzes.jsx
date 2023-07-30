import React, { useEffect, useState } from 'react';
import { LinkSimple, Trash, CaretRight, CaretLeft, Plus, Lightning, Gear } from "@phosphor-icons/react";
import { useNavigate } from 'react-router-dom';
import Backend from "../lib/backend";

function ListQuizzes() {
  const [ quizzes, setQuizzes ] = useState([]);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ loading, setLoading ] = useState(false);
  const [ balance, setBalance ] = useState(0)
  const backend = new Backend()
  const navigate = useNavigate();
  const itemsPerPage = 3; 

  const handleDeleteQuiz = (id) => {
    setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== id));
    backend.deleteQuiz(id);
  };

  const handleOpenQuiz = (id) => {
    navigate(`/${id}`);
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  useEffect(() => {
    setLoading(true)
    backend.getListQuizzes(currentPage, itemsPerPage).then((data) => {
      const q = data.data
      if (q.length >= 1) {
        setQuizzes(data.data)
      } else if (currentPage !== 0) {
        handlePrevPage()
      }
      setLoading(false)
    }).catch((e) => {
      if (e.response.status === 401) {
        navigate("/login")
      }
    })
    backend.getBalance().then((data) => {
      setBalance(data.data.balance)
    })
  }, [currentPage])

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuizzes = quizzes.length >= 3 ? quizzes.slice(startIndex, endIndex) : quizzes;
  
  console.log(currentQuizzes)
  if (loading === true) {
    return (
      <div>
        
      </div>
    )
  }

  return (
    <>
      <div 
        style={{
          position: "relative", 
          marginBottom: "5%", 
          display: "flex", 
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        {balance} sats 
        <div>
          <button 
            style={{background: "transparent", width: 35}}
            onClick={() => navigate("/receive")}
          >
            <Lightning size={18} color='orange'/>
          </button>
          <button 
            style={{background: "transparent", width: 35}}
            onClick={() => navigate("/setup/lndhub")}
          >
            <Gear size={18} color='white'/>
          </button>
        </div>

      </div>
      <div style={{width: 350}}>
        {currentQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            style={{
              display: "flex",
              flexDirection: "row",
              border: '1px solid white',
              borderRadius: 5,
              padding: 10,
              marginBottom: 10,
              justifyContent: "space-between"
            }}
          >
            <p>{quiz.topic}</p>
            <div style={{display: "flex", flexDirection: "row"}}>
              <button
                  onClick={() => handleDeleteQuiz(quiz.id)}
                  style={{
                      cursor: "pointer",
                      background: "transparent",
                      color: "white",
                  }}
              >
                  <Trash size={18} />
              </button>
              <button
                  onClick={() => handleOpenQuiz(quiz.id)}
                  style={{
                      cursor: "pointer",
                      background: "transparent",
                      color: "white",
                  }}
              >
                  <LinkSimple size={18} />
              </button>
            </div>
          </div>
        ))}
        <button
              onClick={() => navigate("/create")}
                  style={{
                      cursor: "pointer",
                      background: "transparent",
                      color: "white",
                  }}
              >
              <Plus size={18} color='white'/>
        </button>
        <div style={{ display: "flex", marginTop: "5%", flexDirection: "row", gap: 25, alignItems: 'center' }}>
          <button onClick={handlePrevPage} disabled={currentPage === 1} style={{
              background: "transparent",
              color: "white",
              border: '1px solid white',
              width: "50%"
          }}>
            <CaretLeft size={18} />
          </button>
          <div>{currentPage}</div>
          <button onClick={handleNextPage} disabled={quizzes.length == 0} style={{
              background: "transparent",
              color: "white",
              border: '1px solid white',
              width: "50%"
          }}>
            <CaretRight size={18} />
          </button>
        </div>
      </div>
    </>

  );
}

export default ListQuizzes;
