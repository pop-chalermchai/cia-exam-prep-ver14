import React from "react";
import LanguageToggle from "./LanguageToggle";

const QUESTION_COUNTS = [10, 20, 30];

const T = {
  examPrep: { en: "Exam Preparation", th: "เตรียมสอบ" },
  selectPart: { en: "Exam Part", th: "ส่วนของข้อสอบ" },
  part1: { en: "CIA Part 1", th: "CIA ภาค 1" },
  part2: { en: "CIA Part 2", th: "CIA ภาค 2" },
  difficultyLevel: { en: "Difficulty Level", th: "ระดับความยาก" },
  normal: { en: "Normal", th: "ปกติ" },
  hard: { en: "Hard", th: "ยาก" },
  mixed: { en: "Mixed", th: "ผสม" },
  conceptual: { en: "Conceptual questions", th: "ข้อสอบแนวความคิด" },
  scenarioBased: { en: "Scenario-based", th: "ข้อสอบเชิงสถานการณ์" },
  allLevels: { en: "All difficulty levels", th: "ทุกระดับความยาก" },
  numQuestions: { en: "Number of Questions", th: "จำนวนข้อ" },
  startExam: { en: "Start Exam Practice", th: "เริ่มทำข้อสอบ" },
  loading: { en: "Loading questions...", th: "กำลังโหลดข้อสอบ..." },
  passmark: {
    en: "Pass mark: 75% · Based on IIA Standards 2024",
    th: "เกณฑ์ผ่าน: 75% · อ้างอิง IIA Standards 2024",
  },
  desc: {
    en: "Practice questions for CIA Part 1 & Part 2 examinations based on IIA Standards 2024.",
    th: "ข้อสอบฝึกหัดสำหรับการสอบ CIA ภาค 1 และ ภาค 2 อ้างอิง IIA Standards 2024",
  },
};

export default function HomeScreen({ onStart, lang, setLang, loading, error }) {
  const [part, setPart] = React.useState(1);
  const [difficulty, setDifficulty] = React.useState("mixed");
  const [count, setCount] = React.useState(20);

  const t = (key) => T[key][lang];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)",
      }}
    >
      <div className="w-full max-w-2xl">
        <div className="flex justify-end mb-4">
          <LanguageToggle lang={lang} setLang={setLang} />
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500 bg-opacity-20 border-2 border-blue-400 mb-6">
            <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">CIA Exam Prep</h1>
          <h2 className="text-xl font-semibold text-blue-300 mb-4">{t("examPrep")}</h2>
          <p className="text-blue-200 text-sm max-w-md mx-auto leading-relaxed">{t("desc")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Part Selection */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
              {t("selectPart")}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 1, label: t("part1"), icon: "📘" },
                { value: 2, label: t("part2"), icon: "📗" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPart(opt.value)}
                  className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                    part === opt.value
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="text-2xl mb-1">{opt.icon}</div>
                  <div className={`font-semibold text-sm ${part === opt.value ? "text-blue-700" : "text-gray-700"}`}>
                    {opt.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
              {t("difficultyLevel")}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "normal", label: t("normal"), desc: t("conceptual"), icon: "📘" },
                { value: "hard", label: t("hard"), desc: t("scenarioBased"), icon: "🔴" },
                { value: "mixed", label: t("mixed"), desc: t("allLevels"), icon: "⚡" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDifficulty(opt.value)}
                  className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                    difficulty === opt.value
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="text-2xl mb-1">{opt.icon}</div>
                  <div className={`font-semibold text-sm ${difficulty === opt.value ? "text-blue-700" : "text-gray-700"}`}>
                    {opt.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
              {t("numQuestions")}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {QUESTION_COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`py-3 rounded-xl border-2 font-semibold text-lg transition-all duration-200 ${
                    count === n
                      ? "border-blue-600 bg-blue-600 text-white shadow-md"
                      : "border-gray-200 text-gray-700 hover:border-blue-300"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={() => onStart({ difficulty, part, count })}
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? t("loading") : t("startExam")}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">{t("passmark")}</p>
        </div>
      </div>
    </div>
  );
}
