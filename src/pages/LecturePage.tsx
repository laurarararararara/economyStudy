import { useLayoutEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { BilibiliEmbed } from '../components/BilibiliEmbed';
import { DialogueViewer } from '../components/DialogueViewer';
import { getLecture } from '../data/lectures';
import type { PresentationMode } from '../types';
import { findLectureContext } from '../utils/lectureContext';

function resolveInitialMode(
  param: string | null,
  hasBilibili: boolean,
): PresentationMode {
  if (param === 'bilibili' && hasBilibili) return 'bilibili';
  if (param === 'dialogue') return 'dialogue';
  if (param === 'text') return 'text';
  return 'original';
}

export function LecturePage() {
  const { lectureId } = useParams();
  const [searchParams] = useSearchParams();
  const lecture = lectureId ? getLecture(lectureId) : undefined;
  const ctx = lectureId ? findLectureContext(lectureId) : null;

  const hasBilibili = Boolean(lecture?.bilibili);
  const initialMode = resolveInitialMode(searchParams.get('view'), hasBilibili);
  const [mode, setMode] = useState<PresentationMode>(initialMode);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [lectureId]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [mode]);

  if (!lecture || !ctx) {
    return (
      <div className="empty-state">
        <h2>讲次未找到</h2>
        <Link to="/">返回首页</Link>
      </div>
    );
  }

  const activeMode =
    mode === 'bilibili' && !hasBilibili ? 'original' : mode;
  const originalText = lecture.original ?? lecture.body;

  const modes: { id: PresentationMode; label: string; show: boolean }[] = [
    { id: 'original', label: '原文', show: true },
    { id: 'text', label: '文字解读', show: true },
    { id: 'dialogue', label: '对话阅读', show: lecture.dialogue.length > 0 },
    { id: 'bilibili', label: 'B站延伸', show: hasBilibili },
  ];

  return (
    <article
      className="lecture-page"
      style={{ '--accent': ctx.chapterColor } as CSSProperties}
    >
      <nav className="breadcrumb">
        <Link to="/">目录</Link>
        <span>/</span>
        <Link to={`/chapters/${ctx.chapterId}`}>
          第 {ctx.chapterNumber} 章 {ctx.chapterTitle}
        </Link>
        <span>/</span>
        <span>第 {String(ctx.lectureNumber).padStart(3, '0')} 讲</span>
      </nav>

      <header className="lecture-header">
        <p className="lecture-meta">{ctx.sectionTitle}</p>
        <h1>
          第 {String(ctx.lectureNumber).padStart(3, '0')} 讲 · {lecture.title}
        </h1>
        <p className="lecture-takeaway-inline">
          <strong>一句话：</strong>
          {lecture.takeaway}
        </p>
      </header>

      <div className="mode-tabs" role="tablist">
        {modes
          .filter((m) => m.show)
          .map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={activeMode === m.id}
              className={activeMode === m.id ? 'active' : ''}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
      </div>

      <div className="lecture-content-panel">
        {activeMode === 'original' && (
          <section className="original-panel">
            <h2>原文</h2>
            <p className="panel-intro original-source">
              摘自《薛兆丰经济学讲义》· 第 {ctx.chapterNumber} 章「{ctx.chapterTitle}」
            </p>
            <div className="original-prose">
              {originalText.split('\n\n').map((block, i) => (
                <p key={i}>{block}</p>
              ))}
            </div>
          </section>
        )}

        {activeMode === 'text' && (
          <section className="text-panel">
            <h2>通俗解读</h2>
            {lecture.body.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <div className="key-points">
              <h3>要点清单</h3>
              <ul>
                {lecture.keyPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
            <div className="takeaway-box">
              <strong>记住这句</strong>
              <p>{lecture.takeaway}</p>
            </div>
          </section>
        )}

        {activeMode === 'dialogue' && (
          <section className="dialogue-panel">
            <p className="panel-intro">
              通过小王和薛老师的对话，把这一讲的核心思想讲清楚。
            </p>
            <DialogueViewer lines={lecture.dialogue} />
          </section>
        )}

        {activeMode === 'bilibili' && lecture.bilibili && (
          <section className="bilibili-panel">
            <p className="panel-intro">
              以下为哔哩哔哩上的延伸阅读，国内网络可直接观看。建议先读「原文」再看视频。
            </p>
            <BilibiliEmbed media={lecture.bilibili} />
          </section>
        )}
      </div>

      <nav className="lecture-footer-nav">
        <Link to={`/chapters/${ctx.chapterId}`}>← 返回本章目录</Link>
        <Link to="/">全书目录</Link>
      </nav>
    </article>
  );
}
