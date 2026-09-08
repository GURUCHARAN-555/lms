import type { Question } from "@/data/questions";

const normalize = (value: string) => value.toLowerCase().trim().replace(/\s+/g, " ");

export function searchQuestions(items: Question[], searchQuery: string, selectedCategory = "All") {
  const query = normalize(searchQuery);
  const terms = query.split(" ").filter(Boolean);

  return items
    .filter((item) => selectedCategory === "All" || item.category === selectedCategory)
    .map((item, index) => {
      if (!terms.length) return { item, score: 0, index };
      const question = normalize(item.question);
      const answer = normalize(item.answer);
      const category = normalize(item.category ?? "");
      const keywords = normalize((item.keywords ?? []).join(" "));
      const matches = terms.every((term) => [question, answer, category, keywords].some((field) => field.includes(term)));
      if (!matches) return null;

      let score = 0;
      if (question === query) score += 1000;
      if (question.startsWith(query)) score += 500;
      if (question.includes(query)) score += 250;
      if (keywords.includes(query)) score += 120;
      if (category.includes(query)) score += 80;
      if (answer.includes(query)) score += 40;
      for (const term of terms) {
        if (question.includes(term)) score += 30;
        if (keywords.includes(term)) score += 15;
        if (category.includes(term)) score += 10;
        if (answer.includes(term)) score += 5;
      }
      return { item, score, index };
    })
    .filter((entry): entry is { item: Question; score: number; index: number } => entry !== null)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ item }) => item);
}
