import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Backend from "../lib/backend";

const CreateQuiz = () => {
  const [isStartQuiz, setIsStartQuiz] = useState(false);
  const [topic, setTopic] = useState("");
  const [answer, setAnswer] = useState("");
  const [options, setOptions] = useState([]);
  const [question, setQuestion] = useState("");
  const [prizeValue, setPrizeValue] = useState(1);
  const [redirectionLink, setRedirectionLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const backend = new Backend();
  const navigate = useNavigate();

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleAddQuiz = () => {
    const newQuiz = [...quizzes, {
      question: question,
      options: [...options],
      answer: answer,
    }]
    console.log(newQuiz);
    setQuizzes(newQuiz);
    setQuestion('');
    setAnswer('');
    setOptions(['']);
  };
  
  const handleCreateQuiz = () => {
    if (quizzes.length > 0) {
      setLoading(true);
      backend.createQuiz(
        topic,
        prizeValue,
        quizzes,
        redirectionLink
      ).then(() => {
        navigate("/")
        setLoading(false);
      }).catch(() => {
        alert("Error when trying to create the quiz, please try again later!");
        setLoading(false);
      })
    }

  }
  
  if (loading === true) {
    return (
      <div>
        
      </div>
    )
  }
  
  return (
    <div style={{ width: 350, display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: 'flex-start', gap: 10 }}>
      {isStartQuiz === false ? (
        <>
          <p>* Qual é o nome do tópico?</p>
          <input
            defaultValue={topic}
            style={{ width: '100%' }}
            onInput={(e) => {
              setTopic(e.target.value);
            }}
          />
          <p>* Qual é o valor do prêmio?</p>
          <input
            type='number'
            defaultValue={1}
            onInput={(e) => setPrizeValue(e.target.value)}
            placeholder="0"
            style={{ width: '100%' }}
          />
          <button
            style={{ width: '105%' }}
            onClick={() => {
              setIsStartQuiz(true);
              setQuestion('');
            }}
            disabled={prizeValue < 1 || topic.length < 4}
          >
            Continuar
          </button>
        </>
      ) : (
        <>
          <p>* #{quizzes.length + 1} Qual é a pergunta?</p>
          <input
            style={{ width: '100%' }}
            value={question}
            onInput={(e) => {
              setQuestion(e.target.value);
            }}
          />
          <p> * Opções </p>
          {options.map((option, index) => (
            <input
              key={index}
              value={option}
              placeholder={`Opção ${index + 1}`}
              style={{ width: '100%' }}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
          ))}
          {question && options.length === 0 && (
            <button onClick={handleAddOption} style={{ width: '105%' }}>
              +
            </button>
          )}
          {!(options.length === 4) && question && quizzes.length < 7 && options.length !== 0 && options[options.length - 1].length >= 4 && (
            <button onClick={handleAddOption} style={{ width: '105%' }}>
              +
            </button>
          )}
          {
            options.length >= 3 && options[options.length - 1].length >= 4 && (
              <>
                <p>* Qual é a resposta correta?</p>
                <input
                  style={{ width: '100%' }}
                  onInput={(e) => {
                    setAnswer(e.target.value);
                  }}
                />
              </>
            )
          }
          {options.length >= 3 && answer && options.includes(answer) === true && (
            <>
              <button
                onClick={handleAddQuiz}
                style={{ width: '105%', background: '#E2E2E2', color: 'black' }}
              >
                Criar Quiz #{quizzes.length + 1}
              </button>
            </>
          )}
          {
            quizzes.length > 1 && (
              <button
                onClick={() => {
                  handleCreateQuiz();
                }}
                style={{ width: '105%', background: '#FE5900', color: 'white' }}
              >
                Finalizar Criação dos #{quizzes.length} Quizzes
              </button>
            ) 
          } {
            quizzes.length === 1  && (
              <button
                onClick={() => {
                  handleCreateQuiz();
                }}
                style={{ width: '105%', background: '#FE5900', color: 'white' }}
              >
                Finalizar Criação do #{quizzes.length} Quiz
              </button>
            )
          }
        </>
      )}
    </div>
  );
};

export default CreateQuiz;
