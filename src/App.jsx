import React from "react";
import HomeScreen from "./components/HomeScreen";
import QuizScreen from "./components/QuizScreen";
import ResultsScreen from "./components/ResultsScreen";
import { questions } from "./data/questions";

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function App() {
  const [screen, setScreen] = React.useState("home"); // "home" | "quiz" | "results"
  const [quizQuestions, setQuizQuestions] = React.useState([]);
  const [answers, setAnswers] = React.useState([]);
  const [lang, setLang] = React.useState("en"); // "en" | "th"

  function handleStart({ difficulty, count }) {
    let pool = questions;

    if (difficulty === "normal") {
      pool = questions.filter((q) => q.difficulty === "normal");
    } else if (difficulty === "hard") {
      pool = questions.filter((q) => q.difficulty === "hard");
    }

    const shuffled = shuffleArray(pool);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));

    setQuizQuestions(selected);
    setScreen("quiz");
  }

  function handleFinish(finalAnswers) {
    setAnswers(finalAnswers);
    setScreen("results");
  }

  function handleRestart() {
    setAnswers([]);
    setQuizQuestions([]);
    setScreen("home");
  }

  return (
    <>
      {screen === "home" && (
        <HomeScreen onStart={handleStart} lang={lang} setLang={setLang} />
      )}
      {screen === "quiz" && (
        <QuizScreen
          questions={quizQuestions}
          onFinish={handleFinish}
          lang={lang}
          setLang={setLang}
        />
      )}
      {screen === "results" && (
        <ResultsScreen
          answers={answers}
          onRestart={handleRestart}
          lang={lang}
          setLang={setLang}
        />
      )}
    </>
  );
}
