import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Backend from "../lib/backend";

const CreateQuiz = () => {
  const [ isStartQuiz, setIsStartQuiz ] = useState(false);
  const [ topic, setTopic ] = useState("");
  const [ answer, setAnswer ] = useState("");
  const [ quizzes, setQuizzes] = useState([]);
  const [ options, setOptions] = useState([]);
  const [ question, setQuestion ] = useState("");
  const [ prizeValue, setPrizeValue ] = useState(1);
  const [ redirectionLink, setRedirectionLink ] = useState("");
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

  const handleAddOption = () => {
    if (options.length < 3) {
      setOptions([...options, '']);
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleAddQuiz = () => {
    setQuizzes([
      ...quizzes, {
        question: question,
        options: [...options],
        answer: answer,
    }]);
    setQuestion("");
    setAnswer("");
    setOptions(['']);
  };
  
  const handleCreateQuiz = () => {
    setLoading(true);
    if (quizzes.length === 0) {
      setQuizzes([
        ...quizzes, {
          question: question,
          options: [...options],
          answer: answer      
        }]);
    } 
  
    if (quizzes.length >= 1) {
      backend.createQuiz(
        topic,
        prizeValue,
        quizzes,
        redirectionLink
      ).then(() => {
        navigate("/")
      }).catch(() => {
        alert("Error when trying to create the quiz, please try again later!")
      })
    }
    setLoading(false);
  }
  
  const isQuizComplete = options.length === 3;
  if (loading === true) {
    return (
      <div>
        
      </div>
    )
  }
  
  if (isStartQuiz === false) {
    return (
      <div style={{ width: 450, display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: 14 }}>
        <p>* What is the topic name?</p>
        <input style={{ width: "100%" }} onInput={(e) => {
          setTopic(e.target.value)
        }}/>
        <p>* What is the Redirect Link?</p>
        <input type='text' placeholder='https://google.com' style={{ width: "100%" }} onInput={(e) => {
          setRedirectionLink(e.target.value)
        }}/>
        <p>* What is the prize amount?</p>
        <input type='number' defaultValue={1} onInput={(e) => setPrizeValue(e.target.value)} placeholder="0" style={{ width: "100%" }} />
        <button 
          style={{width: "105%"}} 
          onClick={() => setIsStartQuiz(true)}
          disabled={(prizeValue < 1 || topic.length < 4 || isValidURL(redirectionLink) === false)}
        > Continue </button>
      </div>
    )
  }

  return (
    <div style={{ width: 350,  display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: 12 }}>
      <p>*  #{quizzes.length + 1} What is the question?</p>
      <input style={{ width: "100%" }} onInput={(e) => {
        setQuestion(e.target.value)
      }}/>
      <p> * Options </p>
      {options.map((option, index) => (
        <input
          key={index}
          value={option}
          placeholder={`options ${index + 1}`}
          style={{ width: "100%" }}
          onChange={(e) => handleOptionChange(index, e.target.value)}
        />
      ))}
      {question && options.length == 0 && (
        <button onClick={handleAddOption} style={{width: "105%"}}>
          +
        </button>
      )}
      {!isQuizComplete && question && quizzes.length < 7 && options.length != 0 && options[options.length - 1].length >= 4 && (
        <button onClick={handleAddOption} style={{width: "105%"}}>
          +
        </button>
      )}
      {
        options.length == 3 && options[options.length - 1].length >= 4 && (
          <>
            <p>* What is the correct answer?</p>
            <input style={{ width: "100%" }} onInput={(e) => {
              setAnswer(e.target.value)
            }}/>
          </>
        )
      }
      {options.length == 3 && answer && options.includes(answer) === true && (
        <>
          <button 
            onClick={handleAddQuiz} 
            style={{width: "105%", background: "#E2E2E2", color: "black"}}
          >
            Next
          </button>
          <button 
            onClick={handleCreateQuiz} 
            style={{width: "105%", background: "#FE5900", color: "white"}}
          >
              Create
          </button>
        </>
      )}
    </div>
  );
};

export default CreateQuiz;
