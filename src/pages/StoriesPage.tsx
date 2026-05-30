import { Link } from 'react-router-dom';
import { chapters } from '../data/book';
import { getLecture } from '../data/lectures';

const storyLectures = chapters.flatMap((ch) =>
  ch.sections.flatMap((sec) =>
    sec.lectures
      .filter((l) => l.hasStory)
      .map((l) => ({ ...l, chapter: ch, section: sec.title })),
  ),
);

export function StoriesPage() {
  return (
    <div className="stories-page">
      <header>
        <h1>案例故事</h1>
        <p>
          每个案例都有完整文字解读，并配有<strong>对话阅读</strong>（小王与薛老师一问一答）；
          部分讲次另有哔哩哔哩视频延伸。
        </p>
      </header>
      <div className="stories-grid">
        {storyLectures.map((lec) => {
          const content = getLecture(lec.id);
          const tags = ['原文', '文字解读', '对话阅读'];
          if (content?.bilibili) tags.push('B站延伸');
          return (
            <Link key={lec.id} to={`/lectures/${lec.id}`} className="story-card">
              <span className="story-media-tag">{tags.join(' · ')}</span>
              <h3>{lec.title}</h3>
              <p>{content?.takeaway ?? ''}</p>
              <footer>
                第 {lec.chapter.number} 章 · 第 {String(lec.number).padStart(3, '0')} 讲
              </footer>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
