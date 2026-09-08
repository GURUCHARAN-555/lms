"use client";

import { useState } from "react";
import type { Question } from "@/data/questions";

function Highlight({ text, query }: { text: string; query: string }) {
  const terms = query.trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return <>{text}</>;
  const pattern = new RegExp(`(${terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return <>{text.split(pattern).map((part, index) => terms.some((term) => part.toLowerCase() === term.toLowerCase()) ? <mark key={index}>{part}</mark> : part)}</>;
}

function Answer({ text, query }: { text: string; query: string }) {
  return <div className="answer-text">{text.split("\n").map((line, index) => {
    if (line.startsWith("- ")) return <p className="answer-bullet" key={index}>• <Highlight text={line.slice(2).replace(/\*\*/g, "")} query={query} /></p>;
    return line ? <p key={index}><Highlight text={line.replace(/\*\*/g, "")} query={query} /></p> : null;
  })}</div>;
}

export default function QuestionCard({ item, query, expanded, onToggle }: { item: Question; query: string; expanded: boolean; onToggle: () => void }) {
  const [copied, setCopied] = useState(false);
  const preview = item.answer.replace(/\n|\*\*/g, " ").slice(0, 176).trim();
  async function copy() { await navigator.clipboard.writeText(item.answer); setCopied(true); setTimeout(() => setCopied(false), 1600); }
  return <article className={`question-card ${expanded ? "expanded" : ""}`} id={`question-${item.id}`}>
    <div className="card-top"><span className="category">{item.category ?? "General"}</span><span className="question-number">#{item.id}</span></div>
    <h2><Highlight text={item.question} query={query} /></h2>
    <p className="answer-label">Answer</p>
    {expanded ? <><Answer text={item.answer} query={query} /><div className="card-actions"><button className="read-more" onClick={onToggle}>Collapse <span>↑</span></button><button className="copy-button" onClick={copy}>{copied ? "Copied ✓" : "Copy Answer"}</button></div></> : <><p className="preview"><Highlight text={`${preview}${item.answer.length > 176 ? "…" : ""}`} query={query} /></p><div className="card-actions"><button className="read-more" onClick={onToggle}>Read more <span>↓</span></button><button className="copy-button" onClick={copy}>{copied ? "Copied ✓" : "Copy Answer"}</button></div></>}
    {!!item.keywords?.length && <div className="keywords">{item.keywords.map((word) => <span key={word}><Highlight text={word} query={query} /></span>)}</div>}
  </article>;
}
