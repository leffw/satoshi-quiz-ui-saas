import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CaretRight } from "@phosphor-icons/react";
import Backend from '../lib/backend';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [ totalValueQuiz, setTotalValueQuiz ] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(null);
  const [isCorrectAnswer, setCorrectAnswer] = useState(null);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [ isStart, setIsStart ] = useState(false);
  const [ topic, setTopic ] = useState("");
  const lengthQuiz = quizData?.length - 1;

  const { id } = useParams();
  const navigate = useNavigate();
  const query = useSearchParams()[0];
  const user = query.get('user');
  const background = query.get('bg') ? query.get('bg') : "#6709F9";
  const colorButtonCorrectAnswer = query.get('bgButtonCorrectAnswer') ? query.get('bgButtonCorrectAnswer') : "green";
  const colorBUttonWrongAnswer = query.get('bgButtonWrongAnswer') ? query.get('bgButtonWrongAnswer') : "red";
  const colorButton = query.get('colorButton') ? query.get('colorButton') : "#3f226b";

  const handleAnswer = (selectedAnswer) => {
    if (!isAnswered) {
      const correctAnswer = quizData[currentQuestion].answer;
      if (selectedAnswer === correctAnswer) {
        setScore(score + 1);
        setCorrectAnswer(true);
      } else {
        setCorrectAnswer(false);
      }
      setAnswer(selectedAnswer);
      setIsAnswered(true);
      setAnswers(`${answers}&${selectedAnswer}`);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsAnswered(null);
    }
  };

  useEffect(() => {
    const backend = new Backend();
    backend.getQuiz(id).then((data) => {
      setTopic(data.data.topic);
      setQuizData(data.data.quizzes);
      setTotalValueQuiz(data.data.prize);
    });
  }, [id]);

  if (!quizData.length) {
    return <div></div>;
  }

  const buttonStyle = {
    color: 'white',
    borderColor: 'white',
    width: 350,
    border: "none",
  };

  if (isStart === false) {
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
          flexDirection: "column",
        }}
      >
        <div style={{width: 450}}>
          <h2 style={{  wordWrap: "break-word" }}>
            {topic}
          </h2>
          <button 
            style={{ 
              display: "flex",
              flexDirection: "row",
              height: 60, 
              background: "none", 
              color: "white", 
              fontWeight: "bold",
              justifyContent: "space-between",
              border: '1px solid white',
              alignItems: "center", 
              gap: 15,
            }}
            onClick={() => {
              setIsStart(true);
          }}> 
            Iniciar Quiz <CaretRight size={22} weight="bold" />
          </button>
        </div>
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
      <div
        style={{
          margin: "0 auto",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          maxWidth: "800px",
          width: "90%",
        }}
      >
        <h2 style={{ wordWrap: "break-word", width: "50%", marginLeft: "25%" }}>{`${currentQuestion + 1}) `} 
          {quizData[currentQuestion].question}
        </h2>
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 15,
        }}>
          {quizData[currentQuestion].options.split('|').map((option, index) => (
            <button
              key={index}
              id={index}
              onClick={() => {
                console.log(option)
                handleAnswer(option)
              }}
              value={option}
              className="option-button"
              style={{
                ...buttonStyle,
                backgroundColor:
                  (answer) ? (option === quizData[currentQuestion].answer ? colorButtonCorrectAnswer : colorBUttonWrongAnswer) : colorButton,
                  height: 50,
                  background: "none",
                  border: '1px solid white'
              }}
            >
              {option}
            </button>
          ))}
          {isAnswered && answer !== quizData[currentQuestion].answer && (
            <p  style={{ wordWrap: "break-word", width: 350}}>
              A resposta correta é {quizData[currentQuestion].answer}!
            </p>
          )}
          {isAnswered && answer === quizData[currentQuestion].answer && (
            <p  style={{ wordWrap: "break-word", width: 350 }}>🏆 Resposta certa! Você ganhou +{(totalValueQuiz / (currentQuestion + 1)).toFixed(0)} sats!</p>
          )}
          {isAnswered && currentQuestion === lengthQuiz && score !== 0 && (
            <button 
              style={{ height: 60, width: 350, padding: 5  }}
              onClick={() => 
                navigate(`/${id}/reward?user=${user}&answers=${btoa(answers)}&reward=${((totalValueQuiz / (currentQuestion + 1)) * score).toFixed(0)}`)
            }>
              Receber recompensa!
            </button>
          )}
          {score === 0 && isAnswered && isCorrectAnswer === false && currentQuestion === lengthQuiz && (
            <button 
              style={{ height: 60, width: 350, padding: 5 }}
              onClick={() => window.open(location.toString(), '_self')}>
                Refazer Quiz!
            </button>
          )}
          {isAnswered && currentQuestion !== lengthQuiz && <button onClick={handleNextQuestion}>Próxima Pergunta</button>}
          <p>Prêmio Acumulado {((totalValueQuiz / (currentQuestion + 1)) * score).toFixed(0)} sats ⚡</p>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
