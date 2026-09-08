import type { Question } from "@/data/questions";
import QuestionCard from "./QuestionCard";

export default function QuestionList({ items, query, expandedId, onToggle }: { items: Question[]; query: string; expandedId: number | null; onToggle: (id: number) => void }) {
  return <div className="question-list">{items.map((item) => <QuestionCard key={item.id} item={item} query={query} expanded={item.id === expandedId} onToggle={() => onToggle(item.id)} />)}</div>;
}
