export default function CategoryFilter({ categories, selected, onChange }: { categories: string[]; selected: string; onChange: (value: string) => void }) {
  return <div id="categories" className="categories" aria-label="Filter questions by category">{categories.map((category) => <button key={category} className={selected === category ? "chip active" : "chip"} onClick={() => onChange(category)}>{category}</button>)}</div>;
}
