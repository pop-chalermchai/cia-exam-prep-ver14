// Translate questions to Thai and update Supabase
// Usage: node translate_questions.mjs

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GLOSSARY = readFileSync(join(__dirname, "src/data/materials/glossary_th.txt"), "utf-8");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  "https://sbvfxglyredueygwtxju.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidmZ4Z2x5cmVkdWV5Z3d0eGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MzQ3NDgsImV4cCI6MjA5NzExMDc0OH0.6c7J095nWHHXCFXEEKoOP-YHvk4Iov3p0YojLvjHPZY"
);

async function translateOne(q) {
  const prompt = `คุณเป็นผู้เชี่ยวชาญด้านการตรวจสอบภายในที่แปลข้อสอบ CIA จากภาษาอังกฤษเป็นภาษาไทย
ให้ใช้ศัพท์วิชาชีพตามอภิธานศัพท์จากมาตรฐานการตรวจสอบภายในสากล (Global Internal Audit Standards) ฉบับภาษาไทย ดังนี้:

${GLOSSARY}

กฎการแปล:
- ใช้คำศัพท์จากอภิธานศัพท์ข้างต้นเสมอเมื่อพบคำเหล่านั้น
- คงคำเหล่านี้เป็นภาษาอังกฤษ: IIA, CIA, CAE, IPPF
- แปลให้อ่านเข้าใจง่าย เป็นภาษาไทยที่เป็นธรรมชาติ
- ส่งคืนเฉพาะ JSON object เท่านั้น ไม่ต้องมี markdown หรือ code block

คำถาม: ${q.question}
ตัวเลือก: ${JSON.stringify(q.options)}
คำอธิบาย: ${q.explanation}

โครงสร้าง JSON ที่ต้องการ:
{"id": ${q.id}, "question_th": "<คำถามภาษาไทย>", "options_th": ["<ตัวเลือก A>","<ตัวเลือก B>","<ตัวเลือก C>","<ตัวเลือก D>"], "explanation_th": "<คำอธิบายภาษาไทย>"}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].text.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");
  return JSON.parse(jsonMatch[0]);
}

async function translateBatch(questions) {
  const results = [];
  for (const q of questions) {
    try {
      const t = await translateOne(q);
      results.push(t);
    } catch (err) {
      console.error(`  Skipping question ${q.id}: ${err.message}`);
    }
  }
  return results;
}

async function main() {
  // Fetch all questions without Thai translation
  const { data: questions, error } = await supabase
    .from("questions")
    .select("id, question, options, explanation")
    .is("question_th", null)
    .order("id");

  if (error) {
    console.error("Failed to fetch questions:", error.message);
    process.exit(1);
  }

  console.log(`Found ${questions.length} questions to translate...`);

  const batchSize = 5;
  let translated = 0;

  for (let i = 0; i < questions.length; i += batchSize) {
    const batch = questions.slice(i, i + batchSize);

    try {
      const translations = await translateBatch(batch);

      for (const t of translations) {
        const { error: updateError } = await supabase
          .from("questions")
          .update({
            question_th: t.question_th,
            options_th: t.options_th,
            explanation_th: t.explanation_th,
          })
          .eq("id", t.id);

        if (updateError) {
          console.error(`Error updating question ${t.id}:`, updateError.message);
        }
      }

      translated += batch.length;
      console.log(`Translated ${translated}/${questions.length}...`);

      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`Error at batch starting ${i}:`, err.message);
      // Continue with next batch
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log("Done! All questions translated.");
}

main();
