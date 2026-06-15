import React from "react";
import LanguageToggle from "./LanguageToggle";

const DOMAIN_TH = {
  "Domain 1: Foundations of Internal Auditing":
    "Domain 1: รากฐานการตรวจสอบภายใน",
  "Domain 2: Independence and Objectivity":
    "Domain 2: ความเป็นอิสระและความเที่ยงธรรม",
  "Domain 3: Proficiency and Due Professional Care":
    "Domain 3: ความชำนาญและความรอบคอบทางวิชาชีพ",
  "Domain 4: Quality Assurance and Improvement Program":
    "Domain 4: โปรแกรมการประกันและปรับปรุงคุณภาพ",
};

export default function QuizScreen({ questions, onFinish, lang, setLang }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState(null);
  const [answers, setAnswers] = React.useState([]);

  const question = questions[currentIndex];
  const total = questions.length;
  const progress = (currentIndex / total) * 100;
  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === question.correct;

  const isTh = lang === "th";

  const qText = isTh && question.question_th ? question.question_th : question.question;
  const opts = isTh && question.options_th ? question.options_th : question.options;
  const expl = isTh && question.explanation_th ? question.explanation_th : question.explanation;
  const domainLabel = isTh ? (DOMAIN_TH[question.domain] || question.domain) : question.domain;

  function handleSelect(idx) {
    if (isAnswered) return;
    setSelectedOption(idx);
  }

  function handleNext() {
    const newAnswers = [
      ...answers,
      {
        questionId: question.id,
        question: question.question,
        question_th: question.question_th,
        selected: selectedOption,
        correct: question.correct,
        options: question.options,
        options_th: question.options_th,
        explanation: question.explanation,
        explanation_th: question.explanation_th,
        domain: question.domain,
        difficulty: question.difficulty,
      },
    ];
    if (currentIndex + 1 >= total) {
      onFinish(newAnswers);
    } else {
      setAnswers(newAnswers);
      setSelectedOption(null);
      setCurrentIndex(currentIndex + 1);
    }
  }

  function getOptionStyle(idx) {
    if (!isAnswered) {
      return "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer";
    }
    if (idx === question.correct) {
      return "border-green-500 bg-green-50 cursor-default";
    }
    if (idx === selectedOption && idx !== question.correct) {
      return "border-red-500 bg-red-50 cursor-default";
    }
    return "border-gray-200 bg-gray-50 opacity-60 cursor-default";
  }

  function getOptionLabelStyle(idx) {
    if (!isAnswered) return "bg-gray-100 text-gray-600";
    if (idx === question.correct) return "bg-green-500 text-white";
    if (idx === selectedOption && idx !== question.correct)
      return "bg-red-500 text-white";
    return "bg-gray-200 text-gray-500";
  }

  const difficultyBadge =
    question.difficulty === "hard"
      ? "bg-red-100 text-red-700 border border-red-200"
      : "bg-green-100 text-green-700 border border-green-200";

  const difficultyLabel =
    question.difficulty === "hard"
      ? isTh ? "ยาก" : "Hard"
      : isTh ? "ปกติ" : "Normal";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-600">
              {isTh
                ? `ข้อ ${currentIndex + 1} จาก ${total}`
                : `Question ${currentIndex + 1} of ${total}`}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${difficultyBadge}`}
              >
                {difficultyLabel}
              </span>
              <LanguageToggle lang={lang} setLang={setLang} />
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Domain tag */}
        <div className="mb-4">
          <span className="text-xs font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            {domainLabel}
          </span>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 leading-relaxed">
            {qText}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {opts.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left rounded-xl border-2 p-4 transition-all duration-200 flex items-start gap-4 ${getOptionStyle(idx)}`}
            >
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${getOptionLabelStyle(idx)}`}
              >
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-gray-700 text-sm leading-relaxed pt-1">
                {opt}
              </span>
              {isAnswered && idx === question.correct && (
                <svg
                  className="flex-shrink-0 w-5 h-5 text-green-500 mt-1 ml-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {isAnswered &&
                idx === selectedOption &&
                idx !== question.correct && (
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-red-500 mt-1 ml-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
            </button>
          ))}
        </div>

        {/* Explanation panel */}
        {isAnswered && (
          <div
            className={`rounded-2xl p-6 mb-6 border-l-4 ${
              isCorrect
                ? "bg-green-50 border-green-500"
                : "bg-red-50 border-red-500"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {isCorrect ? (
                <>
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="font-bold text-green-700">
                    {isTh ? "ถูกต้อง!" : "Correct!"}
                  </span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="font-bold text-red-700">
                    {isTh ? "ไม่ถูกต้อง" : "Incorrect"}
                  </span>
                </>
              )}
            </div>
            {!isCorrect && (
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {isTh ? "คำตอบที่ถูกต้อง:" : "Correct answer:"}{" "}
                <span className="text-green-700">
                  {String.fromCharCode(65 + question.correct)}.{" "}
                  {opts[question.correct]}
                </span>
              </p>
            )}
            <h4 className="text-sm font-bold text-gray-700 mb-1">
              {isTh ? "คำอธิบาย" : "Explanation"}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">{expl}</p>
          </div>
        )}

        {/* Next button */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            {currentIndex + 1 >= total ? (
              <>
                <span>{isTh ? "ดูผลสอบ" : "View Results"}</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </>
            ) : (
              <>
                <span>{isTh ? "ข้อถัดไป" : "Next Question"}</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
