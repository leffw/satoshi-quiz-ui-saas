import React, { useEffect, useState } from 'react';
import { LinkSimple, Trash, CaretRight, CaretLeft, Plus } from "@phosphor-icons/react";
import { useNavigate } from 'react-router-dom';
import Backend from "../lib/backend";

function ListQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const itemsPerPage = 3; 
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ loading, setLoading] = useState(false);
  const backend = new Backend()
  const totalPages = Math.ceil(quizzes.length / itemsPerPage);
  const navigate = useNavigate();

  const handleDeleteQuiz = (id) => {
    setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.id !== id));
    backend.deleteQuiz(id);
  };

  const handleOpenQuiz = (id) => {
    navigate(`/${id}`);
  }

  const handleNextPage = () => {
    console.log("jdhsahdjsa")
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  useEffect(() => {
    setLoading(true)
    console.log(currentPage)
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
  }, [currentPage])

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuizzes = quizzes.slice(startIndex, endIndex);
  
  if (loading === true) {
    return (
      <div>
        
      </div>
    )
  }

  return (
    <div style={{width: 550}}>
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
  );
}

export default ListQuizzes;