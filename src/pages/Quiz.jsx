import React, { useEffect, useState } from 'react';
import { useNavigate, redirect, useParams, useSearchParams } from "react-router-dom"
import { request } from 'graphql-request';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrectAnswer, setCorrectAnswer ] = useState(null);
  const [ quizData, setQuizData ] = useState([]);
  const lengthQuiz = quizData?.length - 1
  const { classroom } = useParams();
  const navigate = useNavigate();
  const query = useSearchParams()[0]
  const email = query.get("email")

  const handleAnswer = (answer) => {
    if (!isAnswered) {
      if (answer === quizData[currentQuestion].correctAnswer) {
        setScore(score + 1);
        setCorrectAnswer(true);
      } else {
        setCorrectAnswer(false);
      }
      setIsAnswered(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsAnswered(false);
    }
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      const { quizzes } = await request(
        import.meta.env.VITE_CMS_URL,
        `
        {
          quizzes(where: {classroom: "${classroom}"}){
            correctAnswer
            question
            options
          }
        }
      `
      );
      setQuizData(quizzes);
    };

    fetchQuizzes();
  }, []);

  if (!quizData.length) {
    return (
      <div>
        <h2> #OPT-OUT</h2>
      </div>
    )
  }

  return (
    <div>
      <div>
        <h2>{quizData[currentQuestion].question}</h2>
        <div style={{display: "flex"}}>
          {quizData[currentQuestion].options.split("\n").map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              style={{
                backgroundColor: isAnswered
                  ? option === quizData[currentQuestion].correctAnswer
                    ? '#0B3915'
                    : '#9C3A1D'
                  : 'initial',
                marginRight: "3%",
                color: "white",
                borderColor: "white",
              }}
            >
              {option}
            </button>
          ))}
        </div>
        <br />
        {
          isCorrectAnswer && currentQuestion === lengthQuiz && (
            <button  style={{marginTop: "5%"}} onClick={
              () => navigate(`/reward?email=${email}&score=${score}&=classroom=${classroom}`)}>
              Receber minha recompensa!
            </button>
          )
        }
        {
          isCorrectAnswer === false && currentQuestion === lengthQuiz && (
            <button  style={{marginTop: "5%"}}>
              Refazer o Quiz Novamente!
            </button>
          )
        }
        {
          isAnswered && currentQuestion !== lengthQuiz && (
            <button  style={{marginTop: "5%"}} onClick={handleNextQuestion}>
              Próxima Pergunta
            </button>
          )
        }
        <p>Pontuação: { score }</p>
      </div>
    </div>
  );
};

export default Quiz;
