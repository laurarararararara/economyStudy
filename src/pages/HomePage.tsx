import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { chapters, fourConstraints } from '../data/book';

export function HomePage() {
  const storyCount = chapters.reduce(
    (n, ch) => n + ch.sections.reduce((m, s) => m + s.lectures.filter((l) => l.hasStory).length, 0),
    0,
  );
  const lectureCount = chapters.reduce(
    (n, ch) => n + ch.sections.reduce((m, s) => m + s.lectures.length, 0),
    0,
  );

  return (
    <div className="home">
      <section className="hero-banner">
        <div className="hero-text">
          <p className="eyebrow">来自超过 25 万人的经济学课堂</p>
          <h1>薛兆丰经济学讲义</h1>
          <p className="lead">
            十大章节、{lectureCount} 讲，每一讲含书中原文与通俗解读；经典案例另配对话阅读，部分有 B 站视频延伸。
            漫画和视频只是呈现方式，核心内容以文字为主。
          </p>
          <div className="hero-actions">
            <Link to="/chapters/ch1" className="btn btn-primary">
              从第 1 章读起
            </Link>
            <Link to="/stories" className="btn btn-outline">
              浏览 {storyCount} 个案例故事
            </Link>
          </div>
        </div>
        <div className="constraints-grid">
          {fourConstraints.map((c) => (
            <div key={c.label} className="constraint-card">
              <span>{c.icon}</span>
              <strong>{c.label}</strong>
              <small>{c.desc}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="chapter-list">
        <h2>全书目录</h2>
        <p className="section-desc">点击章节进入子篇与讲次列表；每一讲均可阅读完整解读，案例讲次另有对话剧场。</p>
        <div className="chapters-grid">
          {chapters.map((ch) => {
            const lectures = ch.sections.flatMap((s) => s.lectures);
            const withStory = lectures.filter((l) => l.hasStory).length;
            return (
              <Link
                key={ch.id}
                to={`/chapters/${ch.id}`}
                className="chapter-card"
                style={{ '--accent': ch.color } as CSSProperties}
              >
                <span className="chapter-num">第 {ch.number} 章</span>
                <h3>{ch.title}</h3>
                <p className="chapter-sub">{ch.subtitle}</p>
                <p className="chapter-theme">{ch.theme}</p>
                <footer>
                  <span>{ch.sections.length} 个子篇</span>
                  <span>{lectures.length} 讲</span>
                  {withStory > 0 && <span className="story-badge">🎬 {withStory} 故事</span>}
                </footer>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
