import type { Question } from "@/data/questions";

export interface QuestionValidationReport {
  valid: boolean;
  errors: string[];
  duplicateRecords: number;
}

export function validateQuestions(items: Question[]): QuestionValidationReport {
  const errors: string[] = [];
  const ids = new Set<number>();
  const records = new Set<string>();
  let duplicateRecords = 0;

  for (const item of items) {
    if (!Number.isInteger(item.id) || item.id < 1) errors.push(`Invalid id: ${item.id}`);
    if (ids.has(item.id)) errors.push(`Duplicate id: ${item.id}`);
    ids.add(item.id);
    if (!item.question.trim()) errors.push(`Question ${item.id} is empty`);
    if (!item.answer.trim()) errors.push(`Answer ${item.id} is empty`);
    if (/^[A-D]$/i.test(item.answer.trim())) errors.push(`Answer ${item.id} is only an option letter`);

    const record = `${item.question.trim().toLowerCase()}\u0000${item.answer.trim().toLowerCase()}`;
    if (records.has(record)) duplicateRecords += 1;
    records.add(record);
  }
  return { valid: errors.length === 0, errors, duplicateRecords };
}
