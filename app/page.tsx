"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import QuestionList from "@/components/QuestionList";
import { questions } from "@/data/questions";
import { searchQuestions } from "@/lib/search";

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const categories = useMemo(() => ["All", ...Array.from(new Set(questions.map((item) => item.category).filter((item): item is string => Boolean(item)))).sort()], []);
  const results = useMemo(() => searchQuestions(questions, query, category), [query, category]);
  const clear = () => { setQuery(""); setCategory("All"); setExpandedId(null); inputRef.current?.focus(); };

  useEffect(() => {
    const shared = new URLSearchParams(window.location.search).get("question");
    const id = Number(shared);
    if (questions.some((item) => item.id === id)) setExpandedId(id);
  }, []);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") { event.preventDefault(); inputRef.current?.focus(); }
      if (event.key === "Escape") { if (document.activeElement === inputRef.current && query) clear(); else setExpandedId(null); }
    };
    window.addEventListener("keydown", keydown); return () => window.removeEventListener("keydown", keydown);
  }, [query]);
  function toggle(id: number) {
    const next = expandedId === id ? null : id; setExpandedId(next);
    const url = new URL(window.location.href); next ? url.searchParams.set("question", String(id)) : url.searchParams.delete("question");
    window.history.replaceState({}, "", url);
  }
  const isSearching = Boolean(query.trim());

  return <main id="top"><Header /><section className="hero"><p className="eyebrow">KNOWLEDGE, WITHIN REACH</p><h1>Question &amp; Answer<br /><em>Search</em></h1><p className="subtitle">Search your complete question bank instantly.</p><SearchBar value={query} onChange={setQuery} onClear={clear} inputRef={inputRef} /><p className="count"><strong>{questions.length}</strong> Questions <span>•</span> press <kbd>/</kbd> to search</p><a className="pdf-download" href="/Questions_and_Answers_Remote_Sensing_GIS_FULL_WORDS.pdf" download>↓ Download Question Bank PDF</a></section><section className="content"><CategoryFilter categories={categories} selected={category} onChange={setCategory} /><div className="result-heading"><div><p className="section-kicker">{isSearching ? "SEARCH RESULTS" : "BROWSE LIBRARY"}</p><h2>{isSearching ? "Search Results" : "All Questions"}</h2></div>{isSearching && <p>{results.length} {results.length === 1 ? "result" : "results"} found for <strong>“{query}”</strong></p>}</div>{results.length ? <QuestionList items={results} query={query} expandedId={expandedId} onToggle={toggle} /> : <div className="empty"><span>⌕</span><h2>No results found</h2><p>Try searching with a different keyword or phrase.</p><button onClick={clear}>Clear Search</button></div>}</section><footer>Built for focused learning <span>·</span> Your questions stay in your browser</footer></main>;
}
