import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return <header className="site-header"><a className="brand" href="#top"><span>✦</span> Q&A Search</a><nav aria-label="Main navigation"><a href="#top">Home</a><a href="#categories">Categories</a><ThemeToggle /></nav></header>;
}
