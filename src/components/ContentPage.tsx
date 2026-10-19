import { ArrowRight } from "lucide-react";
import { contentPages, type ContentPageData } from "../data/pages";

export function ContentPage({ page }: { page: ContentPageData }) {
  return (
    <div className="home-page">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Noillirk home"><span className="brand-word">NOILLIRK</span></a>
        <a className="nav-play" href={`/?play=${page.mode}`}>Play Now</a>
      </header>
      <main className="content-page">
        <nav className="content-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">{page.heading}</span></nav>
        <article>
          <h1>{page.heading}</h1>
          <p className="content-intro">{page.intro}</p>
          <a className="primary-button" href={`/?play=${page.mode}`}>Play {page.mode === "crowd" ? "Crowd 100" : "Sky Climb"}<ArrowRight size={18} /></a>
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </article>
        <nav className="content-related" aria-label="More Noillirk guides">
          <h2>Keep exploring</h2>
          {contentPages.filter((other) => other.path !== page.path).map((other) => <a href={other.path} key={other.path}>{other.heading}<ArrowRight size={16} /></a>)}
          <a href="/">Play Noillirk free online<ArrowRight size={16} /></a>
        </nav>
        <p className="summary-disclaimer">Independent fan-made edition. Not affiliated with Daily or the original Noillirk. Answer rankings are editorial estimates.</p>
      </main>
    </div>
  );
}
