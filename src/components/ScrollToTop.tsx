import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** 路由变化时滚到页面顶部（修复从首页进章节仍停在原滚动位置） */
export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
}
