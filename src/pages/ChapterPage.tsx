import type { CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import { chapters } from '../data/book';

export function ChapterPage() {
  const { chapterId } = useParams();
  const chapter = chapters.find((c) => c.id === chapterId);

  if (!chapter) {
    return (
      <div className="empty-state">
        <h2>章节未找到</h2>
        <Link to="/">返回首页</Link>
      </div>
    );
  }

  const prev = chapters.find((c) => c.number === chapter.number - 1);
  const next = chapters.find((c) => c.number === chapter.number + 1);

  return (
    <article className="chapter-page" style={{ '--accent': chapter.color } as CSSProperties}>
      <nav className="breadcrumb">
        <Link to="/">目录</Link>
        <span>/</span>
        <span>第 {chapter.number} 章</span>
      </nav>

      <header className="chapter-header">
        <span className="chapter-num">第 {chapter.number} 章</span>
        <h1>{chapter.title}</h1>
        <p className="chapter-sub">{chapter.subtitle}</p>
        <p className="chapter-theme">{chapter.theme}</p>
      </header>

      {chapter.sections.map((section) => (
        <section key={section.id} className="subsection">
          <h2>{section.title}</h2>
          <ul className="lecture-list">
            {section.lectures.map((lec) => (
              <li key={lec.id} className={lec.hasStory ? 'has-story' : ''}>
                <Link to={`/lectures/${lec.id}`} className="lecture-link">
                  <span className="lecture-id">第 {String(lec.number).padStart(3, '0')} 讲</span>
                  <span className="lecture-title">{lec.title}</span>
                  {lec.hasStory && <span className="story-badge-small">案例</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <nav className="chapter-nav">
        {prev ? (
          <Link to={`/chapters/${prev.id}`} className="nav-prev">
            ← 第 {prev.number} 章 {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/chapters/${next.id}`} className="nav-next">
            第 {next.number} 章 {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
