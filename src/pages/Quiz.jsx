import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Backend from '../lib/backend';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(null);
  const [isCorrectAnswer, setCorrectAnswer] = useState(null);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState('');
  const [quizData, setQuizData] = useState([]);
  const lengthQuiz = quizData?.length - 1;

  const { id } = useParams();
  const navigate = useNavigate();
  const query = useSearchParams()[0];
  const user = query.get('user');
  const background = query.get('bg');
  const colorButtonCorrectAnswer = query.get('bgButtonCorrectAnswer');
  const colorButton = query.get('colorButton');

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
      setQuizData(data.data);
    });
  }, [id]);

  if (!quizData.length) {
    return <div></div>;
  }

  const buttonStyle = {
    color: 'white',
    borderColor: 'white',
    width: 350,
  };

  const correctButtonStyle = {
    backgroundColor: colorButtonCorrectAnswer || '#FE5900',
    ...buttonStyle,
  };

  const defaultButtonStyle = {
    backgroundColor: colorButton || '#6900FF',
    ...buttonStyle,
  };

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
      <div className="quiz-container">
        <h2>{quizData[currentQuestion].question}</h2>
        <div className="options-container">
          {quizData[currentQuestion].options.split('|').map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="option-button"
              style={isAnswered ? (option === quizData[currentQuestion].answer ? correctButtonStyle : defaultButtonStyle) : buttonStyle}
            >
              {option}
            </button>
          ))}
        </div>
        <br />
        {isAnswered && answer !== quizData[currentQuestion].answer && <p>A resposta correta é {quizData[currentQuestion].answer}!</p>}
        {isAnswered && currentQuestion === lengthQuiz && score !== 0 && (
          <button 
            style={{ height: 60 }}
            onClick={() => navigate(`/${id}/reward?user=${user}&answers=${btoa(answers)}&score=${score}`)}>
            Receber minha recompensa!
          </button>
        )}
        {score === 0 && isAnswered && isCorrectAnswer === false && currentQuestion === lengthQuiz && (
          <button 
            style={{ height: 60 }}
            onClick={() => window.open(location.toString(), '_self')}>
              Refazer o Quiz Novamente!
          </button>
        )}
        {isAnswered && currentQuestion !== lengthQuiz && <button onClick={handleNextQuestion}>Próxima Pergunta</button>}
        <p>Pontuação: {score}</p>
      </div>
    </div>
  );
};

export default Quiz;
