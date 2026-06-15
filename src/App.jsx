import React from "react";
import HomeScreen from "./components/HomeScreen";
import QuizScreen from "./components/QuizScreen";
import ResultsScreen from "./components/ResultsScreen";
import { supabase } from "./lib/supabase";

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function App() {
  const [screen, setScreen] = React.useState("home");
  const [quizQuestions, setQuizQuestions] = React.useState([]);
  const [answers, setAnswers] = React.useState([]);
  const [lang, setLang] = React.useState("en");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  async function handleStart({ difficulty, part, count }) {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from("questions").select("*");

      if (part) query = query.eq("part", part);
      if (difficulty !== "mixed") query = query.eq("difficulty", difficulty);

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const shuffled = shuffleArray(data);
      const selected = shuffled.slice(0, Math.min(count, shuffled.length));

      setQuizQuestions(selected);
      setScreen("quiz");
    } catch (err) {
      setError("Failed to load questions. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
        <HomeScreen
          onStart={handleStart}
          lang={lang}
          setLang={setLang}
          loading={loading}
          error={error}
        />
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
