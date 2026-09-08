import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../data/questions.ts", import.meta.url), "utf8");
const recordPattern = /\{ id: (\d+), question: ("(?:\\.|[^"\\])*"), answer: ("(?:\\.|[^"\\])*"), category:/g;
const records = Array.from(source.matchAll(recordPattern), ([, id, question, answer]) => ({
  id: Number(id), question: JSON.parse(question), answer: JSON.parse(answer)
}));
const errors = [];
const ids = new Set();
const qas = new Set();
let duplicateRecords = 0;
for (const item of records) {
  if (ids.has(item.id)) errors.push(`Duplicate id: ${item.id}`);
  ids.add(item.id);
  if (!item.question.trim()) errors.push(`Question ${item.id} is empty`);
  if (!item.answer.trim()) errors.push(`Answer ${item.id} is empty`);
  if (/^[A-D]$/i.test(item.answer.trim())) errors.push(`Answer ${item.id} is only an option letter`);
  const key = `${item.question.trim().toLowerCase()}\u0000${item.answer.trim().toLowerCase()}`;
  if (qas.has(key)) duplicateRecords += 1;
  qas.add(key);
}
const sequential = records.every((item, index) => item.id === index + 1);
console.log(`Questions imported: ${records.length}`);
console.log(`Invalid records: ${errors.length}`);
console.log(`Duplicate records: ${duplicateRecords}`);
console.log(`Sequential ids: ${sequential ? "yes" : "no"}`);
if (errors.length || !sequential) {
  for (const error of errors) console.error(error);
  process.exitCode = 1;
}
