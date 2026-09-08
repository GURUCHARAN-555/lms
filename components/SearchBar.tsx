import type { RefObject } from "react";

export default function SearchBar({ value, onChange, onClear, inputRef }: { value: string; onChange: (value: string) => void; onClear: () => void; inputRef: RefObject<HTMLInputElement> }) {
  return <div className="search-wrap"><label className="sr-only" htmlFor="search">Search the question bank</label><span className="search-icon" aria-hidden>⌕</span><input ref={inputRef} id="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search questions, keywords, topics or answers..." autoComplete="off" />{value && <button className="clear-button" onClick={onClear} aria-label="Clear search">×</button>}</div>;
}
