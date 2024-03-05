import React, { useState } from "react";
import "./App.css";
import * as GameAPI from "./api/game";

function App() {
  const [gameSession, setGameSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startGame = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await GameAPI.startGame();
      setGameSession(data.sessionId);
      populateQuestions();
    } catch (err) {
      setError("Failed to start game.");
      throw err;
    }

    setLoading(false);
  };

  const populateQuestions = async () => {
    try {
      const data = await GameAPI.fetchQuestions();
      setQuestions(data);
    } catch (err) {
      setError("Failed to populate questions.");
    }
  };

  const submitAnswer = async (index) => {
    // We are submitting the index
    setLoading(true);
    const currentQuestion = questions[currentQuestionIndex];

    try {
      const data = await GameAPI.submitAnswer({
        sessionId: gameSession,
        questionId: currentQuestion.id, // field name is "id", not "questionId"
        answer: index,
      });

      if (data.correct) {
        setScore(data.currentScore); // Update score from server's response
      }

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        endGame();
      }
    } catch (err) {
      setError("Failed to submit answer.");
    }

    setLoading(false);
  };

  const endGame = async () => {
    setLoading(true);

    try {
      const data = await GameAPI.endGame({
        sessionId: gameSession, // need to provide the sessionId
      });

      alert(`Game over! Your score: ${data.finalScore}`); // Use the finalScore from the response

      setGameSession(null);
      setQuestions([]);
      setCurrentQuestionIndex(0);
      setScore(0);
    } catch (err) {
      setError("Failed to end game.");
    }

    setLoading(false);
  };

  if (error) return <div className="error">Error: {error}</div>;
  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="App">
      {!gameSession ? (
        <button onClick={startGame}>Start Game</button>
      ) : (
        <div>
          <h3>{questions[currentQuestionIndex]?.questionText}</h3>
          {questions[currentQuestionIndex]?.options.map((option, index) => (
            <button
              key={index} // Key should be unique for each child in a list, use index as the key
              onClick={() => submitAnswer(index)} // Pass index instead of option
              className="option-button"
            >
              {option}
            </button>
          ))}
          <p className="score">Score: {score}</p>
        </div>
      )}
    </div>
  );
}

export default App;
