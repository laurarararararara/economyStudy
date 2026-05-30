import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand">
          <span className="brand-mark">经</span>
          <div>
            <strong>薛兆丰经济学讲义</strong>
            <span>读书网站 · 故事漫画 & 视频</span>
          </div>
        </Link>
        <nav>
          <Link to="/">目录</Link>
          <Link to="/stories">案例故事</Link>
        </nav>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>内容结构参考《薛兆丰经济学讲义》中信出版社版 · 仅供学习交流</p>
      </footer>
    </div>
  );
}
