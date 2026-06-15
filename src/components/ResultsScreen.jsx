import React from "react";
import LanguageToggle from "./LanguageToggle";

const PASS_THRESHOLD = 75;

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

export default function ResultsScreen({ answers, onRestart, lang, setLang }) {
  const [showReview, setShowReview] = React.useState(false);

  const isTh = lang === "th";

  const total = answers.length;
  const correct = answers.filter((a) => a.selected === a.correct).length;
  const wrong = total - correct;
  const percentage = Math.round((correct / total) * 100);
  const passed = percentage >= PASS_THRESHOLD;

  const wrongAnswers = answers.filter((a) => a.selected !== a.correct);

  const domainStats = answers.reduce((acc, a) => {
    const d = a.domain;
    if (!acc[d]) acc[d] = { total: 0, correct: 0 };
    acc[d].total++;
    if (a.selected === a.correct) acc[d].correct++;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <LanguageToggle lang={lang} setLang={setLang} />
        </div>

        {/* Score Card */}
        <div
          className={`rounded-2xl shadow-lg p-8 mb-6 text-center ${
            passed
              ? "bg-gradient-to-br from-green-600 to-green-700"
              : "bg-gradient-to-br from-red-600 to-red-700"
          }`}
        >
          <div className="mb-4">
            {passed ? (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white bg-opacity-20 mb-4">
                <svg
                  className="w-10 h-10 text-white"
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
              </div>
            ) : (
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white bg-opacity-20 mb-4">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="text-7xl font-bold text-white mb-2">{percentage}%</div>
          <div
            className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4 ${
              passed ? "bg-green-500 text-white" : "bg-red-500 text-white"
            } bg-opacity-40 border border-white border-opacity-30`}
          >
            {passed ? (isTh ? "ผ่าน" : "PASS") : isTh ? "ไม่ผ่าน" : "FAIL"}
          </div>
          <p className="text-white text-opacity-90 text-base">
            {correct} {isTh ? "จาก" : "out of"} {total}{" "}
            {isTh ? "ข้อที่ตอบถูก" : "questions correct"}
          </p>
          <p className="text-white text-opacity-70 text-sm mt-1">
            {isTh ? "เกณฑ์ผ่าน:" : "Pass mark:"} {PASS_THRESHOLD}%
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {correct}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              {isTh ? "ถูก" : "Correct"}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-3xl font-bold text-red-500 mb-1">{wrong}</div>
            <div className="text-xs text-gray-500 font-medium">
              {isTh ? "ผิด" : "Incorrect"}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{total}</div>
            <div className="text-xs text-gray-500 font-medium">
              {isTh ? "ทั้งหมด" : "Total"}
            </div>
          </div>
        </div>

        {/* Domain Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">
            {isTh ? "ผลตามหัวข้อ" : "Performance by Domain"}
          </h3>
          <div className="space-y-4">
            {Object.entries(domainStats).map(([domain, stats]) => {
              const pct = Math.round((stats.correct / stats.total) * 100);
              const color =
                pct >= 75
                  ? "bg-green-500"
                  : pct >= 50
                  ? "bg-yellow-400"
                  : "bg-red-500";
              const domainLabel = isTh
                ? DOMAIN_TH[domain] || domain
                : domain;
              return (
                <div key={domain}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600 font-medium truncate pr-2">
                      {domainLabel}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        pct >= 75
                          ? "text-green-600"
                          : pct >= 50
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {stats.correct}/{stats.total} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${color} h-2 rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review Wrong Answers */}
        {wrongAnswers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
            <button
              onClick={() => setShowReview(!showReview)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-bold text-gray-800">
                {isTh
                  ? `ทบทวนข้อที่ตอบผิด (${wrongAnswers.length})`
                  : `Review Incorrect Answers (${wrongAnswers.length})`}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                  showReview ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showReview && (
              <div className="divide-y divide-gray-100">
                {wrongAnswers.map((a, i) => {
                  const qText =
                    isTh && a.question_th ? a.question_th : a.question;
                  const opts =
                    isTh && a.options_th ? a.options_th : a.options;
                  const expl =
                    isTh && a.explanation_th
                      ? a.explanation_th
                      : a.explanation;
                  const domainLabel = isTh
                    ? DOMAIN_TH[a.domain] || a.domain
                    : a.domain;
                  return (
                    <div key={a.questionId} className="p-6">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <div>
                          <span className="text-xs text-blue-600 font-medium">
                            {domainLabel}
                          </span>
                          <p className="text-sm font-semibold text-gray-800 mt-1">
                            {qText}
                          </p>
                        </div>
                      </div>

                      <div className="ml-9 space-y-2">
                        <div className="flex items-start gap-2 p-2 rounded-lg bg-red-50 border border-red-200">
                          <svg
                            className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5"
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
                          <div>
                            <span className="text-xs text-red-500 font-semibold">
                              {isTh ? "คำตอบของคุณ: " : "Your answer: "}
                            </span>
                            <span className="text-xs text-red-700">
                              {String.fromCharCode(65 + a.selected)}.{" "}
                              {opts[a.selected]}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 p-2 rounded-lg bg-green-50 border border-green-200">
                          <svg
                            className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
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
                          <div>
                            <span className="text-xs text-green-600 font-semibold">
                              {isTh ? "คำตอบที่ถูกต้อง: " : "Correct answer: "}
                            </span>
                            <span className="text-xs text-green-700">
                              {String.fromCharCode(65 + a.correct)}.{" "}
                              {opts[a.correct]}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                          <p className="text-xs font-bold text-blue-700 mb-1">
                            {isTh ? "คำอธิบาย" : "Explanation"}
                          </p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {expl}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 shadow-lg"
          >
            {isTh ? "ลองใหม่" : "Try Again"}
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          {isTh
            ? "เตรียมสอบ CIA Part 1 · อ้างอิง IIA IPPF Standards"
            : "CIA Part 1 Exam Prep · Based on IIA IPPF Standards"}
        </p>
      </div>
    </div>
  );
}
