// Translate questions to Thai and update Supabase
// Usage: node translate_questions.mjs

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  "https://sbvfxglyredueygwtxju.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidmZ4Z2x5cmVkdWV5Z3d0eGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1MzQ3NDgsImV4cCI6MjA5NzExMDc0OH0.6c7J095nWHHXCFXEEKoOP-YHvk4Iov3p0YojLvjHPZY"
);

async function translateBatch(questions) {
  const prompt = `Translate the following CIA exam questions from English to Thai.
Return ONLY a valid JSON array with the same structure, adding Thai translations.
Keep technical terms like "IIA", "CIA", "CAE", "IPPF", "Standards" as-is.

${JSON.stringify(questions.map(q => ({
  id: q.id,
  question: q.question,
  options: q.options,
  explanation: q.explanation,
})))}

Return JSON array with this structure for each item:
[{"id": <number>, "question_th": "<Thai>", "options_th": ["<Thai A>","<Thai B>","<Thai C>","<Thai D>"], "explanation_th": "<Thai>"}]`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 8000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].text;
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("No JSON found in response");
  return JSON.parse(jsonMatch[0]);
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
