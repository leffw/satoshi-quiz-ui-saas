import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { request } from 'graphql-request';

const Quiz = () => {
  const [ currentQuestion, setCurrentQuestion]  = useState(0);
  const [ score, setScore ] = useState(0);
  const [ isAnswered, setIsAnswered ] = useState(null);
  const [ isCorrectAnswer, setCorrectAnswer ] = useState(null);
  const [ answers, setAnswers ] = useState("");
  const [ quizData, setQuizData ] = useState([]);
  const lengthQuiz = quizData?.length - 1
  const { classroom } = useParams();
  const navigate = useNavigate();
  const query = useSearchParams()[0]
  const user = query.get("user")

  const handleAnswer = (answer) => {
    if (!isAnswered) {
      if (answer === quizData[currentQuestion].correctAnswer) {
        setScore(score + 1);
        setCorrectAnswer(true);
      } else {
        setCorrectAnswer(false);
      }
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
    const query_answers = query.get("answers");
    if (query_answers) {
      setAnswers(atob(query_answers))
    }
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
        {quizData[currentQuestion].options.split("\n").map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="option-button"
            style={{
              backgroundColor: isAnswered
                ? option === quizData[currentQuestion].correctAnswer
                  ? '#38A169'
                  : '#B71C1C'
                : 'initial',
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
        isAnswered && currentQuestion === lengthQuiz && score !== 0 && (
          <button onClick={
            () => navigate(`/reward?user=${user}&answers=${btoa(answers)}&score=${score}&classroom=${classroom}`)}>
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
