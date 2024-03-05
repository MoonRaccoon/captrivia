// Use REACT_APP_BACKEND_URL or http://localhost:8080 as the API_BASE
const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

export const startGame = async () => {
  const res = await fetch(`${API_BASE}/game/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
};

export const fetchQuestions = async () => {
  const res = await fetch(`${API_BASE}/questions`);
  return res.json();
};

export const submitAnswer = async ({ sessionId, questionId, answer }) => {
  const res = await fetch(`${API_BASE}/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
      questionId,
      answer,
    }),
  });

  return res.json();
};

export const endGame = async ({ sessionId }) => {
  const res = await fetch(`${API_BASE}/game/end`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
    }),
  });

  return res.json();
};
