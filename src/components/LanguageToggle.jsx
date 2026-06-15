import React from "react";

export default function LanguageToggle({ lang, setLang }) {
  return (
    <div className="flex items-center rounded-full border border-white border-opacity-30 overflow-hidden text-xs font-bold select-none"
      style={{ background: "rgba(255,255,255,0.1)" }}>
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1 transition-all duration-200 ${
          lang === "en"
            ? "bg-white text-blue-700"
            : "text-white hover:bg-white hover:bg-opacity-20"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("th")}
        className={`px-3 py-1 transition-all duration-200 ${
          lang === "th"
            ? "bg-white text-blue-700"
            : "text-white hover:bg-white hover:bg-opacity-20"
        }`}
      >
        TH
      </button>
    </div>
  );
}
