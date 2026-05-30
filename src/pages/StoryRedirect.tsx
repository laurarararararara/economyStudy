import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLegacyStoryTarget } from '../data/storyRedirects';

/**
 * 旧 /stories/:slug 链接一律硬跳转到讲次页。
 * 使用 location.replace 而非 React <Navigate>，避免浏览器仍执行缓存里的旧 bundle（含 YouTube）。
 */
export function StoryRedirect() {
  const { storyId } = useParams();

  useLayoutEffect(() => {
    const target = storyId ? getLegacyStoryTarget(storyId) : null;
    window.location.replace(target ?? '/stories');
  }, [storyId]);

  return (
    <div className="empty-state">
      <p>正在跳转到讲次页面…</p>
      <p className="panel-intro">若长时间未跳转，请<a href="/">返回首页</a>。</p>
    </div>
  );
}
