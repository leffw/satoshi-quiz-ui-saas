import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import Backend from "../lib/backend";

const Quiz = () => {
  const [ currentQuestion, setCurrentQuestion]  = useState(0);
  const [ score, setScore ] = useState(0);
  const [ isAnswered, setIsAnswered ] = useState(null);
  const [ isCorrectAnswer, setCorrectAnswer ] = useState(null);
  const [ answer, setAnswer ] = useState("");
  const [ answers, setAnswers ] = useState("");
  const [ quizData, setQuizData ] = useState([]);
  const lengthQuiz = quizData?.length - 1
  const { id } = useParams();
  const backend = new Backend()

  const navigate = useNavigate();
  const query = useSearchParams()[0]
  const email = query.get("email")

  const handleAnswer = (answer) => {
    if (!isAnswered) {
      if (answer === quizData[currentQuestion].answer) {
        setScore(score + 1);
        setCorrectAnswer(true);
      } else {
        setCorrectAnswer(false);
      }
      setAnswer(answer)
      setIsAnswered(true);
      setAnswers(`${answers}&${answer}`);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsAnswered(null);
    }
  };

  useEffect(() => {
    backend.getQuiz(id).then((data) =>{
      setQuizData(data.data);
    })
  }, []);

  if (!quizData.length) {
    return (
      <div>
        <h2> #OPT-OUT</h2>
      </div>
    )
  }

  return (
    <div className="quiz-container">
      <h2>{quizData[currentQuestion].question}</h2>
      <div className="options-container">
        {quizData[currentQuestion].options.split("|").map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="option-button"
            style={{
              backgroundColor: isAnswered
                ? option === quizData[currentQuestion].answer
                  ? '#6900FF'
                  : '#FE5900'
                : 'initial',
              color: "white",
              borderColor: "white",
              width: 350
            }}
          >
            {option}
          </button>
        ))}
      </div>
      <br />
      {
        isAnswered && answer !== quizData[currentQuestion].answer && (
          <p>A resposta correta é {quizData[currentQuestion].answer}!</p>
        )
      }
      {
        isAnswered && currentQuestion === lengthQuiz && score !== 0 && (
          <button onClick={
            () => navigate(`/reward?email=${email}&answers=${btoa(answers)}&score=${score}&classroom=${classroom}`)}>
            Receber minha recompensa!
          </button>
        )
      }
      {
        score === 0 && isAnswered && isCorrectAnswer === false && currentQuestion === lengthQuiz && (
          <button onClick={() => {
            window.open(location.toString(), "_self")
          }}>
            Refazer o Quiz Novamente!
          </button>
        )
      }
      {
        isAnswered && currentQuestion !== lengthQuiz && (
          <button onClick={handleNextQuestion}>
            Próxima Pergunta
          </button>
        )
      }
      <p>Pontuação: { score }</p>
    </div>
  );
};

export default Quiz;
